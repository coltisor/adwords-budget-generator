const budgetCoefficient = 2; //The cumulated daily <= 2xCurrentBudget
const maxCostsNrPerDay = 10; //

function groupByMonth(budgets) {
	monthlyBudgets 	=  _.chain(budgets)
						.groupBy(function(item) {
						   return item.date.getMonth() + item.date.getYear();
						})
						.map((value, key) => ({ monthYear: key, budgets: value }))
						.value();

	return monthlyBudgets;
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
	   return;
	}

	let budgets = inputProcessing(input);
	if (!budgets.dateBudgetPairs.length) {
	   messages = [];
	   messages.push('ERROR: Invalid input data');
	   console.log(messages[messages.length-1]);
	   return;
	}
	let dailyBiggestBudgets = budgets.dailyBiggestBudgets;
	budgets = budgets.dateBudgetPairs;

	let monthlyBudgets = groupByMonth(budgets);
	let costs = [];

	monthlyBudgets.forEach(function(monthlyBudget, index) {
		let budgets = monthlyBudget.budgets;
		let maxCostsPerMonth = 10;
		let totalCostPerMonth = 0;

		let currentDate = new Date(budgets[0].date);
		currentDate.setHours(0);
		currentDate.setMinutes(0);
		let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 1);

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
					&(cost + totalCostPerMonth <= maxCostsPerMonth)) {
					totalCostPerDay += cost;
					totalCostPerMonth += cost;
					costs.push({date: costDate, cost: cost});
				}
			}

			currentDate.setDate(currentDate.getDate()+1);
		};
	});

	console.log(costs);
}