var messages = [];

function inputPreProcessing(multilineString) {
	lines = multilineString.split('\n');

	lines.forEach(function(item, index) {
	  this[index] = this[index].trim();
	}, lines);

	//TODO uncomment when implementing the following: add +1 to messages line index when splice
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
	let atBOTG = false; //is true when maxBudget is settled ad 00:00 (Begin Of The Day)

	do {
		budgetTime = budgetTimePattern.exec(string);

		if (budgetTime) {
			let hours = parseInt(budgetTime[2]);
			let minutes = parseInt(budgetTime[3]);
			let budget = parseFloat(budgetTime[1]);

			budgetTimes.push({budget: budget, hours: hours, minutes: minutes});

			if (budget >= maxBudget) {
				maxBudget = parseFloat(budgetTime[1]);
				atBOTG = ((hours == 0) && (minutes == 0)) ? true : false;
			}
		}
	} while (budgetTime);

	if (!budgetTimes.length) {
		messages.push('WARNING: line ' + (index+1) + ' was skiped, because it has no valid budgets.');
		console.log(messages[messages.length-1]);
		return 'stop';
	}

	//TODO make sure budgets are sorted and without duplicates
	//Handle it somehow relevant ?

	return {budgetTimePairs: budgetTimes, atBOTG: atBOTG, maxBudget: maxBudget, lastBudget: budgetTimes[budgetTimes.length-1].budget}
}

function inputProcessing(input) {
	let lines = inputPreProcessing(input);
	let budgets = [];
	let dailyBiggestBudgets = [];

	lines.forEach(function(line, index) {
		let date = parseDate(line, index);
		if (date == 'stop') return;

		let budgetTimes = parseBudgetTimes(line, index);
		if (budgetTimes == 'stop') return;  
		let maxBudget = budgetTimes.maxBudget;
		let lastBudget = budgetTimes.lastBudget;
		let atBOTG = budgetTimes.atBOTG;
		budgetTimes = budgetTimes.budgetTimePairs;

		dailyBiggestBudgets.push({date: date, atBOTG: atBOTG, maxBudget: maxBudget, lastBudget: lastBudget});

		budgetTimes.forEach(function(budgetTime) {
			let dateTime = new Date(date);
			dateTime.setHours(budgetTime.hours);
			dateTime.setMinutes(budgetTime.minutes);

			budgets.push({date: dateTime, budget: budgetTime.budget})
		});
	});

	//TODO make sure dates are sorted and without duplicates
	//Handle it somehow relevant 

	return {dateBudgetPairs: budgets, dailyBiggestBudgets: dailyBiggestBudgets};
}