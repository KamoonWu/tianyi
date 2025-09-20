/**
 * 测试前端组件处理空数据的情况
 * 模拟zwds-chart组件的行为
 */

// 导入必要的函数
const { generateEmptyPalaceLayout } = require('../services/palace-calculation');

/**
 * 模拟前端组件的orderPalacesForLayout方法
 */
function orderPalacesForLayout(list) {
  // 紫微斗数标准十二宫布局（4x4网格，中间4格合并，周围12格按传统排列）
  const layoutOrder = [
    '命宫','兄弟宫','夫妻宫','子女宫',
    '财帛宫','','','迁移宫',
    '疾厄宫','','','交友宫',
    '事业宫','田宅宫','福德宫','父母宫'
  ];
  
  console.log('模拟排盘组件接收到的宫位数据:', list);
  
  // 检查是否为空数据（无数据或长度为0的数组）
  const isEmptyData = !list || list.length === 0 || list.every(p => p.isEmpty);
  console.log('是否为空数据:', isEmptyData);
  
  const byName = {};
  (list || []).forEach((p) => {
    const key = p.name || p.label;
    byName[key] = p;
    console.log(`映射宫位: ${p.name} -> ${key}`);
  });
  
  const result = layoutOrder.map((k) => {
    if (k === '') {
      return { name: '', stars: '', isEmpty: true, isCenter: true };
    } else {
      const palace = byName[k];
      if (palace) {
        console.log(`找到宫位 ${k}:`, palace);
        // 确保宫位数据包含所有必要字段
        return {
          ...palace,
          stars: palace.stars || [],
          gods: palace.gods || [],
          heavenlyStem: palace.heavenlyStem || '',
          isEmpty: palace.isEmpty || false
        };
      } else {
        console.log(`未找到宫位 ${k}，创建空宫位`);
        // 如果是空数据，显示"—"而不是宫位名称
        return { 
          name: isEmptyData ? '—' : k, 
          branch: '—',
          stars: [], 
          gods: [],
          heavenlyStem: '',
          isEmpty: true 
        };
      }
    }
  });
  
  console.log('布局后的宫位数据:', result);
  return result;
}

/**
 * 测试空数据情况
 */
function testEmptyData() {
  console.log('\n🧪 测试空数据情况...');
  
  // 生成空白宫位布局
  const emptyLayout = generateEmptyPalaceLayout();
  console.log('后端生成的空白布局:', emptyLayout.slice(0, 3));
  
  // 模拟前端组件处理空数据
  const frontendResult = orderPalacesForLayout(emptyLayout);
  console.log('\n前端组件处理后的布局:');
  frontendResult.slice(0, 4).forEach((item, index) => {
    if (item.isCenter) {
      console.log(`${index}: [中宫区域]`);
    } else {
      console.log(`${index}: ${item.name} - ${item.branch} (isEmpty: ${item.isEmpty})`);
    }
  });
  
  // 验证是否所有非中宫的宫位名称都是"—"
  const nonCenterItems = frontendResult.filter(item => !item.isCenter);
  const allDashes = nonCenterItems.every(item => item.name === '—');
  
  console.log('\n📊 验证结果:');
  console.log(`  总宫位数: ${frontendResult.length}`);
  console.log(`  非中宫宫位数: ${nonCenterItems.length}`);
  console.log(`  显示"—"的宫位数: ${nonCenterItems.filter(item => item.name === '—').length}`);
  console.log(`  验证结果: ${allDashes ? '✅ 通过' : '❌ 失败'}`);
  
  return allDashes;
}

/**
 * 测试有数据情况
 */
function testValidData() {
  console.log('\n🧪 测试有数据情况...');
  
  // 模拟有效数据
  const validData = [
    { name: '命宫', branch: '申', stars: ['紫微', '左辅'], isEmpty: false },
    { name: '兄弟宫', branch: '未', stars: ['武曲', '天机'], isEmpty: false },
    { name: '夫妻宫', branch: '午', stars: ['太阳'], isEmpty: false },
    { name: '子女宫', branch: '巳', stars: ['天同'], isEmpty: false }
  ];
  
  // 模拟前端组件处理有效数据
  const frontendResult = orderPalacesForLayout(validData);
  console.log('\n前端组件处理后的布局:');
  frontendResult.slice(0, 4).forEach((item, index) => {
    if (item.isCenter) {
      console.log(`${index}: [中宫区域]`);
    } else {
      console.log(`${index}: ${item.name} - ${item.branch} (isEmpty: ${item.isEmpty})`);
    }
  });
  
  // 验证宫位名称是否保持不变
  const correctNames = frontendResult.slice(0, 4).every((item, index) => {
    if (item.isCenter) return true;
    return item.name === validData[index].name;
  });
  
  console.log('\n📊 验证结果:');
  console.log(`  验证结果: ${correctNames ? '✅ 通过' : '❌ 失败'}`);
  
  return correctNames;
}

/**
 * 运行所有测试
 */
function runTests() {
  console.log('🚀 开始测试前端组件处理空数据的情况...\n');
  
  const emptyTest = testEmptyData();
  const validTest = testValidData();
  
  console.log('\n📈 总体测试结果:');
  console.log(`  空数据测试: ${emptyTest ? '✅ 通过' : '❌ 失败'}`);
  console.log(`  有效数据测试: ${validTest ? '✅ 通过' : '❌ 失败'}`);
  console.log(`  总体结果: ${emptyTest && validTest ? '✅ 全部通过' : '❌ 部分失败'}`);
  
  if (emptyTest && validTest) {
    console.log('\n🎉 前端组件已正确处理空数据情况，空数据时显示"—"，有数据时显示正确宫名');
  } else {
    console.log('\n⚠️ 前端组件处理数据的逻辑需要进一步修复');
  }
}

// 如果直接运行此文件
if (require.main === module) {
  runTests();
}

module.exports = {
  orderPalacesForLayout,
  testEmptyData,
  testValidData,
  runTests
}; 