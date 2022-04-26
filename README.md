## Installation

```
git clone git@github.com:maxbucknell/base-up/full-stack-technical-interview
cd full-stack-technical-interview
npm install
npm test
```

## Exercises

Please complete the below exercises in your own fork, and submit a pull request to this repository. There are some questions to answer in the pull request, to test your ability to read and comprehend code.

The code in question is a small extract from BaseUp’s pricing logic, inside the booking engine. The function `calculatePriceForTimeRange` is called by another component to find the price that a driver is expected to pay for a booking on a single day.

### Missing Unit Test

Inside the tests for evening pricing, there is a missing scenario: we are not checking that the evening price will max out at `eveningLimitPrice`. Please add a test to verify this behaviour.

### Evening & Weekend Pricing

If somebody books parking on Saturday evening, they should receive the cheaper of the evening or weekend pricing, if both are enabled. Please write tests to verify this behaviour, and (if necessary), fix the code so they pass.
