module.exports = {
  invalid: description => ({ title: 'Oops!', description, color: 'RED' }),
  error: description => ({ title: 'Error...'', description, color: 'RED' }),
  win: description => ({ title: 'You Won!', description, color: 0x00ff00 }),
  lose: description => ({ title: 'You Lost...', description, color: 0xff0000 }),
  timeout: description => ({ title: 'Timeout!', description, color: 'RED' })
}