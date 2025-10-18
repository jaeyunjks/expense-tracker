// basic function and set up
const { Command } = require('commander');
const fs = require('fs');
const program = new Command();
const DATA_PATH = './expenses.json';

// function to read data 
function loadExpenses() {
    if (!fs.existsSync(DATA_PATH)) return [];
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf-8').trim();
        if (!data) return [];
        return JSON.parse(data);
    } catch (e) {
        // file rusak/invalid, langsung reset dengan array kosong
        saveExpenses([]);
        return [];
    }
}


// function to write new expense data
function saveExpenses(expenses) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(expenses, null, 2));
}

// command to add new expense
program
    .command('add')
    .requiredOption('--description <desc>')
    .requiredOption('--amount <amount>')
    .option('--category <cat>')
    .action((options) => {
        let expenses = loadExpenses();
        const id = expenses.length ? expenses[expenses.length - 1].id + 1 : 1;
        const date = new Date().toISOString().slice(0, 10);
        const amount = Number(options.amount);
        if (amount <= 0) {
            console.log('Error: Amount harus lebih dari 0');
            return;
        }
        expenses.push({
            id, date,
            description: options.description,
            amount,
            category: options.category || "unknown"
        });
        saveExpenses(expenses);
        console.log(`Expense added successfully (ID: ${id})`);
    });


// command to list all expenses
program
    .command('list')
    .action(() => {
        const expenses = loadExpenses();
        if (!expenses.length) return console.log('No expenses found.');
        console.log('ID Date        Description Amount Category');
        expenses.forEach(e => {
            console.log(`${e.id} ${e.date} ${e.description} $${e.amount} ${e.category || "unknown"}`);
        });
    });

// filter by category
program
    .command('filter')
    .requiredOption('--category <cat>')
    .action((options) => {
        const expenses = loadExpenses();
        const filtered = expenses.filter(e => e.category === options.category);
        if (!filtered.length) return console.log('No expenses found in category:', options.category);
        filtered.forEach(e => {
            console.log(`${e.id} ${e.date} ${e.description} $${e.amount} ${e.category}`);
        });
    });

// command to delete an expense by ID
program
    .command('delete')
    .requiredOption('--id <id>')
    .action((options) => {
        let expenses = loadExpenses();
        const idx = expenses.findIndex(e => e.id === Number(options.id));
        if (idx === -1) return console.log('Expense ID not found.');
        expenses.splice(idx, 1);
        saveExpenses(expenses);
        console.log('Expense deleted successfully');
    });

// command to update an expense by ID
program
    .command('update')
    .requiredOption('--id <id>')
    .option('--description <desc>')
    .option('--amount <amount>')
    .action((options) => {
        let expenses = loadExpenses();
        const ex = expenses.find(e => e.id === Number(options.id));
        if (!ex) return console.log('Expense ID not found.');
        if (options.description) ex.description = options.description;
        if (options.amount) {
            const amt = Number(options.amount);
            if (amt <= 0) return console.log('Error: Amount harus lebih dari 0');
            ex.amount = amt;
        }
        saveExpenses(expenses);
        console.log('Expense updated successfully');
    });

// command to show summary of expenses
program
    .command('summary')
    .option('--month <month>')
    .action((options) => {
        const expenses = loadExpenses();
        if (options.month) {
            const currYear = new Date().getFullYear();
            const filtered = expenses.filter(e => {
                const [year, month] = e.date.split('-');
                return Number(month) === Number(options.month) && Number(year) === currYear;
            });
            const total = filtered.reduce((sum, e) => sum + e.amount, 0);
            console.log(`Total expenses for ${options.monthName || 'selected month'}: $${total}`);
        } else {
            const total = expenses.reduce((sum, e) => sum + e.amount, 0);
            console.log(`Total expenses: $${total}`);
        }
    });

// command export
program
    .command('export')
    .action(() => {
        const expenses = loadExpenses();
        const createCsvWriter = require('csv-writer').createObjectCsvWriter;
        const csvWriter = createCsvWriter({
            path: 'expenses-export.csv',
            header: [
                { id: 'id', title: 'ID' },
                { id: 'date', title: 'Date' },
                { id: 'description', title: 'Description' },
                { id: 'amount', title: 'Amount' },
                { id: 'category', title: 'Category' }
            ]
        });
        csvWriter.writeRecords(expenses)
            .then(() => console.log('Export ke expenses-export.csv berhasil!'));
    });

// parse command line arguments | to run the program
program.parse(process.argv);
