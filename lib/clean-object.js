const { pick } = require('ramda')
module.exports = props => obj => pick(props, obj)
