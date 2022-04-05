// ------------ Classes ---------------

// class insert data to html
class Html { // function add tr data to table
    static insertExpenses(i, name, amount, type, date) {
        console.log(i)
        let colorType;
        // check for color type
        if (type == 'income') {
            colorType = 'text-success';
        } else if (type == 'cost') {
            colorType = 'text-danger';
        }
        // create tr
        let trExpenses = document.createElement('tr');
        trExpenses.innerHTML = `
            <td class="text-center">${i}</td>
            <td class="text-center">${name}</td>
            <td class="text-center">${amount}</td>
            <td class="${colorType} text-center">${type}</td>
            <td class="text-center">${date}</td>
            <td class="text-center">
                <i class="fas fa-eye text-primary"></i>
                <i class="fas fa-trash text-danger"></i>
            </td>
        `;
        // add tr to table
        trBody.appendChild(trExpenses);
    }

    // function add list to table
    static readExpenses(list) {
        list.forEach((item, index) => {
            let colorType;
            // check for color type
            if (item.type == 'income') {
                colorType = 'text-success';
            } else if (item.type == 'cost') {
                colorType = 'text-danger';
            }
            // create tr
            let trExpenses = document.createElement('tr');
            trExpenses.innerHTML = `
                <td class="text-center">${index}</td>
                <td class="text-center">${
                item.name
            }</td>
                <td class="text-center">${
                item.amount
            }</td>
                <td class="${colorType} text-center">${
                item.type
            }</td>
                <td class="text-center">${
                item.date
            }</td>
                <td class="text-center">
                    <i class="fas fa-eye text-primary"></i>
                    <i class="fas fa-trash text-danger"></i>
                </td>
            `;
            // add tr to table
            trBody.appendChild(trExpenses);
        })
    }
}

// --------------- variables ------------------

// get form
let form = document.getElementById("expenses-form");
// get expenses name
let expensesName = document.getElementById("name");
// get expenses amount
let expensesAmount = document.getElementById("amount");
// get expenses description
let expensesDescription = document.getElementById("description");
// get table body
let trBody = document.getElementById("body-table");
// create list for save items in and add to localstorage
let listOfItems = [];
// counter for row of th
let i = 0;

// ------------ Eventlisteners -------------
runEventListeners();
function runEventListeners() { // when page load run readFromLocalstorage function to load data from localstorage
    window.addEventListener('DOMContentLoaded', () => {
        readFromLocalstorage();
    });

    // submit form eventlistener
    form.addEventListener('submit', (event) => { // check if income checked add as income and if cost checked add as cost
        if (document.getElementById('income').checked) { // send expenses data to Html class for add to table
            Html.insertExpenses(i, expensesName.value, expensesAmount.value, 'income', new Date().toLocaleDateString('fa-IR'));
            // create list of expenses data for save to localstorage
            listOfItems.push({
                name: expensesName.value,
                amount: expensesAmount.value,
                description: expensesDescription.value,
                type: 'income',
                date: new Date().toLocaleDateString('fa-IR')
            });
            // send data to addToLocalstorage function for save in localstorage
            addToLocalstorage(listOfItems);
        } else if (document.getElementById('cost').checked) { // send expenses data to Html class for add to table
            Html.insertExpenses(i, expensesName.value, expensesAmount.value, 'cost', new Date().toLocaleDateString('fa-IR'));
            // create list of expenses data for save to localstorage
            listOfItems.push({
                name: expensesName.value,
                amount: expensesAmount.value,
                description: expensesDescription.value,
                type: 'cost',
                date: new Date().toLocaleDateString('fa-IR')
            });
            // send data to addToLocalstorage function for save in localstorage
            addToLocalstorage(listOfItems);
        }
        // +1 counter after add an item
        i++;
        event.preventDefault();
    });
}


// ----------- Functions ----------------

// add data to localstorage
function addToLocalstorage(data) {
    localStorage.setItem('expenses', JSON.stringify(data));
}

// read data from localstorage
function readFromLocalstorage() { // parse data from localstorage
    let expensesData = JSON.parse(localStorage.getItem("expenses"));
    // check parsed data if its not null then add to table
    if (expensesData != null) { 
        // add previous datain localstorage to list variable
        expensesData.forEach((item, index) => {
            listOfItems.push(item);
            i = index + 1;
        });
        // send data to class Html to show data from localstorage
        Html.readExpenses(expensesData);
    }
}
