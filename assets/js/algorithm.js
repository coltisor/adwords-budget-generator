const budgetCoefficient = 2; //The cumulated daily <= 2xCurrentBudget
const maxCostsNrPerDay = 10; //

function groupBudgetsByMonth(budgets) {
	monthlyBudgets 	=  _.chain(budgets)
						.groupBy(function(item) {
						   return item.date.getMonth() + item.date.getYear();
						})
						.map((value, key) => ({ monthYear: key, budgets: value }))
						.value();

	return monthlyBudgets;
}

function getMonthlyMaxCosts(dailyBiggestBudgets) {
	let monthlyMaxCosts = _.chain(dailyBiggestBudgets)
						.groupBy(function(item) {
						   return [item.date.getMonth(), item.date.getFullYear()];
						})
						.map((value, key) => ({ month: key, year: key, maxCost: value }))
						.value();

	monthlyMaxCosts.forEach(function(monthlyMaxCost, index) {
		monthlyMaxCost = monthlyMaxCost.maxCost;
		let MaxCost = 0;

		let currentDate = new Date(monthlyMaxCost[0].date);
		let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 1);
		let currentCost = {lastBudget: 0, maxBudget: 0};
		let previousCost = {lastBudget: 0, maxBudget: 0};

		while ((currentDate.getTime() < endDate.getTime())) {
			let found = false;

			for (let dailyMaxCost of monthlyMaxCost) {
				if (dailyMaxCost.date.getTime() == currentDate.getTime()) {
					currentCost = dailyMaxCost;
					found = true;
					break;
				}
			}

			if (!found) {
				MaxCost += currentCost.lastBudget;
			} else if ((previousCost.lastBudget >= currentCost.maxBudget) && (!currentCost.atBOTG)) {
				MaxCost += previousCost.lastBudget;
			} else {
				MaxCost += currentCost.maxBudget;
			}

			console.log();

			previousCost = currentCost;
			currentDate.setDate(currentDate.getDate()+1);
		}

		let month = monthlyMaxCosts[index].month.split(',');
		let year = month[1];
		month = month[0];

		monthlyMaxCosts[index].month = month;
		monthlyMaxCosts[index].year = year;

		monthlyMaxCosts[index].maxCost = MaxCost;
	});

	return monthlyMaxCosts;
}

function getMaxCostPerMonth(date, monthlyMaxCosts) {
	let month = date.getMonth();
	let year = date.getFullYear();
	let maxCost = 0;
	
	for (let monthlyMaxCost of monthlyMaxCosts) {
		if (monthlyMaxCost.month == month && monthlyMaxCost.year == year) {
			maxCost = monthlyMaxCost.maxCost;
			break;
		}
	}

	return maxCost;
}

function getCurrentBudget(budgets, costDate) {

	let prevBudgets = budgets.filter(function(budget) {
		return budget.date <= costDate;
	});

	if (!prevBudgets.length) {
		return 0;
	}

	return prevBudgets[prevBudgets.length-1].budget;
}

function generateRandomCostDate(date) {
	let costDate = new Date();
	costDate.setHours(Math.floor(Math.random()*25));
	costDate.setMinutes(Math.floor(Math.random()*61));
	costDate.setSeconds(0);
	costDate.setDate(date.getDate());
	costDate.setMonth(date.getMonth());
	costDate.setFullYear(date.getFullYear());

	return costDate;
}

function generateRandomCost(budget) {
	return parseFloat((Math.random()*budget).toFixed(2));
}

function calculate() {
	console.clear();
	messages = [];
	let input = $('#input').val();

	if (!input.length) {
	   messages.push('WARNING: Input is empty');
	   console.log(messages[messages.length-1]);
	   showMessages();
	   return;
	}

	let budgets = inputProcessing(input);
	if (!budgets.dateBudgetPairs.length) {
	   messages = [];
	   messages.push('ERROR: Invalid input data');
	   console.log(messages[messages.length-1]);
	   showMessages();
	   return;
	}
	let dailyBiggestBudgets = budgets.dailyBiggestBudgets;
	let monthlyMaxCosts = getMonthlyMaxCosts(dailyBiggestBudgets);

	budgets = budgets.dateBudgetPairs;
	let monthlyBudgets = groupBudgetsByMonth(budgets);
	let costs = [];

	monthlyBudgets.forEach(function(monthlyBudget, index) {
		let budgets = monthlyBudget.budgets;
		let totalCostPerMonth = 0;

		let currentDate = new Date(budgets[0].date);
		currentDate.setHours(0);
		currentDate.setMinutes(0);
		let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 1);

		let maxCostPerMonth = getMaxCostPerMonth(currentDate, monthlyMaxCosts); 

		while ((currentDate.getTime() < endDate.getTime())) {
			let totalCostPerDay = 0; // cant'be > than 2*CurrentMoment.Budget
			let costsNr = Math.floor(Math.random()*maxCostsNrPerDay+1);

			for (let i = 1; i <= costsNr; i++) {
				let costDate = generateRandomCostDate(currentDate);

				let currentBudget = getCurrentBudget(budgets, costDate);
				if (currentBudget == 0) 
					continue;

				let cost = generateRandomCost(currentBudget);

				if ((cost + totalCostPerDay <= currentBudget*budgetCoefficient)
					&(cost + totalCostPerMonth <= maxCostPerMonth)) {
					totalCostPerDay += cost;
					totalCostPerMonth += cost;
					costs.push({date: costDate, cost: cost, budget: currentBudget});
				}
			}

			currentDate.setDate(currentDate.getDate()+1);
		};
	});

	outputProcessing(costs);
}