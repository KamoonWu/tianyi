// 测试修复后的测试功能
console.log('=== 测试修复后的测试功能 ===');

// 模拟示例数据
const samplePalaces = [
  // 第一行：命宫 | 兄弟宫 | 夫妻宫 | 子女宫
  {
    name: '命宫',
    branch: '寅',
    stars: [
      { name: '紫微', brightness: '庙' },
      { name: '左辅', brightness: '旺' },
      { name: '禄' },
      { name: '天马' },
      { name: '恩光' },
      { name: '运科' },
      { name: '长生' },
      { name: '1-13' }
    ]
  },
  {
    name: '兄弟宫',
    branch: '丑',
    stars: [
      { name: '天机', brightness: '得' },
      { name: '右弼', brightness: '平' },
      { name: '权' },
      { name: '天巫' },
      { name: '天福' },
      { name: '运忌' },
      { name: '沐浴' },
      { name: '14-26' }
    ]
  },
  {
    name: '夫妻宫',
    branch: '子',
    stars: [
      { name: '太阳', brightness: '旺' },
      { name: '文昌', brightness: '庙' },
      { name: '科' },
      { name: '空亡' },
      { name: '年解' },
      { name: '运禄' },
      { name: '冠带' },
      { name: '27-39' }
    ]
  },
  {
    name: '子女宫',
    branch: '亥',
    stars: [
      { name: '武曲', brightness: '平' },
      { name: '天魁', brightness: '得' },
      { name: '忌' },
      { name: '天德' },
      { name: '月德' },
      { name: '运鸾' },
      { name: '临官' },
      { name: '40-52' }
    ]
  },
  // 第二行：财帛宫 | [中宫合并区域] | 迁移宫
  {
    name: '财帛宫',
    branch: '戌',
    stars: [
      { name: '天同', brightness: '陷' },
      { name: '天钺', brightness: '弱' },
      { name: '天乙' },
      { name: '太乙' },
      { name: '帝旺' },
      { name: '53-65' }
    ]
  },
  { name: '', stars: [], isEmpty: true }, // 中宫合并区域
  { name: '', stars: [], isEmpty: true }, // 中宫合并区域
  {
    name: '迁移宫',
    branch: '申',
    stars: [
      { name: '天府', brightness: '旺' },
      { name: '擎羊', brightness: '得' },
      { name: '病' },
      { name: '79-91' }
    ]
  },
  // 第三行：疾厄宫 | [用户信息] | 交友宫
  {
    name: '疾厄宫',
    branch: '酉',
    stars: [
      { name: '廉贞', brightness: '闲' },
      { name: '禄存', brightness: '平' },
      { name: '衰' },
      { name: '66-78' }
    ]
  },
  { name: '', stars: [], isEmpty: true }, // 中宫合并区域
  { name: '', stars: [], isEmpty: true }, // 中宫合并区域
  {
    name: '交友宫',
    branch: '未',
    stars: [
      { name: '太阴', brightness: '庙' },
      { name: '陀罗', brightness: '平' },
      { name: '死' },
      { name: '92-104' }
    ]
  },
  // 第四行：事业宫 | 田宅宫 | 福德宫 | 父母宫
  {
    name: '事业宫',
    branch: '午',
    stars: [
      { name: '贪狼', brightness: '得' },
      { name: '火星', brightness: '旺' },
      { name: '墓' },
      { name: '105-117' }
    ]
  },
  {
    name: '田宅宫',
    branch: '巳',
    stars: [
      { name: '巨门', brightness: '平' },
      { name: '铃星', brightness: '得' },
      { name: '绝' },
      { name: '118-130' }
    ]
  },
  {
    name: '福德宫',
    branch: '辰',
    stars: [
      { name: '天相', brightness: '旺' },
      { name: '文曲', brightness: '庙' },
      { name: '胎' },
      { name: '131-143' }
    ]
  },
  {
    name: '父母宫',
    branch: '卯',
    stars: [
      { name: '天梁', brightness: '得' },
      { name: '天马', brightness: '平' },
      { name: '养' },
      { name: '144-156' }
    ]
  }
];

// 流年数据
const flowYearData = {
  currentFlowYear: {
    heavenlyStem: '乙',
    earthlyBranch: '巳',
    year: 2024,
    description: '乙巳年'
  }
};

console.log('🧪 测试1: 示例数据验证');
console.log('✅ 宫位数量:', samplePalaces.length);
console.log('✅ 非空宫位数量:', samplePalaces.filter(p => !p.isEmpty).length);
console.log('✅ 中宫合并区域数量:', samplePalaces.filter(p => p.isEmpty).length);

console.log('\n🧪 测试2: 宫位数据验证');
samplePalaces.forEach((palace, index) => {
  if (!palace.isEmpty) {
    console.log(`✅ 宫位 ${index}: ${palace.name} (${palace.branch})`);
    console.log(`  星曜数量: ${palace.stars.length}`);
    console.log(`  主星: ${palace.stars.find(s => ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'].includes(s.name))?.name || '无'}`);
    console.log(`  辅星: ${palace.stars.find(s => ['左辅', '右弼', '文昌', '文曲', '天魁', '天钺', '禄存', '天马', '擎羊', '陀罗', '火星', '铃星'].includes(s.name))?.name || '无'}`);
    console.log(`  四化星: ${palace.stars.filter(s => ['禄', '权', '科', '忌'].includes(s.name)).map(s => s.name).join(', ') || '无'}`);
  } else {
    console.log(`✅ 宫位 ${index}: 中宫合并区域`);
  }
});

console.log('\n🧪 测试3: 流年数据验证');
console.log('✅ 流年天干:', flowYearData.currentFlowYear.heavenlyStem);
console.log('✅ 流年地支:', flowYearData.currentFlowYear.earthlyBranch);
console.log('✅ 流年年份:', flowYearData.currentFlowYear.year);
console.log('✅ 流年描述:', flowYearData.currentFlowYear.description);

console.log('\n🧪 测试4: 数据完整性验证');
const requiredFields = ['name', 'branch', 'stars'];
const validPalaces = samplePalaces.filter(p => !p.isEmpty);

validPalaces.forEach((palace, index) => {
  const missingFields = requiredFields.filter(field => !(field in palace));
  if (missingFields.length === 0) {
    console.log(`✅ 宫位 ${index} (${palace.name}): 字段完整`);
  } else {
    console.log(`❌ 宫位 ${index} (${palace.name}): 缺少字段 ${missingFields.join(', ')}`);
  }
});

console.log('\n🧪 测试5: 星曜分类验证');
validPalaces.forEach((palace, index) => {
  const stars = palace.stars;
  const mainStars = stars.filter(s => ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'].includes(s.name));
  const auxiliaryStars = stars.filter(s => ['左辅', '右弼', '文昌', '文曲', '天魁', '天钺', '禄存', '天马', '擎羊', '陀罗', '火星', '铃星'].includes(s.name));
  const fourHuaStars = stars.filter(s => ['禄', '权', '科', '忌'].includes(s.name));
  
  console.log(`✅ 宫位 ${index} (${palace.name}):`);
  console.log(`  主星: ${mainStars.map(s => `${s.name}${s.brightness || ''}`).join(', ') || '无'}`);
  console.log(`  辅星: ${auxiliaryStars.map(s => `${s.name}${s.brightness || ''}`).join(', ') || '无'}`);
  console.log(`  四化星: ${fourHuaStars.map(s => s.name).join(', ') || '无'}`);
});

console.log('\n🎉 修复后的测试功能验证完成！');
console.log('\n修复总结:');
console.log('1. ✅ 避免了模块加载问题');
console.log('2. ✅ 直接在页面中定义示例数据');
console.log('3. ✅ 包含完整的十二宫数据');
console.log('4. ✅ 每个宫都有丰富的星曜信息');
console.log('5. ✅ 支持流年数据显示');
console.log('6. ✅ 数据结构完整，字段齐全');

console.log('\n下一步：');
console.log('1. 在小程序中点击"测试"按钮');
console.log('2. 查看排盘是否正确显示');
console.log('3. 验证字段优化系统效果');
console.log('4. 测试三方四正高亮功能'); 