/**
 * ============================================================================
 *                                 ヽ/❀o ل͜ o\ﾉ
 *                                THE PARSER!!!
 * ============================================================================
 */

/**
 * 对于parser来说，要做的就是把tokens转化成AST
 *
 *   [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */

// 首先，定义一个parser函数，接受tokens作为参数 
module.exports = function parser(tokens) {

  // 我们仍旧是使用current变量作为指针
  let current = 0;

  // 这里我们要用递归处理而不是whle循环，所以先定义一个递归函数
  function walk() {

    // 在walk里面，我们根据current获取到当前对应的标记
    let token = tokens[current];
    
    // 我们把每种类型的token都分成不同的代码路径
    // 先从number类型的开始
    //
    // 检查是否是number类型
    if (token.type === 'number') {
      // 如果是 移动current指针1位
      current += 1;

      // 我们将要返回的AST节点名叫`NumberLiteral`
      // 并且我们将token的value作为节点的value
      return {
        type: 'NumberLiteral',
        value: token.value,
      }
    }

    // 如果遇到的string类型的token，处理流程和上面一样，返回的节点被称作`StringLiteral`
    if (token.type === 'string') {
      current += 1;

      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }

    // 接下来我们要寻找`CallExpression`类型的节点。
    // 如果遇到了开括号表示我们找到了
    if (token.type === 'paren' && token.value === '(') {

      // 我们移动1位指针来跳过开括号这个token，因为在构建的AST中它并不重要
      token = tokens[++current];

      // 我们先创建一个`CallExpression`类型的基础节点
      // 将token的value作为节点的name，因为紧跟着开括号的token就是function的name
      let node = {
        type: 'CallExpression',
        name: token.value,
        params: []
      };

      // 我们再次移动1位指针，跳过name这个token
      token = tokens[++current];

      // 接下来我们要循环之后的每一个token作为节点的params
      // 直到我们遇到对应的闭括号为止
      //
      // 这里就显示出递归的作用了，我们借助递归来处理这种未知层数嵌套的场景，而不是直接去一个个访问
      //
      // 为了更好的表述，我们来看下我们的Lisp代码，我们可以看到
      // `add`方法的参数是一个数字和一个嵌套的`CallExpression`，它也有自己的参数
      //
      //   (add 2 (subtract 4 2))
      //
      // 你也一定注意到我们的tokens数组里存在多个闭括号标记
      //
      //   [
      //     { type: 'paren',  value: '('        },
      //     { type: 'name',   value: 'add'      },
      //     { type: 'number', value: '2'        },
      //     { type: 'paren',  value: '('        },
      //     { type: 'name',   value: 'subtract' },
      //     { type: 'number', value: '4'        },
      //     { type: 'number', value: '2'        },
      //     { type: 'paren',  value: ')'        }, <<< 闭括号
      //     { type: 'paren',  value: ')'        }, <<< 闭括号
      //   ]
      //
      // 我们会嵌套地使用walk函数去移动current指针，访问任何嵌套的CallExpression
      
      // 所以我们创建了一个while循环来访问token
      // 一直到我们遇到一个类型为paren，且value是闭括号的token才停止
      while(
        (token.type !== 'paren') ||
        (token.type === 'paren' && token.value !== ')')
      ) {
        // 我们通过walk生成node，并且添加到params中
        node.params.push(walk());
        // current在上面的walk中已经被移动到它应该在的地方了
        // 我们把此时current对应的token取出来，判断我们是否应该停止这个循环
        token = tokens[current];
      }

      // 最后我们还要再次移动current来跳过最后的闭括号token
      current += 1;

      // 返回生成的node
      return node;
    }

    // 如果我们如法识别这个token，我们就会抛出一个错误
    throw new TypeError(token.type);
  }

  // 现在 我们来创建AST 它的根节点是一个类型为Program的节点
  const ast = {
    type: 'Program',
    body: []
  };

  // 我们将要启动我们的walk函数了，将生成的节点添加到ast.body里

  // 我们在循环里做是因为CallExpression除了嵌套的场景，还有可能是并列的
  //
  //   (add 2 2)
  //   (subtract 4 2)
  //
  while(current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}