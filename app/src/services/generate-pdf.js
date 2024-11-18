import PDFDocument from 'pdfkit'
import fs from 'fs'

import { getMonthName } from '../helpers/get-month-name.js'

import logger from '../utils/logger.js'

// Función principal para generar el PDF de asistencias
export const generateAttendancePDF = ({ filePath, summary, month, year }) => {
  const doc = new PDFDocument()

  const writeStream = fs.createWriteStream(filePath)
  doc.pipe(writeStream)

  addTitle(doc, getMonthName(month), year)

  const sortedSummary = sortSummaryByEmployeeId(summary)

  Object.keys(sortedSummary).forEach((email) => {
    const {
      assistances,
      hours_worked: hoursWorked,
      ...employeeData // {id, name, category}
    } = sortedSummary[email]

    doc.addPage()
    generateHeaders(doc, employeeData)
    doc.fontSize(12).text('Listado de asistencias')

    const tableTop = doc.y + 20
    let tableY = tableTop
    drawTableHeader(doc, tableY)

    assistances.forEach((assistance) => {
      tableY = checkAndAddPage(doc, tableY, tableTop, employeeData)
      tableY += 25
      drawTableRow(doc, assistance, tableY)
    })

    doc.addPage()
    generateHeaders(doc, employeeData)
    doc.fontSize(12).text('Resumen de Horas Trabajadas')
    generateSummaryTable(doc, hoursWorked)
  })

  doc.end()
  logger.success(`PDF generado con éxito: ${filePath.split('/')[1]}`)
}

// Función para agregar el título del PDF
const addTitle = (doc, monthName, year) => {
  doc
    .fontSize(45)
    .text(`Resumen Asistencias ${monthName} - ${year}`, { align: 'center' })
}

// Función para ordenar el resumen por ID
const sortSummaryByEmployeeId = (summary) => {
  return Object.entries(summary)
    .sort(([, a], [, b]) => a.id - b.id)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
}

// Función para generar encabezados
const generateHeaders = (doc, { id, name, category }) => {
  doc
    .fontSize(24)
    .font('Helvetica-Bold')
    .text(`${id} - ${name}`, { align: 'center' })
    .moveDown()
  doc
    .fontSize(16)
    .font('Helvetica')
    .text('Categoría:', { underline: true, continued: true })
    .text(` ${category}`, { underline: false })
    .moveDown()
}

// Función para dibujar la cabecera de la tabla
const drawTableHeader = (doc, tableY) => {
  doc.fontSize(12).text('Fecha', 50, tableY)
  doc.text('Hora de Ingreso', 120, tableY)
  doc.text('Hora de Egreso', 220, tableY)
  doc.text('Hs Trabajadas', 320, tableY)
  doc.text('Tipo de Día', 420, tableY)
  doc
    .moveTo(50, tableY + 15)
    .lineTo(500, tableY + 15)
    .stroke()
}

// Función para dibujar una fila de la tabla
const drawTableRow = (doc, assistance, tableY) => {
  doc.fontSize(12)
  doc.text(assistance.date, 50, tableY)
  doc.text(assistance.hour_in, 120, tableY)
  doc.text(assistance.hour_out, 220, tableY)
  doc.text(
    `${assistance.hours_worked} (${assistance.paid_hours || '0:00'})`,
    320,
    tableY
  )
  doc.text(assistance.type_day, 420, tableY)
}

// Función para verificar y agregar nueva página si es necesario
const checkAndAddPage = (doc, tableY, tableTop, { id, name, category }) => {
  if (tableY + 30 > doc.page.height - doc.page.margins.bottom) {
    doc.addPage()
    generateHeaders(doc, { id, name, category })
    doc.fontSize(12).text('Listado de asistencias')
    tableY = tableTop
    drawTableHeader(doc, tableY)
  }
  return tableY
}

// Función para generar la tabla de resumen
const generateSummaryTable = (doc, hoursWorked) => {
  const tableTop = doc.y + 20
  let tableY = tableTop

  doc.fontSize(12).text(' ', 50, tableY)
  doc.text('Semana', 150, tableY)
  doc.text('Fin de Semana', 250, tableY)
  doc.text('Feriado', 350, tableY)
  doc
    .moveTo(50, tableY + 15)
    .lineTo(500, tableY + 15)
    .stroke()

  tableY += 25
  doc.text('Total', 50, tableY)
  doc.text(hoursWorked.total_week, 150, tableY)
  doc.text(hoursWorked.total_weekend, 250, tableY)
  doc.text(hoursWorked.total_holiday, 350, tableY)

  tableY += 25
  doc.text('Regular', 50, tableY)
  doc.text(hoursWorked.regular_week, 150, tableY)
  doc.text(hoursWorked.regular_weekend, 250, tableY)

  tableY += 25
  doc.text('Extra', 50, tableY)
  doc.text(hoursWorked.extra_week, 150, tableY)
  doc.text(hoursWorked.extra_weekend, 250, tableY)
}
