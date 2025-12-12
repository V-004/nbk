"use client"

import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Camera, CheckCircle } from "lucide-react"

interface FaceEnrollmentProps {
    onEnrolled: (descriptor: number[]) => void;
}

const FaceEnrollment: React.FC<FaceEnrollmentProps> = ({ onEnrolled }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [initializing, setInitializing] = useState(true);
    const [message, setMessage] = useState('Loading AI models...');
    const [faceDetected, setFaceDetected] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                startVideo();
            } catch (err) {
                console.error("Model Load Error", err);
                setMessage("Failed to load AI models");
            }
        };
        loadModels();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startVideo = () => {
        setMessage("Accessing camera...");
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then(currentStream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = currentStream;
                    setStream(currentStream);
                    setMessage("Please position your face in the center");
                    setInitializing(false);
                }
            })
            .catch(err => {
                console.error(err);
                setMessage("Camera access denied");
            });
    };

    const handleVideoPlay = () => {
        const interval = setInterval(async () => {
            if (canvasRef.current && videoRef.current) {
                // Ensure video is playing and has dimensions
                if (videoRef.current.paused || videoRef.current.ended) return;

                const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
                const detections = await faceapi.detectSingleFace(videoRef.current, options).withFaceLandmarks().withFaceDescriptor();

                if (detections) {
                    setFaceDetected(true);

                    const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
                    faceapi.matchDimensions(canvasRef.current, displaySize);
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);

                    const ctx = canvasRef.current.getContext('2d');
                    if (ctx) {
                        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                    }
                } else {
                    setFaceDetected(false);
                    const ctx = canvasRef.current.getContext('2d');
                    if (ctx) {
                        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    }
                }
            }
        }, 500);
        return () => clearInterval(interval);
    };

    const captureFace = async () => {
        if (!faceDetected || !videoRef.current) return;

        const detections = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks().withFaceDescriptor();
        if (detections) {
            const descriptorArray = Array.from(detections.descriptor);
            if (stream) stream.getTracks().forEach(track => track.stop());
            onEnrolled(descriptorArray);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Face Registration
                </CardTitle>
                <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <div className="relative rounded-lg overflow-hidden border-2 border-muted bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        onPlay={handleVideoPlay}
                        width="320"
                        height="240"
                        className={faceDetected ? 'border-2 border-green-500' : ''}
                    />
                    <canvas ref={canvasRef} className="absolute top-0 left-0" />
                </div>

                <Button
                    onClick={captureFace}
                    disabled={!faceDetected || initializing}
                    className="w-full"
                >
                    {initializing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    {initializing ? 'Initializing...' : 'Capture Face ID'}
                </Button>
            </CardContent>
        </Card>
    );
};

export default FaceEnrollment;
