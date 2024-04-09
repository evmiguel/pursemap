
'use client'
import { useRouter } from "next/navigation";
import WorkbookParserFactory, { ParserOutput } from "@/classes/WorkbookParser";
import { Purchase } from "../Purchases/columns";

type FilePickerProps = {
  className: string
}

export default function FilePicker({ className }: FilePickerProps) {

  const router = useRouter();

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
      const parser = WorkbookParserFactory('AMEX', file);
      if (!parser) {
        return
      }
      const data = await parser.parse();
      savePurchases(data);
    };
    return (
      <div className={className}>
        <input
          placeholder="fileInput"
          type="file"
          multiple={true}
          onChange={async (e: any) => {
            const file = e.target.files[0];
            await readExcel(file);
          }}
          accept=".xlsx,.xls,.csv"
        />
      </div>
    )
}