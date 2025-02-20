import { calculateWorkHours } from '../../src/helpers/calculate-works-hours.js'

test('1 employee and some assistances on different days', () => {
  const assistances = [
    {
      email: 'joaquinbas98@gmail.com',
      date: '4/2/2025',
      hour_in: '10:10:00 a.m.',
      hour_out: '11:12:00 a.m.',
      hours_worked: '1:02',
      type_day: 'Lunes a Viernes',
      especial_day: ''
    },
    {
      email: 'joaquinbas98@gmail.com',
      date: '5/2/2025',
      hour_in: '1:10:00 p.m.',
      hour_out: '6:10:00 p.m.',
      hours_worked: '5:00',
      type_day: 'Lunes a Viernes',
      especial_day: ''
    },
    {
      email: 'joaquinbas98@gmail.com',
      date: '8/2/2025',
      hour_in: '6:00:00 a.m.',
      hour_out: '10:10:00 a.m.',
      hours_worked: '4:10',
      type_day: 'Sábado/Domingo',
      especial_day: ''
    },
    {
      email: 'joaquinbas98@gmail.com',
      date: '9/2/2025',
      hour_in: '10:10:00 a.m.',
      hour_out: '10:10:00 p.m.',
      hours_worked: '12:00',
      type_day: 'Sábado/Domingo',
      especial_day: ''
    },
    {
      email: 'joaquinbas98@gmail.com',
      date: '19/2/2025',
      hour_in: '10:00:00 a.m.',
      hour_out: '6:00:00 p.m.',
      hours_worked: '8:00',
      type_day: 'Lunes a Viernes',
      especial_day: ''
    },
    {
      email: 'joaquinbas98@gmail.com',
      date: '26/2/2025',
      hour_in: '',
      hour_out: '',
      hours_worked: '',
      type_day: 'Lunes a Viernes',
      especial_day: 'Franco'
    },
    {
      email: 'joaquinbas98@gmail.com',
      date: '2/2/2025',
      hour_in: '',
      hour_out: '',
      hours_worked: '',
      type_day: 'Sábado/Domingo',
      especial_day: 'Franco'
    },
    {
      email: 'joaquinbas98@gmail.com',
      date: '28/2/2025',
      hour_in: '',
      hour_out: '',
      hours_worked: '',
      type_day: 'Lunes a Viernes',
      especial_day: 'Certificado Médico'
    },
    {
      email: 'joaquinbas98@gmail.com',
      date: '17/2/2025',
      hour_in: '',
      hour_out: '',
      hours_worked: '',
      type_day: 'Lunes a Viernes',
      especial_day: 'Otro motivo'
    }
  ]
  const employees = [
    {
      id: '1',
      email: 'joaquinbas98@gmail.com',
      name: 'Joaquin Bassano',
      category: 'Recibo 8hs'
    }
  ]

  const expectedSummary = {
    'joaquinbas98@gmail.com': {
      assistances: [
        {
          date: '2/2/2025',
          hour_in: '',
          hour_out: '',
          hours_worked: '',
          type_day: 'Sábado/Domingo',
          especial_day: 'Franco'
        },
        {
          date: '4/2/2025',
          hour_in: '10:10:00 a.m.',
          hour_out: '11:12:00 a.m.',
          hours_worked: '1:02',
          type_day: 'Lunes a Viernes',
          especial_day: ''
        },
        {
          date: '5/2/2025',
          hour_in: '1:10:00 p.m.',
          hour_out: '6:10:00 p.m.',
          hours_worked: '5:00',
          type_day: 'Lunes a Viernes',
          especial_day: ''
        },
        {
          date: '8/2/2025',
          hour_in: '6:00:00 a.m.',
          hour_out: '10:10:00 a.m.',
          hours_worked: '4:10',
          type_day: 'Sábado/Domingo',
          especial_day: ''
        },
        {
          date: '9/2/2025',
          hour_in: '10:10:00 a.m.',
          hour_out: '10:10:00 p.m.',
          hours_worked: '12:00',
          type_day: 'Sábado/Domingo',
          especial_day: '',
          paid_hours: '04:00'
        },
        {
          date: '17/2/2025',
          hour_in: '',
          hour_out: '',
          hours_worked: '',
          type_day: 'Lunes a Viernes',
          especial_day: 'Otro motivo'
        },
        {
          date: '19/2/2025',
          hour_in: '10:00:00 a.m.',
          hour_out: '6:00:00 p.m.',
          hours_worked: '8:00',
          type_day: 'Lunes a Viernes',
          especial_day: ''
        },
        {
          date: '26/2/2025',
          hour_in: '',
          hour_out: '',
          hours_worked: '',
          type_day: 'Lunes a Viernes',
          especial_day: 'Franco'
        },
        {
          date: '28/2/2025',
          hour_in: '',
          hour_out: '',
          hours_worked: '',
          type_day: 'Lunes a Viernes',
          especial_day: 'Certificado Médico'
        }
      ],
      id: '1',
      name: 'Joaquin Bassano',
      category: 'Recibo 8hs',
      hours_worked: {
        total_week: '14:02',
        total_weekend: '16:10',
        total_holiday: '0:00',
        extra_week: '0:00',
        extra_weekend: '4:00',
        regular_week: '14:02',
        regular_weekend: '12:10'
      },
      days_worked: {
        total_week_and_weekend: 5,
        total_holiday: 0,
        total_rest_day: 2,
        total_medical_certificate: 1,
        total_other_reason: 1
      }
    }
  }

  const summary = calculateWorkHours(assistances, employees)

  expect(summary).toEqual(expectedSummary)
})
