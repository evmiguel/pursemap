"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import PlaidLink from "../PlaidLink";

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
                <li className="inline-block">PURSE MAP</li>
                <li className="inline-block"><PlaidLink /></li>
                <li className="inline-block"><AuthButton /></li>
            </ul>
        </nav>
    )
}