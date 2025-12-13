"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Bot, Send, X, MessageSquare, Loader2, Sparkles, Mic, Volume2, StopCircle } from "lucide-react"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"
import { useSpeech } from "@/hooks/use-speech"

type Message = {
    id: string
    role: 'user' | 'ai'
    text: string
}

export function AiAssistant() {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', text: 'Hello! I am your AI banking assistant. How can I help you today?' }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { speak, startListening, isListening, transcript, resetTranscript, isSpeaking, stopSpeaking } = useSpeech()
    const [language, setLanguage] = useState("en-US")

    useEffect(() => {
        // Cleanup speech on unmount
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const toggleOpen = () => {
        if (isOpen) {
            // Stop speaking when closing
            window.speechSynthesis.cancel();
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    useEffect(() => {
        if (transcript) {
            setInput(transcript)
            resetTranscript()
        }
    }, [transcript, resetTranscript])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setLoading(true)

        try {
            // Call AI API
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMsg.text, // Changed from 'input' to 'userMsg.text' to ensure the correct message is sent
                    email: user?.email // Assuming 'user' is available in scope, e.g., from a context or prop
                })
            })

            const data = await res.json()

            // Handle both simple string (mock) and JSON object (Gemini)
            let replyText = ""
            if (typeof data.reply === 'string') {
                replyText = data.reply
            } else if (data.reply) {
                // If reply is an object (unexpected), stringify it
                replyText = typeof data.reply === 'object' ? JSON.stringify(data.reply) : String(data.reply)
            } else if (data.error) {
                // Handle explicit error field
                replyText = `Error: ${data.error}`
            } else {
                // Fallback: Stringify whatever data is received to prevent crash
                replyText = typeof data === 'object' ? JSON.stringify(data) : String(data)
            }

            // Handle Navigation Action
            if (data.action === 'navigate' && data.payload) {
                router.push(data.payload)
                setIsOpen(false)
            }
            // Handle Open Tab Action
            else if (data.action === 'open_tab' && data.payload) {
                window.open(data.payload, '_blank')
                setIsOpen(false)
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                text: replyText || "I'm having trouble connecting right now."
            }
            setMessages(prev => [...prev, aiMsg])
            speak(aiMsg.text, language)
        } catch (err) {
            console.error("Frontend AI Error:", err);
            const errorMessage = err instanceof Error ? err.message : String(err);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: `Network Error (${new Date().toLocaleTimeString()}): ${errorMessage}` }])
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        stopSpeaking(); // Reset hook state
        window.speechSynthesis.cancel(); // Force browser stop
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <Button
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white z-50 overflow-hidden p-0"
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src="/ai-avatar.png"
                    alt="Nexus AI"
                    width={56}
                    height={56}
                    className="object-cover"
                />
            </Button>
        )
    }

    return (
        <Card className="fixed bottom-6 right-6 w-[350px] h-[500px] shadow-2xl z-50 flex flex-col border-violet-200 dark:border-violet-900 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-t-xl p-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm">
                        <Image
                            src="/ai-avatar.png"
                            alt="Nexus AI"
                            width={32}
                            height={32}
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <CardTitle className="text-base">Nexus AI <span className="text-xs opacity-50 ml-1">v2.1</span></CardTitle>
                        <p className="text-xs text-white/80">{isListening ? "Listening..." : "Always here to help"}</p>
                    </div>
                </div>

                <div className="flex gap-1">
                    {isSpeaking && (
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={stopSpeaking}>
                            <StopCircle className="h-5 w-5 animate-pulse" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={handleClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </CardHeader >
            <CardContent className="flex-1 p-0 overflow-hidden bg-muted/30">
                <div className="h-full overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user'
                                ? 'bg-violet-600 text-white rounded-tr-none'
                                : 'bg-white dark:bg-slate-800 border shadow-sm rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-slate-800 border shadow-sm rounded-2xl rounded-tl-none p-3">
                                <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-3 bg-background border-t">
                <form
                    className="flex flex-col w-full gap-2"
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                >
                    <div className="flex gap-2 w-full">
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-[160px] h-9 bg-background/50 backdrop-blur-sm border-violet-200 dark:border-violet-800">
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en-US">English</SelectItem>
                                <SelectItem value="hi-IN">Hindi (हिंदी)</SelectItem>
                                <SelectItem value="bn-IN">Bengali (বাংলা)</SelectItem>
                                <SelectItem value="kn-IN">Kannada (ಕನ್ನಡ)</SelectItem>
                                <SelectItem value="ta-IN">Tamil (தமிழ்)</SelectItem>
                                <SelectItem value="te-IN">Telugu (తెలుగు)</SelectItem>
                                <SelectItem value="mr-IN">Marathi (मराठी)</SelectItem>
                                <SelectItem value="ml-IN">Malayalam (മലയാളം)</SelectItem>
                                <SelectItem value="gu-IN">Gujarati (ગુજરાતી)</SelectItem>
                                <SelectItem value="pa-IN">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                                <SelectItem value="or-IN">Odia (ଓଡ଼ିଆ)</SelectItem>
                                <SelectItem value="as-IN">Assamese (অসমীয়া)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            placeholder={isListening ? "Listening..." : "Ask anything..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="button" size="icon" variant="ghost" onClick={() => startListening(language)} className={isListening ? "text-red-500 animate-pulse" : "text-muted-foreground"}>
                            <Mic className="h-5 w-5" />
                        </Button>
                        <Button type="submit" size="icon" disabled={loading || !input.trim()} className="bg-violet-600 hover:bg-violet-700">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </CardFooter>
        </Card >
    )
}
