"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

function AuthButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <>
                <button onClick={() => signOut()} className="text-white">Sign Out</button>
            </>
        )
    }
    return (
        <>
            <button onClick={() => signIn()} className="text-white">Sign In</button>
        </>
    ) 
}

export default function NavMenu() {
    return (
        <div className="text-right p-6 bg-blue-600">
            <AuthButton />
        </div>
    )
}