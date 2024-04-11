
import { Purchase } from '@/components/Purchases/columns';
import * as d3 from "d3";

enum Banks {
    AMEX = 'AMEX',
    CHASE = 'CHASE',
    GEMINI = 'GEMINI'
}

export interface PurchaseOutput extends Purchase {
    duplicates?: Array<any>
    payment?: boolean
}

abstract class WorkbookParser {
    file: File;

    constructor(file: File) {
        this.file = file
    }

    abstract readFile(file: File): Promise<any>

    abstract parse(): Promise<Array<PurchaseOutput>>
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

class AmexWorkbookParser extends CsvWorkbookParser {
    constructor(file: File) {
        super(file);
    }

    async parse() {
        const text = await this.readFile(this.file)
        const csvData = d3.csvParse(text);
        console.log(csvData)
        return Promise.all(csvData.map(async (row) => {
            if (row['Description'].includes('THANK YOU')) {
                return {
                    date: new Date(row['Date']),
                    name: row['Description'],
                    cost: parseFloat(row['Amount']),
                    category: row['Category'],
                    payment: true
                };
            }

            const costData = {
                date: new Date(row['Date']).setHours(12),
                cost: parseFloat(row['Amount'])
            }
      
            const response = await fetch('/api/purchase/duplicate', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(costData)
            });

            const responseBody = await response.json();

            const duplicates = responseBody.result;

            return {
                date: new Date(row['Date']),
                name: row['Description'],
                cost: parseFloat(row['Amount']),
                category: row['Category'],
                duplicates,
                payment: false
            }
        }));
    } 
}

class ChaseWorkbookParser extends CsvWorkbookParser {
    constructor(file: File) {
        super(file);
    }

    async parse() {
        const text = await this.readFile(this.file)
        const csvData = d3.csvParse(text);
        return Promise.all(csvData.map(async (row) => {
            if (row['Type'] === 'Payment') {
                return {
                    date: new Date(row['Transaction Date']),
                    name: row['Description'],
                    cost: parseFloat(row['Amount']) * -1,
                    category: row['Category'],
                    payment: true
                };
            }

            const costData = {
                date: new Date(row['Transaction Date']).setHours(12),
                cost: parseFloat(row['Amount']) * -1
            }
      
            const response = await fetch('/api/purchase/duplicate', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(costData)
            });

            const responseBody = await response.json();

            const duplicates = responseBody.result;

            return {
                date: new Date(row['Transaction Date']),
                name: row['Description'],
                cost: parseFloat(row['Amount']) * -1,
                category: row['Category'],
                duplicates,
                payment: false
            }
        }));
    } 
}

class GeminiWorkbookParser extends CsvWorkbookParser {
    constructor(file: File) {
        super(file);
    }

    async parse() {
        const text = await this.readFile(this.file)
        const csvData = d3.csvParse(text);
        return Promise.all(
            csvData.map(async (row) => {
                if (row['Transaction Type'] === 'payment_transaction') {
                    return {
                        date: new Date(row['Transaction Post Date']),
                        name: row['Description of Transaction'],
                        cost: parseFloat(row['Amount']),
                        category: '',
                        payment: true
                    };
                }

                const costData = {
                    date: new Date(row['Transaction Post Date']).setHours(12),
                    cost: parseFloat(row['Amount'])
                }
          
                const response = await fetch('/api/purchase/duplicate', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(costData)
                });
    
                const responseBody = await response.json();
    
                const duplicates = responseBody.result;

                return {
                    date: new Date(row['Transaction Post Date']),
                    name: row['Description of Transaction'],
                    cost: parseFloat(row['Amount']),
                    category: '',
                    duplicates,
                    payment: false
                }
            })
        );
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