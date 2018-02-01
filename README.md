# TODOS API

## ENDPOINTS

## home

Example

```
GET /
```

200 Response

```
Welcome to the ToDos API
```

## Create a todo

```
POST /todos
```

Example

Create a todo by sending the todo as a json string in the request body. The `text` is required. `completed` property is option. If omitted `complete` will default to `false`.

```
POST /todos

{
  text: "Eat tacos",
  completed: false
}
```

201 Created

```
{
  id: 4,
  text: "Eat tacos",
  completed: false
}
```

## Retrieve a todo

```
GET /todos/:id
```

Example

```
GET /todos/4
```

200 Response

```
{
  id: 4,
  text: "Eat tacos",
  completed: false
}
```

## Update a todo

```
PUT /todos/:id
```

Example

Update a todo by sending the todo as a json string in the request body. The `text` is required. `completed` property is required.

We ate a taco bell for lunch and ate tacos so let's check this todo item off our list.

```
PUT /todos/4

{
  id: 4,
  text: "Eat tacos",
  completed: true
}
```

200 OK

```
{
  id: 4,
  text: "Eat tacos",
  completed: true
}
```

## Delete a todo

```
DELETE /todos/:id
```

Example

```
DELETE /todos/4
```

200 OK

```
{ok: true}
```

## GET todos (LIST)

```
GET /todos
```

200 Response

```
[
  {
    id: 1,
    text: "Wake up",
    completed: true
  },
  {
    id: 2,
    text: "Drink coffee",
    completed: true
  },
  {
    id: 3,
    text: "Teach express",
    completed: false
  }
]
```

## Search todos

Search todos using a search query string `s` providing the todo property and value of the item we wish to search. Matching results include any values that equal or contain the given search criteria.

```
GET /todos?s=<property>:<value>
```

Example

Searching for the word "teach" within a todos `text` property.

```
GET /todos?s=text:teach
```

200 OK

```
[
  {
    id: 3,
    text: "Teach express",
    completed: false
  }
]
```
