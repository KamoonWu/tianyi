// 简单测试：组件的基本功能
console.log('=== 简单测试：组件的基本功能 ===');

// 模拟微信小程序组件的简化版本
class SimpleComponent {
  constructor() {
    this.properties = {
      showLines: {
        type: Boolean,
        value: false
      }
    };
    
    this.data = {
      showLines: false
    };
    
    this.observers = {
      'showLines': function() {
        console.log('🔍 showLines观察者触发');
        console.log('当前showLines值:', this.data.showLines);
        this.drawChart();
      }
    };
  }
  
  // 模拟属性更新
  updateProperty(name, value) {
    console.log(`📝 更新属性 ${name}: ${value}`);
    
    if (this.properties[name]) {
      this.data[name] = value;
      
      // 触发观察者
      if (this.observers[name]) {
        console.log(`🔄 触发 ${name} 观察者`);
        this.observers[name].call(this);
      }
    }
  }
  
  drawChart() {
    console.log('🎨 drawChart被调用');
    console.log('showLines状态:', this.data.showLines);
    
    if (this.data.showLines) {
      console.log('✅ 绘制连线');
    } else {
      console.log('❌ 跳过连线绘制');
    }
  }
}

// 测试组件
console.log('=== 开始测试 ===\n');

const component = new SimpleComponent();

console.log('🧪 测试1: 初始状态');
console.log('组件showLines:', component.data.showLines);

console.log('\n🧪 测试2: 更新showLines为true');
component.updateProperty('showLines', true);

console.log('\n🧪 测试3: 更新showLines为false');
component.updateProperty('showLines', false);

console.log('\n🧪 测试4: 再次更新showLines为true');
component.updateProperty('showLines', true);

console.log('\n🎉 简单组件测试完成！');
console.log('如果观察者正确触发，说明组件逻辑是正确的'); 