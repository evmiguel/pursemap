"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

function AuthButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <>
                <button onClick={() => signOut()}>Sign Out</button>
            </>
        )
    }
    return (
        <>
            <button onClick={() => signIn()}>Sign In</button>
        </>
    ) 
}

export default function NavMenu() {
    return (
        <div className="text-right p-4 bg-blue-400">
            <AuthButton />
        </div>
    )
}