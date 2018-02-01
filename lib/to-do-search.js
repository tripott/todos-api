const { compose, contains, split } = require('ramda')

module.exports = search

function textSearch(searchValue, todoTextValue) {
  return compose(contains(searchValue), split(' '))(todoTextValue)
}

function completedSearch(searchValue, completedSearchValue) {
  return searchValue === completedSearchValue.toString()
}

function search(searchProp, searchValue) {
  return function(todo) {
    if (searchProp === 'text') {
      return textSearch(searchValue, todo[searchProp])
    } else if (searchProp === 'completed') {
      return completedSearch(searchValue, todo[searchProp])
    } else {
      return false
    }
  }
}
