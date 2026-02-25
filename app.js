import {
    memorySetup,
    storeInMem,
    loadFromMem,
    pushToListInMem,
    readLastFromListInMem,
    deleteAllData,
    removeFromTransactionHistory
} from "./modules/storage.js"

import {
    createNewTransaction,
    calcBalance,
} from "./modules/transactions.js"

import { storeDummyData } from "./dummyData.js"

import {
    eventsUI,
    informationPopup,
    getTransactionFromUser,
    resetTransactionForm,
    listLatestTransactions,
    confirmDeleteAllData,
    textInputPopup,
    welcomeUserName,
    getNumberInput,
    showCurrentBalance,
    showMonthDashboard,
    confirmAlert,
    openTransactionModal,
    closeTransactionModal,
    switchSection,
    showTransactionHistory,
    populateCategoryFilter,
    getFilterValues,
    applyFiltersToList,
    clearFilters,
} from "./modules/userIterface.js"

// CONSTANTS

let EXPENSE_CATEGORIES = [];
let INCOME_CATEGORIES = [];

// ON OPEN APP
function loadApp() {
    console.clear()
    console.log('=== COIN COFFER ===\n - personal finance manager - ')

    if (localStorage.length === 0) {firstUseSetup()}
        
     
    
    // LOAD SOME INFO FROM MEM
    const USER_DATA=loadFromMem("userData")
    const TRANSACTION_LIST = loadFromMem('transactionHistory')

    const USER_NAME = USER_DATA.userName
    console.log(`user name saved in memory:${USER_NAME}`)
    if (USER_NAME !== 'User') {
        welcomeUserName(USER_NAME)
    }

    const STARTING_BALANCE = USER_DATA.startingBalance

    const CURRENT_BALANCE = calcBalance(TRANSACTION_LIST)+STARTING_BALANCE

    console.log('--> CURRENT BALANCE: ', CURRENT_BALANCE)
    showCurrentBalance(CURRENT_BALANCE.toFixed(2))

    showMonthDashboard(TRANSACTION_LIST)

    EXPENSE_CATEGORIES = loadFromMem('expenseCategories') || []
    INCOME_CATEGORIES = loadFromMem('incomeCategories') || []


    const DASH_TRANSACTION_LIST = readLastFromListInMem('transactionHistory', 10);

    listLatestTransactions(DASH_TRANSACTION_LIST, 10, handleDeleteTransaction);

    switchSection('dashboard')


    return
}

function firstUseSetup(){
    console.log('Memory is empty.\nWelcoming user for the first time.')
    informationPopup('Welcome to Coin Coffer!\nThis is a simple personal financing app');

    let inputName = textInputPopup('What is your name?')

    if (inputName === null || inputName === '') {
        inputName = 'User';
    }  
    
    console.log('asking starting balance value')
    let startingBalanceInput = getNumberInput(
        "What is your account's starting balance?",
        "Invalid value! Try again.\nIf you want to start with an empty account, type '0'"
    )
    memorySetup(inputName, startingBalanceInput)
}

// SOME UTILITIES ---------------------------

//make printing to console more visible, wastes space but helps debugging
function log(printThis) {
    console.log('\n', printThis, '\n\n')
}
// HANDLE EVENTS FUNCTIONS

function handleNewTrans() {
    log('-> HANDLING NEW TRANSACTION')

    log('retrieving new trans from user input: ')
    let rawTransaction = getTransactionFromUser()
    log(rawTransaction)

    log('consulting last ID, generating new one, giving it to new transaction:');
    let transactionMetadata = loadFromMem('transactionMetadata')
    const newTransID = transactionMetadata.lastTransactionID + 1
    log(newTransID)

    const transactionWithID = { ...rawTransaction, id: newTransID }

    log('validating and formatting transaction:')
    const validatedTransaction = createNewTransaction(transactionWithID)
    if (!validatedTransaction) {
        log('Transaction validation failed')
        return
    }
    log(validatedTransaction)

    log('storing new transaction in memory')
    pushToListInMem("transactionHistory", validatedTransaction)
    log('transaction history', loadFromMem('transactionHistory'))

    log('updating transaction metadata: ')
    transactionMetadata.lastTransactionID = newTransID;
    storeInMem('transactionMetadata', transactionMetadata)
    log(transactionMetadata)

    closeTransactionModal()

    loadApp()

    return
}

function handleDeleteAllData() {
    console.log('-> HANDLING DELETE ALL DATA');
    if (confirmDeleteAllData()) {
        deleteAllData()
        loadApp()
        return
    }
    console.log('user canceled deleting all data')
    return
}

function handleOpenModal(type) {
    const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    openTransactionModal(type, categories);
}

function handleDeleteTransaction(transactionId) {
    console.log('-> HANDLING DELETE TRANSACTION', transactionId);
    
    const confirmed = confirmAlert('Delete this transaction?');
    if (!confirmed) return;

    removeFromTransactionHistory(transactionId);
    
    loadApp()
}

function handleSwitchSection(sectionName) {
    switchSection(sectionName);
    
    if (sectionName === 'history') {
        populateCategoryFilter(EXPENSE_CATEGORIES, INCOME_CATEGORIES);
        const TRANSACTION_LIST = loadFromMem('transactionHistory');
        showTransactionHistory(TRANSACTION_LIST, false, handleDeleteTransaction);
    }
}

function handleLoadMore() {
    const TRANSACTION_LIST = loadFromMem('transactionHistory');
    showTransactionHistory(TRANSACTION_LIST, true, handleDeleteTransaction);
}

function handleApplyFilters() {
    const filters = getFilterValues();
    const allTransactions = loadFromMem('transactionHistory');
    const filteredTransactions = applyFiltersToList(allTransactions, filters);
    showTransactionHistory(filteredTransactions, false, handleDeleteTransaction);
}

function handleClearFilters() {
    clearFilters();
    const TRANSACTION_LIST = loadFromMem('transactionHistory');
    showTransactionHistory(TRANSACTION_LIST, false, handleDeleteTransaction);
}

function handleDemoMode() {
    const confirmed = confirmAlert('This will load 50 example transactions so you can experiment with the app features. Continue?');
    if (!confirmed) return;
    
    storeDummyData();
    loadApp();
}


// SETUP OF WHAT HAPPENS ON EACH EVENT

eventsUI({
    onSubmitTrans: handleNewTrans,
    onDeleteAllData: handleDeleteAllData,
    onOpenModal: handleOpenModal,
    onSwitchSection: handleSwitchSection,
    onLoadMore: handleLoadMore,
    onApplyFilters: handleApplyFilters,
    onClearFilters: handleClearFilters,
    onDemoMode: handleDemoMode,
})


loadApp()

