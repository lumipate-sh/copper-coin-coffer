import type { MonthRecordSchema, TransactionSchema, UserDataSchema } from './interfaces.js';
export declare function memorySetup(userName?: string, startingBalance?: number): void;
export declare function deleteAllData(): void;
type DataType = boolean | string | number | TransactionSchema | MonthRecordSchema | UserDataSchema | TransactionMetadataSchema;
interface TransactionMetadataSchema {
    lastTransactionID: number;
    nrTransactionsDeleted: number;
}
export declare function storeInMem(key: string, data: DataType | DataType[]): void;
export declare function loadFromMem(key: string): DataType | DataType[];
export declare function pushToListInMem(key: string, data: DataType): void;
export declare function readRecentFromListInMem(key: string, qty: number): DataType[];
export declare function removeFromTransactionHistory(transactionID: number): void;
export {};
//# sourceMappingURL=localStorageUtils.d.ts.map