import chalk from 'chalk'

const log = console.log

const success = (msg) => {
  log(`\n${chalk.green.bold.underline('✔ Success:')} ${chalk.green(msg)}`)
}

const warning = (msg) => {
  log(`\n${chalk.yellow.bold.underline('⚠️ Warning:')} ${chalk.yellow(msg)}`)
}

const info = (msg) => {
  log(`\n${chalk.blue.bold.underline('ℹ️  Info:')} ${chalk.blue(msg)}`)
}

const error = (msg) => {
  log(`\n${chalk.red.bold.underline('❌ Error:')} ${chalk.red(msg)}`)
}

export default { success, warning, info, error }
