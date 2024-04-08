import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Purchase } from "../Purchases/columns"
import { useRouter } from "next/navigation"

type EditPurchaseProps = {
    purchase: Purchase,
    open: boolean,
    openOnChange: (value: boolean) => void
}

export default function EditPurchase({ purchase, open, openOnChange }: EditPurchaseProps) {
    const router = useRouter();

    async function updatePurchase(formData: FormData) {

        const data = {
            id: purchase.id,
            name: formData.get('name'),
            category: formData.get('category')
        }

        try {
            await fetch('/api/purchase', { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            openOnChange(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={openOnChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Edit Purchase</DialogTitle>
                <DialogDescription>
                    Change the name or category of your purchase. Hit save when you&apos;re done
                </DialogDescription>
                </DialogHeader>
                <form action={updatePurchase}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            Name
                            </Label>
                            <Input id="name" name="name" defaultValue={purchase.name} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                            Category
                            </Label>
                            <Input id="category" name="category" defaultValue={purchase.category} className="col-span-3" />
                        </div>
                    </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}