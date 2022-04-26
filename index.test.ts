import { expect } from 'chai'

import { calculateDayPrice, calculatePriceForTimeRange, Policy } from '.'

describe('calculateDayPrice', () => {
	it('should calculate hourly prices', () => {
		expect(calculateDayPrice(5, 50, 1)).to.equal(5)
		expect(calculateDayPrice(5, 50, 2)).to.equal(10)
	})

	it('should ignore daily price if not set', () => {
		expect(calculateDayPrice(5, 0, 4)).to.equal(20)
	})

	it('should use daily price if it is cheaper', () => {
		expect(calculateDayPrice(5, 22, 6)).to.equal(22)
		expect(calculateDayPrice(5, 22, 4)).to.equal(20)
	})

	it('should use daily price if hourly price is not set', () => {
		expect(calculateDayPrice(0, 18, 4)).to.equal(18)
	})
})

describe('calculatePriceForTimeRange', () => {
	const defaultPolicy: Policy = {
		name: 'Foobar',
		enablePricing: false,
		hourlyPrice: 0,
		dailyPrice: 0,

		enableWeekendPricing: false,
		weekendHourlyPrice: 0,
		weekendDailyPrice: 0,

		enableEveningPricing: false,
		eveningStartTime: 0,
		eveningHourlyPrice: 0,
		eveningLimitPrice: 0
	}

	it('should return 0 for free policies', () => {
		expect(calculatePriceForTimeRange(defaultPolicy, 1, 0, 86340)).to.equal(0)
	})

	it('should calculate an hourly price', () => {
		const policy = {
			...defaultPolicy,

			enablePricing: true,
			hourlyPrice: 6
		}

		expect(calculatePriceForTimeRange(policy, 1, 25200, 68400)).to.equal(72)

		// Check 2.5 hours rounds to 3
		expect(calculatePriceForTimeRange(policy, 1, 43200, 52200)).to.equal(18)
	})

	it('should calculate a daily price', () => {
		const policy = {
			...defaultPolicy,

			enablePricing: true,
			hourlyPrice: 6,
			dailyPrice: 25
		}

		expect(calculatePriceForTimeRange(policy, 1, 25200, 68400)).to.equal(25)
	})

	it('should calculate weekend pricing', () => {
		const policy = {
			...defaultPolicy,

			enablePricing: true,
			hourlyPrice: 6,
			dailyPrice: 25,

			enableWeekendPricing: true,
			weekendHourlyPrice: 3,
			weekendDailyPrice: 13
		}

		expect(calculatePriceForTimeRange(policy, 1, 25200, 68400)).to.equal(25)
		expect(calculatePriceForTimeRange(policy, 0, 25200, 68400)).to.equal(13)
		expect(calculatePriceForTimeRange(policy, 6, 25200, 68400)).to.equal(13)
		expect(calculatePriceForTimeRange(policy, 0, 43200, 57600)).to.equal(12)
	})

	it('should calculate evening pricing', () => {
		const policy = {
			...defaultPolicy,

			enablePricing: true,
			hourlyPrice: 6,
			dailyPrice: 25,

			enableEveningPricing: true,
			eveningStartTime: 64800,
			eveningHourlyPrice: 3,
			eveningLimitPrice: 10
		}

		expect(calculatePriceForTimeRange(policy, 1, 25200, 68400)).to.equal(25)
		expect(calculatePriceForTimeRange(policy, 1, 68400, 75600)).to.equal(6)
	})
})

