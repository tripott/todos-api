const { difference, keys } = require('ramda')

module.exports = requiredFields => data =>
  difference(requiredFields, keys(data))
