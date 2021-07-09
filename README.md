
# Web Recruitment Exercise - AdWords Budgets

Daily history of the budget set and consumption for the AdWords campaign.

A user can select a daily budget for his Adwords campaign. The user can change the budget anytime he wants, including changing the
budget in the same day. He can also pause the campaign at any time (the budget will be 0).

The AdWords campaign will generate costs in a random way trough-out the entire day (at most 10 times per day) based on the daily budget
set by the end-user in the moment the cost generation is initiated, considering the following rules:

- The cumulated daily cost can not be greater than two times of what the budget is set in the given moment
- The cumulated cost per month can not not be greater than the sum of the maximum budget for each days within the month

**Requirements**

- Create an algorithm that takes as input the history of the daily budget adjustments by an end-user, over a period of 3 months and:
Randomly generate the ad-word costs following the above rules
- Show a daily history of what was the max budget set and what costs the campaign generated for the given period.

## Example

### Input

**Budget History:**

- 01.01.2019: First budget 7 (10:00), 0 (11:00), 1 (12:00), 6 (23:00); 01.05.2019: 2 (10:00); 
- 01.06.2019: 0 (00:00); 
- 02.09.2019: 1 (13:13); 
- 03.01.2019: 0 (12:00), 1 (14:00) 
 
### Output 

**Costs generated:**
- a.  01.01.2019: 1 (10:05); 3.12 (10:50); 1 (23:59) 
- b.  01.02.2019: 2.1 (11:00); 
- c.  01.03.2019: 1.1 (10:00); 1.2 (12:00), 2.9 (11:00) 
- d.  01.04.2019: 8 (10:00) 
- e.  01.05.2019: 2 (07:00), 3 (09:00)  
- f.  01.06.2019: 0 
- g.  01.07.2019: 0 
- h.  01.08.2019: 0 

 
**Daily History report:**

| Date        | Budget  | Costs |
|-------------|---------|-------|
| 01.01.2019  | 7       | 5.12  |
| 01.02.2019  | 6       | 2.1   |
| 01.03.2019  | 6       | 5.2   |
| 01.04.2019  | 6       | 8     |
| 01.05.2019  | 2       | 5     |
| 01.06.2019  | 0       | 0     |
| 01.07.2019  | 0       | 0     |
| 01.08.2019  | 0       | 0     |
| 01.09.2019  | ...     | ...   |

## Solution

https://coltisor.github.io/adwords-budget-generator/
