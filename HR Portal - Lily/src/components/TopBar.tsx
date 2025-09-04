import React, { useState, useEffect } from 'react';
import { Calendar, User, Settings, Users } from 'lucide-react';
import { Button } from './ui/button';
import { NotificationDropdown } from './NotificationDropdown';
import { CalendarOverlay } from './CalendarOverlay';
import { EmailViewPanel } from './EmailViewPanel';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export function TopBar() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showEmailPanel, setShowEmailPanel] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

   useEffect(() => {
    const openCal = () => setShowCalendar(true);
    window.addEventListener('hr:openCalendar', openCal);
    return () => window.removeEventListener('hr:openCalendar', openCal);
  }, []); 
  
  // Count events in next 7 days
  const getUpcomingEventsCount = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Mock events - in real app this would come from props or context
    const events = [
      new Date(2024, 8, 15), // Sep 15
      new Date(2024, 8, 20), // Sep 20
    ];
    
    return events.filter(event => event >= today && event <= nextWeek).length;
  };

  const upcomingEventsCount = getUpcomingEventsCount();

  const handleEmailView = (notification: any) => {
    setSelectedEmail(notification);
    setShowEmailPanel(true);
  };

  return (
    <>
      <div className="h-20 border-b border-[#E5E7EB] bg-white px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-[#20232A]">Your HR Assistant - Lily</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <NotificationDropdown onEmailView={handleEmailView} />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCalendar(true)}
            className="h-12 w-12 p-0 hover:bg-[#F8FAFF] transition-colors relative"
          >
            <Calendar className="h-5 w-5 text-[#5A6075]" />
            {upcomingEventsCount > 0 && (
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#4F84FF] text-white text-xs flex items-center justify-center font-medium">
                {upcomingEventsCount}
              </div>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-12 w-12 p-0 hover:bg-[#F8FAFF] transition-colors rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFuJTIwaGVhZHNob3QlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTY2MDU1ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Profile"
                  className="h-full w-full object-cover object-center"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg border border-[#E5E7EB] rounded-[4px]">
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-[#F8FAFF] cursor-pointer">
                <User className="h-4 w-4 text-[#5A6075]" />
                <span className="text-sm text-[#20232A]">My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-[#F8FAFF] cursor-pointer">
                <Users className="h-4 w-4 text-[#5A6075]" />
                <span className="text-sm text-[#20232A]">My Team</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 hover:bg-[#F8FAFF] cursor-pointer">
                <Settings className="h-4 w-4 text-[#5A6075]" />
                <span className="text-sm text-[#20232A]">Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CalendarOverlay 
        isOpen={showCalendar} 
        onClose={() => setShowCalendar(false)} 
      />
      
      <EmailViewPanel 
        isOpen={showEmailPanel}
        onClose={() => setShowEmailPanel(false)}
        selectedEmail={selectedEmail}
      />
    </>
  );
}