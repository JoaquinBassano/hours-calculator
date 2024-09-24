import moment from 'moment'

export const filterByYearMonth = (data, year, month) => {
  const date = moment(data.date, 'DD/MM/YYYY')

  return date.year() === year && date.month() === month
}
