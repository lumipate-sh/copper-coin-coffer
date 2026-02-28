import type { TransactionSchema } from './interfaces.js';
interface UIHandlers {
    onSubmitTrans?: () => void;
    onDeleteAllData?: () => void;
    onOpenModal?: (type: 'expense' | 'income') => void;
    onSwitchSection?: (sectionName: string) => void;
    onLoadMore?: () => void;
    onApplyFilters?: () => void;
    onClearFilters?: () => void;
    onDemoMode?: () => void;
}
export declare function eventsUI(handlers: UIHandlers): void;
export declare function informationPopup(alertStr: string): void;
export declare function textInputPopup(message: string): string | null;
export declare function confirmAlert(alertStr: string): boolean;
export declare function welcomeUserName(userName: string): void;
export declare function getTransactionFromUser(): {
    description: string;
    type: string;
    category: string;
    value: string;
    date: string;
};
export declare function resetTransactionForm(): void;
export declare function confirmDeleteAllData(): boolean;
export declare function listLatestTransactions(transactions: TransactionSchema[], qty?: number, onDelete?: ((id: number) => void) | null): void;
export declare function getNumberInput(message: string, invalidInputMsg?: string): number;
export declare function showCurrentBalance(balanceString: string): void;
export declare function showMonthDashboard(transactionList: TransactionSchema[]): void;
export declare function openTransactionModal(type: string, categories: string[]): void;
export declare function closeTransactionModal(): void;
export declare function populateCategoriesForType(type: string, categories: string[]): void;
export declare function switchSection(sectionName: string): void;
export declare function showTransactionHistory(transactions: TransactionSchema[], append?: boolean, onDelete?: ((id: number) => void) | null): void;
export declare function toggleFilterDropdown(): void;
export declare function populateCategoryFilter(expenseCategories: string[], incomeCategories: string[]): void;
export declare function getFilterValues(): {
    type: string;
    category: string;
    dateFrom: string;
    dateUntil: string;
};
export declare function clearFilters(onClear?: () => void): void;
export declare function applyFiltersToList(transactions: TransactionSchema[], filters: {
    type?: string;
    category?: string;
    dateFrom?: string;
    dateUntil?: string;
}): TransactionSchema[];
export {};
//# sourceMappingURL=userInterfaceUtils.d.ts.map