/**
 * 测试宫位布局修复
 * 验证宫位布局是否根据命宫位置动态调整
 */

// 导入所需模块
const { calculatePalaceLayout } = require('../services/palace-calculation');

// 模拟app.js中的用户数据
const profiles = [
  {
    id: 'user1',
    name: '用户1',
    gender: 'male',
    date: '1991-01-22',
    time: '04:00',
    city: '太原市',
    calendarType: 'solar',
    trueSolarTime: true,
    yearStem: '庚',
    yearBranch: '午',
    lunarYear: 1990,
    lunarMonth: 12,
    lunarDay: 7,
    hourBranch: '寅',
    description: '公历1991年1月22日凌晨4点太原出生的男性（农历庚午年十二月初七寅时）'
  },
  {
    id: 'user2', 
    name: '用户2',
    gender: 'female',
    date: '2000-01-22',
    time: '02:00',
    city: '北京市',
    calendarType: 'solar',
    trueSolarTime: true,
    yearStem: '己',
    yearBranch: '卯',
    lunarYear: 1999,
    lunarMonth: 12,
    lunarDay: 16,
    hourBranch: '丑',
    description: '2000年1月22日北京出生的女性（农历己卯年十二月十六日丑时）'
  },
  {
    id: 'user3',
    name: '用户3', 
    gender: 'female',
    date: '2005-01-22',
    time: '02:00',
    city: '广州市',
    calendarType: 'solar',
    trueSolarTime: true,
    yearStem: '甲',
    yearBranch: '申',
    lunarYear: 2004,
    lunarMonth: 12,
    lunarDay: 12,
    hourBranch: '丑',
    description: '2005年1月22日广州出生的女性（农历甲申年十二月十二日丑时）'
  }
];

// 模拟前端组件的orderPalacesForLayout方法
function orderPalacesForLayout(list) {
  console.log('排盘组件接收到的宫位数据:', list.length);
  
  // 检查是否为空数据（无数据或长度为0的数组）
  const isEmptyData = !list || list.length === 0 || list.every(p => p.isEmpty);
  console.log('是否为空数据:', isEmptyData);
  
  if (isEmptyData) {
    // 如果是空数据，返回空数组
    return [];
  }
  
  // 紫微斗数十二宫的标准顺序（这是固定的）
  const PALACE_NAMES = ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'];
  
  // 紫微斗数宫位在4x4网格中的位置映射（固定布局）
  const GRID_POSITIONS = {
    '命宫': 0,
    '父母宫': 1,
    '福德宫': 2,
    '田宅宫': 3,
    '兄弟宫': 4,
    '官禄宫': 7,
    '夫妻宫': 8,
    '交友宫': 11,
    '子女宫': 12,
    '财帛宫': 13,
    '疾厄宫': 14,
    '迁移宫': 15
  };
  
  // 创建一个16位置的数组，用于存放布局数据
  const layoutData = new Array(16);
  
  // 中宫位置
  layoutData[5] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 5 };
  layoutData[6] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 6 };
  layoutData[9] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 9 };
  layoutData[10] = { name: '', isEmpty: true, isCenter: true, layoutIndex: 10 };
  
  // 处理每个宫位数据
  for (let i = 0; i < list.length; i++) {
    const palace = list[i];
    if (!palace) continue;
    
    // 获取宫位名称
    const palaceName = palace.displayName || palace.name;
    
    // 如果palace.isEmpty为true，确保name和branch显示为"—"
    if (palace.isEmpty) {
      const gridIndex = GRID_POSITIONS[palaceName];
      if (gridIndex !== undefined) {
        layoutData[gridIndex] = {
          ...palace,
          name: '—',
          branch: '—',
          stars: [],
          gods: [],
          heavenlyStem: '',
          isEmpty: true,
          layoutIndex: gridIndex
        };
      }
      continue;
    }
    
    // 获取宫位在网格中的位置
    const gridIndex = GRID_POSITIONS[palaceName];
    if (gridIndex !== undefined) {
      layoutData[gridIndex] = {
        ...palace,
        name: palaceName,
        stars: palace.stars || [],
        gods: palace.gods || [],
        heavenlyStem: palace.heavenlyStem || '',
        isEmpty: false,
        layoutIndex: gridIndex
      };
    }
  }
  
  return layoutData;
}

// 测试宫位布局
function testPalaceLayout() {
  console.log('🔄 开始测试宫位布局...');
  
  profiles.forEach((profile, index) => {
    console.log(`\n👤 测试用户 ${index + 1}: ${profile.name}`);
    
    // 计算排盘
    const palaceLayoutResult = calculatePalaceLayout(profile);
    
    if (palaceLayoutResult && palaceLayoutResult.success) {
      console.log(`✅ 后端计算成功`);
      
      // 输出命宫和身宫信息
      console.log(`📊 命宫: ${palaceLayoutResult.mingGong.branch} (${palaceLayoutResult.mingGong.name})`);
      console.log(`📊 身宫: ${palaceLayoutResult.shenGong.branch} (${palaceLayoutResult.shenGong.name})`);
      
      // 输出原始十二宫数据
      if (palaceLayoutResult.originalPalaces) {
        console.log(`📊 原始十二宫数据 (${palaceLayoutResult.originalPalaces.length}):`);
        palaceLayoutResult.originalPalaces.forEach((palace, i) => {
          console.log(`  ${i + 1}. ${palace.name} - ${palace.branch}宫 (${palace.heavenlyStem}${palace.branch})`);
        });
      }
      
      // 输出网格布局数据
      console.log(`📊 网格布局数据 (${palaceLayoutResult.palaces.length}):`);
      const gridLayout = palaceLayoutResult.palaces.filter(p => p && !p.isCenter);
      gridLayout.forEach((palace, i) => {
        if (palace && palace.name) {
          console.log(`  ${i}. ${palace.name} - ${palace.branch}宫 (${palace.heavenlyStem}${palace.branch})`);
        }
      });
      
      // 测试前端组件的orderPalacesForLayout方法
      console.log(`\n📊 测试前端组件的orderPalacesForLayout方法:`);
      const originalPalaces = palaceLayoutResult.originalPalaces || [];
      const layoutData = orderPalacesForLayout(originalPalaces);
      
      // 输出布局后的数据
      console.log(`📊 布局后的数据 (${layoutData.filter(p => p && !p.isCenter).length}):`);
      layoutData.forEach((palace, i) => {
        if (palace && palace.name && !palace.isCenter) {
          console.log(`  ${i}. ${palace.name} - ${palace.branch || ''}宫 (${palace.heavenlyStem || ''}${palace.branch || ''})`);
        }
      });
    } else {
      console.error(`❌ ${profile.name}: 排盘计算失败`);
    }
  });
  
  console.log('\n🎉 宫位布局测试完成');
}

// 运行测试
testPalaceLayout(); 