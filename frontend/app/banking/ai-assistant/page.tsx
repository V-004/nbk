"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIAvatar } from "@/components/ai/ai-avatar"
import { SpeechToText } from "@/components/ai/speech-to-text"
import { TextToSpeech } from "@/components/ai/text-to-speech"
import { LLMChatbot } from "@/components/ai/llm-chatbot"

export default function AIAssistantPage() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [avatarMessage, setAvatarMessage] = useState("Hello! How can I help you today?")

  const handleStartListening = () => {
    setIsListening(true)
  }

  const handleStopListening = () => {
    setIsListening(false)
  }

  const handleTranscript = (text: string) => {
    setAvatarMessage(`You said: "${text}"`)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">AI Assistant</h1>
          <p className="text-sm text-muted-foreground">Voice-enabled banking with AI capabilities</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="avatar" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
            <TabsTrigger value="speech">Speech-to-Text</TabsTrigger>
            <TabsTrigger value="tts">Text-to-Speech</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="avatar">
              <AIAvatar
                isListening={isListening}
                isSpeaking={isSpeaking}
                onStartListening={handleStartListening}
                onStopListening={handleStopListening}
                avatarMessage={avatarMessage}
              />
            </TabsContent>

            <TabsContent value="speech">
              <SpeechToText
                onTranscript={handleTranscript}
                onStart={() => setIsListening(true)}
                onStop={() => setIsListening(false)}
              />
            </TabsContent>

            <TabsContent value="tts">
              <TextToSpeech
                defaultText="Your account balance is ₹2,50,000 with ₹1,50,000 available for withdrawal."
                onSpeak={() => setIsSpeaking(true)}
              />
            </TabsContent>

            <TabsContent value="chat">
              <LLMChatbot />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
