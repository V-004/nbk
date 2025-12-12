"use client"

import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Loader2, ScanFace, XCircle } from "lucide-react"

interface FaceLoginProps {
    onSuccess: (userId: string) => void;
    email: string;
}

export function FaceLogin({ onSuccess, email }: FaceLoginProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [status, setStatus] = useState('Initializing Face ID...');
    const [matching, setMatching] = useState(false);
    const [loadingModels, setLoadingModels] = useState(true);
    const [detectedUserId, setDetectedUserId] = useState<string | null>(null);
    const [storedDescriptors, setStoredDescriptors] = useState<Float32Array[]>([]);

    // 1. Load Models & Fetch User Face Data
    useEffect(() => {
        const load = async () => {
            try {
                const MODEL_URL = '/models';
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);

                // Fetch user face data
                const res = await fetch('/api/auth/login-face', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();

                if (data.faceData) {
                    // Handle both 1D (old) and 2D (new multi-enrollment) formats
                    let descriptors: Float32Array[] = [];
                    if (Array.isArray(data.faceData)) {
                        if (data.faceData.length > 0 && Array.isArray(data.faceData[0])) {
                            // 2D Array (new format: multiple enrollments)
                            descriptors = data.faceData.map((d: number[]) => new Float32Array(d));
                        } else {
                            // 1D Array (old format: single enrollment)
                            descriptors = [new Float32Array(data.faceData)];
                        }
                    }

                    setStoredDescriptors(descriptors);
                    setDetectedUserId(data.userId);
                    setStatus(`Loaded ${descriptors.length} face model(s). Accessing camera...`);
                    setLoadingModels(false);
                    startVideo();
                } else {
                    setStatus('Face ID not set up for this user.');
                    setLoadingModels(false);
                }
            } catch (err) {
                console.error(err);
                setStatus('Error initializing Face ID.');
                setLoadingModels(false);
            }
        };
        if (email) load();
    }, [email]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
            }
        };
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then(stream => {
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(() => setStatus('Camera permission denied'));
    };

    const handleVideoPlay = async () => {
        const interval = setInterval(async () => {
            // Check against storedDescriptors array
            if (canvasRef.current && videoRef.current && storedDescriptors.length > 0 && !matching) {
                if (videoRef.current.paused || videoRef.current.ended) return;

                const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
                const detection = await faceapi.detectSingleFace(videoRef.current, options).withFaceLandmarks().withFaceDescriptor();

                if (detection) {
                    // Check against ALL stored descriptors
                    // We match if ANY stored descriptor is close enough
                    let bestMatch = 1.0;
                    for (const descriptor of storedDescriptors) {
                        const distance = faceapi.euclideanDistance(descriptor, detection.descriptor);
                        if (distance < bestMatch) bestMatch = distance;
                    }

                    if (bestMatch < 0.5) { // Threshold
                        setMatching(true);
                        setStatus('Face Verified! Logging in...');
                        clearInterval(interval);
                        if (videoRef.current) videoRef.current.pause();
                        if (streamRef.current) streamRef.current.getTracks().forEach((track: MediaStreamTrack) => track.stop());
                        if (detectedUserId) onSuccess(detectedUserId);
                    }
                }
            }
        }, 500);
        return () => clearInterval(interval);
    };

    if (loadingModels) {
        return (
            <div className="flex flex-col items-center justify-center p-8 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">{status}</p>
            </div>
        );
    }

    if (storedDescriptors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 gap-4 text-destructive">
                <XCircle className="h-8 w-8" />
                <p className="text-sm font-medium">{status}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative rounded-lg overflow-hidden border-2 border-primary bg-black w-full max-w-[320px] aspect-video">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    onPlay={handleVideoPlay}
                    className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <ScanFace className="w-24 h-24 text-primary/50 animate-pulse" />
                </div>
            </div>
            <p className="text-sm font-medium text-center animate-pulse">{status}</p>
        </div>
    );
}
