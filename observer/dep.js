let uid = 0;

/**
 * @class 依赖类 Dep, 维护一个数组集合 Watcher(订阅者), 管理订阅者行为, 一旦触发notify, 订阅者就调用自己的update方法
 */
class Dep {
  constructor() {
    this.id = uid++;
    this.subs = [];
  };
  /**
   * [添加订阅者]
   * @param  {[Watcher]} sub [订阅者]
   */
  addSub(sub) {
    this.subs.push(sub);
  };
  /**
   * [移除订阅者]
   * @param  {[Watcher]} sub [订阅者]
   */
  removeSub(sub) {
    let index = this.subs.indexOf(sub);
    if (index !== -1) {
      this.subs.splice(index, 1);
    }
  };
  // 通知数据变更
  notify() {
    this.subs.forEach(sub => {
      sub.update();
    })
  }
}

export default Dep;