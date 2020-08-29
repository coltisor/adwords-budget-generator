function groupByMonth(budgets) {
	budgets = _.chain(budgets)
	         .groupBy(function(item) {
	               return item.date.getMonth() + item.date.getYear();
	            })
	         .map((value, key) => ({ monthYear: key, budgets: value }))
	         .value();

	return budgets;
}

function getMonthlyBudget(dates) {
	let monthlyBudgets = [];

	dates.forEach(function(date, index) {
	   monthlyBudgets = monthlyBudgets.concat(date.budgetTimes.map(function(budgetTime) { return budgetTime.budget; }));
	});

	return monthlyBudgets.reduce((a, b) => a + b, 0);
	}

	function getMonthlyMaxCosts(dates) {
	let maxBudgets = [];

	dates.forEach(function(date, index) {
	   maxBudgets.push(date.maxBudget);
	});

	return maxBudgets.reduce((a, b) => a + b, 0);
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
	let dailyMaxBudgets = budgets.dailyMaxBudgets;
	budgets = budgets.dateBudgetPairs;

	monthlyBudgets = groupByMonth(budgets);

	console.log(monthlyBudgets);

	console.log(messages);
}