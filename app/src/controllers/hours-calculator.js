import path from 'path'

import {
  transformAssitance,
  transformEmployee
} from '../helpers/transformers/index.js'
import { filterByYearMonth } from '../helpers/filters/index.js'
import { calculateWorkHours } from '../helpers/calculate-works-hours.js'
import { getMonthName } from '../helpers/get-month-name.js'

import { processCSV } from '../services/process-csv.js'
import { generateAttendancePDF } from '../services/generate-pdf.js'

import logger from '../utils/logger.js'

// import { config } from '../../config/index.js'
const sheetNames = {
  prod: {
    assistances: 'Asistencias - La Aldeana - Registros',
    employees: 'Asistencias - La Aldeana - Datos Empleados'
  },
  test: {
    assistances: 'Asistencias - La Aldeana (test) - Registros',
    employees: 'Asistencias - La Aldeana (test) - Datos Empleados'
  }
}

export const hoursCalculator = async ({ month, year, mode = 'prod' }) => {
  try {
    logger.info('Script iniciado: hours-calculator')

    const __dirname = import.meta.dirname

    const inputPath = path.resolve(__dirname, '../../../input')
    const outputPath = path.resolve(__dirname, '../../../output')

    const [assistances, employees] = await Promise.all([
      processCSV(
        `${inputPath}/${sheetNames[mode].assistances}.csv`,
        transformAssitance,
        filterByYearMonth,
        year,
        month
      ),
      processCSV(
        `${inputPath}/${sheetNames[mode].employees}.csv`,
        transformEmployee
      )
    ])

    // console.log('🚀 ~ hoursCalculator ~ employees:', employees)
    // console.log('🚀 ~ hoursCalculator ~ assistances:', assistances)

    logger.warning(`Asistencias totales para procesar: ${assistances.length}`)

    const workSummary = calculateWorkHours(assistances, employees)

    console.log('🚀 ~ hoursCalculator ~ workSummary:', workSummary)
    console.log(
      '🚀 ~ hoursCalculator ~ workSummary.assistances:',
      workSummary['joaquinbas98@gmail.com'].assistances
    )

    generateAttendancePDF({
      filePath: `${outputPath}/Resumen Asistencias - ${year} - ${getMonthName(
        month
      )}.pdf`,
      summary: workSummary,
      month,
      year
    })

    logger.info('Script finalizado: hours-calculator\n')
  } catch (error) {
    logger.error(error.toString())
    logger.error(
      'No se puede continuar con la ejecución del script debido a un error.\n'
    )
  }
}
