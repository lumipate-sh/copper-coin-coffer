import type { TransactionSchema } from './interfaces.js';
export declare function normalizeDate(dateInput: unknown): Date;
export declare function createNewTransaction(data: TransactionSchema): TransactionSchema;
declare function isValidTrans_Iterative(transaction: TransactionSchema): boolean;
export { isValidTrans_Iterative };
export declare function calcTotalValue(transactionList: TransactionSchema[]): number;
export declare function filterByType(transactionList: TransactionSchema[], type: string): TransactionSchema[];
export declare function filterByCategory(transactionList: TransactionSchema[], category: string): TransactionSchema[];
export declare function filterByDate(transactionList: TransactionSchema[], startDate: string, endDate: string): TransactionSchema[];
export declare function calcBalance(transactionList: TransactionSchema[]): number;
//# sourceMappingURL=transactionUtils.d.ts.map