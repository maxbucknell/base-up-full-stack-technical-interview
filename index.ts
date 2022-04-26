export interface Policy {
	name: string

	enablePricing: boolean
	hourlyPrice: number
	dailyPrice: number

	enableWeekendPricing: boolean
	weekendHourlyPrice: number
	weekendDailyPrice: number

	enableEveningPricing: boolean
	eveningStartTime: number
	eveningHourlyPrice: number
	eveningLimitPrice: number
}

// Sunday – Saturday, as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6

export function calculateDayPrice(hourlyPrice: number, dailyPrice: number, hours: number): number {
	let amount = 0

	if (hourlyPrice) {
		amount = hourlyPrice * hours

		if (dailyPrice) {
			if (amount > dailyPrice) {
				amount = dailyPrice
			}
		}
	} else if (dailyPrice) {
		amount = dailyPrice
	}

	return amount
}

/**
 * Price a time range within a single day.
 *
 * Parameters:
 *  - policy: Object used to define pricing information
 *  - day: A number between 0 and 6 to denote day of week
 *  - startTime: A number between 0 and 86349 to indicate the time the request starts
 *  - endTime: A number between 0 and 86349 to indicate the time the request ends
 */
export function calculatePriceForTimeRange(
	policy: Policy,
	day: WeekDay,
	startTime: number,
	endTime: number
): number {
	if (!policy.enablePricing) {
		return 0
	}

	const numberOfHours = Math.ceil((endTime - startTime) / (60 * 60))
	const isWeekend = day === 0 || day === 6

	// Weekend Pricing
	if (isWeekend && policy.enableWeekendPricing) {
		return calculateDayPrice(policy.weekendHourlyPrice, policy.weekendDailyPrice, numberOfHours)
	}

	// Evening Pricing
	if (policy.enableEveningPricing && startTime >= policy.eveningStartTime) {
		return calculateDayPrice(policy.eveningHourlyPrice, policy.eveningLimitPrice, numberOfHours)
	}

	// Base Price
	return calculateDayPrice(policy.hourlyPrice, policy.dailyPrice, numberOfHours)
}
