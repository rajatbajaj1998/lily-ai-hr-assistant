import React, { useState } from 'react';
import { X, Mail, Reply, Forward, Archive, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface EmailData {
  id: string;
  subject: string;
  sender: string;
  senderEmail: string;
  date: Date;
  content: string;
  priority: 'high' | 'normal' | 'low';
  category: 'Benefits' | 'Payroll' | 'Policy' | 'General';
}

interface EmailViewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmail?: any;
}

export function EmailViewPanel({ isOpen, onClose, selectedEmail }: EmailViewPanelProps) {
  const [emails] = useState<EmailData[]>([
    {
      id: '1',
      subject: 'Benefits Enrollment Reminder - Action Required',
      sender: 'HR Benefits Team',
      senderEmail: 'benefits@company.com',
      date: new Date(2024, 11, 10, 9, 30),
      content: `Dear Sarah,

This is a friendly reminder that the annual benefits enrollment period is approaching its deadline.

**Important Details:**
• Enrollment Period: November 1 - December 15, 2024
• Deadline: December 15, 2024 at 11:59 PM EST
• Changes Effective: January 1, 2025

**What You Need to Do:**
1. Review your current benefit selections
2. Make any necessary changes to your health, dental, and vision plans
3. Update your FSA and HSA contributions
4. Review and update your beneficiaries

**New Options for 2025:**
• Enhanced mental health coverage with reduced copays
• Expanded telehealth services
• New wellness program incentives

To complete your enrollment, please log into the benefits portal at benefits.company.com using your employee credentials.

If you have any questions or need assistance, please don't hesitate to reach out to our benefits team at benefits@company.com or call (555) 123-HELP.

Best regards,
HR Benefits Team`,
      priority: 'high',
      category: 'Benefits'
    },
    {
      id: '2',
      subject: 'Your December Pay Stub is Available',
      sender: 'Payroll Department',
      senderEmail: 'payroll@company.com', 
      date: new Date(2024, 11, 8, 14, 15),
      content: `Hello Sarah,

Your pay stub for the pay period ending December 6, 2024 is now available for viewing.

**Pay Period:** November 23 - December 6, 2024
**Pay Date:** December 8, 2024
**Net Pay:** $3,247.83

You can access your pay stub through the employee portal under Payroll > Pay Statements. 

**Year-to-Date Summary:**
• Gross Pay: $65,234.50
• Federal Tax: $9,785.18
• State Tax: $3,261.73
• FICA: $4,992.64
• Benefits: $2,456.12
• Net Pay: $44,738.83

If you have any questions about your pay stub or need assistance accessing the portal, please contact the payroll department.

Thank you,
Payroll Department`,
      priority: 'normal',
      category: 'Payroll'
    },
    {
      id: '3',
      subject: 'Updated Holiday Schedule for 2025',
      sender: 'Sarah Johnson',
      senderEmail: 'sarah.j@company.com',
      date: new Date(2024, 11, 5, 11, 45),
      content: `Team,

I hope this message finds you well. I'm writing to share the updated holiday schedule for 2025.

**Company Holidays for 2025:**
• New Year's Day - January 1, 2025 (Wednesday)
• Martin Luther King Jr. Day - January 20, 2025 (Monday)
• Presidents' Day - February 17, 2025 (Monday)
• Memorial Day - May 26, 2025 (Monday)
• Independence Day - July 4, 2025 (Friday)
• Labor Day - September 1, 2025 (Monday)
• Thanksgiving - November 27, 2025 (Thursday)
• Day after Thanksgiving - November 28, 2025 (Friday)
• Christmas Eve - December 24, 2025 (Wednesday)
• Christmas Day - December 25, 2025 (Thursday)

**Important Notes:**
• Floating holidays: Each employee receives 2 floating holiday days to use at their discretion
• Holiday pay eligibility: Full-time employees scheduled to work on holidays will receive holiday pay
• Time off requests: Please submit requests for time off around holidays at least 2 weeks in advance

The updated holiday calendar has been posted on the employee portal and will be reflected in your PTO tracking system.

Please let me know if you have any questions.

Best regards,
Sarah Johnson
HR Generalist`,
      priority: 'normal',
      category: 'Policy'
    }
  ]);

  const currentEmail = emails.find(e => e.id === selectedEmail?.id) || emails[0];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[95vw] max-w-[1280px] sm:max-w-none max-w-none p-0">
        <div className="flex h-full">
          {/* Email List - Left Column */}
          <div className="w-100 border-r bg-[#FAFBFC] overflow-y-auto p-[14px]">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-lg font-semibold text-[#20232A]">Inbox</SheetTitle>
              <SheetDescription className="text-[#5A6075]">
                View and manage your HR-related emails and notifications
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-2">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentEmail.id === email.id 
                      ? 'bg-[#4F84FF]/10 border border-[#4F84FF]/30' 
                      : 'bg-white hover:bg-gray-50 border border-[#E5E7EB]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-sm text-[#20232A] line-clamp-1">
                      {email.sender}
                    </p>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(email.priority)}`}></div>
                  </div>
                  <p className="text-sm text-[#20232A] font-medium mb-1 line-clamp-2">
                    {email.subject}
                  </p>
                  <p className="text-xs text-[#5A6075]">
                    {email.date.toLocaleDateString()} • {email.category}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Email Content - Center Column */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b bg-white">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-[#20232A] mb-2">
                    {currentEmail.subject}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-[#5A6075]">
                    <span>From: {currentEmail.sender}</span>
                    <span>•</span>
                    <span>{currentEmail.senderEmail}</span>
                    <span>•</span>
                    <span>{currentEmail.date.toLocaleDateString()} at {currentEmail.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={`${getPriorityColor(currentEmail.priority)} text-white`}>
                    {currentEmail.priority} priority
                  </Badge>
                  <Badge variant="outline" className="text-[#5A6075]">
                    {currentEmail.category}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-[#5A6075] border-[#E5E7EB]">
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </Button>
                <Button size="sm" variant="outline" className="text-[#5A6075] border-[#E5E7EB]">
                  <Forward className="w-4 h-4 mr-2" />
                  Forward
                </Button>
                <Button size="sm" variant="outline" className="text-[#5A6075] border-[#E5E7EB]">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
                <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-[#20232A] leading-relaxed">
                  {currentEmail.content}
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel - Right Column (Future Use) */}
          <div className="w-64 border-l bg-[#FAFBFC] p-4">
            <h3 className="font-semibold text-[#20232A] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm text-[#5A6075]">
                <Mail className="w-4 h-4 mr-2" />
                Mark as Important
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm text-[#5A6075]">
                <Archive className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}