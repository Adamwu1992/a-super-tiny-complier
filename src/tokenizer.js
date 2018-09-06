
/**
 * ============================================================================
 *                                   (/^▽^)/
 *                                THE TOKENIZER!
 * ============================================================================
 */

/**
 * 我们将从编译器的第一部分开始，词法分析，借助于标记生成器(tokenizer)。
 * 
 * 我们会得到一个代码字符串，我们要做的时把它变成一个标记组成的数组。
 * 
 *   (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]
 */

// 从获取一段代码字符串开始，我们需要做两件事情...
module.exports = function tokenizer(input) {

  // 类似一个指针，负责追踪我们在代码里的位置
  let current = 0;

  // 负责存储生成的标记
  const tokens = [];

  // 我们创建了一个while循环，通过增加current来深入这个循环。
  // 因为input可以是任意长度的，我们需要在一个单循环内增加current很多次
  while(current < input.length) {

    // 把当前的字符储存下来
    let char = input[current];

    // 我们首先需要检查这个字符是否是一个开括号。这个后面将用于构建`CallExpression`
    // 对象，但是现在我们仅仅只关心这个字符。
    //
    // 是否是开括号：
    if (char === '(') {

      // 如果是的话，我们推入一个`paren`类型的标记，并且把它的值设为`(`
      tokens.push({
        type: 'paren',
        value: '('
      });

      // 移动指针
      current += 1;

      // 进入到下一个循环
      continue;
    }

    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')'
      });
      current += 1;
      continue;
    }

    const WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current += 1;
      continue;
    }

    const NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = '';
      while(NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: 'number', value });

      continue;
    }

    if (char === '"') {
      let value = '';
      char = input[++current];
      while (char !== '"') {
        value += char;
        char = input[+current];
      }
      char = input[++current];

      tokens.push({ type: 'string', value });

      continue;
    }

    const LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = '';
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: 'name', value });

      continue;
    }

    throw new TypeError('I dont know what this character is: ' + char);
  }

  return tokens;
}