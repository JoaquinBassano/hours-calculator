import moment from 'moment'

import { config } from '../../config/index.js'

import { sumHours, calculateRegularAndExtraHours } from './hours-operations.js'
import { getCategoryKeyByName } from './get-category-key.js'

const {
  type_days: TYPE_DAYS,
  employee_categories: EMPLOYEE_CATEGORIES,
  type_especial_days: TYPE_ESPECIAL_DAYS,
} = config

export const calculateWorkHours = (assistances, employees) => {
  // Agrupar las asistencias por email y sumar campos de información requerida
  const assistancesXEmail = assistances.reduce((acc, { email, ...rest }) => {
    if (!acc[email]) {
      const employee = employees.find((e) => e.email === email)
      acc[email] = {
        assistances: [],
        id: employee.id,
        name: employee.name,
        category: employee.category,
        hours_worked: {
          total_week: '0:00', // suma total de horas de la semana
          total_weekend: '0:00', // suma total de horas de fin de semana
          total_holiday: '0:00', // suma total de horas de feriados
          extra_week: '0:00', // suma de horas extras de la semana (all categories)
          extra_weekend: '0:00', // suma de horas extras de fin de semana (all categories)
          regular_week: '0:00', // suma de horas regulares de la semana (only without receipt)
          regular_weekend: '0:00', // suma de horas regulares de fin de semana (only without receipt)
        },
        days_worked: {
          total_week_and_weekend: 0,
          total_holiday: 0,
          total_rest_day: 0,
          total_medical_certificate: 0,
        },
      }
    }
    acc[email].assistances.push(rest)

    return acc
  }, {})

  // Ordenar las asistencias por fecha
  Object.values(assistancesXEmail).forEach((entry) => {
    entry.assistances.sort(
      (a, b) =>
        moment(a.date, 'DD/MM/YYYY').toDate() -
        moment(b.date, 'DD/MM/YYYY').toDate()
    )
  })

  // Procesamiento de las horas de cada empleado
  Object.values(assistancesXEmail).forEach((employee) => {
    const hsThreshold =
      EMPLOYEE_CATEGORIES[
        getCategoryKeyByName(EMPLOYEE_CATEGORIES, employee.category)
      ].rest

    employee.assistances.forEach((assistance) => {
      const {
        type_day: typeDay,
        hours_worked: hoursWorked,
        especial_day: especialDay,
      } = assistance

      if (!!especialDay) {
        // Agrega el tipo de dia especial a los dias trabajados
        switch (especialDay) {
          case TYPE_ESPECIAL_DAYS.rest_day:
            employee.days_worked.total_rest_day += 1
            break
          case TYPE_ESPECIAL_DAYS.medical_certificate:
            employee.days_worked.total_medical_certificate += 1
            break
        }
        return
      }

      if (typeDay === TYPE_DAYS.holiday) {
        // Suma de horas de feriados
        employee.hours_worked.total_holiday = sumHours(
          employee.hours_worked.total_holiday,
          hoursWorked
        )
        // Agrega las horas pagadas a cada asistencia
        assistance.paid_hours = hoursWorked

        // Agrega el día feriado a los dias trabajados
        employee.days_worked.total_holiday += 1
      } else {
        // Agrega el día (semana o finde) a los dias trabajados
        employee.days_worked.total_week_and_weekend += 1

        const { hsRegular, hsExtra } = calculateRegularAndExtraHours(
          hoursWorked,
          hsThreshold
        )
        if (typeDay === TYPE_DAYS.weekend) {
          // Suma de horas de fin de semana
          employee.hours_worked.total_weekend = sumHours(
            employee.hours_worked.total_weekend,
            hoursWorked
          )
          employee.hours_worked.regular_weekend = sumHours(
            employee.hours_worked.regular_weekend,
            hsRegular
          )

          if (hsExtra !== '00:00') {
            employee.hours_worked.extra_weekend = sumHours(
              employee.hours_worked.extra_weekend,
              hsExtra
            )

            assistance.paid_hours = hsExtra
          }
        } else {
          // Suma de horas de la semana
          employee.hours_worked.total_week = sumHours(
            employee.hours_worked.total_week,
            hoursWorked
          )
          employee.hours_worked.regular_week = sumHours(
            employee.hours_worked.regular_week,
            hsRegular
          )

          if (hsExtra !== '00:00') {
            employee.hours_worked.extra_week = sumHours(
              employee.hours_worked.extra_week,
              hsExtra
            )

            assistance.paid_hours = hsExtra
          }
        }
      }
    })
  })

  return assistancesXEmail
}
