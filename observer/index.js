import Dep from './dep';

// 数据劫持
function observer(data) {
  if(!data || typeof data !== 'object') {
    return;
  };
  return new Observer(data);
}

/**
 * @class 发布类 Observer that are attached to each observed
 * @param {[type]} data [vm参数]
 */
class Observer {
  constructor(data) {
    this.data = data;
    this.walk(data);
  };
  // 递归遍历 对象的每个属性, 劫持数据变化
  walk(obj) {
    let self = this;
    Object.keys(obj).forEach(key => {
      self.observeProperty(obj, key, obj[key]);
    });
  };
  observeProperty(obj, key, val) {
    /** 
     * 把 val 递归给 observer方法, 
     * val如果是对象,里面还有其他属性,则继续去递归里面的其他属性
     * val若是值类型, observer方法直接返回 undefined 赋值给 childOb 
     */
    let childOb = observer(val);
    // 通过 Object.defineProperty 对obj每个属性进行劫持数据变动, 进行监听
    Object.defineProperty(obj, key, {
      enumerable: true, // 可枚举
      configurable: true, // 可重新定义
      get: () => {
        return val;
      },
      set: (newVal) => {
        // 判断 newVal 是否发生变化
        if(val === newVal || (newVal !== newVal && val !== val)) {
          return;
        }
        // 如果发生变化, 赋值
        val = newVal;
        // 并监听新值的子属性
        childOb = observer(newVal);
        // 通知数据变更...
      }
    })
  }
}

