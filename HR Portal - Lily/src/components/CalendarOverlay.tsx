import React, { useState } from 'react';
import { Calendar as CalendarIcon, X, Clock, DollarSign, Users, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'payroll' | 'deadline' | 'holiday' | 'event';
  description?: string;
}

interface CalendarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalendarOverlay({ isOpen, onClose }: CalendarOverlayProps) {
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Payroll Processing',
      date: new Date(2024, 8, 15), // September 15
      type: 'payroll',
      description: 'Monthly payroll will be processed'
    },
    {
      id: '2',
      title: 'Benefits Enrollment Deadline',
      date: new Date(2024, 8, 20), // September 20
      type: 'deadline',
      description: 'Last day to submit benefit changes'
    },
    {
      id: '3',
      title: 'Team Building Event',
      date: new Date(2024, 8, 25), // September 25
      type: 'event',
      description: 'Annual company holiday celebration'
    },
    {
      id: '4',
      title: 'Performance Review Deadline',
      date: new Date(2024, 8, 28), // September 28
      type: 'deadline',
      description: 'Quarterly performance reviews due'
    },
    {
      id: '5',
      title: 'Company Retreat',
      date: new Date(2024, 9, 5), // October 5
      type: 'holiday',
      description: 'Company holiday - offices closed'
    },
    {
      id: '6',
      title: 'Payroll Processing',
      date: new Date(2024, 9, 15), // October 15
      type: 'payroll',
      description: 'Year-end payroll processing'
    },
    {
      id: '7',
      title: "New Year's Day",
      date: new Date(2025, 0, 1),
      type: 'holiday',
      description: 'Company holiday - offices closed'
    },
    {
      id: '8',
      title: 'Q1 All-Hands Meeting',
      date: new Date(2025, 0, 15),
      type: 'event',
      description: 'Quarterly company meeting'
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'payroll': return <DollarSign className="w-4 h-4" />;
      case 'deadline': return <Clock className="w-4 h-4" />;
      case 'holiday': return <Gift className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payroll': return 'bg-green-500 text-white';
      case 'deadline': return 'bg-red-500 text-white';
      case 'holiday': return 'bg-purple-500 text-white';
      default: return 'bg-[#4F84FF] text-white';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const sortedEvents = events.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b border-[#E5E7EB]">
          <DialogTitle className="text-xl font-bold text-[#20232A] flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#4F84FF]" />
            Upcoming Events
          </DialogTitle>
          <DialogDescription className="text-[#5A6075]">
            View all upcoming company events, deadlines, and important dates
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 overflow-y-auto pr-2 scroll-smooth max-h-96">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-4 p-4 bg-white border border-[#E5E7EB] rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-col items-center gap-1 min-w-[60px] text-center">
                <div className="text-xs font-medium text-[#5A6075] uppercase tracking-wide">
                  {event.date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
                <div className="text-lg font-bold text-[#20232A]">
                  {event.date.getDate()}
                </div>
                <div className="text-xs text-[#5A6075]">
                  {event.date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-[#20232A] text-sm">
                    {event.title}
                  </h3>
                  <Badge className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(event.type)}`}>
                    <span className="mr-1">{getIcon(event.type)}</span>
                    {event.type}
                  </Badge>
                </div>
                
                {event.description && (
                  <p className="text-sm text-[#5A6075] leading-relaxed">
                    {event.description}
                  </p>
                )}
                
                <p className="text-xs text-[#9CA3AF] mt-2">
                  {formatDate(event.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-[#5A6075] border-[#E5E7EB] hover:bg-[#F8FAFF]"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}