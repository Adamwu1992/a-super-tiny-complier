const compiler = require('./index')

test(`compiler '(subtract 123 (add 456 "999"))'`, () => {
  const input = '(subtract 123 (add 456 "999"))';
  const expected = 'subtract(123, add(456, "999"));';

  expect(compiler(input)).toBe(expected);
})