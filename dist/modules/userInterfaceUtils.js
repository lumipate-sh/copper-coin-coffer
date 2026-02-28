// this file will contain all the operations of inserting and retrieving data to and from the user interface
// CONSTANTS
const NEW_TRANS_FORM = document.getElementById('new-trans-form');
const SUBMIT_NEW_TRANS_BUTTON = document.getElementById('new-trans-submit');
const DELETE_ALL_DATA_BUTTON = document.getElementById('delete-all-data');
const WELCOME_USER_HEAD = document.getElementById('welcome-user');
const LATEST_TRANSACTIONS_DASHBOARD = document.getElementById('latest-transactions-dashboard');
const CURRENT_BALANCE_OUTPUT = document.getElementById('current-balance');
const MONTH_EXPENSES_OUTPUT = document.getElementById('month-expenses');
const MONTH_INCOME_OUTPUT = document.getElementById('month-income');
const TRANSACTION_MODAL = document.getElementById('transaction-modal');
const MODAL_TITLE = document.getElementById('modal-title');
const TRANS_TYPE_INPUT = document.getElementById('trans-type');
const CATEGORY_FIELDSET = document.getElementById('category-fieldset');
const BTN_ADD_EXPENSE = document.getElementById('btn-add-expense');
const BTN_ADD_INCOME = document.getElementById('btn-add-income');
const BTN_CANCEL = document.getElementById('btn-cancel');
const MODAL_CLOSE = document.querySelector('.modal-close');
const BTN_SHOW_DASHBOARD = document.getElementById('btn-show-dashboard');
const BTN_SHOW_HISTORY = document.getElementById('btn-show-history');
const DASHBOARD_SECTION = document.getElementById('dashboard-section');
const TRANSACTION_HISTORY_SECTION = document.getElementById('transaction-history');
const TRANSACTION_HISTORY_LIST = document.getElementById('transaction-history-list');
const BTN_LOAD_MORE = document.getElementById('btn-load-more');
const BTN_FILTER = document.getElementById('btn-filter');
const FILTER_DROPDOWN = document.getElementById('filter-dropdown');
const FILTER_TYPE = document.getElementById('filter-type');
const FILTER_CATEGORY = document.getElementById('filter-category');
const FILTER_DATE_FROM = document.getElementById('filter-date-from');
const FILTER_DATE_UNTIL = document.getElementById('filter-date-until');
const BTN_APPLY_FILTERS = document.getElementById('btn-apply-filters');
const BTN_CLEAR_FILTERS = document.getElementById('btn-clear-filters');
const BTN_DEMO_MODE = document.getElementById('btn-demo-mode');
let currentHistoryPage = 0;
const transactionsPerPage = 30;
let allTransactions = [];
// EVENT LISTENERS INTEGRATION WITH REST OF APP
export function eventsUI(handlers) {
    SUBMIT_NEW_TRANS_BUTTON?.addEventListener('click', (event) => {
        event.preventDefault();
        handlers?.onSubmitTrans?.();
    });
    DELETE_ALL_DATA_BUTTON?.addEventListener('click', () => handlers?.onDeleteAllData?.());
    BTN_ADD_EXPENSE?.addEventListener('click', () => handlers?.onOpenModal?.('expense'));
    BTN_ADD_INCOME?.addEventListener('click', () => handlers?.onOpenModal?.('income'));
    BTN_CANCEL?.addEventListener('click', closeTransactionModal);
    MODAL_CLOSE?.addEventListener('click', closeTransactionModal);
    TRANSACTION_MODAL?.addEventListener('click', (event) => {
        if (event.target === TRANSACTION_MODAL) {
            closeTransactionModal();
        }
    });
    BTN_SHOW_DASHBOARD?.addEventListener('click', () => handlers?.onSwitchSection?.('dashboard'));
    BTN_SHOW_HISTORY?.addEventListener('click', () => handlers?.onSwitchSection?.('history'));
    BTN_LOAD_MORE?.addEventListener('click', () => handlers?.onLoadMore?.());
    BTN_FILTER?.addEventListener('click', toggleFilterDropdown);
    BTN_APPLY_FILTERS?.addEventListener('click', () => handlers?.onApplyFilters?.());
    BTN_CLEAR_FILTERS?.addEventListener('click', () => handlers?.onClearFilters?.());
    BTN_DEMO_MODE?.addEventListener('click', () => handlers?.onDemoMode?.());
}
export function informationPopup(alertStr) {
    alert(alertStr);
    return;
}
export function textInputPopup(message) {
    let userInput = prompt(message);
    return userInput;
}
export function confirmAlert(alertStr) {
    let option = confirm(alertStr);
    return option;
}
export function welcomeUserName(userName) {
    WELCOME_USER_HEAD.textContent = (`Welcome back, ${userName}`);
    return;
}
export function getTransactionFromUser() {
    const rawTransaction = {
        description: NEW_TRANS_FORM?.description.value,
        type: NEW_TRANS_FORM?.type.value,
        category: NEW_TRANS_FORM?.category.value,
        value: NEW_TRANS_FORM?.currencyValue.value,
        date: NEW_TRANS_FORM?.date.value
    };
    return rawTransaction;
}
export function resetTransactionForm() {
    NEW_TRANS_FORM?.reset();
    return;
}
export function confirmDeleteAllData() {
    console.log('-> asking confirmation for delete data');
    let isConfirmed = false;
    isConfirmed = confirmAlert('YOU ARE ABOUT TO DELETE ALL USAGE DATA\n\nPROCEED?');
    if (!isConfirmed) {
        return false;
    }
    console.log('asking for absolute confirmation');
    isConfirmed = confirmAlert('this process cannot be undone. you can still stop this madness');
    return isConfirmed;
}
export function listLatestTransactions(transactions, qty = 10, onDelete = null) {
    LATEST_TRANSACTIONS_DASHBOARD.innerHTML = '';
    const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const limited = sorted.slice(0, qty);
    const headerRow = document.createElement('li');
    headerRow.className = 'transaction-header';
    headerRow.innerHTML = `
        <span class="col-date">Date</span>
        <span class="col-amount">Amount</span>
        <span class="col-desc">Description</span>
        <span class="col-category">Category</span>
        <span class="col-actions"></span>
    `;
    LATEST_TRANSACTIONS_DASHBOARD.appendChild(headerRow);
    for (const trans of limited) {
        const date = new Date(trans.date);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        const description = trans.description;
        const category = trans.category;
        const type = trans.type;
        const value = type === 'income' ? `+${trans.value}` : `-${trans.value}`;
        const amountClass = type === 'income' ? 'amount-income' : 'amount-expense';
        const li = document.createElement('li');
        li.className = 'transaction-row';
        li.innerHTML = `
            <span class="col-date">${formattedDate}</span>
            <span class="col-amount ${amountClass}">${value}€</span>
            <span class="col-desc">${description}</span>
            <span class="col-category">${category}</span>
        `;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑';
        deleteBtn.title = 'Delete transaction';
        deleteBtn.className = 'col-actions';
        if (onDelete) {
            deleteBtn.addEventListener('click', () => onDelete(trans.id));
        }
        else {
            deleteBtn.style.display = 'none';
        }
        li.appendChild(deleteBtn);
        LATEST_TRANSACTIONS_DASHBOARD.appendChild(li);
    }
}
export function getNumberInput(message, invalidInputMsg = 'Must be a number! Try again') {
    console.log('...uisng getNumberInput');
    let inputNr;
    do {
        inputNr = Number(textInputPopup(message));
        isNaN(inputNr) && informationPopup(invalidInputMsg);
    } while (isNaN(inputNr));
    console.log('-> returned ', inputNr);
    return inputNr;
}
export function showCurrentBalance(balanceString) {
    CURRENT_BALANCE_OUTPUT.textContent = balanceString;
}
export function showMonthDashboard(transactionList) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentMonthTransactions = transactionList.filter(trans => {
        const transDate = new Date(trans.date);
        return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
    });
    const monthExpenses = currentMonthTransactions
        .filter(trans => trans.type === 'expense')
        .reduce((sum, trans) => sum + Number(trans.value), 0);
    const monthIncome = currentMonthTransactions
        .filter(trans => trans.type === 'income')
        .reduce((sum, trans) => sum + Number(trans.value), 0);
    MONTH_EXPENSES_OUTPUT.textContent = monthExpenses.toFixed(2);
    MONTH_INCOME_OUTPUT.textContent = monthIncome.toFixed(2);
}
export function openTransactionModal(type, categories) {
    TRANS_TYPE_INPUT.value = type;
    MODAL_TITLE.textContent = type === 'expense' ? 'Add Expense' : 'Add Income';
    populateCategoriesForType(type, categories);
    TRANSACTION_MODAL.style.display = 'block';
}
export function closeTransactionModal() {
    TRANSACTION_MODAL.style.display = 'none';
    resetTransactionForm();
}
export function populateCategoriesForType(type, categories) {
    CATEGORY_FIELDSET.innerHTML = '<legend>category</legend>';
    categories.forEach((category, index) => {
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'category';
        radio.value = category.toLowerCase();
        radio.id = `new-trans-cat-${category.toLowerCase()}`;
        if (index === 0) {
            radio.checked = true;
        }
        const label = document.createElement('label');
        label.htmlFor = radio.id;
        label.textContent = category;
        const br = document.createElement('br');
        CATEGORY_FIELDSET.appendChild(radio);
        CATEGORY_FIELDSET.appendChild(label);
        CATEGORY_FIELDSET.appendChild(br);
    });
}
export function switchSection(sectionName) {
    if (sectionName === 'dashboard') {
        DASHBOARD_SECTION.style.display = 'block';
        TRANSACTION_HISTORY_SECTION.style.display = 'none';
    }
    else if (sectionName === 'history') {
        DASHBOARD_SECTION.style.display = 'none';
        TRANSACTION_HISTORY_SECTION.style.display = 'block';
    }
}
export function showTransactionHistory(transactions, append = false, onDelete = null) {
    allTransactions = transactions;
    if (!append) {
        TRANSACTION_HISTORY_LIST.innerHTML = '';
        currentHistoryPage = 0;
        const headerRow = document.createElement('li');
        headerRow.className = 'transaction-header';
        headerRow.innerHTML = `
            <span class="col-date">Date</span>
            <span class="col-amount">Amount</span>
            <span class="col-desc">Description</span>
            <span class="col-category">Category</span>
            <span class="col-actions"></span>
        `;
        TRANSACTION_HISTORY_LIST.appendChild(headerRow);
    }
    const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const startIndex = currentHistoryPage * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    const transactionsToShow = sorted.slice(startIndex, endIndex);
    for (const trans of transactionsToShow) {
        const date = new Date(trans.date);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        const description = trans.description;
        const category = trans.category;
        const type = trans.type;
        const value = type === 'income' ? `+${trans.value}` : `-${trans.value}`;
        const amountClass = type === 'income' ? 'amount-income' : 'amount-expense';
        const li = document.createElement('li');
        li.className = 'transaction-row';
        li.innerHTML = `
            <span class="col-date">${formattedDate}</span>
            <span class="col-amount ${amountClass}">${value}€</span>
            <span class="col-desc">${description}</span>
            <span class="col-category">${category}</span>
        `;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑';
        deleteBtn.title = 'Delete transaction';
        deleteBtn.className = 'col-actions';
        if (onDelete) {
            deleteBtn.addEventListener('click', () => onDelete(trans.id));
        }
        li.appendChild(deleteBtn);
        TRANSACTION_HISTORY_LIST.appendChild(li);
    }
    currentHistoryPage++;
    if (endIndex < sorted.length) {
        BTN_LOAD_MORE.style.display = 'block';
    }
    else {
        BTN_LOAD_MORE.style.display = 'none';
    }
}
export function toggleFilterDropdown() {
    if (FILTER_DROPDOWN.style.display === 'none') {
        FILTER_DROPDOWN.style.display = 'block';
    }
    else {
        FILTER_DROPDOWN.style.display = 'none';
    }
}
export function populateCategoryFilter(expenseCategories, incomeCategories) {
    FILTER_CATEGORY.innerHTML = '<option value="all">All</option>';
    const allCategories = [...(expenseCategories || []), ...(incomeCategories || [])];
    const uniqueCategories = [...new Set(allCategories.map(c => c.toLowerCase()))];
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        FILTER_CATEGORY.appendChild(option);
    });
}
export function getFilterValues() {
    return {
        type: FILTER_TYPE.value,
        category: FILTER_CATEGORY.value,
        dateFrom: FILTER_DATE_FROM.value,
        dateUntil: FILTER_DATE_UNTIL.value
    };
}
export function clearFilters(onClear) {
    FILTER_TYPE.value = 'all';
    FILTER_CATEGORY.value = 'all';
    FILTER_DATE_FROM.value = '';
    FILTER_DATE_UNTIL.value = '';
    FILTER_DROPDOWN.style.display = 'none';
    if (onClear) {
        onClear();
    }
}
export function applyFiltersToList(transactions, filters) {
    let filtered = [...transactions];
    if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(trans => trans.type === filters.type);
    }
    if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(trans => trans.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom).getTime();
        filtered = filtered.filter(trans => new Date(trans.date).getTime() >= fromDate);
    }
    if (filters.dateUntil) {
        const untilDate = new Date(filters.dateUntil).getTime();
        filtered = filtered.filter(trans => new Date(trans.date).getTime() <= untilDate);
    }
    return filtered;
}
//# sourceMappingURL=userInterfaceUtils.js.map