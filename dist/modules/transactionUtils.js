// this file contains operations to manage transaction data
//
// todo:
// - valid transaction
// - filter transaction by type, catetory and date
// - calculate current balance
import { loadFromMem } from "./localStorageUtils.js";
import { informationPopup } from "./userInterfaceUtils.js";
const MAX_DESCRIPTION_LENGTH = 64;
function isValidDescription(transaction) {
    console.log("...using isValidDescription");
    if (transaction.description === undefined || transaction.description === null) {
        return [false, "Description is missing"];
    }
    if (typeof transaction.description !== 'string') {
        return [false, "Description must be text"];
    }
    const trimmed = transaction.description.trim();
    if (trimmed === '') {
        return [false, "Description cannot be empty"];
    }
    if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
        return [false, `Description cannot be longer than ${MAX_DESCRIPTION_LENGTH} characters (got ${trimmed.length})`];
    }
    console.log("-> returned true");
    return [true, 'description: OK'];
}
function isValidType(transaction) {
    console.log("...using isValidType");
    if (transaction.type === undefined || transaction.type === null) {
        return [false, "Type is missing"];
    }
    const validTypes = ['expense', 'income'];
    if (!validTypes.includes(transaction.type)) {
        return [false, `Type must be either "expense" or "income" (got "${transaction.type}")`];
    }
    console.log("-> returned true");
    return [true, 'type: OK'];
}
function isValidCategory(transaction) {
    console.log("...using isValidCategory");
    if (transaction.category === undefined || transaction.category === null) {
        return [false, "Category is missing"];
    }
    if (typeof transaction.category !== 'string') {
        return [false, "Category must be a string"];
    }
    const trimmed = transaction.category.trim();
    if (trimmed === '') {
        return [false, "Category cannot be empty"];
    }
    const expenseCategories = loadFromMem('expenseCategories');
    const incomeCategories = loadFromMem('incomeCategories');
    const allCategories = [...expenseCategories, ...incomeCategories];
    const isValid = allCategories.some(cat => cat.toLowerCase() === trimmed.toLowerCase());
    if (!isValid) {
        return [false, `Category "${trimmed}" is not valid. Must be one of: ${allCategories.join(', ')}`];
    }
    console.log("-> returned true");
    return [true, 'category: OK'];
}
function isValidValue(transaction) {
    console.log("...using isValidValue");
    if (transaction.value === undefined || transaction.value === null) {
        return [false, "Value is missing"];
    }
    let value = Number(transaction.value);
    if (isNaN(value)) {
        return [false, "Currency value must be a number"];
    }
    if (value <= 0) {
        return [false, "Currency value must be positive"];
    }
    value = Math.round(value * 100) / 100;
    transaction.value = value;
    console.log("-> returned true");
    return [true, 'value: OK'];
}
function isValidDate(transaction) {
    console.log("...using isValidDate");
    if (transaction.date === undefined || transaction.date === null) {
        return [false, "Date is missing"];
    }
    const dateObj = new Date(transaction.date);
    if (isNaN(dateObj.getTime())) {
        return [false, "Date must be a valid date"];
    }
    console.log("-> returned true");
    return [true, 'date: OK'];
}
function isValidTrans(transaction) {
    if (!isValidDescription(transaction)[0])
        return false;
    if (!isValidType(transaction)[0])
        return false;
    if (!isValidCategory(transaction)[0])
        return false;
    if (!isValidValue(transaction)[0])
        return false;
    if (!isValidDate(transaction)[0])
        return false;
    return true;
}
export function normalizeDate(dateInput) {
    if (!dateInput || dateInput === '')
        return new Date();
    if (dateInput instanceof Date)
        return dateInput;
    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
}
export function createNewTransaction(data) {
    console.log("...using createNewTransaction");
    return { ...data };
}
function isValidTrans_Iterative(transaction) {
    const validations = [isValidDescription, isValidType, isValidCategory, isValidValue, isValidDate];
    for (let validation of validations) {
        if (validation(transaction)[0] === false) {
            console.log(validation(transaction)[1]);
            return false;
        }
    }
    return true;
}
export { isValidTrans_Iterative };
export function calcTotalValue(transactionList) {
    console.log("...using calcTotalValue");
    let totalSum = transactionList.reduce((sum, trans) => sum + Number(trans.value), 0);
    totalSum = (totalSum * 100) / 100;
    console.log("-> returned " + totalSum);
    return totalSum;
}
export function filterByType(transactionList, type) {
    console.log("...using filterByType");
    let filteredList = transactionList.filter(trans => trans.type === type);
    console.log("-> returned", filteredList);
    return filteredList;
}
export function filterByCategory(transactionList, category) {
    console.log("...using filterByCategory");
    let filteredList = transactionList.filter(trans => trans.category.toLowerCase() === category.toLowerCase());
    console.log("-> returned ", filteredList);
    return filteredList;
}
export function filterByDate(transactionList, startDate, endDate) {
    console.log("...using filterByDate");
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    let filteredList = transactionList.filter(trans => {
        const transDate = new Date(trans.date).getTime();
        return transDate >= start && transDate <= end;
    });
    console.log("-> returned", filteredList);
    return filteredList;
}
export function calcBalance(transactionList) {
    console.log("...using calcBalance");
    const income = calcTotalValue(filterByType(transactionList, 'income'));
    const expenses = calcTotalValue(filterByType(transactionList, 'expense'));
    let balance = Math.round((income - expenses) * 100) / 100;
    console.log("-> returned ", balance);
    return balance;
}
//# sourceMappingURL=transactionUtils.js.map