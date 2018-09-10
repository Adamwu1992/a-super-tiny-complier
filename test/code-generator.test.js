const codeGenerator = require('../src/code-generator')

test(`code-generator '(subtract 123 (add 456 "999"))'`, () => {
  const input = {
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

  const expected = 'subtract(123, add(456, "999"));'

  expect(codeGenerator(input)).toBe(expected);
})