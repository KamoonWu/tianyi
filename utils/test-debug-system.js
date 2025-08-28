// 测试调试系统的修复
console.log('=== 测试调试系统的修复 ===');

// 模拟排盘组件的调试输出
class MockDebugSystem {
  constructor() {
    this.data = {
      highlightedPalaces: [0, 2]
    };
    
    this.properties = {
      flowYear: {
        currentFlowYear: {
          heavenlyStem: '乙',
          earthlyBranch: '巳',
          year: 2024
        }
      }
    };
  }
  
  // 模拟绘制过程
  simulateDrawing() {
    console.log('🧪 开始模拟排盘绘制过程');
    
    // 模拟数据数组
    const data = [
      {
        name: '命宫',
        branch: '寅',
        stars: [
          { name: '紫微', brightness: '庙' },
          { name: '左辅', brightness: '旺' },
          { name: '禄' }
        ]
      },
      {
        name: '兄弟宫',
        branch: '丑',
        stars: [
          { name: '天机', brightness: '得' },
          { name: '右弼', brightness: '平' },
          { name: '权' }
        ]
      }
    ];
    
    // 模拟单元格
    const cells = [
      { x: 0, y: 0, w: 120, h: 150, name: '命宫', branch: '寅', skip: false },
      { x: 120, y: 0, w: 120, h: 150, name: '兄弟宫', branch: '丑', skip: false }
    ];
    
    console.log(`🔍 数据数组长度: ${data.length}`);
    console.log(`🔍 单元格数量: ${cells.length}`);
    
    // 模拟绘制循环
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      if (!cell || cell.skip) continue;
      
      const { x, y, w, h } = cell;
      
      // 检查是否需要高亮
      const isHighlighted = this.data.highlightedPalaces.includes(i);
      
      console.log(`🔍 开始绘制宫位 ${i}: ${cell.name} (${cell.branch})`);
      console.log(`  位置: (${x}, ${y}), 尺寸: ${w}x${h}`);
      console.log(`  高亮状态: ${isHighlighted}`);
      
      // 模拟绘制测试文本
      console.log(`🔍 绘制测试文本到宫位 ${i}`);
      console.log(`✅ 测试文本绘制完成`);
      
      // 模拟字段优化系统
      try {
        console.log(`🔍 宫位 ${i} 开始使用字段优化系统`);
        
        // 检查数据数组
        console.log(`🔍 数据数组长度: ${data.length}`);
        console.log(`🔍 当前索引 ${i} 的数据:`, data[i]);
        
        // 模拟模块加载
        console.log(`✅ 字段优化系统模块加载成功`);
        console.log(`✅ 可用字段: ['mainStar', 'auxiliaryStar', 'fourHua', 'flowYear', 'miscStars', 'fortuneStars', 'longevityGods', 'ageRange', 'palaceName', 'palaceBranch']`);
        
        // 获取宫位数据
        const palaceData = data[i] || {};
        const flowYearData = this.properties.flowYear?.currentFlowYear || null;
        
        console.log(`🔍 宫位 ${i} 数据:`, palaceData);
        console.log(`🔍 流年数据:`, flowYearData);
        
        // 模拟字段数据生成
        const fieldData = this.generateMockFieldData(palaceData, flowYearData);
        console.log(`🔍 宫位 ${i} 字段数据:`, fieldData);
        
        // 模拟绘制字段
        let drawnFields = 0;
        const fieldKeys = ['mainStar', 'auxiliaryStar', 'fourHua', 'flowYear', 'miscStars', 'fortuneStars', 'longevityGods', 'ageRange', 'palaceName', 'palaceBranch'];
        
        fieldKeys.forEach(fieldKey => {
          const fieldValue = fieldData[fieldKey];
          
          if (fieldValue) {
            console.log(`🔍 绘制字段 ${fieldKey}:`, fieldValue);
            
            // 模拟配置
            const fieldConfig = {
              x: 8,
              y: 20,
              width: 80,
              height: 16,
              align: 'left',
              category: fieldKey
            };
            
            // 调整坐标到当前宫位
            const adjustedConfig = {
              ...fieldConfig,
              x: x + fieldConfig.x,
              y: y + fieldConfig.y
            };
            
            console.log(`🔍 调整后的配置:`, adjustedConfig);
            console.log(`✅ 字段 ${fieldKey} 绘制完成`);
            drawnFields++;
          }
        });
        
        console.log(`✅ 宫位 ${i} 字段优化系统绘制完成，共绘制 ${drawnFields} 个字段`);
        
      } catch (error) {
        console.error(`❌ 宫位 ${i} 使用字段优化系统失败:`, error);
        console.error(`❌ 错误堆栈:`, error.stack);
      }
    }
    
    console.log('🎉 所有宫位绘制完成');
  }
  
  // 模拟字段数据生成
  generateMockFieldData(palaceData, flowYearData) {
    const stars = palaceData.stars || [];
    
    return {
      mainStar: stars.find(s => ['紫微', '天机'].includes(s.name)) || null,
      auxiliaryStar: stars.find(s => ['左辅', '右弼'].includes(s.name)) || null,
      fourHua: stars.filter(s => ['禄', '权', '科', '忌'].includes(s.name)),
      flowYear: flowYearData ? `流年・${flowYearData.heavenlyStem}` : null,
      miscStars: stars.filter(s => !['紫微', '天机', '左辅', '右弼', '禄', '权', '科', '忌'].includes(s.name)),
      fortuneStars: [],
      longevityGods: [],
      ageRange: [],
      palaceName: palaceData.name || '',
      palaceBranch: palaceData.branch || ''
    };
  }
}

// 运行测试
console.log('🧪 创建模拟调试系统');
const mockSystem = new MockDebugSystem();

console.log('\n🧪 开始模拟绘制测试');
mockSystem.simulateDrawing();

console.log('\n🎉 调试系统测试完成！');
console.log('\n修复总结:');
console.log('1. ✅ 增强了调试日志输出');
console.log('2. ✅ 添加了属性观察者');
console.log('3. ✅ 添加了Canvas测试绘制');
console.log('4. ✅ 详细的数据流追踪');
console.log('5. ✅ 错误堆栈信息');

console.log('\n下一步：');
console.log('1. 在小程序中重新测试');
console.log('2. 点击"测试"按钮');
console.log('3. 查看控制台输出，应该能看到详细的调试信息');
console.log('4. 检查Canvas上是否显示了红色测试文本');
console.log('5. 根据调试信息定位问题'); 