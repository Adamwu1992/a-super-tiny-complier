
/**
 * 今天我们将一起手写一个编译器。
 * 不是传统意义上的那种编译器，而是一个很小巧的编译器，小到如果不算注释，只有200多行的代码。
 * 
 * 我们将把Lisp风格的函数调用编译成C风格的函数调用。
 * 
 * 如果你不熟悉其中的一种语言风格，这里简单做一下介绍：
 *               Lisp                     C
 * 2 + 2        (add 2 2)                add(2, 2)
 * 4 - 2        (subtract 4 2)           subreact(4, 2)
 * 2 + (4 - 2)  (add 2 (subtract 4 2))   add(2, subtract(4, 2))
 * 很简单是吧？
 * 
 * 很好，这正式我们编译器需要编译的内容。
 * 尽管这不是一个完整的Lisp语法或者C语法的编译器，但是它足够验证许多现代编译器中的重要部分。
 */

/**
 * 大多数编译器分为三个主要的阶段：解析(Parsing)、转换(Transformation)
 * 和代码生成(Code Generation)。
 * 
 * 1.**解析**就是将原始的代码变为一种更加抽象的形式；
 * 
 * 2.**转换**就是处理被解析后的抽象代码，编译器在这个阶段可以做任何想做的事情；
 * 
 * 3.**代码生成**将经过转换的数据再次转换为新的代码。
 */


/**
 * 解析
 * --------
 * 
 * 解析通常分为两个阶段：词法分析(Lexical Analysis)和语法分析(Syntactic Analysis)。
 * 
 * 1.**词法分析**就是将原始的代码经过标记生成器(tokenizer)或者叫词法分析器处理(lexer)，
 *   分割成一种叫做标记(tokens)的东西；
 *   
 *   标记(tokens)是一个由许多小对象组成的数组，每个对象描述了一段孤立的语法。它可以描述
 *   一个数字、一个标签、一个标点、一个操作符等等任何东西。
 * 
 * 2.**语法分析**得到生成的标记(tokens)并将它们格式化成另一种形式，这种形式可以描述语法的
 *   每个部分和它们之前的关系。我们称这种形式为中间代表(intermediate representation)
 *   或者抽象语法树(Abstract Syntax Tree)。
 * 
 *   抽象语法树(Abstract Syntax Tree)或者叫AST，是一个深层嵌套的对象，这种形式方便进一步
 *   处理并且包含了许多信息。
 * 
 * 比如下面的这段代码：
 *   (add 2 (subtract 4 2))
 * 
 * 它的标记应该是这样：
 *   [
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'add'      },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: '('        },
 *     { type: 'name',   value: 'subtract' },
 *     { type: 'number', value: '4'        },
 *     { type: 'number', value: '2'        },
 *     { type: 'paren',  value: ')'        },
 *     { type: 'paren',  value: ')'        },
 *   ]
 * 
 * 对应的AST应该是这样：
 *   {
 *     type: 'Program',
 *     body: [{
 *       type: 'CallExpression',
 *       name: 'add',
 *       params: [{
 *         type: 'NumberLiteral',
 *         value: '2',
 *       }, {
 *         type: 'CallExpression',
 *         name: 'subtract',
 *         params: [{
 *           type: 'NumberLiteral',
 *           value: '4',
 *         }, {
 *           type: 'NumberLiteral',
 *           value: '2',
 *         }]
 *       }]
 *     }]
 *   }
 */


/**
 * 转换
 * --------
 * 
 * 编译器的下一阶段叫做转换。同样地，这个阶段得到解析阶段最后生成AST并且改变它。我们可以把AST
 * 用相同的语言进行处理，或者直接把它转换成另一种语言。
 * 
 * 让我们看看如何转换一棵AST。
 * 
 * 你也许注意到了AST中包含的元素非常的相似，它们都有一个`type`属性，这些元素被叫做
 * 抽象语法树节点(AST Node)。这些节点定义了不同的属性来表示语法树中一段孤立的部分。
 * 
 * 我们可以有一个类型为NumberLiteral的节点：
 *   {
 *     type: 'NumberLiteral',
 *     value: '2',
 *   }
 * 
 * 或者一个CallExpression节点：
 *   {
 *     type: 'CallExpression',
 *     name: 'subtract',
 *     params: [...],
 *   }
 * 
 * 我们所说的转换AST，实际上就是新增/删除/替换这些节点的属性，我们也可以新增一个节点，删除一个节点，
 * 或者把这些节点都留着，根据它们生成一棵新的AST。
 * 
 * 既然我们的目标是一个新的语言，我们将会生成一棵新的、特定于目标语言的AST。
 * 
 * 
 * 遍历(Traversal)
 * --------
 * 
 * 为了能够访问所有的节点，我们需要遍历它们。我们使用深度优先(depth-first)的策略遍历每一个节点。
 *   {
 *     type: 'Program',
 *     body: [{
 *       type: 'CallExpression',
 *       name: 'add',
 *       params: [{
 *         type: 'NumberLiteral',
 *         value: '2'
 *       }, {
 *         type: 'CallExpression',
 *         name: 'subtract',
 *         params: [{
 *           type: 'NumberLiteral',
 *           value: '4'
 *         }, {
 *           type: 'NumberLiteral',
 *           value: '2'
 *         }]
 *       }]
 *     }]
 *   }
 * 
 * 如果遍历上面的这棵树，我们的顺序是：
 *    1.Program - 从树的顶层节点开始遍历
 *    2.CallExpression(add) - 进入到body的第一个元素CallExpression
 *    3.NumberLiteral(2) - 进入到params的第一个元素NumberLiteral
 *    4.CallExpression(subtract) - 进入到params的第二个元素CallExpression
 *    5.NumberLiteral(4) - 再次进入到这个元素的params的第一个子元素NumberLiteral
 *    6.NumberLiteral(2) - 进入到params的第二个子元素NumberLiteral
 * 
 * 如果我们正在直接修改这课AST，而不是重新构建一棵，我们可能会在这里介绍各种抽象的概念，但是我们现在想要做的
 * 只需要访问到每一个节点就够了。
 * 
 * 我之所以用到`访问(visiting)`这个词，是因为这是一种如何在对象结构的元素上表示操作的模式。
 * 
 * 
 * 访问(visiting)
 * --------
 * 
 * 最基本的设想是，我们要创建一个对象`visitor`，它有接受各种类型节点的方法。
 * 
 *   var visitor = {
 *     NumberLiteral() {},
 *     CallExpression() {},
 *   };
 * 
 */


/**
 * 
 */

const tokenizer = require('./src/tokenizer');
const parser = require('./src/parser');
const transformer = require('./src/transformer');
const codeGenerator = require('./src/code-generator');

function log(prefix, msg) {
  console.log(`${prefix} >>>`);
  console.log(msg);
  console.log('<<<');
}

module.exports = function compiler(input) {
  log('input', input);
  const tokens = tokenizer(input);
  log('tokens', tokens);
  const ast = parser(tokens);
  log('ast', ast);
  const newAst = transformer(ast);
  log('new ast', newAst);
  const output = codeGenerator(newAst);
  log('output', output);

  return output;
}