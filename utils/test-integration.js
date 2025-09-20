/**
 * 集成测试：验证整个宫位计算系统的工作流程
 */

const { calculatePalaceLayout, generateEmptyPalaceLayout } = require('../services/palace-calculation');

// 模拟用户档案数据
const testProfiles = [
  {
    id: 'test1',
    name: '张三',
    date: '1991-03-15',
    time: '16:00',
    gender: '男',
    city: '北京市'
  },
  {
    id: 'test2', 
    name: '李四',
    date: '1985-01-22',
    time: '04:00',
    gender: '女',
    city: '上海市'
  },
  {
    id: 'empty',
    name: '空档案',
    date: '',
    time: '',
    gender: '',
    city: ''
  }
];

// 模拟主页面的计算逻辑
function simulatePageCalculation(profile) {
  console.log(`\n🧮 模拟页面计算：${profile.name}`);
  
  try {
    if (profile.id === 'empty' || !profile.date || !profile.time) {
      // 空档案处理
      console.log('📄 检测到空档案，使用空白布局');
      const emptyLayout = generateEmptyPalaceLayout();
      
      return {
        chart: {
          palaces: emptyLayout,
          center: {
            name: '—',
            gender: '—',
            solarDate: '—',
            lunarDate: '—',
            city: '—',
            clockTime: '—',
            trueSolarTime: '—',
            lifeMaster: '—',
            bodyMaster: '—',
            ziDou: '—',
            fiveElements: '—'
          }
        }
      };
    } else {
      // 使用新的宫位计算服务
      const palaceLayoutResult = calculatePalaceLayout(profile);
      
      if (palaceLayoutResult.success) {
        console.log('✅ 后端宫位计算成功');
        
        // 转换为前端格式（模拟buildChartFromPalaceLayout）
        const chartData = {
          palaces: palaceLayoutResult.palaces,
          center: {
            name: profile.name || '—',
            gender: profile.gender || '—',
            solarDate: profile.date || '—',
            lunarDate: `农历${palaceLayoutResult.calculation.lunarMonth}月`,
            city: profile.city || '—',
            clockTime: `${profile.date} ${profile.time}`,
            trueSolarTime: profile.trueSolarTime ? '已转换' : '未转换',
            lifeMaster: '—',
            bodyMaster: '—',
            ziDou: '—',
            fiveElements: '—',
            mingGong: palaceLayoutResult.mingGong,
            shenGong: palaceLayoutResult.shenGong,
            calculation: palaceLayoutResult.calculation
          }
        };
        
        return { chart: chartData };
      } else {
        console.log('⚠️ 后端宫位计算失败，使用空白布局');
        const emptyLayout = generateEmptyPalaceLayout();
        return {
          chart: {
            palaces: emptyLayout,
            center: { name: '计算失败', /* 其他默认值 */ }
          }
        };
      }
    }
  } catch (error) {
    console.error('❌ 页面计算失败:', error);
    return null;
  }
}

// 验证结果的函数
function validateResult(result, profileName) {
  if (!result || !result.chart) {
    console.log(`❌ ${profileName}: 结果无效`);
    return false;
  }
  
  const { palaces, center } = result.chart;
  
  // 验证宫位数据
  if (!Array.isArray(palaces) || palaces.length !== 16) {
    console.log(`❌ ${profileName}: 宫位数据格式错误`);
    return false;
  }
  
  // 统计有效宫位
  const validPalaces = palaces.filter(p => !p.isEmpty && !p.isCenter);
  const centerCells = palaces.filter(p => p.isCenter);
  
  console.log(`📊 ${profileName}: 有效宫位${validPalaces.length}个，中宫位置${centerCells.length}个`);
  
  // 验证中宫信息
  if (!center || !center.name) {
    console.log(`❌ ${profileName}: 中宫信息无效`);
    return false;
  }
  
  console.log(`✅ ${profileName}: 验证通过`);
  return true;
}

// 显示宫位排列
function showPalaceLayout(result, profileName) {
  console.log(`\n📋 ${profileName} 的宫位排列：`);
  
  const { palaces } = result.chart;
  const validPalaces = palaces.filter(p => !p.isEmpty && !p.isCenter);
  
  if (validPalaces.length === 0) {
    console.log('无宫位数据（空白排盘）');
    return;
  }
  
  validPalaces.forEach(palace => {
    const markers = [];
    if (palace.isMingGong) markers.push('命宫');
    if (palace.isShenGong) markers.push('身宫');
    const markerText = markers.length > 0 ? ` [${markers.join(',')}]` : '';
    
    console.log(`  ${palace.layoutIndex}: ${palace.name} - ${palace.branch}宫${markerText}`);
  });
}

// 运行集成测试
function runIntegrationTest() {
  console.log('🚀 开始运行集成测试...\n');
  
  let passCount = 0;
  let totalCount = testProfiles.length;
  
  testProfiles.forEach(profile => {
    const result = simulatePageCalculation(profile);
    const isValid = validateResult(result, profile.name);
    
    if (isValid) {
      passCount++;
      showPalaceLayout(result, profile.name);
    }
  });
  
  console.log(`\n📈 集成测试结果：${passCount}/${totalCount} 通过`);
  
  if (passCount === totalCount) {
    console.log('🎉 所有测试通过！系统集成成功！');
  } else {
    console.log('⚠️ 部分测试失败，需要检查系统集成');
  }
  
  return passCount === totalCount;
}

// 如果直接运行此文件
if (require.main === module) {
  runIntegrationTest();
}

module.exports = {
  runIntegrationTest,
  simulatePageCalculation,
  validateResult
}; 