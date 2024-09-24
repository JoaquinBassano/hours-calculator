import PDFDocument from 'pdfkit'
import fs from 'fs'

import { getMonthName } from '../helpers/get-month-name.js'
import logger from '../utils/logger.js'

export const generateAttendancePDF = ({ filePath, summary, month, year }) => {
  const doc = new PDFDocument()
  const writeStream = fs.createWriteStream(filePath)
  doc.pipe(writeStream)

  // Título
  doc
    .fontSize(45)
    .text(`Resumen Asistencias ${getMonthName(month)} - ${year}`, {
      align: 'center'
    })

  // Iterar sobre cada email y agregar sus asistencias al PDF
  Object.keys(summary).forEach((email) => {
    const {
      assistances,
      name,
      category,
      hours_worked: hoursWorked
    } = summary[email]

    doc.addPage() // Crea una nueva página para cada email

    generateHeaders(doc, name, category)

    doc.fontSize(12).text('Listado de asistencias')

    // Configuración de tabla
    const tableTop = doc.y + 20 // Posición inicial de la tabla
    let tableY = tableTop

    // Dibujar encabezado de la tabla
    doc.fontSize(12).text('Fecha', 50, tableY)
    doc.text('Hora de Ingreso', 120, tableY)
    doc.text('Hora de Egreso', 220, tableY)
    doc.text('Hs Trabajadas', 320, tableY)
    doc.text('Tipo de Día', 420, tableY)

    // Dibujar una línea debajo del encabezado de la tabla
    doc
      .moveTo(50, tableY + 15)
      .lineTo(500, tableY + 15)
      .stroke()

    // Listar cada asistencia como una fila en la tabla
    assistances.forEach((assistance) => {
      tableY += 25 // Espacio entre filas
      doc.text(assistance.date, 50, tableY)
      doc.text(assistance.hour_in, 120, tableY)
      doc.text(assistance.hour_out, 220, tableY)
      doc.text(
        `${assistance.hours_worked} (${assistance.paid_hours || '0:00'})`,
        320,
        tableY
      )
      doc.text(assistance.type_day, 420, tableY)
    })

    doc.addPage()

    generateHeaders(doc, name, category)

    doc.fontSize(12).text('Resumen de Horas Trabajadas')
  })

  // Finalizar el PDF
  doc.end()

  logger.success(`PDF generado con éxito: ${filePath.split('/')[1]}`)
}

const generateHeaders = (doc, name, category) => {
  doc.fontSize(24).font('Helvetica-Bold').text(` ${name}`, { align: 'center' })

  doc.moveDown()

  doc
    .fontSize(16)
    .font('Helvetica')
    .text('Categoría:', { underline: true, continued: true })
    .text(` ${category}`, { underline: false })

  doc.moveDown()
}
