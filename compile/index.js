/** 
 * @class 指令解析类 Compile, 解析指令初始化视图
 */
class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
      this.compileElement(this.$el);
    }
  };
  compileElement(el) {
    let self = this;
    let childNodes = el.childNodes;
    // 截取（更重要的是获取，slice是得到子数组）函数的参数，然后让arguments等“伪数组”也可以使用数组的各种方法
    [].slice.call(childNodes).forEach(node => {
      let text = node.textContent;
      // 筛选 {{ }}
      let reg = /\{\{((?:.|\n)+?)\}\}/;
      // 如果是element节点
      if (self.isElementNode(node)) {
        self.compile(node);
      }
      // 如果是text节点
      else if (self.isTextNode(node) && reg.test(text)) {
        // 匹配第一个选项
        self.compileText(node, RegExp.$1.trim());
      }
      // 解析子节点包含的指令, 递归
      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node);
      }
    });
  };
  // 指令解析 ls-xxx
  compile(node) {
    let self = this;
    let nodeAttrs = node.attributes;  // 获取元素节点上的所有属性对象
    // 遍历属性对象, 提取其中的 mvvm 指令(ls-xxx: value)
    [].slice.call(nodeAttrs).forEach(attr => {
      let attrName = attr.name; // 属性名( class, id, ls-xxx.....)
      // 过滤 ls-xxx 指令
      if (self.isDirective(attrName)) {
        var exp = attr.value; // ls-xxx: 123, 获取属性值 '123'
        node.innerHTML = typeof self.$vm[exp] === 'undefined' ? '' : self.$vm[exp];
        node.removeAttribute(attrName); // 移除指令属性
      }
    })
  };
  // {{ test }} 匹配变量 test 
  compileText(node, exp) {
    node.textContent = typeof this.$vm[exp] === 'undefined' ? '' : this.$vm[exp];
  };
  // 判断是否为element 节点
  isElementNode(node) {
    return node.nodeType === 1
  };
  // 判断是否为text节点
  isTextNode(node) {
    return node.nodeType === 3
  };
  // ls-XXX指令判定
  isDirective(attr) {
    return attr.indexOf('ls-') === 0;
  }
}

// export default Compile;