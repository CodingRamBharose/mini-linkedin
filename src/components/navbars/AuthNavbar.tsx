import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

export default function AuthNavbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Briefcase className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg sm:text-xl font-bold text-blue-700 dark:text-blue-600">
              LinkedIn
            </span>
          </Link>

          {/* Auth buttons */}
          <div className="flex gap-2">
            <Button asChild className='border-none bg-transparent shadow-none px-3 sm:px-4 rounded-full hover:bg-gray-100 text-sm sm:text-base'>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className='border-2 text-blue-600 border-blue-600 bg-transparent shadow-none px-3 sm:px-4 rounded-full hover:bg-gray-100 text-sm sm:text-base'>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}