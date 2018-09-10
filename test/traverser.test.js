const traverser = require('../src/traverser');

const tracer = ast => {
  let result = [];
  traverser(ast, {
    Program: {
      enter() {
        result.push({
          action: 'enter',
          type: 'Program'
        });
      },
      exit() {
        result.push({
          action: 'exit',
          type: 'Program'
        });
      }
    },

    CallExpression: {
      enter(node) {
        result.push({
          action: 'enter',
          type: 'CallExpression',
          name: node.name
        })
      },
      exit(node) {
        result.push({
          action: 'exit',
          type: 'CallExpression',
          name: node.name
        })
      }
    },

    NumberLiteral: {
      enter(node) {
        result.push({
          action: 'enter',
          type: 'NumberLiteral',
          value: node.value
        })
      },
      exit(node) {
        result.push({
          action: 'exit',
          type: 'NumberLiteral',
          value: node.value
        })
      }
    },

    StringLiteral: {
      enter(node) {
        result.push({
          action: 'enter',
          type: 'StringLiteral',
          value: node.value
        })
      },
      exit(node) {
        result.push({
          action: 'exit',
          type: 'StringLiteral',
          value: node.value
        })
      }
    }
  });

  return result;
}

test(`traverser '(subtract 123 (add 456 "999"))'`, () => {
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
  const expected = [
    { action: 'enter', type: 'Program' },
    { action: 'enter', type: 'CallExpression', name: 'subtract' },
    { action: 'enter', type: 'NumberLiteral', value: '123' },
    { action: 'exit', type: 'NumberLiteral', value: '123' },
    { action: 'enter', type: 'CallExpression', name: 'add' },
    { action: 'enter', type: 'NumberLiteral', value: '456' },
    { action: 'exit', type: 'NumberLiteral', value: '456' },
    { action: 'enter', type: 'StringLiteral', value: '999' },
    { action: 'exit', type: 'StringLiteral', value: '999' },
    { action: 'exit', type: 'CallExpression', name: 'add' },
    { action: 'exit', type: 'CallExpression', name: 'subtract' },
    { action: 'exit', type: 'Program' },
  ]

  expect(tracer(input)).toEqual(expected);
})