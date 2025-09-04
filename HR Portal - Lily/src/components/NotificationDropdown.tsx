import React, { useState } from 'react';
import { Bell, Mail, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'system' | 'reminder';
  timestamp: Date;
  isRead: boolean;
}

interface NotificationDropdownProps {
  onEmailView: (notification: Notification) => void;
}

export function NotificationDropdown({ onEmailView }: NotificationDropdownProps) {
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Benefits Enrollment Reminder',
      message: 'Your benefits enrollment deadline is approaching. Please complete by Dec 15th.',
      type: 'email',
      timestamp: new Date(2024, 11, 10),
      isRead: false
    },
    {
      id: '2', 
      title: 'Pay Stub Available',
      message: 'Your December pay stub is now available for viewing.',
      type: 'system',
      timestamp: new Date(2024, 11, 8),
      isRead: false
    },
    {
      id: '3',
      title: 'Holiday Schedule Update',
      message: 'Updated holiday schedule for 2025 has been posted.',
      type: 'email',
      timestamp: new Date(2024, 11, 5),
      isRead: true
    },
    {
      id: '4',
      title: 'Performance Review Due',
      message: 'Your quarterly performance review is due by Dec 20th.',
      type: 'reminder',
      timestamp: new Date(2024, 11, 3),
      isRead: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'reminder': return <Clock className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === 'email') {
      onEmailView(notification);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 hover:bg-[#F8FAFF] transition-colors relative text-[12px]"
        >
          <Bell className="h-7 w-7 text-[#5A6075]" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-[#20232A]">Notifications</h3>
          <p className="text-sm text-[#5A6075]">{unreadCount} unread messages</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification, index) => (
            <DropdownMenuItem
              key={notification.id}
              className="p-4 cursor-pointer hover:bg-[#F8FAFF] transition-colors"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex gap-3 w-full">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  notification.isRead ? 'bg-gray-100 text-gray-500' : 'bg-[#4F84FF]/10 text-[#4F84FF]'
                }`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${
                      notification.isRead ? 'text-[#5A6075]' : 'text-[#20232A]'
                    }`}>
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-[#4F84FF] rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                  <p className="text-xs text-[#5A6075] mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    {notification.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <div className="p-3 border-t">
          <Button variant="ghost" className="w-full text-[#4F84FF] hover:bg-[#4F84FF]/5">
            View All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}