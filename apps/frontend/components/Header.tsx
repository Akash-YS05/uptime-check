"use client"

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Appbar() {
    return (
        <header className="flex justify-between items-center p-4 gap-4 h-16">
            <div>Monitr.</div>
            <div>
                <SignedOut>
                <SignInButton />
                <SignUpButton />
                </SignedOut>
                <SignedIn>
                <UserButton />
                </SignedIn>
            </div>
        </header>
    )
}