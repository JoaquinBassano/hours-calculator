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

export const hoursCalculator = async ({ month, year }) => {
  try {
    logger.info('Script iniciado: hours-calculator')

    const __dirname = import.meta.dirname

    const inputPath = path.resolve(__dirname, '../../../input')
    const outputPath = path.resolve(__dirname, '../../../output')

    const [assistances, employees] = await Promise.all([
      processCSV(
        `${inputPath}/Asistencias - La Aldeana - Registros.csv`,
        transformAssitance,
        filterByYearMonth,
        year,
        month
      ),
      processCSV(
        `${inputPath}/Asistencias - La Aldeana - Datos Empleados.csv`,
        transformEmployee
      )
    ])

    logger.warning(`Asistencias totales para procesar: ${assistances.length}`)

    const workSummary = calculateWorkHours(assistances, employees)

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
