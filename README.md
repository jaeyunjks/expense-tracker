Expense Tracker CLI
(https://roadmap.sh/projects/expense-tracker)

A simple command-line application to help you manage your daily expenses easily. Add, update, list, filter, and export your expenses all from your terminal.

Features
Add new expenses with description, amount, and category

List all expenses

Update your recorded expenses

Delete any expense by its ID

Show summary for all expenses or per month

Filter expenses by category

Export expenses to CSV file

Getting Started
1. Install dependencies
text
npm install
2. Run commands
Add an expense
text
node expense-tracker.js add --description "Lunch" --amount 20 --category "Food"
List all expenses
text
node expense-tracker.js list
Update an expense
text
node expense-tracker.js update --id 1 --description "Lunch with friend" --amount 25
Delete an expense
text
node expense-tracker.js delete --id 1
View summary of all expenses
text
node expense-tracker.js summary
View summary of a specific month (current year)
text
node expense-tracker.js summary --month 10
Filter expenses by category
text
node expense-tracker.js filter --category "Food"
Export expenses to CSV
text
node expense-tracker.js export
This will create a new file called expenses-export.csv in your project directory.

Data Storage
All expense data is stored in a local JSON file named expenses.json in your project folder.

Requirements
Node.js installed

commander npm package (for CLI command parsing)

csv-writer npm package (for CSV export, if used)

Contributing
Pull requests and suggestions are welcome!
Feel free to fork this repo, submit fixes, or request new features.

Feel free to edit or expand according to your actual implementation or features!
