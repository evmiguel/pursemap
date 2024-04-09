
import { Purchase } from '@/components/Purchases/columns';
import exceljs from 'exceljs';

export type ParserOutput = {
    [index: number]: Purchase
}

abstract class WorkbookParser {
    file: File;

    constructor(file: File) {
        this.file = file
    }

    readFile(fileRes: any) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsArrayBuffer(fileRes)
          reader.onload = () => {
            resolve(reader.result)
          }
        })
    }

    abstract parse(): Promise<ParserOutput>
}

class AmexWorkbookParser extends WorkbookParser {
    constructor(file: File) {
        super(file);
    }

    async parse() {
        const workbook = new exceljs.Workbook();
        const buffer = await this.readFile(this.file);
        const fileData = await workbook.xlsx.load(buffer as Buffer);
        const sheet = fileData.worksheets[0];
        const data:ParserOutput = { }
        sheet.eachRow((row, rowIndex) => {
            if ([1, 2, 3, 4, 5, 6, 7].includes(rowIndex)) {
                return;
            }

            const values = row.values as Array<any>;
            
            data[rowIndex] = {
               date: values[1],
               name: values[2],
               cost: values[3],
               category: values[11],
            };
        });
        return data;
    }
}

enum Banks {
    AMEX = 'AMEX'
}

export default function WorkbookParserFactory(bank: string, file: File) {
    if (bank === Banks.AMEX) {
        return new AmexWorkbookParser(file);
    } 
    return null;
}