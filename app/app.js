import { hoursCalculator } from './src/controllers/hours-calculator.js'

import { config } from './config/index.js'

const { years: YEARS, months: MONTHS } = config

console.clear()

const params = {
  year: YEARS[2025],
  month: MONTHS.Febrero,
  mode: 'test'
}

await hoursCalculator(params)
