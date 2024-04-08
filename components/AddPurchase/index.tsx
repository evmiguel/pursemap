'use client'

import { useRouter } from "next/navigation";
import { useRef } from 'react';
import dayjs from 'dayjs';


export default function AddPurchase() {

    const router = useRouter();
    const ref = useRef<HTMLFormElement>(null);

    async function addPurchase(formData: FormData) {

        let formattedDate;
        if (dayjs(formData.get('date') as string).isSame(Date.now(), 'day')){
            formattedDate = new Date();
        } else {
            formattedDate = new Date(formData.get('date') as string).setHours(24)
        }

        const data = {
            name: formData.get('name'),
            cost: formData.get('cost'),
            category: formData.get('category'),
            date: formattedDate,
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

    const today = dayjs(new Date()).format('YYYY-MM-DD');

    return (
        <div className="container mx-auto text-center">
            <form ref={ref} action={async (formData) => { addPurchase(formData);  ref.current?.reset(); }}>
                <input type="date" name="date" defaultValue={today} max={today} className='text-center text-black block lg:inline-block mx-auto' />
                <input name="name" placeholder="Purchase Name" className='text-center text-black block lg:inline-block mx-auto' />
                <input name="cost" placeholder="Purchase Cost" className='text-center text-black block lg:inline-block mx-auto' />
                <input name="category" placeholder="Category (optional)" className='text-center text-black block lg:inline-block mx-auto' />
                <button type="submit" className="text-white bg-orange-300 p-4 rounded-md mx-auto">Add Purchase</button>
            </form>
        </div>
    )
}