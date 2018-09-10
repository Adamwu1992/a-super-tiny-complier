const parser = require('../src/parser');

test(`parser '123'`, () => {
  const input = [{ type: 'number', value: '123'}];
  const expected = {
    type: 'Program',
    body: [{
      type: 'NumberLiteral',
      value: '123',
    }]
  };
  expect(parser(input)).toEqual(expected);
});

test(`tokenizer '123 456'`, () => {
  const input = [
    { type: 'number', value: '123'},
    { type: 'number', value: '456'}
  ];
  const expected = {
    type: 'Program',
    body: [{
      type: 'NumberLiteral',
      value: '123',
    }, {
      type: 'NumberLiteral',
      value: '456',
    }]
  }
  expect(parser(input)).toEqual(expected);
});

test(`tokenizer '(add 123 456)'`, () => {
  const input = [
    { type: 'paren', value: '(' },
    { type: 'name', value: 'add' },
    { type: 'number', value: '123'},
    { type: 'number', value: '456'},
    { type: 'paren', value: ')' }
  ];
  const expected = {
    type: 'Program',
    body: [
      {
        type: 'CallExpression',
        name: 'add',
        params: [{
          type: 'NumberLiteral',
          value: '123',
        }, {
          type: 'NumberLiteral',
          value: '456',
        }]
      }
    ]
  }
  expect(parser(input)).toEqual(expected);
});

test(`tokenizer '(subtract 123 (add 456 "999"))'`, () => {
  const input = [
    { type: 'paren', value: '(' },
    { type: 'name', value: 'subtract' },
    { type: 'number', value: '123'},
    { type: 'paren', value: '(' },
    { type: 'name', value: 'add' },
    { type: 'number', value: '456'},
    { type: 'string', value: '999'},
    { type: 'paren', value: ')' },
    { type: 'paren', value: ')' }
  ];
  const expected = {
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
  expect(parser(input)).toEqual(expected);
});