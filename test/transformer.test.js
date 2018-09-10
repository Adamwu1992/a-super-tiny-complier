const transformer = require('../src/transformer')

test(`transformer '(subtract 123 (add 456 "999"))'`, () => {
  const input = {
    type: 'Program',
    body: [
      {
        type: 'CallExpression',
        name: 'subtract',
        params: [{
          type: 'NumberLiteral',
          value: '123',
        }, {
          type: 'CallExpression',
          name: 'add',
          params: [{
            type: 'NumberLiteral',
            value: '456',
          }, {
            type: 'StringLiteral',
            value: '999',
          }]
        }]
      }
    ]
  }

  const expected = {
    type: 'Program',
    body: [{
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'subtract'
        },
        arguments: [{
          type: 'NumberLiteral',
          value: '123'
        }, {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'add'
          },
          arguments: [{
            type: 'NumberLiteral',
            value: '456'
          }, {
            type: 'StringLiteral',
            value: '999',
          }]
        }]
      }
    }]
  }

  expect(transformer(input)).toEqual(expected);
})