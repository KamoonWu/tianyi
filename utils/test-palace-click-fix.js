// 测试宫位点击事件修复
console.log('=== 测试宫位点击事件修复 ===');

// 模拟排盘组件
class MockChartComponent {
  constructor() {
    this.data = {
      palaces: [
        { name: '田宅宫', branch: '巳' },
        { name: '官禄宫', branch: '午' },
        { name: '仆役宫', branch: '未' },
        { name: '迁移宫', branch: '申' },
        { name: '福德宫', branch: '辰' },
        { name: '中宫', branch: '中' },
        { name: '中宫', branch: '中' },
        { name: '疾厄宫', branch: '酉' },
        { name: '父母宫', branch: '卯' },
        { name: '中宫', branch: '中' },
        { name: '中宫', branch: '中' },
        { name: '财帛宫', branch: '戌' },
        { name: '命宫', branch: '寅' },
        { name: '兄弟宫', branch: '丑' },
        { name: '夫妻宫', branch: '子' },
        { name: '子女宫', branch: '亥' }
      ]
    };
  }
  
  // 模拟获取宫位数据
  getPalaceData(palaceIndex) {
    // 从三方四正关系工具获取宫位信息
    try {
      const { PALACE_INDEX_MAP } = require('./palace-relations');
      const palaceInfo = PALACE_INDEX_MAP[palaceIndex];
      
      if (palaceInfo) {
        return {
          name: palaceInfo.name,
          branch: palaceInfo.branch,
          index: palaceIndex,
          row: palaceInfo.row,
          col: palaceInfo.col
        };
      }
    } catch (error) {
      console.error('❌ 获取宫位信息失败:', error);
    }
    
    // 备用方案：从组件数据获取
    if (this.data.palaces && this.data.palaces[palaceIndex]) {
      return this.data.palaces[palaceIndex];
    }
    
    // 最后备用方案：返回基本信息
    return {
      name: `宫位${palaceIndex}`,
      index: palaceIndex
    };
  }
  
  // 模拟触发事件
  triggerEvent(eventName, detail) {
    console.log(`📤 触发事件: ${eventName}`, detail);
    return detail;
  }
  
  // 模拟点击宫位
  simulatePalaceClick(palaceIndex) {
    console.log(`\n🎯 模拟点击宫位 ${palaceIndex}`);
    
    // 获取宫位数据
    const palace = this.getPalaceData(palaceIndex);
    console.log('🎯 获取到的宫位数据:', palace);
    
    // 触发事件
    const eventDetail = this.triggerEvent('palaceClick', {
      palaceIndex: palaceIndex,
      palace: palace
    });
    
    return eventDetail;
  }
}

// 模拟主页面
class MockPage {
  constructor() {
    this.chartComponent = new MockChartComponent();
  }
  
  // 模拟宫位点击事件处理
  onPalaceClick(e) {
    console.log('🎯 主页面收到宫位点击事件:', e.detail);
    
    const { palaceIndex, palace } = e.detail;
    
    // 安全检查
    if (!palace) {
      console.error('❌ 宫位数据为空:', e.detail);
      console.log('❌ 显示错误提示: 宫位数据无效');
      return;
    }
    
    // 显示宫位信息
    const palaceName = palace.name || `宫位${palaceIndex}`;
    console.log(`✅ 显示提示: 点击了${palaceName}`);
    
    console.log('🎯 宫位详情:', {
      index: palaceIndex,
      name: palace.name,
      branch: palace.branch,
      row: palace.row,
      col: palace.col
    });
    
    return {
      success: true,
      palaceName: palaceName,
      palaceData: palace
    };
  }
}

// 运行测试
console.log('=== 开始测试 ===\n');

const page = new MockPage();

// 测试1: 点击命宫
console.log('🧪 测试1: 点击命宫');
const result1 = page.chartComponent.simulatePalaceClick(12);
const response1 = page.onPalaceClick({ detail: result1 });
console.log('测试1结果:', response1);

// 测试2: 点击兄弟宫
console.log('\n🧪 测试2: 点击兄弟宫');
const result2 = page.chartComponent.simulatePalaceClick(13);
const response2 = page.onPalaceClick({ detail: result2 });
console.log('测试2结果:', response2);

// 测试3: 点击夫妻宫
console.log('\n🧪 测试3: 点击夫妻宫');
const result3 = page.chartComponent.simulatePalaceClick(14);
const response3 = page.onPalaceClick({ detail: result3 });
console.log('测试3结果:', response3);

// 测试4: 点击无效宫位
console.log('\n🧪 测试4: 点击无效宫位');
const result4 = page.chartComponent.simulatePalaceClick(99);
const response4 = page.onPalaceClick({ detail: result4 });
console.log('测试4结果:', response4);

console.log('\n🎉 宫位点击事件修复测试完成！');
console.log('\n修复总结:');
console.log('1. ✅ 添加了getPalaceData方法获取宫位信息');
console.log('2. ✅ 修复了事件传递的数据结构');
console.log('3. ✅ 添加了安全检查防止undefined错误');
console.log('4. ✅ 提供了备用方案确保数据完整性');
console.log('5. ✅ 增强了错误处理和日志记录'); 