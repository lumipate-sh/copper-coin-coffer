// dealing with sending and retrieving data from memory

// IMPORTS  
// import { simpleAlert, confirmAlert } from "./userIterface.js"

// CONSTANTS & VARIABLES


// INITIAL SETUP
// only run on the first time the app is opened or if user deletes local data
// technically redundant, but sets up a schema of sorts from the getgo and is a guiding light for the rest of development.
export function memorySetup(userName = 'User', startingBalance = 0) {
    const FIRST_USE_DATE = new Date(Date.now());


    const USER_DATA = {
        userName: userName,
        firstUseDate: FIRST_USE_DATE,
        startingBalance: startingBalance,
        // numberOfLogins: 1,
        // totalDifferentDaysUsed: 1,
        // usageStreak: 0,
    };
    storeInMem('userData', USER_DATA)


    storeInMem('transactionHistory', [])

    const transactionMetadata = {
        lastTransactionID: 0,
        nrTransactionsDeleted: 0,
    };
    storeInMem('transactionMetadata', transactionMetadata)


    const expenseCategories = ['Groceries', 'Eating Out', 'Bills', 'Rent', 'Vehicle', 'Investment', 'Health', 'Hobby', 'Technology', 'Clothing', 'Service', 'Gift', 'Donation', 'Home', 'Others'];
    storeInMem('expenseCategories', expenseCategories)


    const INCOME_CATEGORIES = ['Salary', 'Gift', 'Selling', 'Others'];
    storeInMem('incomeCategories', INCOME_CATEGORIES)

    const TRANSACTION_SCHEMA = {
        idType: 'number; (unique, positive int)',
        descriptionType: 'string; (free text)',
        type: 'string; (either "expense" or "income")',
        value: 'number; (float, positive, 2 decimal points precision)',
        date: 'Date; (Date object)',
    };
    storeInMem('transactionSchema', TRANSACTION_SCHEMA)

    const CURRENT_MONTH_RECORD = {
        month: FIRST_USE_DATE.month,
        year: FIRST_USE_DATE.year,
        startingBalance: 0,
        endingbalance: 0,
        totalIncome: 0,
        totalExpense: 0,
        numberOfTransactions: 0,
        transactionList: [],
    };
    storeInMem('currentMonthRecord', CURRENT_MONTH_RECORD)


    const PAST_MONTH_RECORDS = [];
    storeInMem('pastMonthRecords', PAST_MONTH_RECORDS)

    return

}

export function deleteAllData() {


    localStorage.clear()
    return
}



// LOCAL STORAGE FUNCTIONS
export function storeInMem(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    return
}

export function loadFromMem(key) {
    const RETRIEVED_OBJ = localStorage.getItem(key);
    const PARSED_OBJ = JSON.parse(RETRIEVED_OBJ)
    return PARSED_OBJ
}

export function pushToListInMem(key, data) {
    let list = loadFromMem(key);
    list.push(data);
    storeInMem(key, list)

    return
}

export function readLastFromListInMem(key, qty) {
    let list = loadFromMem(key);
    if (!list || !Array.isArray(list)) {
        return [];
    }
    const startIndex =list.length - qty;
    return list.slice(startIndex);
}

// export function updateLocalStorage(oldData,newData){
//
// }


export function addToTransactionHistory(transactionObj) {
    let transactioHistory = loadFromMem('transactioHistory')
    append(transactionObj)
    return
}

export function removeFromTransactionHistory(transactionId) {
    let transactionHistory = loadFromMem('transactionHistory');
    const filteredList = transactionHistory.filter(trans => trans.id !== transactionId);
    storeInMem('transactionHistory', filteredList);
    return
}
//SESSION STORAGE
