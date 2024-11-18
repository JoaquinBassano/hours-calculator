import moment from 'moment'

export const sumHours = (duration1, duration2) => {
  const totalDuration = moment
    .duration(duration1)
    .add(moment.duration(duration2))
  const hours = Math.floor(totalDuration.asHours())
  const minutes = totalDuration.minutes()

  return `${hours}:${minutes.toString().padStart(2, '0')}`
}

export const calculateRegularAndExtraHours = (workedHours, threshold) => {
  const workedDuration = moment.duration(workedHours)
  const thresholdDuration = moment.duration(threshold)

  // Horas regulares es el mínimo entre horas trabajadas y el umbral
  const hsRegular = moment.duration(
    Math.min(
      workedDuration.asMilliseconds(),
      thresholdDuration.asMilliseconds()
    )
  )

  // Horas extra es la diferencia si las horas trabajadas superan el umbral
  const hsExtra = moment.duration(
    Math.max(
      0,
      workedDuration.asMilliseconds() - thresholdDuration.asMilliseconds()
    )
  )

  return {
    hsRegular: moment.utc(hsRegular.asMilliseconds()).format('HH:mm'),
    hsExtra: moment.utc(hsExtra.asMilliseconds()).format('HH:mm')
  }
}
