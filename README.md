Web Recruitment Exercise - AdWords Budgets

Daily history of the budget set and consumption for the AdWords campaign.

A user can select a daily budget for his Adwords campaign. The user can change the budget anytime he wants, including changing the
budget in the same day. He can also pause the campaign at any time (the budget will be 0).

The AdWords campaign will generate costs in a random way trough-out the entire day (at most 10 times per day) based on the daily budget
set by the end-user in the moment the cost generation is initiated, considering the following rules:

- The cumulated daily cost can not be greater than two times of what the budget is set in the given moment
- The cumulated cost per month can not not be greater than the sum of the maximum budget for each days within the month

Requirements:

Create an algorithm that takes as input the history of the daily budget adjustments by an end-user, over a period of 3 months and:
Randomly generate the ad-word costs following the above rules

Show a daily history of what was the max budget set and what costs the campaign generated for the given period.

Github Pages: https://coltisor.github.io/adwords-budget-generator/
