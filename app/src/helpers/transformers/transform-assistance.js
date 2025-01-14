export const transformAssitance = (data) => {
  return {
    email: data['Dirección de correo electrónico'],
    date: data['Fecha trabajada'],
    hour_in: data['Hora de Ingreso'],
    hour_out: data['Hora de Egreso'],
    hours_worked: data['Hs Trabajadas (hh:mm)'],
    type_day: data['Día'],
    especial_day: data['Día Especial'].trim()
  }
}
