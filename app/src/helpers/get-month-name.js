import { config } from '../../config/index.js'

const { months: MONTHS } = config

export const getMonthName = (monthNumber) => {
  const monthName = Object.keys(MONTHS).find(
    (month) => MONTHS[month] === monthNumber
  )
  return monthName || null
}
