"use client";
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
        <nav className="p-6 bg-blue-600">
            <ul className="flex justify-between">
                <li className="inline-block font-bold text-lg text-white">PURSE MAP</li>
                <li className="inline-block"><AuthButton /></li>
            </ul>
        </nav>
    )
}