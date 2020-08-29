let messages = [];

function inputPreProcessing(multilineString) {
	lines = multilineString.split('\n');

	lines.forEach(function(item, index) {
	  this[index] = this[index].trim();
	}, lines);

	//TODO uncomment when implementing: add +1 to messages line index
	//if (lines[0] == 'Budget History:') lines.splice(0,1); 

	return lines;
} 

function parseDate(string, index) {
	const datePattern = /^(0[1-9]|1[012])[- \.](0[1-9]|[12][0-9]|3[01])[- \.](19|20)\d\d/;

	let date = datePattern.exec(string);

	if (date == null) {
		messages.push('WARNING: line ' + (index+1) + ' was skiped, because it has no valid date.');
		console.log(messages[messages.length-1]);
		return 'stop';
	}

	return new Date(date[0]);
}

function parseBudgetTimes(string, index) {
	const budgetTimePattern = /(\d+(?:[.]\d+)?)\s*\((\d*):(\d*)\)/g; //can take float
	let budgetTimes = [];
	let maxBudget = 0; //budget can't be negative
	let countBudgets = 0;

	do {
		budgetTime = budgetTimePattern.exec(string);

		if (budgetTime) {
			if (countBudgets >= 10) {
				messages.push('WARNING: line ' + (index+1) + ' has more than 10 budgets. Only first 10 are used.');
				console.log(messages[messages.length-1]);
				break;
			 }
			countBudgets++;
			budgetTimes.push({budget: parseFloat(budgetTime[1]), hours: parseInt(budgetTime[2]), minutes: parseInt(budgetTime[3])});
			if (budgetTime[1] > maxBudget) maxBudget = parseFloat(budgetTime[1]);
		}
	} while (budgetTime);

	if (!budgetTimes.length) {
		messages.push('WARNING: line ' + (index+1) + ' was skiped, because it has no valid budgets.');
		console.log(messages[messages.length-1]);
		return 'stop';
	}

	//TODO make sure budgets are sorted and without duplicates
	//Handle it somehow relevant ?
	return {budgetTimePairs: budgetTimes, maxBudget: maxBudget}
}

function inputProcessing(input) {
	let lines = inputPreProcessing(input);
	let budgets = [];
	let dailyMaxBudgets = [];

	lines.forEach(function(line, index) {
		let date = parseDate(line, index);
		if (date == 'stop') return; // TODO return 'stop' for the conventional integrity?

		let budgetTimes = parseBudgetTimes(line, index);
		if (budgetTimes == 'stop') return;  // TODO return 'stop' for the conventional integrity?
		let maxBudget = budgetTimes.maxBudget;
		budgetTimes = budgetTimes.budgetTimePairs;

		dailyMaxBudgets.push({date: date, maxBudget: maxBudget});

		budgetTimes.forEach(function(budgetTime) {
			let dateTime = date;
			dateTime.setHours(budgetTime.hours);
			dateTime.setMinutes(budgetTime.minutes);

			budgets.push({date: dateTime, budget: budgetTime.budget})
		});
	});

	//TODO make sure dates are sorted and without duplicates
	//Handle it somehow relevant 

	return {dateBudgetPairs: budgets, dailyMaxBudgets: dailyMaxBudgets};
}
