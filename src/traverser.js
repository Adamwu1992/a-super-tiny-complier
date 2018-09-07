/**
 * ============================================================================
 *                                 ⌒(❀>◞౪◟<❀)⌒
 *                               THE TRAVERSER!!!
 * ============================================================================
 */


/**
 * 目前为止，我们已经得到了AST
 * 现在我们想通过一个访问者对象(visitor)来访问不同的节点
 * 当我们在AST上遇到一个匹配的节点时，我们要能够调用到visitor的相应的方法
 * 
 *   traverse(ast, {
 *     Program: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *
 *     CallExpression: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *
 *     NumberLiteral: {
 *       enter(node, parent) {
 *         // ...
 *       },
 *       exit(node, parent) {
 *         // ...
 *       },
 *     },
 *   });
 */

// 所以我们定义了一个遍历方法，接受AST和visitor
// 我们将在内部定义两种方法
module.exports = function traverser(ast, visitor) {

  // traverseArray方法允许我们迭代一个数组
  // 并且对数组的每个对象调用我们定义的另一个方法traverseNode
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  // traverseNode方法接受一个节点和它的父节点，以便我们能将他们都传递给visitor
  function traverseNode(node, parent) {

    // 我们首先通过节点的type来检查visitor上是否有相应的方法
    let methods = visitor[node.type];

    // 如果这个节点的处理方法中，存在enter方法，我们在此时调用，将节点和父节点都传给它
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    // 接下来我们根据节点的类型来区分处理
    switch(node.type) {

      // 我们将从顶层的`Program`节点开始
      // 因为`Program`节点总是用一个数组类型的属性`body`，所以我们将用`traverseArray`来处理它
      //
      // （请记住，`traverseArray`将依次调用`traverseNode`，因此我们正在使树以递归方式遍历）
      case 'Program': traverseArray(node.body, node); break;

      // 接下来我们处理`CallExpression`，遍历它们的`params`属性
      case 'CallExpression': traverseArray(node.params, node); break;

      // 在`NumberLiteral`和`StringLiteral`的情况下，我们没有任何子节点需要处理，所以直接跳过
      case 'NumberLiteral':
      case 'StringLiteral':
        break;

      // 最后按照惯例，如果识别不出这个节点将抛出一个错误
      default:
        throw new TypeError(node.type);
    }

    // 同样的，如果存在exit方法，那么在此时调用
    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  // 最后，我们把AST作为第一个节点传递给`traverseNode`来启动这个遍历过程
  // 此时没有父节点所以第二个参数为null
  traverseNode(ast, null);
}