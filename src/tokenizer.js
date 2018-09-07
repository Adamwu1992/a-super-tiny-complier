
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

    // 接下来我们要检查字符是否是一个闭括号。
    // 我们做的事情和之前一样：检测到一个闭括号；添加一个token；移动current；continue；
    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')'
      });
      current += 1;
      continue;
    }

    // 继续，我们将要检测空白字符。
    // 我们依靠空白字符来区分单词，但是我们却不需要把他们存储为token
    // 所以我们要剔除掉空白字符。
    //
    // 我们检查当前字符是否是空白字符，如果是的话，就移动指针到下一个字符
    const WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current += 1;
      continue;
    }

    // 接下来一个记号类型是number
    // 和之前的都不一样，一个number可以是任意数量的字符组成的
    // 我们需要捕获所有的字符，把他们记为一个token
    //
    //   (add 123 456)
    //        ^^^ ^^^
    //        Only two separate tokens
    //
    // 当我们遇到一个序列中的第一个数字时进入下面的流程
    const NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      // value变量用来存储我们检测到的符合条件的字符
      let value = '';

      // 接着我们通过移动current指针循环访问这个序列中每一个字符
      // 把每一个数字添加到value变量中
      // 直到遇到一个不是数字的字符为止
      while(NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }
      // 添加一个number类型的token
      tokens.push({ type: 'number', value });
      // 移动指针继续循环
      continue;
    }

    // 我们将添加对处理字符串的支持
    // 字符串指的是被双引号包裹的字符
    //
    //   (concat "foo" "bar")
    //            ^^^   ^^^ string tokens
    //
    // 所以我们从检测双引号开始
    if (char === '"') {
      // 声明一个变量来构建string类型token的value字段
      let value = '';
      
      // 首先我们跳过双引号，访问字符串的第一个字符
      char = input[++current];

      // 我们将持续迭代每一个字符
      // 直到遇到另一个双引号为止
      while (char !== '"') {
        value += char;
        char = input[+current];
      }
      // 跳过关闭的双引号
      char = input[++current];

      // 添加一个string类型的token
      tokens.push({ type: 'string', value });

      continue;
    }

    // 最后一种token的类型是name，这是一个非数字字符组成的序列
    // 在Lisp的语法中表示names或者functions
    //
    //   (add 2 4)
    //    ^^^
    //    Name token
    //
    const LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = '';

      // 我们仍然是循环整个序列并且把每个字符都保存到value中
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // 添加一个name类型的token 移动指针
      tokens.push({ type: 'name', value });

      continue;
    }

    // 最后，如果有字符不符合以上所有的条件
    // 我们将抛出一个错误并且退出
    throw new TypeError('I dont know what this character is: ' + char);
  }

  // 最后我们的标记生成器(tokenizer)将保存标记的数组tokens作为返回结果
  return tokens;
}