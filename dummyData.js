import { storeInMem } from "./modules/storage.js"

const today = new Date('2026-02-16')

function getRandomDate(daysBack) {
    const date = new Date(today)
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack))
    return date
}

const randomDates = Array.from({ length: 50 }, () => getRandomDate(30))
randomDates.sort((a, b) => a.getTime() - b.getTime())

const transactions = [
    { id: 1, description: 'Monthly salary', type: 'income', category: 'Salary', value: 2500.00, date: randomDates[0] },
    { id: 2, description: 'Grocery shopping', type: 'expense', category: 'Groceries', value: 85.50, date: randomDates[1] },
    { id: 3, description: 'Dinner at restaurant', type: 'expense', category: 'Eating Out', value: 45.00, date: randomDates[2] },
    { id: 4, description: 'Electricity bill', type: 'expense', category: 'Bills', value: 120.00, date: randomDates[3] },
    { id: 5, description: 'Gas station', type: 'expense', category: 'Vehicle', value: 60.00, date: randomDates[4] },
    { id: 6, description: 'Freelance project', type: 'income', category: 'Others', value: 500.00, date: randomDates[5] },
    { id: 7, description: 'Pharmacy', type: 'expense', category: 'Health', value: 25.00, date: randomDates[6] },
    { id: 8, description: 'Cinema tickets', type: 'expense', category: 'Hobby', value: 28.00, date: randomDates[7] },
    { id: 9, description: 'New headphones', type: 'expense', category: 'Technology', value: 79.99, date: randomDates[8] },
    { id: 10, description: 'Winter jacket', type: 'expense', category: 'Clothing', value: 120.00, date: randomDates[9] },
    { id: 11, description: 'Gym membership', type: 'expense', category: 'Health', value: 45.00, date: randomDates[10] },
    { id: 12, description: 'Internet bill', type: 'expense', category: 'Bills', value: 40.00, date: randomDates[11] },
    { id: 13, description: 'Coffee with friend', type: 'expense', category: 'Eating Out', value: 8.50, date: randomDates[12] },
    { id: 14, description: 'Birthday gift', type: 'expense', category: 'Gift', value: 35.00, date: randomDates[13] },
    { id: 15, description: 'Donation to charity', type: 'expense', category: 'Donation', value: 50.00, date: randomDates[14] },
    { id: 16, description: 'Car insurance', type: 'expense', category: 'Vehicle', value: 150.00, date: randomDates[15] },
    { id: 17, description: 'Home insurance', type: 'expense', category: 'Home', value: 80.00, date: randomDates[16] },
    { id: 18, description: 'Selling old bike', type: 'income', category: 'Selling', value: 200.00, date: randomDates[17] },
    { id: 19, description: 'Grocery shopping', type: 'expense', category: 'Groceries', value: 95.00, date: randomDates[18] },
    { id: 20, description: 'Phone bill', type: 'expense', category: 'Bills', value: 35.00, date: randomDates[19] },
    { id: 21, description: 'Dentist appointment', type: 'expense', category: 'Health', value: 75.00, date: randomDates[20] },
    { id: 22, description: 'Lunch at work', type: 'expense', category: 'Eating Out', value: 15.00, date: randomDates[21] },
    { id: 23, description: 'Book purchase', type: 'expense', category: 'Hobby', value: 22.00, date: randomDates[22] },
    { id: 24, description: 'Bonus from work', type: 'income', category: 'Salary', value: 1000.00, date: randomDates[23] },
    { id: 25, description: 'Streaming subscription', type: 'expense', category: 'Hobby', value: 15.99, date: randomDates[24] },
    { id: 26, description: 'New shoes', type: 'expense', category: 'Clothing', value: 65.00, date: randomDates[25] },
    { id: 27, description: 'Veterinary visit', type: 'expense', category: 'Health', value: 90.00, date: randomDates[26] },
    { id: 28, description: 'Parking fee', type: 'expense', category: 'Vehicle', value: 12.00, date: randomDates[27] },
    { id: 29, description: 'Water bill', type: 'expense', category: 'Bills', value: 45.00, date: randomDates[28] },
    { id: 30, description: 'Gardening supplies', type: 'expense', category: 'Home', value: 35.00, date: randomDates[29] },
    { id: 31, description: 'Part-time job payment', type: 'income', category: 'Others', value: 300.00, date: randomDates[30] },
    { id: 32, description: 'Fast food', type: 'expense', category: 'Eating Out', value: 12.00, date: randomDates[31] },
    { id: 33, description: 'Laundry detergent', type: 'expense', category: 'Groceries', value: 15.00, date: randomDates[32] },
    { id: 34, description: 'Concert tickets', type: 'expense', category: 'Hobby', value: 85.00, date: randomDates[33] },
    { id: 35, description: 'Online course', type: 'expense', category: 'Hobby', value: 49.99, date: randomDates[34] },
    { id: 36, description: 'Rent payment', type: 'expense', category: 'Rent', value: 1200.00, date: randomDates[35] },
    { id: 37, description: 'Gift from parents', type: 'income', category: 'Gift', value: 100.00, date: randomDates[36] },
    { id: 38, description: 'Car maintenance', type: 'expense', category: 'Vehicle', value: 180.00, date: randomDates[37] },
    { id: 39, description: 'Bread and milk', type: 'expense', category: 'Groceries', value: 8.00, date: randomDates[38] },
    { id: 40, description: 'New charger', type: 'expense', category: 'Technology', value: 25.00, date: randomDates[39] },
    { id: 41, description: 'House cleaning', type: 'expense', category: 'Service', value: 60.00, date: randomDates[40] },
    { id: 42, description: 'Investments return', type: 'income', category: 'Investment', value: 150.00, date: randomDates[41] },
    { id: 43, description: 'Sneakers', type: 'expense', category: 'Clothing', value: 95.00, date: randomDates[42] },
    { id: 44, description: 'Breakfast', type: 'expense', category: 'Eating Out', value: 10.00, date: randomDates[43] },
    { id: 45, description: 'Toiletries', type: 'expense', category: 'Groceries', value: 22.00, date: randomDates[44] },
    { id: 46, description: 'Haircut', type: 'expense', category: 'Service', value: 30.00, date: randomDates[45] },
    { id: 47, description: 'Video game', type: 'expense', category: 'Hobby', value: 60.00, date: randomDates[46] },
    { id: 48, description: 'Selling books', type: 'income', category: 'Selling', value: 45.00, date: randomDates[47] },
    { id: 49, description: 'Spare parts', type: 'expense', category: 'Vehicle', value: 40.00, date: randomDates[48] },
    { id: 50, description: 'Miscellaneous', type: 'expense', category: 'Others', value: 20.00, date: randomDates[49] },
]

const transactionMetadata = {
    lastTransactionID: 50,
    nrTransactionsDeleted: 0,
}

export function storeDummyData(){
    storeInMem('transactionHistory', transactions)
    storeInMem('transactionMetadata', transactionMetadata)

    console.log('Dummy data saved to localStorage')
}