// this file contains operations to manage transaction data
//
// todo:
// - valid transaction
// - filter transaction by type, catetory and date
// - calculate current balance

import { loadFromMem } from "./storage.js"

const MAX_DESCRIPTION_LENGTH = 64

function isValidDescription(transaction) {
    console.log("...using isValidDescription");
    try {
        if (transaction.description === undefined || transaction.description === null) {
            throw new Error("Description is missing");
        }
        if (typeof transaction.description !== 'string') {
            throw new Error("Description must be a string");
        }
        const trimmed = transaction.description.trim();
        if (trimmed === '') {
            throw new Error("Description cannot be empty");
        }
        if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
            throw new Error(`Description cannot be longer than ${MAX_DESCRIPTION_LENGTH} characters (got ${trimmed.length})`);
        }
        console.log("-> returned true");
        return true;
    } catch (e) {
        console.error("Validation error:", e.message);
        throw e;
    }
}

function isValidType(transaction) {
    console.log("...using isValidType");
    try {
        if (transaction.type === undefined || transaction.type === null) {
            throw new Error("Type is missing");
        }
        const validTypes = ['expense', 'income'];
        if (!validTypes.includes(transaction.type)) {
            throw new Error(`Type must be either "expense" or "income" (got "${transaction.type}")`);
        }
        console.log("-> returned true");
        return true;
    } catch (e) {
        console.error("Validation error:", e.message);
        throw e;
    }
}

function isValidCategory(transaction) {
    console.log("...using isValidCategory");
    try {
        if (transaction.category === undefined || transaction.category === null) {
            throw new Error("Category is missing");
        }
        if (typeof transaction.category !== 'string') {
            throw new Error("Category must be a string");
        }
        const trimmed = transaction.category.trim();
        if (trimmed === '') {
            throw new Error("Category cannot be empty");
        }

        const expenseCategories = loadFromMem('expenseCategories');
        const incomeCategories = loadFromMem('incomeCategories');
        const allCategories = [...expenseCategories, ...incomeCategories];

        const isValid = allCategories.some(cat => cat.toLowerCase() === trimmed.toLowerCase());
        if (!isValid) {
            throw new Error(`Category "${trimmed}" is not valid. Must be one of: ${allCategories.join(', ')}`);
        }
        console.log("-> returned true");
        return true;
    } catch (e) {
        console.error("Validation error:", e.message);
        throw e;
    }
}

function isValidValue(transaction) {
    console.log("...using isValidValue");
    try {
        if (transaction.value === undefined || transaction.value === null) {
            throw new Error("Value is missing");
        }
        let value = Number(transaction.value);
        if (isNaN(value)) {
            throw new Error("Currency value must be a number");
        }
        if (value <= 0) {
            throw new Error("Currency value must be positive");
        }
        value = Math.round(value * 100) / 100;
        transaction.value = value;
        console.log("-> returned true");
        return true;
    } catch (e) {
        console.error("Validation error:", e.message);
        throw e;
    }
}

function isValidDate(transaction) {
    console.log("...using isValidDate");
    try {
        if (transaction.date === undefined || transaction.date === null) {
            throw new Error("Date is missing");
        }
        const dateObj = new Date(transaction.date);
        if (isNaN(dateObj.getTime())) {
            throw new Error("Date must be a valid date");
        }
        console.log("-> returned true");
        return true;
    } catch (e) {
        console.log("-> !! ")
        console.error("Validation error:", e.message);
        throw e;
    }
}

function isValidTrans(transaction){
    if (!isValidDescription) return false
    if (!isValidType) return false
    if (!isValidCategory) return false
    if (!isValidValue) return false
    if (!isValidDate) return false
    return true
}


export function createNewTransaction(newTransactionData) {
    console.log("...using createNewTransaction");



    if (newTransactionData.date === '') {
        newTransactionData.date = Date.now()
    }
    newTransactionData.date = new Date(newTransactionData.date)


    // must make this descriptive later 
    if (!isValidTrans(newTransactionData)) {
        informationPopup('ERROR: INVALID TRANSACTION\nInsert valid data')
        console.log("-> !! invalid transaction\naborting...");
        return
    }

    console.log("-> returned ", newTransactionData);
    return newTransactionData
}

export function calcTotalValue(transactionList) {
    console.log("...using calcTotalValue");
    let totalSum = transactionList.reduce((sum, trans) => sum + Number(trans.value), 0);
    totalSum = (totalSum*100)/100
    console.log("-> returned " + totalSum);
    return totalSum
}

export function filterByType(transactionList, type) {
    console.log("...using filterByType");
    let filteredList = transactionList.filter(trans => trans.type === type);
    console.log("-> returned" , filteredList);
    return filteredList
}
export function filterByCategory(transactionList, category) {
    console.log("...using filterByCategory");
    let filteredList = transactionList.filter(trans => trans.category.toLowerCase() === category.toLowerCase());

    console.log("-> returned ", filteredList);
    return filteredList
}

export function filterByDate(transactionList, startDate, endDate) {
    console.log("...using filterByDate");
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    let filteredList = transactionList.filter(trans => {
        const transDate = new Date(trans.date).getTime();

        return transDate >= start && transDate <= end;

        return isInRange
    });

    console.log("-> returned", filteredList);
    return filteredList
}

export function calcBalance(transactionList) {
    console.log("...using calcBalance");
    const income = calcTotalValue(filterByType(transactionList, 'income'));
    const expenses = calcTotalValue(filterByType(transactionList, 'expense'));
    let balance = Math.round((income-expenses)*100)/100
    console.log("-> returned ", balance);
    return balance;
}