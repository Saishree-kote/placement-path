import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

const SYSTEM_PROMPT = `You are a PlacePrep assistant that helps students with placement preparation.
You know about these application pages:
- Dashboard (/dashboard)
- Resume Analyzer (/dashboard/resume)
- Aptitude Test (/dashboard/aptitude)
- Skill Tracker (/dashboard/skills)
- Mock Interview (/dashboard/interview)
- Resources (/dashboard/resources)
- Roadmap (/dashboard/roadmap)

Answer student questions concisely and helpfully. When recommending one of the above pages, format it exactly as a markdown link, like [Page Name](/dashboard/path).`;

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Hi! I am your PlacePrep assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const chat = model.startChat({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        history: messages
          .filter((m) => m.id !== 'welcome')
          .map((m) => ({
            role: m.role,
            parts: [{ text: m.content }],
          })),
      });

      const result = await chat.sendMessage(userMessage.content);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: text || 'Sorry, I could not understand that.',
        },
      ]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: 'I encountered an error while trying to respond. Please try again later.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const renderMessageContent = (content: string) => {
    // Regex to match markdown links: [text](href)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const textAhead = content.substring(lastIndex, match.index);
      if (textAhead) {
        parts.push(<span key={`text-${lastIndex}`}>{textAhead}</span>);
      }

      const linkText = match[1];
      const linkHref = match[2];

      parts.push(
        <button
          key={`link-${match.index}`}
          onClick={() => {
            setIsOpen(false);
            navigate(linkHref);
          }}
          className="text-blue-500 hover:text-blue-700 underline font-medium cursor-pointer bg-transparent border-none p-0 inline"
        >
          {linkText}
        </button>
      );

      lastIndex = linkRegex.lastIndex;
    }

    const remainingText = content.substring(lastIndex);
    if (remainingText) {
      parts.push(<span key={`text-remaining-${lastIndex}`}>{remainingText}</span>);
    }

    return <>{parts}</>;
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[100] p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Open AI Assistant"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[100] w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <h3 className="font-semibold text-lg">PlacePrep AI</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-sm'
                      : 'bg-muted rounded-tl-sm text-foreground'
                  }`}
                  style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                >
                  {renderMessageContent(message.content)}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 flex-row">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="max-w-[75%] bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-background border-t">
            <div className="flex relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your placement prep..."
                className="w-full pl-4 pr-12 py-3 rounded-full border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                aria-label="Send message"
              >
                {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
