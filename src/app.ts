// IMPORTS FROM MODULES 

// state stores all the current values that are subject to change 
// import .. from './modules/state'


// localStorageUtils handles all reads and writes to and from memory
import {
    memorySetup,
    storeInMem,
    loadFromMem,
    pushToListInMem,
    readRecentFromListInMem,
    deleteAllData,
    removeFromTransactionHistory
} from "./modules/localStorageUtils.js"

// transactionUtils handles all handling of data
import {
    createNewTransaction,
    calcBalance,
    normalizeDate,
    isValidTrans_Iterative,
} from "./modules/transactionUtils.js"

// dummyData is test data that can be used to test and experiment with the app
import { storeDummyData } from "./dummyData.js"
import type { TransactionSchema, UserDataSchema } from "./modules/interfaces.js"

// userInterfaceUtils handles all changes to the user interface in the webapp
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
} from "./modules/userInterfaceUtils.js"

// CONSTANTS

let expenseCategoriesInMem: string[] = [];
let incomeCategoriesInMem: string[] = [];

// ON OPEN APP
function loadApp() {
    console.clear()
    console.log('=== COIN COFFER ===\n - personal finance manager - ')

    if (localStorage.length === 0) { firstUseSetup() }



    // LOAD SOME INFO FROM MEM
    const USER_DATA = loadFromMem("userData") as UserDataSchema
    const TRANSACTION_LIST = loadFromMem('transactionHistory') as TransactionSchema[]

    const USER_NAME = USER_DATA.userName
    console.log(`user name saved in memory:${USER_NAME}`)
    if (USER_NAME !== 'User') {
        welcomeUserName(USER_NAME)
    }

    const STARTING_BALANCE = USER_DATA.startingBalance

    const CURRENT_BALANCE = calcBalance(TRANSACTION_LIST) + STARTING_BALANCE

    console.log('--> CURRENT BALANCE: ', CURRENT_BALANCE)
    showCurrentBalance(CURRENT_BALANCE.toFixed(2))

    showMonthDashboard(TRANSACTION_LIST)

    expenseCategoriesInMem = (loadFromMem('expenseCategories') as string[]) || []
    incomeCategoriesInMem = (loadFromMem('incomeCategories') as string[]) || []


    const DASH_TRANSACTION_LIST = readRecentFromListInMem('transactionHistory', 10) as TransactionSchema[];

    listLatestTransactions(DASH_TRANSACTION_LIST, 10, handleDeleteTransaction);

    switchSection('dashboard')


    return
}

function firstUseSetup() {
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
function log(printThis: any): void {
    console.log('\n', printThis, '\n\n')
}
// HANDLE EVENTS FUNCTIONS

function handleNewTrans() {
    log('-> HANDLING NEW TRANSACTION')

    log('retrieving new trans from user input: ')
    const rawTransaction = getTransactionFromUser()
    log(rawTransaction)

    log('consulting last ID, generating new one, giving it to new transaction:');
    const transactionMetadata = loadFromMem('transactionMetadata') as { lastTransactionID: number; nrTransactionsDeleted: number }
    const newTransID = transactionMetadata.lastTransactionID + 1
    log(newTransID)

    log('normalizing transaction date:')
    const normalizedDate = normalizeDate(rawTransaction.date)
    log(normalizedDate)

    const preTransaction: TransactionSchema = { 
        description: rawTransaction.description,
        type: rawTransaction.type as 'income' | 'expense',
        category: rawTransaction.category,
        value: Number(rawTransaction.value),
        date: normalizedDate,
        id: newTransID
    }

    log('validating transaction:')
    if (!isValidTrans_Iterative(preTransaction)) {
        informationPopup('ERROR: INVALID TRANSACTION\nInsert valid data')
        log('Transaction validation failed')
        return
    }

    log('creating transaction:')
    const validatedTransaction = createNewTransaction(preTransaction)
    log(validatedTransaction)

    log('storing new transaction in memory')

    pushToListInMem("transactionHistory", validatedTransaction)


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

function handleOpenModal(type: 'expense' | 'income') {
    const categories = type === 'expense' ? expenseCategoriesInMem : incomeCategoriesInMem;
    openTransactionModal(type, categories);
}

function handleDeleteTransaction(transactionId: number) {
    console.log('-> HANDLING DELETE TRANSACTION', transactionId);

    const confirmed = confirmAlert('Delete this transaction?');
    if (!confirmed) return;

    removeFromTransactionHistory(transactionId);

    loadApp()
}

function handleSwitchSection(sectionName: string) {
    switchSection(sectionName);

    if (sectionName === 'history') {
        populateCategoryFilter(expenseCategoriesInMem, incomeCategoriesInMem);
        const TRANSACTION_LIST = loadFromMem('transactionHistory') as TransactionSchema[];
        showTransactionHistory(TRANSACTION_LIST, false, handleDeleteTransaction);
    }
}

function handleLoadMore() {
    const TRANSACTION_LIST = loadFromMem('transactionHistory') as TransactionSchema[];
    showTransactionHistory(TRANSACTION_LIST, true, handleDeleteTransaction);
}

function handleApplyFilters() {
    const filters = getFilterValues();
    const allTransactions = loadFromMem('transactionHistory') as TransactionSchema[];
    const filteredTransactions = applyFiltersToList(allTransactions, filters);
    showTransactionHistory(filteredTransactions, false, handleDeleteTransaction);
}

function handleClearFilters() {
    clearFilters();
    const TRANSACTION_LIST = loadFromMem('transactionHistory') as TransactionSchema[];
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

// RUN
loadApp()

