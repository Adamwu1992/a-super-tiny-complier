
/**
 * ============================================================================
 *                               ヾ（〃＾∇＾）ﾉ♪
 *                            THE CODE GENERATOR!!!!
 * ============================================================================
 */


/**
 * 接下来让我们来到最后一趴：代码生成。
 * 
 * 我们的代码生成器将会递归的调用自身，将语法树的每一个节点逐个打印成一个巨大的字符串。
 */

module.exports = function codeGenerator(node) {

  // 我们根据node的类型将流程拆分开
  switch(node.type) {

    // 如果我们得到了一个`Program`类型的节点
    // 那么我们会将它`body`中的每一个元素作为节点传入我们的代码生成器
    // 最后再把转化后的`body`数组通过换行符'\n'转换成字符串
    case 'Program':
      return node.body.map(codeGenerator).join('\n');
    
    // 对应`ExpressionStatement`类型的节点，我们将会对其嵌套的expression调用代码生成器
    // 并且在结尾加上分号  
    case 'ExpressionStatement':
      return `${codeGenerator(node.expression)};`;
    
    // 对应`CallExpression`节点，我们首先会添加一个开括号
    // 再将arguments中的每一个元素传入生成器，通过逗号将结果转化为字符串
    // 再添加闭括号
    case 'CallExpression':
      return (
        codeGenerator(node.callee) +
        '(' +
        node.arguments.map(codeGenerator).join(', ') +
        ')'
      );
    
    // 对于`Identifier`节点我们直接返回name属性
    case 'Identifier':
      return node.name;
    
    // 对于`NumberLiteral`节点我们直接返回value属性
    case 'NumberLiteral':
      return node.value;

    // 对于`StringLiteral`节点，我们将其value属性用双引号包裹后返回
    case 'StringLiteral':
      return `"${node.value}"`;

    // 最后 如果我们无法识别节点 抛出一个错误
    default:
      throw new TypeError(node.type);
  }
}