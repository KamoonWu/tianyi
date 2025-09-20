/**
 * 网格布局测试
 * 验证十二宫在4x4网格中的布局是否正确
 */

// 引入宫位计算服务
const { calculatePalaceLayout } = require('../services/palace-calculation');

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

// 网格布局位置映射（4x4网格）
const gridPositions = [
  '命宫', '父母宫', '福德宫', '田宅宫',      // 第1行：索引0-3
  '兄弟宫', '中宫', '中宫', '官禄宫',       // 第2行：索引4-7
  '夫妻宫', '中宫', '中宫', '交友宫',       // 第3行：索引8-11
  '子女宫', '财帛宫', '疾厄宫', '迁移宫'     // 第4行：索引12-15
];

// 运行测试
function runTest() {
  console.log('🧪 开始测试网格布局...');
  
  testProfiles.forEach((profile, index) => {
    console.log(`\n🧮 测试用户${index + 1}: ${profile.name}`);
    
    // 计算宫位布局
    const result = calculatePalaceLayout(profile);
    
    if (!result || !result.success) {
      console.error('❌ 计算失败:', result?.error || '未知错误');
      return;
    }
    
    // 验证网格布局
    validateGridLayout(result.palaces, profile);
  });
}

// 验证网格布局
function validateGridLayout(palaces, profile) {
  console.log('📊 验证网格布局...');
  
  // 检查布局数据长度
  if (!palaces || palaces.length !== 16) {
    console.error(`❌ 布局数据长度不正确: ${palaces?.length || 0}，应为16`);
    return;
  }
  
  // 打印布局信息
  console.log('📋 布局信息:');
  palaces.forEach((palace, index) => {
    const position = gridPositions[index];
    const name = palace.name || '—';
    const branch = palace.branch || '—';
    const stem = palace.heavenlyStem || '—';
    
    console.log(`  ${index}: ${position} - ${name} (${stem}${branch})`);
    
    // 验证宫位名称是否与位置匹配
    if (position !== '中宫' && name !== '—' && name !== position) {
      console.error(`❌ 宫位名称不匹配: 位置 ${position}，名称 ${name}`);
    }
  });
  
  // 验证命宫和身宫
  const mingGong = palaces.find(p => p.name === '命宫');
  const shenGong = palaces.find(p => p.branch === profile.shenGongBranch);
  
  console.log(`\n📍 命宫: ${mingGong?.branch || '—'} (${mingGong?.heavenlyStem || '—'}${mingGong?.branch || '—'})`);
  console.log(`📍 身宫: ${shenGong?.branch || '—'} (${shenGong?.heavenlyStem || '—'}${shenGong?.branch || '—'})`);
  
  // 检查是否有星曜数据
  const starsCount = palaces.reduce((sum, p) => sum + (p.stars?.length || 0), 0);
  console.log(`📊 星曜总数: ${starsCount}`);
  
  // 总结
  if (starsCount > 0 && mingGong && shenGong) {
    console.log('✅ 网格布局验证通过');
  } else {
    console.error('❌ 网格布局验证失败');
  }
}

// 运行测试
runTest(); 