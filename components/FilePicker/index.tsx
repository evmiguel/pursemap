
'use client'
import { useRouter } from "next/navigation";
import WorkbookParserFactory, { ParserOutput } from "@/classes/WorkbookParser";
import { Purchase } from "../Purchases/columns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type FilePickerProps = {
  className: string
}

export default function FilePicker({ className }: FilePickerProps) {

  const router = useRouter();

  const [bank, setBank] = useState('');
  const [file, setFile] = useState();

  async function savePurchases(purchases: ParserOutput) {

    Promise.all(Object.values(purchases as Array<Purchase>).map((purchase: Purchase) => {
      const data = {
          name: purchase.name,
          cost: purchase.cost,
          category: purchase.category,
          date: new Date(purchase.date as unknown as string).setHours(24)
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
      const data = await parser.parse();
      savePurchases(data);
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
      </div>
    )
}