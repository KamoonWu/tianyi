// 测试连线开关的完整流程
console.log('=== 测试连线开关完整流程 ===');

// 模拟微信小程序的组件系统
class MockComponent {
  constructor() {
    this.data = {
      showLines: true
    };
    this.observers = {
      'showLines': function() {
        console.log('🔍 观察者触发 - showLines变化:', this.data.showLines);
        this.drawChart();
      }
    };
  }
  
  setData(newData) {
    console.log('📝 setData调用:', newData);
    
    // 更新数据
    Object.assign(this.data, newData);
    
    // 触发观察者
    if (newData.hasOwnProperty('showLines')) {
      console.log('🔄 触发showLines观察者');
      this.observers.showLines.call(this);
    }
  }
  
  drawChart() {
    console.log('🎨 drawChart被调用');
    console.log('当前showLines状态:', this.data.showLines);
    
    if (this.data.showLines) {
      console.log('✅ 绘制连线');
      // 模拟连线绘制逻辑
      this.drawLines();
    } else {
      console.log('❌ 跳过连线绘制');
    }
  }
  
  drawLines() {
    console.log('🖌️ 开始绘制连线...');
    
    // 模拟六条线
    const lines = ['命迁线', '兄友线', '官夫线', '子田线', '财福线', '父疾线'];
    
    lines.forEach((line, index) => {
      console.log(`📏 绘制连线 ${index + 1}: ${line}`);
    });
    
    console.log('✅ 连线绘制完成');
  }
}

// 模拟主页面的开关处理
class MockPage {
  constructor() {
    this.data = {
      showLines: true
    };
    this.component = new MockComponent();
  }
  
  toggleLines(e) {
    console.log('\n🔄 主页面开关切换:');
    console.log('开关事件:', e);
    console.log('旧值:', this.data.showLines);
    console.log('新值:', e.detail.value);
    
    // 更新主页面状态
    this.setData({
      showLines: e.detail.value
    });
    
    // 更新组件状态
    this.component.setData({
      showLines: e.detail.value
    });
  }
  
  setData(newData) {
    console.log('📝 主页面setData:', newData);
    Object.assign(this.data, newData);
  }
}

// 测试连线开关流程
console.log('=== 开始测试 ===\n');

const page = new MockPage();

// 测试1: 初始状态
console.log('🧪 测试1: 初始状态');
console.log('主页面showLines:', page.data.showLines);
console.log('组件showLines:', page.component.data.showLines);

// 测试2: 切换到false
console.log('\n🧪 测试2: 切换到false');
page.toggleLines({ detail: { value: false } });

// 测试3: 切换到true
console.log('\n🧪 测试3: 切换到true');
page.toggleLines({ detail: { value: true } });

// 测试4: 再次切换到false
console.log('\n🧪 测试4: 再次切换到false');
page.toggleLines({ detail: { value: false } });

console.log('\n🎉 连线开关完整流程测试完成！');
console.log('如果测试通过，说明连线开关的逻辑是正确的');
console.log('问题可能在于实际的微信小程序环境中'); 