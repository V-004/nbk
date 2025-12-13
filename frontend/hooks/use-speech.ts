"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

export function useSpeech() {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [supported, setSupported] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) && 'speechSynthesis' in window) {
            setSupported(true)
        }
    }, [])

    const speak = useCallback((text: string, lang: string = 'en-US') => {
        if (!supported) return

        // Cancel current speech
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang

        // Try to find a matching voice
        const voices = window.speechSynthesis.getVoices()
        const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0])) // loose match
        if (voice) utterance.voice = voice

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        window.speechSynthesis.speak(utterance)
    }, [supported])

    const recognitionRef = useRef<any>(null)

    const startListening = useCallback((lang: string = 'en-US') => {
        if (!supported) return

        // Stop any existing recognition
        if (recognitionRef.current) {
            try {
                recognitionRef.current.abort()
            } catch (e) {
                // ignore
            }
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognitionRef.current = recognition

        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = lang

        recognition.onstart = () => setIsListening(true)
        recognition.onresult = (event: any) => {
            const result = event.results[0][0].transcript
            setTranscript(result)
        }
        recognition.onerror = (event: any) => {
            if (event.error === 'aborted') {
                return
            }
            if (event.error === 'audio-capture') {
                console.error("No microphone found or permission denied.")
                // Ideally trigger a toast or UI state here, but for now just stop cleanly
                setIsListening(false)
                return
            }
            console.error("Speech recognition error", event.error)
            setIsListening(false)
        }
        recognition.onend = () => {
            setIsListening(false)
            recognitionRef.current = null
        }

        try {
            recognition.start()
        } catch (err) {
            console.error("Failed to start recognition", err)
            setIsListening(false)
        }
    }, [supported])

    const stopSpeaking = useCallback(() => {
        if (supported) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
        }
    }, [supported])

    return {
        isListening,
        transcript,
        isSpeaking,
        speak,
        stopSpeaking,
        startListening,
        resetTranscript: () => setTranscript(""),
        supported
    }
}
