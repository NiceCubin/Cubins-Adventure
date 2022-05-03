module.exports = {
  invalid: description => ({
    title: 'Oops!',
    description,
    color: 'RED'
  }),
  
  error: description => ({
    title: 'Error...',
    description,
    color: 'RED'
  }),
  
  timeout: description => ({
    title: 'Timeout!',
    description,
    color: 'RED'
  }),
  
  win: description => ({
    title: 'You Won!',
    description,
    color: 0xFF00FF
  }),
  
  lose: description => ({
    title: 'You Lost...',
    description,
    color: 0xFF0000
  })
}