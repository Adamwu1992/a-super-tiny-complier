const tokenizer = require('../src/tokenizer');

test(`tokenizer '123'`, () => {
  const input = '123';
  const expected = [{ type: 'number', value: '123'}];
  expect(tokenizer(input)).toEqual(expected);
});

test(`tokenizer '123 456'`, () => {
  const input = '123 456';
  const expected = [
    { type: 'number', value: '123'},
    { type: 'number', value: '456'}
  ];
  expect(tokenizer(input)).toEqual(expected);
});

test(`tokenizer '(123 456)'`, () => {
  const input = '(123 456)';
  const expected = [
    { type: 'paren', value: '(' },
    { type: 'number', value: '123'},
    { type: 'number', value: '456'},
    { type: 'paren', value: ')' },
  ];
  expect(tokenizer(input)).toEqual(expected);
});

test(`tokenizer '(add 123 456)'`, () => {
  const input = '(add 123 456)';
  const expected = [
    { type: 'paren', value: '(' },
    { type: 'name', value: 'add' },
    { type: 'number', value: '123'},
    { type: 'number', value: '456'},
    { type: 'paren', value: ')' }
  ];
  expect(tokenizer(input)).toEqual(expected);
});

test(`tokenizer '(add 123 "456")'`, () => {
  const input = '(add 123 "456")';
  const expected = [
    { type: 'paren', value: '(' },
    { type: 'name', value: 'add' },
    { type: 'number', value: '123'},
    { type: 'string', value: '456'},
    { type: 'paren', value: ')' }
  ];
  expect(tokenizer(input)).toEqual(expected);
});

test(`tokenizer '(subtract 123 (add 456 "999"))'`, () => {
  const input = '(subtract 123 (add 456 "999"))';
  const expected = [
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
  expect(tokenizer(input)).toEqual(expected);
});