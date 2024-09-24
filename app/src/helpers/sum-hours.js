import moment from 'moment'

export const sumHours = (duration1, duration2) => {
  const totalDuration = moment
    .duration(duration1)
    .add(moment.duration(duration2))
  return moment.utc(totalDuration.asMilliseconds()).format('HH:mm')
}
