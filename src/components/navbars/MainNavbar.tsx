'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUserData } from '@/hooks/useUserData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  ChevronDown,
  Briefcase,
} from 'lucide-react';

// interface SearchResult {
//   id: string;
//   username: string;
//   name: string;
//   avatar?: string;
// }

export default function Navbar() {
  const { user } = useUserData();


  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
      href: '/dashboard',
      icon: Home,
      active: pathname === '/dashboard'
    },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            {/* Logo */}
            <Link
              href="/dashboard"
              className={`flex items-center h-full px-1 sm:px-2}`}
            >
              <Briefcase className="h-6 w-6 text-blue-600" />
              <span className="ml-1 sm:ml-2 text-lg sm:text-xl font-bold text-blue-800 dark:text-blue-300">
                LinkedIn
              </span>
            </Link>
          </div>

          {/* Right side - Navigation Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4 h-full">
            {/* Navigation Items with bottom border indicators */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`h-full flex items-center px-2 sm:px-4 ${item.active ? 'border-b-2 border-blue-600 dark:border-blue-400' : ''}`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={`flex flex-col h-full gap-1 ${item.active ? 'text-blue-600 dark:text-blue-400' : ''}`}
                >
                  <item.icon className="h-5 w-5 sm:h-6 sm:w-6 min-w-5 min-h-5 sm:min-w-6 sm:min-h-6 aspect-square" />
                  <span className="text-gray-600 dark:text-gray-300 text-[9px] sm:text-[10px] hidden sm:block">{item.name}</span>
                </Button>
              </Link>
            ))}

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="relative border-none outline-none bg-transparent text-gray-600 dark:text-gray-300 h-8 w-8 sm:h-10 sm:w-10 flex flex-col items-center justify-center gap-1 cursor-pointer">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs sm:text-sm">
                      {user.name?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <p className='text-[9px] sm:text-[10px] hidden sm:flex items-center'>Me<ChevronDown className="h-3 w-3 ml-1" /></p>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    👤 View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900 cursor-pointer"
                  onClick={() => signOut()}
                >
                  🚪 Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}