"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'

export function VoiceCommand() {
    const [isListening, setIsListening] = useState(false)
    const [processing, setProcessing] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const { user } = useAuth()
    const router = useRouter()

    const startListening = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaRecorderRef.current = new MediaRecorder(stream)
            chunksRef.current = []

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data)
                }
            }

            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/mp3' })
                await processVoiceCommand(blob)
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorderRef.current.start()
            setIsListening(true)
        } catch (err) {
            console.error("Microphone access denied:", err)
            toast("Microphone access is required for voice commands.")
        }
    }

    const stopListening = () => {
        if (mediaRecorderRef.current && isListening) {
            mediaRecorderRef.current.stop()
            setIsListening(false)
            setProcessing(true)
        }
    }

    const processVoiceCommand = async (blob: Blob) => {
        try {
            const formData = new FormData()

            // Append metadata first for better server parsing
            if (user?.email) {
                formData.append('email', user.email)
            }
            formData.append('audio', blob, 'command.mp3')

            const res = await fetch('/api/ai/command', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) throw new Error("Failed to process command")

            const data = await res.json()

            console.log("AI Command:", data)

            if (data.reply) {
                toast(data.reply)
            }

            if (data.action === 'NAVIGATE' && data.payload) {
                toast(`Navigating to ${data.payload}...`)
                router.push(data.payload)
            } else if (data.action === 'TOAST' && data.payload) {
                toast(data.payload)
            } else if (data.action === 'OPEN_TAB' && data.payload) {
                window.open(data.payload, '_blank')
            }

        } catch (err) {
            console.error(err)
            toast("Sorry, I didn't verify that command.")
        } finally {
            setProcessing(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Button
                size="icon"
                variant={isListening ? "destructive" : "default"}
                className={`h-14 w-14 rounded-full shadow-lg transition-all ${isListening ? "animate-pulse" : "hover:scale-105"}`}
                onClick={isListening ? stopListening : startListening}
                disabled={processing}
            >
                {processing ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                ) : isListening ? (
                    <MicOff className="h-6 w-6" />
                ) : (
                    <Mic className="h-6 w-6" />
                )}
                <span className="sr-only">Voice Command</span>
            </Button>
        </div>
    )
}
