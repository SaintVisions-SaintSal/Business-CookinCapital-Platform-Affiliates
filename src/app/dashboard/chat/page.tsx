'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Copy, 
  Check,
  RefreshCw,
  Settings,
  ChevronDown,
  Zap,
  Brain,
  MessageSquare
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type Model = {
  id: string
  name: string
  provider: string
  description: string
  icon: string
}

const models: Model[] = [
  { id: 'gpt-4', name: 'GPT-4 Turbo', provider: 'OpenAI', description: 'Most capable model', icon: '🧠' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', description: 'Fastest GPT-4', icon: '⚡' },
  { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', description: 'Best for analysis', icon: '🎯' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', description: 'Multimodal', icon: '💎' },
  { id: 'grok-2', name: 'Grok 2', provider: 'xAI', description: 'Real-time data', icon: '🚀' },
]

const suggestedPrompts = [
  "Analyze this property for investment potential",
  "Help me structure a commercial loan deal",
  "What's the current market outlook for multifamily?",
  "Create a business plan for my startup",
  "Explain cap rates like I'm new to real estate",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(models[0])
  const [showModelSelect, setShowModelSelect] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel.id,
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success('Copied to clipboard')
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Image
            src="/images/TRANSPARENTSAINTSALLOGO.png"
            alt="SaintSal™"
            width={48}
            height={48}
            className="rounded-xl"
          />
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              SaintSal™ Chat
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-500/20 text-green-400">
                ONLINE
              </span>
            </h1>
            <p className="text-white/50 text-sm">Your AI expert in everything business</p>
          </div>
        </div>

        {/* Model Selector */}
        <div className="relative">
          <button
            onClick={() => setShowModelSelect(!showModelSelect)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:border-gold-500/30 transition-colors"
          >
            <span className="text-xl">{selectedModel.icon}</span>
            <div className="text-left">
              <div className="text-sm font-medium text-white">{selectedModel.name}</div>
              <div className="text-xs text-white/40">{selectedModel.provider}</div>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-white/40 transition-transform",
              showModelSelect && "rotate-180"
            )} />
          </button>

          <AnimatePresence>
            {showModelSelect && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-64 p-2 rounded-xl bg-[#1a1d23] border border-white/10 shadow-xl z-50"
              >
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model)
                      setShowModelSelect(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      selectedModel.id === model.id 
                        ? "bg-gold-500/10 text-gold-400" 
                        : "text-white hover:bg-white/[0.05]"
                    )}
                  >
                    <span className="text-xl">{model.icon}</span>
                    <div className="text-left flex-1">
                      <div className="text-sm font-medium">{model.name}</div>
                      <div className="text-xs text-white/40">{model.description}</div>
                    </div>
                    {selectedModel.id === model.id && (
                      <Check className="w-4 h-4 text-gold-400" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6">
                <Image
                  src="/images/TRANSPARENTSAINTSALLOGO.png"
                  alt="SaintSal™"
                  width={60}
                  height={60}
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                What can I help you with today?
              </h2>
              <p className="text-white/50 max-w-md mb-8">
                I'm SaintSal™, your AI expert in business, real estate, lending, trading, 
                and anything else you need. Ask me anything!
              </p>
              
              {/* Suggested Prompts */}
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(prompt)}
                    className="px-4 py-2 rounded-full bg-white/[0.05] border border-white/10 text-sm text-white/70 hover:text-white hover:border-gold-500/30 hover:bg-gold-500/10 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <Image
                        src="/images/TRANSPARENTSAINTSALLOGO.png"
                        alt="SaintSal™"
                        width={40}
                        height={40}
                        className="rounded-xl"
                      />
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-[70%] group",
                    message.role === 'user' ? "order-1" : ""
                  )}>
                    <div className={cn(
                      "px-5 py-4 rounded-2xl",
                      message.role === 'user' 
                        ? "bg-gold-500 text-black" 
                        : "bg-white/[0.05] text-white/90"
                    )}>
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>
                    
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="p-1.5 rounded-lg hover:bg-white/[0.05] text-white/40 hover:text-white transition-colors"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-white/40 hover:text-white transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-400 font-semibold">
                      U
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4"
                >
                  <Image
                    src="/images/TRANSPARENTSAINTSALLOGO.png"
                    alt="SaintSal™"
                    width={40}
                    height={40}
                    className="rounded-xl"
                  />
                  <div className="px-5 py-4 rounded-2xl bg-white/[0.05]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="relative flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask SaintSal™ anything..."
                rows={1}
                className="w-full px-5 py-4 pr-24 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold-500/30 focus:ring-1 focus:ring-gold-500/20 resize-none max-h-32"
                style={{ minHeight: '56px' }}
              />
              
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isRecording 
                      ? "bg-red-500/20 text-red-400" 
                      : "hover:bg-white/[0.05] text-white/40 hover:text-white"
                  )}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-4 rounded-xl transition-all",
                input.trim() && !isLoading
                  ? "btn-gold"
                  : "bg-white/[0.05] text-white/30 cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3 px-1">
            <p className="text-xs text-white/30">
              Press Enter to send, Shift+Enter for new line
            </p>
            <p className="text-xs text-white/30">
              Powered by {selectedModel.provider}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
