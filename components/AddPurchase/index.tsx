'use client'

import { useRouter } from "next/navigation"

interface AddPurchaseProps {
    email: string | null | undefined
}

export default function AddPurchase({ email }: AddPurchaseProps) {

    const router = useRouter();

    async function addPurchase(formData: FormData) {

        const data = {
            name: formData.get('name'),
            cost: formData.get('cost'),
            category: formData.get('category'),
            email: email
        }

        try {
            await fetch('/api/add-purchase', { 
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
        <form action={addPurchase}>
            <input name="name" placeholder="Purchase Name" className='text-black' />
            <input name="cost" placeholder="Purchase Cost" className='text-black' />
            <input name="category" placeholder="Category (optional)" className='text-black' />
            <button type="submit">Add Purchase</button>
        </form>
    )
}