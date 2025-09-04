import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  DollarSign, 
  Award, 
  Phone, 
  Mail,
  Receipt,
  ExternalLink,
  Headset,
  ChevronDown,
  ChevronRight,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface HRSidebarProps {
  onOpenCalendar: () => void;
}

export function HRSidebar({ onOpenCalendar }: HRSidebarProps) {
  const [openSection, setOpenSection] = useState<string | null>('leave'); // Start with leave summary open
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const calculateDaysToNextSalary = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Assuming salary is paid on the 26th of each month
    let nextSalaryDate = new Date(currentYear, currentMonth, 26);
    
    // If we've passed the 26th this month, move to next month
    if (today.getDate() > 26) {
      nextSalaryDate = new Date(currentYear, currentMonth + 1, 26);
    }
    
    const timeDiff = nextSalaryDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return { days: daysDiff, date: nextSalaryDate };
  };

  const { days: daysToSalary, date: nextSalaryDate } = calculateDaysToNextSalary();

  const quickStats = [
    { label: "Days Off Remaining", value: "18", icon: <Calendar className="w-5 h-5" /> },
    { label: "Sick Days Left", value: "8", icon: <Clock className="w-5 h-5" /> },
    { label: "Next PTO", value: "Sep 23–24", icon: <Calendar className="w-5 h-5" /> }
  ];

  const payrollInfo = [
    { label: "Next Payday", value: "Sep 26", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Last Pay Amount", value: "$3,247.83", icon: <DollarSign className="w-5 h-5" /> },
    { label: "YTD Earnings", value: "$44,738.83", icon: <DollarSign className="w-5 h-5" /> }
  ];

  const quickLinks = [
    { icon: <Calendar className="w-5 h-5" />, label: "Manage PTO Requests" },
    { icon: <FileText className="w-5 h-5" />, label: "Employee Handbook" },
    { icon: <Users className="w-5 h-5" />, label: "Organization Chart" },
    { icon: <Award className="w-5 h-5" />, label: "Performance Portal" },
    { icon: <Headset className="w-5 h-5" />, label: "IT Helpdesk" }
  ];

  const hrTeam = [
    {
      name: "Jessica Chen",
      role: "HR Business Partner",
      email: "jessica.chen@company.com",
      phone: "(555) 123-4567"
    },
    {
      name: "Michael Rodriguez",
      role: "Benefits Specialist",
      email: "michael.r@company.com", 
      phone: "(555) 234-5678"
    }
  ];

  const handleSectionToggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 p-6 pb-32 overflow-y-auto sidebar-scroll"> {/* Added bottom padding and scroll */}
        {/* Greeting Section */}
        <div className="py-4 mb-6">
          <div className="text-white font-semibold text-lg mb-1 text-[14px]">
            {getGreeting()}, Sarah Williams
          </div>
          <div className="text-white/60 text-sm">
            Next salary in <span className="font-medium text-[rgba(79,255,196,1)]">{daysToSalary} days</span> • {nextSalaryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-3">
          {/* Leave Summary Dropdown */}
          <Collapsible open={openSection === 'leave'} onOpenChange={() => handleSectionToggle('leave')}>
            <Card className="bg-sidebar-accent border-sidebar-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="py-4 px-5 cursor-pointer hover:bg-white/5 transition-colors px-[12px] py-[10px]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-sidebar-foreground text-[14px]">Leave Summary</CardTitle>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-[#B0B3C0] hover:text-[#4F84FF] transition-colors" />
                      {openSection === 'leave' ? 
                        <ChevronDown className="w-5 h-5 text-white transition-transform duration-200" /> : 
                        <ChevronRight className="w-5 h-5 text-white transition-transform duration-200" />
                      }
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent className="transition-all duration-300 ease-in-out">
                <CardContent className="px-4 pb-4 space-y-3">
                  {quickStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sidebar-primary/20 text-sidebar-primary flex items-center justify-center">
                          {stat.icon}
                        </div>
                        <span className="text-sm font-medium text-white">{stat.label}</span>
                      </div>
                      <Badge className={`font-semibold ${
                        stat.label === 'Next PTO' 
                          ? 'bg-[#4F84FF] text-white' 
                          : 'bg-sidebar-primary text-white'
                      }`}>
                        {stat.value}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Payroll Dropdown */}
          <Collapsible open={openSection === 'payroll'} onOpenChange={() => handleSectionToggle('payroll')}>
            <Card className="bg-sidebar-accent border-sidebar-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="py-4 px-5 cursor-pointer hover:bg-white/5 transition-colors px-[12px] py-[10px]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-sidebar-foreground text-[14px]">Payroll</CardTitle>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-[#B0B3C0] hover:text-[#4F84FF] transition-colors" />
                      {openSection === 'payroll' ? 
                        <ChevronDown className="w-5 h-5 text-white transition-transform duration-200" /> : 
                        <ChevronRight className="w-5 h-5 text-white transition-transform duration-200" />
                      }
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent className="transition-all duration-300 ease-in-out">
                <CardContent className="px-4 pb-4 space-y-3">
                  {payrollInfo.map((item, index) => (
                    <div key={index} className="flex items-center justify-between hover:bg-white/5 p-2 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sidebar-primary/20 text-sidebar-primary flex items-center justify-center">
                          {item.icon}
                        </div>
                        <span className={`text-sm ${
                          item.label === 'Next Payday' 
                            ? 'font-semibold text-white' 
                            : 'font-medium text-white'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                      <Badge className={`font-semibold ${
                        item.label === 'Next Payday'
                          ? 'bg-[#4F84FF] text-white'
                          : item.label === 'Last Pay Amount'
                          ? 'bg-green-500 text-white'
                          : 'bg-sidebar-primary text-white'
                      }`}>
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Quick Links Dropdown */}
          <Collapsible open={openSection === 'links'} onOpenChange={() => handleSectionToggle('links')}>
            <Card className="bg-sidebar-accent border-sidebar-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="px-5 py-[10px] cursor-pointer hover:bg-white/5 transition-colors px-[12px]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-sidebar-foreground text-[14px]">Quick Links</CardTitle>
                    {openSection === 'links' ? 
                      <ChevronDown className="w-5 h-5 text-white transition-transform duration-200" /> : 
                      <ChevronRight className="w-5 h-5 text-white transition-transform duration-200" />
                    }
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent className="transition-all duration-300 ease-in-out">
                <CardContent className="px-4 pb-4 space-y-2">
                  {quickLinks.map((link, index) => (
                    <Button 
                      key={index}
                      variant="ghost" 
                      className="w-full justify-start text-sm h-auto p-3 text-white hover:bg-sidebar-primary/20 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-3 w-full">
                        {link.icon}
                        <span className="flex-1 text-left">{link.label}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* My HR Team Dropdown */}
          <Collapsible open={openSection === 'team'} onOpenChange={() => handleSectionToggle('team')}>
            <Card className="bg-sidebar-accent border-sidebar-border">
              <CollapsibleTrigger asChild>
                <CardHeader className="px-5 py-[10px] cursor-pointer hover:bg-white/5 transition-colors px-[12px]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-sidebar-foreground text-[14px]">My HR Team</CardTitle>
                    {openSection === 'team' ? 
                      <ChevronDown className="w-5 h-5 text-white transition-transform duration-200" /> : 
                      <ChevronRight className="w-5 h-5 text-white transition-transform duration-200" />
                    }
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent className="transition-all duration-300 ease-in-out">
                <CardContent className="px-4 pb-4 space-y-4">
                  {hrTeam.map((member, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-sidebar-primary/20 text-sidebar-primary flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm mb-1">{member.name}</h4>
                          <p className="text-white/70 text-xs mb-2">{member.role}</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <Mail className="w-3 h-3 text-white/60" />
                              <span className="text-white/60 truncate">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Phone className="w-3 h-3 text-white/60" />
                              <span className="text-white/60">{member.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </div>

      {/* Emergency Contact - Fixed at bottom */}
      <div className="absolute bottom-3 left-6 right-6">
        <Card className="bg-red-500/10 border-red-500/30 shadow-lg border-t-2 border-t-red-500/50 rounded-[14px]">
          <CardHeader className="pt-2 px-4">
            <CardTitle className="text-lg font-semibold text-red-400">Emergency HR Line</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <p className="text-sm text-red-300/90 mb-2 leading-relaxed">
            We’re here for you anytime — call us for urgent HR matters, 24x7.
          </p>
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium mb-[4px] mt-[0px] mr-[0px] ml-[0px]">
              <Phone className="w-4 h-4 mr-2" />
              Call (555) 911-HR24
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}