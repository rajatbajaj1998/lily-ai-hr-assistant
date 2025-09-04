import image_79aebf3d3c32f9adfe31cb8d3a6453e64cd7c7a3 from 'figma:asset/79aebf3d3c32f9adfe31cb8d3a6453e64cd7c7a3.png';
import image_be7511a5cd7b222125a9d0124c3de72173ef72d5 from 'figma:asset/be7511a5cd7b222125a9d0124c3de72173ef72d5.png';
import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, FileText, User, Receipt, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  error?: boolean;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description: string;
  action: () => void;
  isPrimary: boolean;
}

interface HRAssistantProps {
  onSendMessage: (message: string) => Promise<string>;
  isLoading: boolean;
}

const N8N_CHAT_URL = "http://localhost:5678/webhook/hr/chat";

export function HRAssistant({ onSendMessage, isLoading }: HRAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi, I'm Lily, your HR assistant. I can help you with leave balances, time off requests, benefits information, and answer policy questions. How can I assist you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);

  const [showQuickActions, setShowQuickActions] = useState(true);
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const popularQuestions = [
    "What's my current leave balance?",
    "How do I request time off?",
    "Tell me about my health insurance benefits",
    "What's the remote work policy?",
    "When is open enrollment?",
    "How do I update my emergency contact?",
    "What's the dress code policy?",
    "How do I access my pay stubs?"
  ];

  const quickActions: QuickAction[] = [
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Request Time Off",
      description: "Submit new request",
      action: () => handleQuickAction("I'd like to request time off"),
      isPrimary: true
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "Benefits Info",
      description: "View benefits",
      action: () => handleQuickAction("Tell me about my benefits"),
      isPrimary: true
    },
    {
      icon: <Receipt className="w-4 h-4" />,
      label: "Employee Expenses",
      description: "Track reimbursements",
      action: () => handleQuickAction("I need to track my expense reimbursements"),
      isPrimary: false
    },
    {
      icon: <User className="w-4 h-4" />,
      label: "Employee Handbook",
      description: "Access handbook",
      action: () => handleQuickAction("I need to check the employee handbook"),
      isPrimary: false
    }
  ];

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for custom events from App component
  useEffect(() => {
    const handleUserMessage = (event: CustomEvent<{ message: string; messageId: string }>) => {
      const { message, messageId } = event.detail;
      const userMessage: Message = {
        id: messageId,
        text: message,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setShowQuickActions(false);
      setErrorMessages(prev => {
        const newErrors = { ...prev };
        delete newErrors[messageId];
        return newErrors;
      });
    };

    const handleAssistantReply = (event: CustomEvent<{ answer: string; messageId: string }>) => {
      const { answer, messageId } = event.detail;
      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: answer,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      // Clear any error for this message
      setErrorMessages(prev => {
        const newErrors = { ...prev };
        delete newErrors[messageId];
        return newErrors;
      });
    };

    const handleError = (event: CustomEvent<{ messageId: string; error: string }>) => {
      const { messageId, error } = event.detail;
      setErrorMessages(prev => ({
        ...prev,
        [messageId]: error
      }));
    };

    window.addEventListener('hr:userMessage', handleUserMessage as EventListener);
    window.addEventListener('hr:assistantReply', handleAssistantReply as EventListener);
    window.addEventListener('hr:error', handleError as EventListener);

    return () => {
      window.removeEventListener('hr:userMessage', handleUserMessage as EventListener);
      window.removeEventListener('hr:assistantReply', handleAssistantReply as EventListener);
      window.removeEventListener('hr:error', handleError as EventListener);
    };
  }, []);

  const handleQuickAction = async (query: string) => {
    const messageId = Date.now().toString();
    
    // Optimistically add user message
    const userMessage: Message = {
      id: messageId,
      text: query,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setShowQuickActions(false);

    try {
      // Call the backend
      const response = await fetch(N8N_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const data = await response.json().catch(() => ({}));
      const answer = (data && (data.answer ?? data.text)) || "I'm here, but I couldn't parse a response.";

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('n8n error', error);
      setErrorMessages(prev => ({
        ...prev,
        [messageId]: "Couldn't reach Lily. Try again."
      }));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] px-8 py-6 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-18 h-18 rounded-full overflow-hidden shadow-sm">
            <img 
              src={image_79aebf3d3c32f9adfe31cb8d3a6453e64cd7c7a3}
              alt="HR Assistant"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#20232A] mb-1">How can I help?</h1>
            <p className="text-[#5A6075] text-sm">Your 24/7 HR support companion</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="px-8 py-8 border-b border-[#E5E7EB] bg-white">
          <h3 className="text-lg font-semibold text-[#20232A] mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 h-full ${
                  action.isPrimary 
                    ? 'bg-[#4F84FF] border-[#4F84FF] hover:bg-[#4F84FF]/90' 
                    : 'bg-white border-[#E5E7EB] hover:border-[#4F84FF]/30 hover:bg-[#F8FAFF]'
                }`}
                onClick={() => !isLoading && action.action()}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      action.isPrimary 
                        ? 'bg-white/20 text-white' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm mb-1 ${
                        action.isPrimary ? 'text-white' : 'text-[#20232A]'
                      }`}>{action.label}</p>
                      <p className={`text-xs leading-relaxed ${
                        action.isPrimary ? 'text-white/80' : 'text-[#5A6075]'
                      }`}>{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 px-8 py-6 pb-24 bg-[#FAFBFC] overflow-y-auto"
        aria-live="polite"
        role="log"
        aria-label="Chat messages"
      >
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div key={message.id}>
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user' 
                    ? 'bg-[#4F84FF] text-white shadow-sm' 
                    : 'bg-[#F2F4F7] text-[#20232A] shadow-sm'
                }`}>
                  <p className="whitespace-pre-line text-sm leading-relaxed" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                    {message.text}
                  </p>
                  <p className="text-xs mt-2 opacity-70" style={{ fontSize: '11px', color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#5A6075' }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Error message for user messages */}
              {message.sender === 'user' && errorMessages[message.id] && (
                <div className="flex justify-end mt-2">
                  <div className="flex items-center gap-2 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg max-w-[75%]">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errorMessages[message.id]}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Popular Questions as Pills - only show initially */}
          {messages.length === 1 && !isLoading && (
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-3">
                {popularQuestions.slice(0, 5).map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="rounded-full h-10 px-3 bg-[#F1F4FA] text-[#20232A] hover:bg-[#E7EBF3] transition-all duration-200 text-sm font-medium hover:shadow-sm active:scale-95"
                    onClick={() => handleQuickAction(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start max-w-4xl mx-auto">
              <div className="bg-[#F2F4F7] rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#5A6075]/50 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#5A6075]/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-[#5A6075]/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Invisible element for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}