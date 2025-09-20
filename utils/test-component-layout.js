/**
 * 前端组件布局测试
 * 模拟前端组件的行为，验证宫位布局是否正确
 */

// 引入宫位计算服务
const { calculatePalaceLayout } = require('../services/palace-calculation');

// 模拟前端组件的orderPalacesForLayout方法
function orderPalacesForLayout(list) {
  console.log('排盘组件接收到的宫位数据:', list.length);
  
  // 检查是否为空数据（无数据或长度为0的数组）
  const isEmptyData = !list || list.length === 0 || list.every(p => p.isEmpty);
  console.log('是否为空数据:', isEmptyData);
  
  if (isEmptyData) {
    // 如果是空数据，返回固定布局的空宫位
    return getEmptyLayout();
  }
  
  // 紫微斗数标准十二宫布局（4x4网格，中间4格合并，周围12格按顺时针排列）：
  // 顶行：命宫 | 父母宫 | 福德宫 | 田宅宫
  // 中行：兄弟宫 | [中宫合并区域] | 官禄宫
  // 中行：夫妻宫 | [用户信息] | 交友宫  
  // 底行：子女宫 | 财帛宫 | 疾厄宫 | 迁移宫
  const layoutOrder = [
    '命宫','父母宫','福德宫','田宅宫',
    '兄弟宫','','','官禄宫',
    '夫妻宫','','','交友宫',
    '子女宫','财帛宫','疾厄宫','迁移宫'
  ];
  
  // 创建一个映射，将宫位名称映射到后端数据
  const palaceMap = {};
  list.forEach(palace => {
    palaceMap[palace.name] = palace;
  });
  
  // 按照固定布局顺序重新排列宫位
  const result = layoutOrder.map(name => {
    if (name === '') {
      // 中宫区域
      return { name: '', stars: [], isEmpty: true, isCenter: true };
    } else {
      // 查找对应的宫位数据
      const palace = palaceMap[name];
      if (palace) {
        // 找到对应宫位数据
        return {
          ...palace,
          stars: palace.stars || [],
          gods: palace.gods || [],
          heavenlyStem: palace.heavenlyStem || '',
          isEmpty: palace.isEmpty || false
        };
      } else {
        // 找不到对应宫位数据，创建空宫位
        return {
          name: isEmptyData ? '—' : name,
          branch: '—',
          stars: [],
          gods: [],
          heavenlyStem: '',
          isEmpty: true
        };
      }
    }
  });
  
  console.log('布局后的宫位数据:', result.length);
  return result;
}

// 获取空布局
function getEmptyLayout() {
  // 紫微斗数标准十二宫布局（4x4网格，中间4格合并，周围12格按顺时针排列）：
  // 顶行：命宫 | 父母宫 | 福德宫 | 田宅宫
  // 中行：兄弟宫 | [中宫合并区域] | 官禄宫
  // 中行：夫妻宫 | [用户信息] | 交友宫  
  // 底行：子女宫 | 财帛宫 | 疾厄宫 | 迁移宫
  const layoutOrder = [
    '命宫','父母宫','福德宫','田宅宫',
    '兄弟宫','','','官禄宫',
    '夫妻宫','','','交友宫',
    '子女宫','财帛宫','疾厄宫','迁移宫'
  ];
  
  return layoutOrder.map(k => {
    if (k === '') {
      return { name: '', stars: '', isEmpty: true };
    } else {
      return { 
        name: '—', 
        branch: '—',
        stars: [], 
        gods: [],
        heavenlyStem: '',
        isEmpty: true 
      };
    }
  });
}

// 测试用户资料
const testProfiles = [
  {
    name: '测试用户1',
    date: '1991-03-15',
    time: '16:00',
    gender: '男',
    city: '北京市',
    yearStem: '辛',
    yearBranch: '未',
    lunarMonth: 2,
    lunarDay: 1,
    hourBranch: '申'
  },
  {
    name: '测试用户2',
    date: '2000-01-22',
    time: '02:00',
    gender: '女',
    city: '上海市',
    yearStem: '庚',
    yearBranch: '辰',
    lunarMonth: 1,
    lunarDay: 22,
    hourBranch: '丑'
  },
  {
    name: '测试用户3',
    date: '2005-01-22',
    time: '02:00',
    gender: '女',
    city: '广州市',
    yearStem: '乙',
    yearBranch: '酉',
    lunarMonth: 1,
    lunarDay: 22,
    hourBranch: '丑'
  }
];

// 运行测试
function runTest() {
  console.log('🧪 开始测试前端组件布局...');
  
  testProfiles.forEach((profile, index) => {
    console.log(`\n🧮 测试用户${index + 1}: ${profile.name}`);
    
    // 计算宫位布局
    const result = calculatePalaceLayout(profile);
    
    if (!result || !result.success) {
      console.error('❌ 计算失败:', result?.error || '未知错误');
      return;
    }
    
    // 模拟前端组件处理
    const layoutData = orderPalacesForLayout(result.palaces);
    
    // 验证布局
    validateLayout(layoutData, result);
  });
}

// 验证布局
function validateLayout(layoutData, result) {
  console.log('📊 验证前端组件布局...');
  
  // 检查布局数据长度
  if (!layoutData || layoutData.length !== 16) {
    console.error(`❌ 布局数据长度不正确: ${layoutData?.length || 0}，应为16`);
    return;
  }
  
  // 打印布局信息
  console.log('📋 布局信息:');
  
  // 命宫位置
  const mingGongIndex = layoutData.findIndex(p => p.name === '命宫' && !p.isEmpty);
  console.log(`  命宫位置: 索引${mingGongIndex}, 地支${layoutData[mingGongIndex]?.branch || '—'}`);
  
  // 身宫位置
  const shenGongBranch = result.shenGong.branch;
  const shenGongIndex = layoutData.findIndex(p => p.branch === shenGongBranch && !p.isEmpty);
  console.log(`  身宫位置: 索引${shenGongIndex}, 地支${shenGongBranch}`);
  
  // 打印所有宫位
  layoutData.forEach((palace, index) => {
    if (palace.isCenter) {
      console.log(`  ${index}: 中宫`);
    } else {
      const isMingGong = palace.name === '命宫' && !palace.isEmpty;
      const isShenGong = palace.branch === shenGongBranch && !palace.isEmpty;
      const marker = isMingGong ? '[命宫]' : isShenGong ? '[身宫]' : '';
      console.log(`  ${index}: ${palace.name} - ${palace.branch} ${palace.heavenlyStem || ''} ${marker}`);
    }
  });
  
  // 检查命宫和身宫是否在正确位置
  if (mingGongIndex !== 0) {
    console.error(`❌ 命宫位置不正确: 索引${mingGongIndex}，应为0`);
  }
  
  // 检查其他宫位是否按顺时针排列
  const expectedOrder = ['命宫', '父母宫', '福德宫', '田宅宫', '兄弟宫', '官禄宫', '夫妻宫', '交友宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫'];
  let isOrderCorrect = true;
  
  expectedOrder.forEach((name, i) => {
    const index = [0, 1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15][i];
    if (layoutData[index].name !== name && !layoutData[index].isEmpty) {
      console.error(`❌ 宫位顺序不正确: 索引${index}，期望${name}，实际${layoutData[index].name}`);
      isOrderCorrect = false;
    }
  });
  
  // 总结
  if (mingGongIndex === 0 && isOrderCorrect) {
    console.log('✅ 前端组件布局验证通过');
  } else {
    console.error('❌ 前端组件布局验证失败');
  }
}

// 运行测试
runTest(); 