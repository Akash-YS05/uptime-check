"use client"

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Dog } from "lucide-react";
import Link from "next/link";

export default function Appbar() {
    return (
        // <header className="flex justify-between items-center p-4 gap-4 h-16">
        //     <div>Monitr.</div>
        //     <div>
        //         <SignedOut>
        //         <SignInButton />
        //         <SignUpButton />
        //         </SignedOut>
        //         <SignedIn>
        //         <UserButton />
        //         </SignedIn>
        //     </div>
        // </header>


        <header className="py-6 px-4 sm:px-6 lg:px-8 border border-neutral-200 backdrop-blur-sm bg-white sticky top-0 z-50 text-black">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-light tracking-tight font-[Bodoni_Moda] flex"><span>UpDog</span> <Dog/> </Link>
            <nav className="hidden sm:flex space-x-6">
              <Link href="#features" className="text-lg  font-normal hover:text-gray-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-lg  font-normal hover:text-gray-600 transition-colors">
                How it works
              </Link>
              <Link href="#pricing" className="text-lg  font-normal hover:text-gray-600 transition-colors">
                Pricing
              </Link>
              <Link href="#faq" className="text-lg  font-normal hover:text-gray-600 transition-colors">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
                <SignedOut>
                <div className="cursor-pointer border border-gray-400 hover:bg-gray-200 rounded py-1 px-3 duration-150">
                <SignInButton />
                </div>
                <div className="cursor-pointer border border-gray-400 hover:bg-gray-200 rounded py-1 px-3 duration-150">
                <SignUpButton />
                </div>
                </SignedOut>
                <SignedIn>
                <UserButton />
                </SignedIn>
            </div>
          </div>
        </div>
      </header>
    )
}