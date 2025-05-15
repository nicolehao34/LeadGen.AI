import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, CircleHelp, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  return (
    <header className="bg-white border-b border-neutral-200 py-2 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-primary-600 font-bold text-xl">LeadGen.ai</div>
          <nav className="hidden md:flex ml-10 space-x-6">
            <Link href="/dashboard">
              <a className="text-neutral-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Dashboard</a>
            </Link>
            <Link href="/lead-generation">
              <a className="text-primary-600 border-b-2 border-primary-600 px-3 py-2 text-sm font-medium">Lead Generation</a>
            </Link>
            <Link href="/campaigns">
              <a className="text-neutral-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Campaigns</a>
            </Link>
            <Link href="/reports">
              <a className="text-neutral-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Reports</a>
            </Link>
            <Link href="/settings">
              <a className="text-neutral-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Settings</a>
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-neutral-800">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-neutral-800">
            <CircleHelp className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.fullName || 'User'} />
              <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <span className="ml-2 text-sm font-medium text-neutral-700 hidden md:block">
              {user?.fullName || 'User'}
            </span>
            <ChevronDown className="ml-2 text-neutral-500 h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
