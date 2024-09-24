import { createReadStream } from 'fs'
import csv from 'csv-parser'

import logger from '../utils/logger.js'

export const processCSV = (
  filePath,
  transformFn = (data) => data,
  filterFn = () => true,
  ...filterArgs
) => {
  return new Promise((resolve, reject) => {
    const dataArray = []

    const readableStream = createReadStream(filePath)

    readableStream
      .pipe(csv())
      .on('data', (row) => {
        const transformedData = transformFn(row)
        if (filterFn(transformedData, ...filterArgs)) {
          dataArray.push(transformedData)
        }
      })
      .on('end', () => {
        logger.success(`Archivo procesado: ${filePath}`)
        resolve(dataArray)
      })
      .on('error', (err) => {
        logger.error(
          `Error procesando el archivo: ${filePath}. Error: ${err.message}`
        )
        reject(err)
      })
  })
}
