function groupCostsByDay(costs) {
	let dailyCosts 	=  _.chain(costs)
					.groupBy(function(item) {
					   return item.date.toDateString();
					})
					.map((value, key) => ({ date: new Date(key), costs: value, budget: 0}))
					.value();

	return dailyCosts;
}

function groupDailyHistory(costs) {
	//duplicate array to create brand new data structure
	let dailyHistory = JSON.stringify(costs);
	dailyHistory = JSON.parse(dailyHistory);

	dailyHistory.forEach(function(dailyCost, index) {
		let totalCosts = 0; 
		let biggestBudget = 0; 

		for (let costs of dailyCost.costs) {
			totalCosts += costs.cost;

			if (costs.budget > biggestBudget) 
				biggestBudget = costs.budget;
		}

		dailyHistory[index].date = new Date(dailyHistory[index].date);
		dailyHistory[index].costs = parseFloat(totalCosts.toFixed(2));
		dailyHistory[index].budget = parseFloat(biggestBudget.toFixed(2));
	})

	return dailyHistory;
}

function generateDailyCostsOutput(dailyCosts) {
	listElement = document.createElement('ul');

	dailyCosts.forEach(function (dailyCost, index) {
    	let li = document.createElement('li');
    	li.innerHTML = '<b>' + dailyCost.date.toLocaleDateString() + '</b>: ';
    	listElement.appendChild(li);

    	dailyCost.costs.forEach(function (item, index) {
    		let hours = item.date.getHours();
    		let minutes = item.date.getMinutes();
    		let cost = item.cost;

    		li.innerHTML += cost + ' (' + ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + '); ';
    	});
	});
	return listElement;
}

function generateDailyHistoryOutput(dailyHistory) {
	let table = document.createElement("table");
	table.classList.add('table');

	for (let element of dailyHistory) {
		let row = table.insertRow();

		let cell = row.insertCell();
		let text = document.createTextNode(element.date.toLocaleDateString());
		cell.appendChild(text);

		cell = row.insertCell();
		text = document.createTextNode(element.budget);
		cell.appendChild(text);

		cell = row.insertCell();
		text = document.createTextNode(element.costs);
		cell.appendChild(text);
	}
	
	let data = Object.keys(dailyHistory[0]);
	let thead = table.createTHead();
	let row = thead.insertRow();
	let th = document.createElement("th");
	th.innerText = 'Date';
	row.appendChild(th);
	th = document.createElement("th");
	th.innerText = 'Budget';
	row.appendChild(th);
	th = document.createElement("th");
	th.innerText = 'Costs';
	row.appendChild(th);

	return table;
}

function outputProcessing(costs) {
	console.log(costs);

	let dailyCosts = groupCostsByDay(costs);
	let dailyHistory = groupDailyHistory(dailyCosts);

	let dailyCostsOutput = generateDailyCostsOutput(dailyCosts);
	let output = document.getElementById('costs');
	output.innerHTML = '';
	output.appendChild(dailyCostsOutput);

	let dailyHistoryOutput = generateDailyHistoryOutput(dailyHistory);
	output = document.getElementById('history');
	output.innerHTML = '';
	output.appendChild(dailyHistoryOutput);
}