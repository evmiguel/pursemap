
'use client'
import { useRouter } from "next/navigation";
import WorkbookParserFactory, { PurchaseOutput } from "@/classes/WorkbookParser";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import dayjs from "dayjs";

type FilePickerProps = {
  className: string
}

export default function FilePicker({ className }: FilePickerProps) {

  const router = useRouter();

  const [bank, setBank] = useState('');
  const [file, setFile] = useState();
  const [purchases, setPurchases] = useState([] as Array<PurchaseOutput>);
  const [alertOpen, setAlertOpen] = useState(false);
  const [duplicates, setDuplicates] = useState(new Map());

  const handleCheck = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement
    const purchase = purchases.filter((p) => p.name === target.value)[0]
    if (target.checked) {
      setDuplicates(new Map(duplicates.set(purchase.name, purchase)))
    } else {
      setDuplicates((prevState) => {
        prevState.delete(purchase.name)
        return new Map(prevState)
      })
    }
  }

  const renderAlert = (purchases: Array<PurchaseOutput>) => {
    return (
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <AlertDialogContent className="max-w-6xl overflow-scroll max-h-96">
        <AlertDialogHeader>
          <AlertDialogTitle>Possible duplicates detected</AlertDialogTitle>
            Check off all the duplicates that you don&apos;t want to upload
            <table>
              <tr>
                <th className="mr-6">Date</th>
                <th>Purchase</th>
                <th>Cost</th>
                <th>Possible duplicates</th>
                <th className="text-center">Don&apos;t upload</th>
              </tr>
            {purchases.map((purchase, index) => {
              if (!purchase.payment && purchase.duplicates !== undefined && purchase.duplicates.length > 0) {
                  return (
                    <tr className="border-b-2 border-black" key={index}>
                        <td className="pr-6">{dayjs(purchase.date).format('MM/DD/YYYY')}</td>
                        <td>{purchase.name}</td>
                        <td>${purchase.cost}</td>
                        <td>
                          <ul>
                            {purchase.duplicates.map(p => {return (<li key={p.id}>{dayjs(p.date).format('MM/DD/YYYY')} {p.name} ${p.cost}</li>)})}
                          </ul>
                        </td>
                        <td><Input type="checkbox" className="mx-auto w-4" value={purchase.name} name="purchase" onChange={handleCheck}/></td>
                    </tr>
                  )
              }
            })}
          </table>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={async () => {
            const purchasesToSave = purchases.filter(purchase => !purchase.payment && !duplicates.has(purchase.name));
            await savePurchases(purchasesToSave);
            router.refresh();
          }}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    )
  }

  async function savePurchases(purchases: Array<PurchaseOutput>) {
    Promise.all(Object.values(purchases as Array<PurchaseOutput>).map((purchase: PurchaseOutput) => {
      if (!purchase.payment) {
        const data = {
          name: purchase.name,
          cost: purchase.cost,
          category: purchase.category,
          date: new Date(purchase.date as unknown as string).setHours(12)
        }

        try {
          fetch('/api/purchase', { 
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
    }));
  }

  const readExcel = async (file: File) => {
      const parser = WorkbookParserFactory(bank, file);
      if (!file) {
        alert('Please select a file')
        return;
      }

      if (!bank) {
        alert('Please select a bank')
        return;
      }
      if (!parser) {
        return;
      }
      const data = await parser.parse() as Array<PurchaseOutput>;
      console.log(data)
      setPurchases(data);
      const hasDuplicates = data.filter(purchase => purchase.duplicates !== undefined && purchase.duplicates.length > 0).length > 0;
        if (hasDuplicates) {
        setAlertOpen(true)
      } else {
        savePurchases(data);
      }
    };
    return (
      <div className={className}>
        <Input
          placeholder="fileInput"
          type="file"
          multiple={true}
          onChange={async (e: any) => {
            const file = e.target.files[0];
            setFile(file);
          }}
          accept=".xlsx,.xls,.csv"
          className="w-1/4"
        />
        <Select onValueChange={setBank}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="AMEX">AMEX</SelectItem>
              <SelectItem value="CHASE">Chase</SelectItem>
              <SelectItem value="GEMINI">Gemini</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={(e) => { e.preventDefault(); readExcel(file as unknown as File);}} className="ml-4">Upload File</Button>
        { renderAlert(purchases) }
      </div>
    )
}