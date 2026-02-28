export interface TransactionSchema {
    id: number;
    description: string;
    type: 'income' | 'expense';
    category: string;
    value: number;
    date: Date;
}
export interface MonthRecordSchema {
    month: number;
    year: number;
    startingBalance: number;
    endingbalance: number;
    totalIncome: number;
    totalExpense: number;
    numberOfTransactions: number;
    transactionList: TransactionSchema[];
}
export interface UserDataSchema {
    userName: string;
    firstUseDate: Date;
    startingBalance: number;
}
//# sourceMappingURL=interfaces.d.ts.map