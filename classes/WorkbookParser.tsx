
import { Purchase } from '@/components/Purchases/columns';
import exceljs from 'exceljs';
import * as d3 from "d3";

enum Banks {
    AMEX = 'AMEX',
    CHASE = 'CHASE',
    GEMINI = 'GEMINI'
}

export type ParserOutput = {
    [index: number]: Purchase
}

abstract class WorkbookParser {
    file: File;

    constructor(file: File) {
        this.file = file
    }

    abstract readFile(file: File): Promise<any>

    abstract parse(): Promise<ParserOutput>
}

abstract class CsvWorkbookParser extends WorkbookParser {
    constructor(file: File) {
        super(file);
    }

    override readFile(file: File): Promise<any> {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onload = () => {
              resolve(reader.result)
            }
        })
    }

}

class AmexWorkbookParser extends WorkbookParser {
    constructor(file: File) {
        super(file);
    }

    override readFile(fileRes: any) {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.readAsArrayBuffer(fileRes)
          reader.onload = () => {
            resolve(reader.result)
          }
        });
    }

    async parse() {
        const workbook = new exceljs.Workbook();
        const buffer = await this.readFile(this.file);
        const fileData = await workbook.xlsx.load(buffer as Buffer);
        const sheet = fileData.worksheets[0];
        const data:ParserOutput = {};
        sheet.eachRow((row, rowIndex) => {
            if ([1, 2, 3, 4, 5, 6, 7].includes(rowIndex)) {
                return;
            }

            const values = row.values as Array<any>;

            if (values[2].includes('THANK YOU')) {
                return;
            }
            
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

class ChaseWorkbookParser extends CsvWorkbookParser {
    constructor(file: File) {
        super(file);
    }

    async parse() {
        const text = await this.readFile(this.file)
        const csvData = d3.csvParse(text);
        const data:ParserOutput = {}
        csvData.forEach((row, index) => {
            if (row['Type'] === 'Payment') {
                return;
            }
            data[index] = {
                date: new Date(row['Transaction Date']),
                name: row['Description'],
                cost: parseFloat(row['Amount']) * -1,
                category: row['Category']
            }
        });
        return data;
    } 
}

class GeminiWorkbookParser extends CsvWorkbookParser {
    constructor(file: File) {
        super(file);
    }

    async parse() {
        const text = await this.readFile(this.file)
        const csvData = d3.csvParse(text);
        const data:ParserOutput = {}
        csvData.forEach((row, index) => {
            if (row['Transaction Type'] === 'payment_transaction') {
                return;
            }
            data[index] = {
                date: new Date(row['Transaction Post Date']),
                name: row['Description of Transaction'],
                cost: parseFloat(row['Amount']),
                category: ''
            }
        });
        return data;
    } 
}

export default function WorkbookParserFactory(bank: string, file: File) {
    if (bank === Banks.AMEX) {
        return new AmexWorkbookParser(file);
    } else if (bank === Banks.CHASE) {
        return new ChaseWorkbookParser(file);
    } else if (bank === Banks.GEMINI) {
        return new GeminiWorkbookParser(file);
    }
    return null;
}