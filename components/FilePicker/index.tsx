
'use client'
import exceljs from 'exceljs';

export default function FilePicker() {
  const readExcel = async (file: File) => {
      function readFile(fileRes: any) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsArrayBuffer(fileRes)
            reader.onload = () => {
              resolve(reader.result)
            }
          })
      }
      const buffer = await readFile(file);
      const workbook = new exceljs.Workbook();
      const fileData = await workbook.xlsx.load(buffer as Buffer);
      const sheet = fileData.worksheets[0];
      sheet.eachRow((row, rowIndex) => {
        console.log(row.values, rowIndex)
      })
    };
    return (
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
    )
}