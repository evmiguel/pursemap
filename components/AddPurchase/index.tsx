'use client'

import { useRouter } from "next/navigation"
import { useRef } from 'react'

interface AddPurchaseProps {
    email: string | null | undefined
}

export default function AddPurchase({ email }: AddPurchaseProps) {

    const router = useRouter();
    const ref = useRef<HTMLFormElement>(null);

    async function addPurchase(formData: FormData) {

        const data = {
            name: formData.get('name'),
            cost: formData.get('cost'),
            category: formData.get('category'),
            date: Date.now(),
            email: email
        }

        try {
            await fetch('/api/purchase', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="container mx-auto text-center">
            <form ref={ref} action={async (formData) => { addPurchase(formData);  ref.current?.reset(); }}>
                <input name="name" placeholder="Purchase Name" className='text-center text-black block lg:inline-block mx-auto' />
                <input name="cost" placeholder="Purchase Cost" className='text-center text-black block lg:inline-block mx-auto' />
                <input name="category" placeholder="Category (optional)" className='text-center text-black block lg:inline-block mx-auto' />
                <button type="submit" className="text-white bg-orange-300 p-4 rounded-md mx-auto">Add Purchase</button>
            </form>
        </div>
    )
}