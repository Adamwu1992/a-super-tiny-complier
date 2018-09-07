
const traverser = require('./traverser');

/**
 * ============================================================================
 *                                   ⁽(◍˃̵͈̑ᴗ˂̵͈̑)⁽
 *                              THE TRANSFORMER!!!
 * ============================================================================
 */

/**
 * 接下来是转换，我们的转换器(transformer)将把我们刚才生成的AST传递给`traverser`
 * 并且使用一个`visotor`来构建一个新的AST
 *
 * ----------------------------------------------------------------------------
 *   Original AST                     |   Transformed AST
 * ----------------------------------------------------------------------------
 *   {                                |   {
 *     type: 'Program',               |     type: 'Program',
 *     body: [{                       |     body: [{
 *       type: 'CallExpression',      |       type: 'ExpressionStatement',
 *       name: 'add',                 |       expression: {
 *       params: [{                   |         type: 'CallExpression',
 *         type: 'NumberLiteral',     |         callee: {
 *         value: '2'                 |           type: 'Identifier',
 *       }, {                         |           name: 'add'
 *         type: 'CallExpression',    |         },
 *         name: 'subtract',          |         arguments: [{
 *         params: [{                 |           type: 'NumberLiteral',
 *           type: 'NumberLiteral',   |           value: '2'
 *           value: '4'               |         }, {
 *         }, {                       |           type: 'CallExpression',
 *           type: 'NumberLiteral',   |           callee: {
 *           value: '2'               |             type: 'Identifier',
 *         }]                         |             name: 'subtract'
 *       }]                           |           },
 *     }]                             |           arguments: [{
 *   }                                |             type: 'NumberLiteral',
 *                                    |             value: '4'
 * ---------------------------------- |           }, {
 *                                    |             type: 'NumberLiteral',
 *                                    |             value: '2'
 *                                    |           }]
 *  (sorry the other one is longer.)  |         }
 *                                    |       }
 *                                    |     }]
 *                                    |   }
 * ----------------------------------------------------------------------------
 */

// 所以我们的transformer方法接受一个AST作为参数
module.exports = function transformer(ast) {

  // 我们创建一个newAst，它和之前的ast有着类似的结构
  const newAst = {
    type: 'Program',
    body: []
  };

  // 接下来我会使用一个hack的方法来作一些小小的弊
  // 我们将在父节点的prototype上使用一个`context`对象
  // 这样我们就可以将节点添加到它们父节点的`context`
  // 一般来说应该有更加抽象的处理方式，但是这样可以让我们用简单的方式达到目的
  //
  // 请注意旧的ast的`context`是新的ast的引用
  ast._context = newAst.body;

  // 我们将把参数`ast`和我们定义的`visitor`作为参数调用`traverser`方法
  traverser(ast, {

    // 第一个visitor的方法接受任何的`NumberLiteral`类型节点
    NumberLiteral: {
      // 我们将在进入节点的时候调用
      enter(node, parent) {
        // 我们将创建一个新的`NumberLiteral`节点
        // 并且将它加入父节点的context.
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value
        });
      }
    },

    // 接下来处理`StringLiteral`
    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value
        });
      }
    },

    // 接下来是`CallExpression`.
    CallExpression: {
      enter(node, parent) {

        // 我们创建一个新的节点`CallExpression`
        // 在里面加一个嵌套对象`Identifier`
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name
          },
          arguments: []
        }

        // 接下里我们会在原始的`CallExpression`节点上再创建一个context
        // 这个context是expression.arguments的引用
        // 这样我们就可以向其中添加节点
        node._context = expression.arguments;

        // 接着我们判断父节点是否是CallExpression类型
        // 如果不是的话...
        if (parent.type !== 'CallExpression') {

          // 我们将要用一个`ExpressionStatement`类型的节点来包裹我们的`CallExpression`节点
          // 我们这么做是因为JavaScript中的顶级`CallExpression`实际上是语句(statement)
          expression = {
            type: 'ExpressionStatement',
            expression: expression
          };
        }

        // 最后，我们将expression(有可能是被包裹过的)添加到父节点的context中
        parent._context.push(expression);
      }
    }
  });

  // 在最后，返回我们创建的newAst
  return newAst;
}