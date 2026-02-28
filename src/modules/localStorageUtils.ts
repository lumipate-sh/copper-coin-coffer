// dealing with sending and retrieving data from memory

// IMPORTS  
// import { simpleAlert, confirmAlert } from "./userIterface.js"
import type { MonthRecordSchema, TransactionSchema, UserDataSchema } from './interfaces.js'
// CONSTANTS & VARIABLES




// INITIAL SETUP
// only run on the first time the app is opened or if user deletes local data
// technically redundant, but sets up a schema of sorts from the getgo and is a guiding light for the rest of development.
export function memorySetup(userName: string = 'User', startingBalance: number = 0): void {
    const firstUseDate: Date = new Date(Date.now());


    const userData = {
        userName: userName,
        firstUseDate: firstUseDate,
        startingBalance: startingBalance,
    };
    storeInMem('userData', userData)


    storeInMem('transactionHistory', [])

    const transactionMetadata = {
        lastTransactionID: 0,
        nrTransactionsDeleted: 0,
    };
    storeInMem('transactionMetadata', transactionMetadata)


    const expenseCategories: string[] = ['Groceries', 'Eating Out', 'Bills', 'Rent', 'Vehicle', 'Investment', 'Health', 'Hobby', 'Technology', 'Clothing', 'Service', 'Gift', 'Donation', 'Home', 'Others'];
    storeInMem('expenseCategories', expenseCategories)


    const incomeCategories: string[] = ['Salary', 'Gift', 'Selling', 'Others'];
    storeInMem('incomeCategories', incomeCategories)


    const currentMonthRecord: MonthRecordSchema = {
        month: firstUseDate.getMonth() + 1,
        year: firstUseDate.getFullYear(),
        startingBalance: 0,
        endingbalance: 0,
        totalIncome: 0,
        totalExpense: 0,
        numberOfTransactions: 0,
        transactionList: [],
    };
    storeInMem('currentMonthRecord', currentMonthRecord)


    const pastMonthRecords: MonthRecordSchema[] = [];
    storeInMem('pastMonthRecords', pastMonthRecords)

    return

}

export function deleteAllData() {


    localStorage.clear()
    return
}

type DataType =
    boolean |
    string |
    number |
    TransactionSchema |
    MonthRecordSchema |
    UserDataSchema |
    TransactionMetadataSchema;

interface TransactionMetadataSchema {
    lastTransactionID: number;
    nrTransactionsDeleted: number;
}

// LOCAL STORAGE FUNCTIONS
export function storeInMem(key: string, data: DataType | DataType[]): void {

    localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromMem(key: string): DataType | DataType[] {
    const retrieved: string | null = localStorage.getItem(key);
    if (retrieved === null) {
        return 'nothing here yet...' // on setup all memory data structures should be populated but in the case something that doesnt exist yet is called, a string is returned in the place of any data   
    }
    const parsed: DataType | DataType[] = JSON.parse(retrieved)
    return parsed

}

export function pushToListInMem(key: string, data: DataType): void {
    let list: DataType | DataType[] = loadFromMem(key);
    if (!Array.isArray(list)) {
        return
    }
    list.push(data);
    storeInMem(key, list)

}

export function readRecentFromListInMem(key: string, qty: number): DataType[] {
    let list = loadFromMem(key);
    if (!list || !Array.isArray(list)) {
        return [];
    }
    const startIndex = list.length - qty;
    return list.slice(startIndex);
}


export function removeFromTransactionHistory(transactionID: number): void {
    let transactionHistory = loadFromMem('transactionHistory') as TransactionSchema[];
    const filteredList = transactionHistory.filter(trans => trans.id !== transactionID);
    storeInMem('transactionHistory', filteredList);
    return
}
