const babel = require('babel-core');
// const path = require('path');
// const fs = require('fs')

// let testFilePath = path.resolve(__dirname, './test.js');
// let testFileStr = fs.readFileSync(testFilePath)

let result = babel.transform("var a = 'test-a';")

console.log('转换前：' + result.code)

const transAst = (ast) => {
  let newAst = JSON.parse(JSON.stringify(ast))
  let body = newAst.program.body
  let nodeLen = newAst.program.body.length
  
  // 对应节点进行转换
  function transNode (node) {
    let nodeType = node.type
    let transMethods = {
      'VariableDeclaration': () => {
        node.kind = 'const'
      },
      'VariableDeclarator': () => {
        node.id.name = 'b'
        node.init.value = 'test-b'
      }
    }

    if (node.declarations) {
      transNode(node.declarations[0])
    }

    if (transMethods[nodeType]) {
      transMethods[nodeType]()
    }
  }

  if (nodeLen > 0) {
    for (let nodeIdx = 0; nodeIdx < nodeLen; nodeIdx++) {
      transNode(body[nodeIdx])
    }
  }

  return newAst
}

// 将新的ast转换成代码
let code = babel.transformFromAst(transAst(result.ast)).code

console.log('转换后：' + code)