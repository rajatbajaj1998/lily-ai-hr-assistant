import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { HRAssistant } from './components/HRAssistant';
import { HRSidebar } from './components/HRSidebar';
import { TopBar } from './components/TopBar';
import { CalendarOverlay } from './components/CalendarOverlay';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

const N8N_CHAT_URL = "http://localhost:5678/webhook/hr/chat";

export default function App() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('leave balance') || lowerQuery.includes('vacation') || lowerQuery.includes('sick days')) {
      return "Based on your current records:\n\n• Vacation Days: 18 remaining (out of 25 annual)\n• Sick Days: 8 remaining (out of 10 annual)\n• Personal Days: 3 remaining (out of 5 annual)\n\nYour leave year resets on January 1st. Would you like to request time off or need more details about leave policies?";
    }
    
    if (lowerQuery.includes('time off') || lowerQuery.includes('request')) {
      return "I can help you submit a time off request! Here's what I need:\n\n1. Start date and end date\n2. Type of leave (vacation, sick, personal)\n3. Reason (optional)\n\nYou can also access the full request form through your employee portal. Would you like me to guide you through the process?";
    }
    
    if (lowerQuery.includes('benefits')) {
      return "Here's your current benefits information:\n\n• Health Insurance: Premium Plan (Company pays 80%)\n• Dental: Full coverage\n• Vision: Basic plan\n• 401(k): 6% company match\n• Life Insurance: 2x annual salary\n\nOpen enrollment is November 1-15. Need details about any specific benefit or want to make changes?";
    }
    
    if (lowerQuery.includes('handbook') || lowerQuery.includes('policy') || lowerQuery.includes('remote work') || lowerQuery.includes('dress code')) {
      return "I can help you find information from our employee handbook. Popular topics include:\n\n• Remote work policy\n• Dress code guidelines\n• Performance review process\n• Code of conduct\n• IT security policies\n\nWhat specific policy or procedure would you like to know about?";
    }
    
    if (lowerQuery.includes('open enrollment') || lowerQuery.includes('enrollment')) {
      return "Open enrollment for 2024 benefits is coming up! Here are the key details:\n\n• **Dates:** November 1-15, 2024\n• **Changes take effect:** January 1, 2025\n• **What you can change:** Health, dental, vision, FSA, HSA\n• **New this year:** Expanded mental health coverage\n\nYou'll receive detailed information packets by email. Need help with any specific benefit decisions?";
    }
    
    if (lowerQuery.includes('emergency contact') || lowerQuery.includes('update') && lowerQuery.includes('contact')) {
      return "To update your emergency contact information:\n\n1. Log into the employee portal\n2. Go to 'Personal Information' > 'Emergency Contacts'\n3. Add, edit, or remove contacts as needed\n4. Save your changes\n\nYou can add up to 3 emergency contacts. Make sure to include their relationship to you and current phone numbers. Need help accessing the portal?";
    }
    
    if (lowerQuery.includes('pay stub') || lowerQuery.includes('payroll') || lowerQuery.includes('salary')) {
      return "To access your pay stubs and payroll information:\n\n• **Online:** Employee portal > Payroll > Pay Statements\n• **Mobile:** Download the company app\n• **Direct deposit:** Set up in Payroll > Direct Deposit\n• **Tax documents:** Available in January for W-2s\n\nPay stubs are available immediately after each pay period. Having trouble accessing your account?";
    }
    
    if (lowerQuery.includes('expense') || lowerQuery.includes('reimbursement')) {
      return "I can help you with expense reimbursements! Here's how to submit and track your expenses:\n\n• **Submit:** Use the expense portal or mobile app\n• **Required:** Receipts for all expenses over $25\n• **Processing time:** 5-7 business days\n• **Categories:** Travel, meals, office supplies, training\n\nCurrent reimbursement status: You have 2 pending submissions totaling $340. Need help with a specific expense?";
    }
    
    return "I understand you're asking about HR-related matters. I can help with:\n\n• Leave balances and time off requests\n• Benefits information and enrollment\n• Company policies and procedures\n• Payroll and compensation questions\n• Performance reviews and career development\n\nCould you be more specific about what you need help with?";
  };

  const handleSendMessage = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const messageId = Date.now().toString();

      const lower = text.toLowerCase();
  
  if (
    lower.includes('open calendar') ||
    lower.includes('show calendar') ||
    lower.includes('calendar') ||
    lower.includes('upcoming events')
  ) {
        window.dispatchEvent(new CustomEvent('hr:openCalendar'));
      }
    setInputValue('');
    setIsLoading(true);
  if (
    lower.includes('show notifications') ||
    lower.includes('open notifications') ||
    lower.includes('check notifications') ||
    lower.includes('inbox')
  ) {
    window.dispatchEvent(new CustomEvent('hr:openNotifications'));
  }

    
    // Clear input immediately (optimistic)
    setInputValue('');
    setIsLoading(true);

    // Dispatch user message event to HRAssistant
    window.dispatchEvent(new CustomEvent('hr:userMessage', {
      detail: { message: text, messageId }
    }));

    try {
      // Log the request details
      console.log('Sending POST request to:', N8N_CHAT_URL);
      console.log('Request body:', { message: text });

      const response = await fetch(N8N_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      // Log the response status
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      let answer = "I'm here, but I couldn't parse a response.";

      try {
        // Try to parse as JSON
        const data = await response.json();
        console.log('Parsed JSON response:', data);
        
        // Extract answer from data.answer specifically
        answer = data.answer || data.text || "I'm here, but I couldn't find an answer in the response.";
      } catch (jsonError) {
        // If JSON parsing fails, try to get raw text
        console.log('JSON parsing failed, trying raw text...');
        try {
          const rawText = await response.text();
          console.log('Raw text response:', rawText);
          answer = rawText || "I'm here, but I received an empty response.";
        } catch (textError) {
          console.error('Failed to parse response as text:', textError);
          answer = "I'm here, but I couldn't read the response.";
        }
      }

      // Dispatch assistant reply event
      window.dispatchEvent(new CustomEvent('hr:assistantReply', {
        detail: { answer, messageId }
      }));

      // Clear loading state and restore focus for successful response
      setIsLoading(false);
      setIsUsingFallback(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

    } catch (error) {
      // Check if it's a network/fetch error (expected when N8N server is down)
      const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
      
      if (isNetworkError) {
        console.log('🤖 N8N server unavailable - using local HR assistant...');
        setIsUsingFallback(true);
      } else {
        console.error('Unexpected error:', error);
      }
      
      // Simulate realistic response time for fallback
      setTimeout(() => {
        const fallbackAnswer = generateMockResponse(text);
        
        // Dispatch assistant reply event with fallback
        window.dispatchEvent(new CustomEvent('hr:assistantReply', {
          detail: { answer: fallbackAnswer, messageId }
        }));

        // Clear loading state and restore focus for fallback response
        setIsLoading(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }, 1200); // 1.2 second delay to simulate server response
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Create a mock sendMessage function for HRAssistant prop compatibility
  const handleSendMessageProp = async (message: string): Promise<string> => {
    // This is just for prop compatibility - actual logic is in handleSendMessage
    return "Response handled via events";
  };

  return (
    <div className="h-screen w-full flex relative">
      {/* Sidebar - fixed width */}
      <div className="w-80 h-screen bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <HRSidebar onOpenCalendar={() => setShowCalendar(true)} />
      </div>
      
      {/* Main Content - flex grows on larger screens */}
      <div className="flex-1 min-w-0 h-screen flex flex-col bg-[#FAFBFC] relative">
        <TopBar />
        <div className="flex-1 overflow-y-auto">
          <HRAssistant 
            onSendMessage={handleSendMessageProp}
            isLoading={isLoading}
          />
        </div>
        
        {/* Full-width input bar - spans from sidebar edge to right edge */}
        <div className="sticky bottom-0 border-t border-[#E5E7EB] bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] h-20 flex-shrink-0">
          <div className="h-full flex items-center px-8 gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder={isUsingFallback ? "Ask me anything about HR policies, benefits, or submit requests... (Local assistant)" : "Ask me anything about HR policies, benefits, or submit requests..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className="w-full h-12 px-4 border-[#E5E7EB] bg-white rounded-xl text-[#20232A] placeholder:text-[#5A6075] focus:ring-2 focus:ring-[#4F84FF] focus:border-[#4F84FF] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: '14px' }}
              />
              {isUsingFallback && (
                <div className="absolute -top-6 left-0 text-xs text-[#5A6075] bg-[#F8FAFF] px-2 py-1 rounded border border-[#E5E7EB]">
                  🤖 Local assistant mode
                </div>
              )}
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isLoading}
              className="h-12 px-6 bg-[#4F84FF] hover:bg-[#4F84FF]/90 text-white rounded-xl font-medium shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <CalendarOverlay 
        isOpen={showCalendar} 
        onClose={() => setShowCalendar(false)} 
      />
    </div>
  );
}