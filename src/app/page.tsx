import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="min-h-screen w-full">
      <main className="flex flex-col lg:flex-row items-center justify-center bg-white min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="text-center lg:text-left w-full lg:w-1/2 lg:pr-8">
          <h1 className="text-2xl sm:text-xl lg:text-2xl xl:text-3xl text-black font-bold mb-4 sm:mb-6">
            Connect with Professionals Worldwide
          </h1>
          <p className="text-base sm:text-md lg:text-lg text-black mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
            LinkedIn is the premier professional networking platform to share
            knowledge, opportunities, and grow your career.
          </p>
          <div className="flex flex-col gap-3 sm:gap-4 items-center lg:items-start max-w-md mx-auto lg:mx-0">
            <Suspense fallback={<div className="text-sm">Loading...</div>}>
              <GoogleSignInButton width={100}/>
            </Suspense>
            <Link href="/sign-up" className="w-full">
              <Button className="text-black h-10 sm:h-12 w-full rounded-full flex justify-center items-center font-medium gap-2.5 border-2 border-black bg-white cursor-pointer transition-all duration-200 ease-in-out hover:border-[#2d79f3] text-sm sm:text-base" size="lg">Get Started</Button>
            </Link>
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-10 text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className='text-[10px] sm:text-[11px] text-gray-500 max-w-sm lg:max-w-md'>
              By clicking Continue to join or sign in, you agree to LinkedIn <span className='text-blue-500 font-semibold'>User Agreement, Privacy Policy</span>, and <span className='text-blue-500 font-semibold'> Cookie Policy.</span>
            </p>
            <p className='mt-2 sm:mt-3 text-black text-sm sm:text-base'>
              Already have an account? <span className='text-blue-500 font-semibold hover:underline'>
                <Link href="/sign-in">
                  Sign In
                </Link></span>
            </p>
          </div>
        </div>
         <div className='w-full lg:w-1/2 text-center mt-8 lg:mt-0'>
          <Image
            src="/assets/landingpage.svg"
            alt='Professional networking illustration'
            width={596}
            height={500}
            className="w-full max-w-md sm:max-w-lg lg:max-w-full h-auto mx-auto"
            priority
          />
        </div>
      </main>
    </div>
  );
}
