// ------------ Classes ---------------
// class insert data to html
class Html { // function add tr data to table
    static insertExpenses(i, name, description, amount, type, date) {
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
                <i class="fas fa-eye text-primary" data-toggle="modal" data-target="#detail-expenses-${i}"></i>
                <i class="fas fa-trash text-danger ml-1" onClick="deleteItem(event,${i})"></i>
                <div class="modal fade" id="detail-expenses-${i}" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="text-left modal-body">
                            <h5>${name}</h5>
                            <p>${description}</p>
                            <span>$${amount}</span>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>
                        </div>
                    </div>
                </div>
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
                    <i class="fas fa-eye text-primary" data-toggle="modal" data-target="#detail-expenses-${index}"></i>
                    <i class="fas fa-trash text-danger ml-1" onClick="deleteItem(event, ${index})"></i>
                    <div class="modal fade" id="detail-expenses-${index}" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-left">
                                <h5>${
                item.name
            }</h5>
                                <p>${
                item.description
            }</p>
                                <span>$${
                item.amount
            }</span>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>
                            </div>
                        </div>
                    </div>
                </td>
            `;
            // add tr to table
            trBody.appendChild(trExpenses);
        });
    }

    // function insert total cost and total income in page
    static insertTotal(cost, income) {
        document.getElementById('total-cost').innerHTML = "$"+cost;
        document.getElementById('total-income').innerHTML = "$"+income;
    }

    // function create chart
    static showChart(costData , incomeData){
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            exportEnabled: true,
            title:{
                text: "Expenses Comparison of Every Month"
            },
            axisX: {
                valueFormatString: "MMM"
            },
            axisY: {
                suffix: " $"
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: [{
                type: "rangeColumn",
                name: "Income",
                showInLegend: true,
                yValueFormatString: "#0.## $",
                xValueFormatString: "MMM, YYYY",
                dataPoints: incomeData
                },
                {
                    type: "rangeColumn",
                    name: "Cost",
                    showInLegend: true,
                    yValueFormatString: "#0.## $",
                    xValueFormatString: "MMM, YYYY",
                    dataPoints: costData
            }]
        });
        chart.render();
        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            e.chart.render();
        }
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
function runEventListeners() { 
    // when page load run readFromLocalstorage ,calculateTotalExpenses , createChart  function to load data from localstorage
    window.addEventListener('DOMContentLoaded', () => {
        readFromLocalstorage();
        calculateTotalExpenses();
        createChart();
    });

    // submit form eventlistener
    form.addEventListener('submit', (event) => { // check if income checked add as income and if cost checked add as cost
        if (document.getElementById('income').checked) { // send expenses data to Html class for add to table
            Html.insertExpenses(i, expensesName.value, expensesDescription.value, expensesAmount.value, 'income', new Date().toLocaleString('en-GB',{ year: 'numeric', month: '2-digit', day: '2-digit' }));
            // create list of expenses data for save to localstorage
            listOfItems.push({
                name: expensesName.value,
                amount: parseInt(expensesAmount.value),
                description: expensesDescription.value,
                type: 'income',
                date: new Date().toLocaleString('en-GB',{ year: 'numeric', month: '2-digit', day: '2-digit' })
            });
            // send data to addToLocalstorage function for save in localstorage
            addToLocalstorage(listOfItems);
            // calculate total expenses
            calculateTotalExpenses();
            // update chart
            createChart();
        } else if (document.getElementById('cost').checked) { // send expenses data to Html class for add to table
            Html.insertExpenses(i, expensesName.value, expensesDescription.value, expensesAmount.value, 'cost', new Date().toLocaleString('en-GB',{ year: 'numeric', month: '2-digit', day: '2-digit' }));
            // create list of expenses data for save to localstorage
            listOfItems.push({
                name: expensesName.value,
                amount: parseInt(expensesAmount.value),
                description: expensesDescription.value,
                type: 'cost',
                date: new Date().toLocaleString('en-GB',{ year: 'numeric', month: '2-digit', day: '2-digit' })
            });
            // send data to addToLocalstorage function for save in localstorage
            addToLocalstorage(listOfItems);
            // calculate total expenses
            calculateTotalExpenses();
            // update chart
            createChart();
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
    if (expensesData != null) { // add previous datain localstorage to list variable
        expensesData.forEach((item, index) => {
            listOfItems.push(item);
            i = index + 1;
        });
        // send data to class Html to show data from localstorage
        Html.readExpenses(expensesData);
    }
}

// function delete item from table
function deleteItem(e, id) { // confirm dialog if user is click ok then delete
    if (confirm("Are you sure?") == true) { // delete element we choice for delete
        e.target.parentElement.parentElement.remove()
        // parse data from localstorage
        let expensesData = JSON.parse(localStorage.getItem("expenses"));
        expensesData.forEach((item, index) => { // check item id  for delete from localstorage too
            if (id == index) {
                expensesData.splice(index, 1);
            }
        });
        // update list and save to localstorage again
        localStorage.setItem('expenses', JSON.stringify(expensesData));
        calculateTotalExpenses();
        createChart();
    }
}

// calculate total cost and total income from localstorage
function calculateTotalExpenses() { // read data from localstorage
    let expensesData = JSON.parse(localStorage.getItem("expenses"));
    let totalIncome = 0,
    totalCost = 0;
    if(expensesData != null){
        expensesData.forEach((element, index) => {
            if (element.type == 'cost') { // calculate total cost
                totalCost += element.amount;
            } else { // calculate total income
                totalIncome += element.amount;
            }
        });
        Html.insertTotal(totalCost, totalIncome);
    }
}

// calculate total cost and income for every month
function createChart(){
    let expensesData = JSON.parse(localStorage.getItem("expenses"));
    console.log(expensesData)
    // check if its not null then calculate and create chart
    if(expensesData != null && expensesData.length != 0){
        document.getElementById('chart-container').classList.remove("d-none");
        let totalCostJan = 0 , totalIncomeJan = 0;
        let totalCostFeb = 0 , totalincomeFeb = 0;
        let totalCostMar = 0 , totalIncomeMar = 0;
        let totalCostApr = 0 , totalIncomeApr = 0;
        let totalCostMay = 0 , totalIncomeMay = 0;
        let totalCostJun = 0 , totalIncomeJun = 0;
        let totalCostJul = 0 , totalIncomeJul = 0;
        let totalCostAug = 0 , totalIncomeAug = 0;
        let totalCostSep = 0 , totalIncomeSep = 0;
        let totalCostOct = 0 , totalIncomeOct = 0;
        let totalCostNov = 0 , totalIncomeNov = 0;
        let totalCostDec = 0 , totalIncomeDec = 0;
    
        expensesData.forEach((item , index)=>{
            // calculate cost
            if(item.type == 'cost'){
                if(item.date.split('/')[1] == '01'){
                    totalCostJan+=item.amount;
                }else if(item.date.split('/')[1] == '02'){
                    totalCostFeb+=item.amount;
                }else if(item.date.split('/')[1] == '03'){
                    totalCostMar+=item.amount;
                }else if(item.date.split('/')[1] == '04'){
                    totalCostApr+=item.amount;
                }else if(item.date.split('/')[1] == '05'){
                    totalCostMay+=item.amount;
                }else if(item.date.split('/')[1] == '06'){
                    totalCostJun+=item.amount;
                }else if(item.date.split('/')[1] == '07'){
                    totalCostJul+=item.amount;
                }else if(item.date.split('/')[1] == '08'){
                    totalCostAug+=item.amount;
                }else if(item.date.split('/')[1] == '09'){
                    totalCostSep+=item.amount;
                }else if(item.date.split('/')[1] == '10'){
                    totalCostOct+=item.amount;
                }else if(item.date.split('/')[1] == '11'){
                    totalCostNov+=item.amount;
                }else if(item.date.split('/')[1] == '12'){
                    totalCostDec+=item.amount;
                }
            }
            // calculate cost
            else{
                if(item.date.split('/')[1] == '01'){
                    totalIncomeJan+=item.amount;
                }else if(item.date.split('/')[1] == '02'){
                    totalincomeFeb+=item.amount;
                }else if(item.date.split('/')[1] == '03'){
                    totalIncomeMar+=item.amount;
                }else if(item.date.split('/')[1] == '04'){
                    totalIncomeApr+=item.amount;
                }else if(item.date.split('/')[1] == '05'){
                    totalIncomeMay+=item.amount;
                }else if(item.date.split('/')[1] == '06'){
                    totalIncomeJun+=item.amount;
                }else if(item.date.split('/')[1] == '07'){
                    totalIncomeJul+=item.amount;
                }else if(item.date.split('/')[1] == '08'){
                    totalIncomeAug+=item.amount;
                }else if(item.date.split('/')[1] == '09'){
                    totalIncomeSep+=item.amount;
                }else if(item.date.split('/')[1] == '10'){
                    totalIncomeOct+=item.amount;
                }else if(item.date.split('/')[1] == '11'){
                    totalIncomeNov+=item.amount;
                }else if(item.date.split('/')[1] == '12'){
                    totalIncomeDec+=item.amount;
                }
            }
            
            let costArray = [
                { x: new Date(item.date.split('/')[2], 00), y: [0, totalCostJan] },
                { x: new Date(item.date.split('/')[2], 01), y: [0, totalCostFeb] },
                { x: new Date(item.date.split('/')[2], 02), y: [0, totalCostMar] },
                { x: new Date(item.date.split('/')[2], 03), y: [0, totalCostApr] },
                { x: new Date(item.date.split('/')[2], 04), y: [0, totalCostMay] },
                { x: new Date(item.date.split('/')[2], 05), y: [0, totalCostJun] },
                { x: new Date(item.date.split('/')[2], 06), y: [0, totalCostJul] },
                { x: new Date(item.date.split('/')[2], 07), y: [0, totalCostAug] },
                { x: new Date(item.date.split('/')[2], 08), y: [0, totalCostSep] },
                { x: new Date(item.date.split('/')[2], 09), y: [0, totalCostOct] },
                { x: new Date(item.date.split('/')[2], 10), y: [0, totalCostNov] },
                { x: new Date(item.date.split('/')[2], 11), y: [0, totalCostDec] }
            ];
    
            let incomeArray = [
                { x: new Date(item.date.split('/')[2], 00), y: [0, totalIncomeJan] },
                { x: new Date(item.date.split('/')[2], 01), y: [0, totalincomeFeb] },
                { x: new Date(item.date.split('/')[2], 02), y: [0, totalIncomeMar] },
                { x: new Date(item.date.split('/')[2], 03), y: [0, totalIncomeApr] },
                { x: new Date(item.date.split('/')[2], 04), y: [0, totalIncomeMay] },
                { x: new Date(item.date.split('/')[2], 05), y: [0, totalIncomeJun] },
                { x: new Date(item.date.split('/')[2], 06), y: [0, totalIncomeJul] },
                { x: new Date(item.date.split('/')[2], 07), y: [0, totalIncomeAug] },
                { x: new Date(item.date.split('/')[2], 08), y: [0, totalIncomeSep] },
                { x: new Date(item.date.split('/')[2], 09), y: [0, totalIncomeOct] },
                { x: new Date(item.date.split('/')[2], 10), y: [0, totalIncomeNov] },
                { x: new Date(item.date.split('/')[2], 11), y: [0, totalIncomeDec] }
            ];
    
            // run showchart to create chart
            Html.showChart(costArray,incomeArray)
        })
    }
   
}
