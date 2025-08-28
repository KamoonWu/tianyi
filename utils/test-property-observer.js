// 测试属性观察者
console.log('=== 测试属性观察者 ===');

// 模拟微信小程序组件的属性观察者
class PropertyObserverComponent {
  constructor() {
    this.properties = {
      showLines: {
        type: Boolean,
        value: true,
        observer: function(newVal, oldVal) {
          console.log('🔍 showLines属性观察者触发');
          console.log('🔍 旧值:', oldVal);
          console.log('🔍 新值:', newVal);
          console.log('🔍 数据类型:', typeof newVal);
          this.drawChart();
        }
      }
    };
    
    this.data = {};
  }
  
  // 模拟属性更新
  setProperty(name, value) {
    console.log(`📝 设置属性 ${name}: ${value}`);
    
    if (this.properties[name]) {
      const oldVal = this.properties[name].value;
      this.properties[name].value = value;
      
      // 触发观察者
      if (this.properties[name].observer) {
        console.log(`🔄 触发 ${name} 属性观察者`);
        this.properties[name].observer.call(this, value, oldVal);
      }
    }
  }
  
  drawChart() {
    console.log('🎨 drawChart被调用');
    console.log('showLines属性值:', this.properties.showLines.value);
    
    if (this.properties.showLines.value) {
      console.log('✅ 绘制连线');
    } else {
      console.log('❌ 跳过连线绘制');
    }
  }
}

// 测试组件
console.log('=== 开始测试 ===\n');

const component = new PropertyObserverComponent();

console.log('🧪 测试1: 初始状态');
console.log('组件showLines属性:', component.properties.showLines.value);

console.log('\n🧪 测试2: 设置showLines为false');
component.setProperty('showLines', false);

console.log('\n🧪 测试3: 设置showLines为true');
component.setProperty('showLines', true);

console.log('\n🧪 测试4: 再次设置showLines为false');
component.setProperty('showLines', false);

console.log('\n🎉 属性观察者测试完成！');
console.log('如果属性观察者正确触发，说明修复是成功的'); 