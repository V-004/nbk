"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import FaceEnrollment from '@/components/face-enrollment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SetupFacePage() {
    const { user, setupBiometric } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState('');

    const handleEnroll = async (descriptor: number[]) => {
        setStatus('Securely enrolling Face ID...');
        try {
            // Call backend API directly or via context
            const res = await fetch('/api/auth/enroll-face', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    faceDescriptor: descriptor
                })
            });

            if (!res.ok) throw new Error('Failed to enroll');

            await setupBiometric(); // Update context state
            setStatus('Face ID successfully enrolled!');
            setTimeout(() => router.push('/dashboard'), 2000);
        } catch (err) {
            console.error(err);
            setStatus('Failed to save Face ID. Please try again.');
        }
    };

    return (
        <div className="container flex items-center justify-center min-h-screen py-12">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Biometric Security</CardTitle>
                    <CardDescription>Enhance your account security with Face Recognition</CardDescription>
                </CardHeader>
                <CardContent>
                    <FaceEnrollment onEnrolled={handleEnroll} />

                    {status && (
                        <p className={`mt-4 text-center font-medium ${status.includes('Failed') ? 'text-destructive' : 'text-green-500'}`}>
                            {status}
                        </p>
                    )}

                    <div className="mt-6 text-center">
                        <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                            Skip for now
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
