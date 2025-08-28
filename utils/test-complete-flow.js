// 测试完整流程
console.log('=== 测试完整流程 ===');

try {
  // 1. 加载所有必要模块
  console.log('1. 加载模块...');
  const { StarPlacement } = require('./star-placement');
  const { analyzePatterns } = require('./pattern-analysis');
  const { classifyStars } = require('./stars-catalog');
  console.log('✅ 所有模块加载成功');
  
  // 2. 创建测试数据
  console.log('\n2. 创建测试数据...');
  const testProfile = {
    name: '测试用户',
    date: '1991-01-22',
    time: '01:00',
    gender: 'male',
    calendarType: 'lunar',
    city: '北京'
  };
  console.log('测试档案:', testProfile);
  
  // 3. 生成排盘数据
  console.log('\n3. 生成排盘数据...');
  const birthDate = new Date(testProfile.date);
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth() + 1;
  const birthDay = birthDate.getDate();
  const timeParts = testProfile.time.split(':');
  const birthHour = parseInt(timeParts[0]) + parseInt(timeParts[1]) / 60;
  
  const starPlacement = new StarPlacement(
    birthYear, birthMonth, birthDay, birthHour, 
    testProfile.gender, testProfile.calendarType
  );
  
  const chartData = starPlacement.generateChart();
  console.log('排盘数据生成成功，宫位数量:', chartData.palaces.length);
  
  // 4. 格式化数据
  console.log('\n4. 格式化数据...');
  const formattedPalaces = chartData.palaces.map((palace, index) => {
    return {
      name: palace.name,
      branch: palace.branch,
      stars: palace.stars || '',
      starNames: palace.starNames || [],
      index: palace.index,
      isEmpty: !palace.stars || palace.stars.trim() === ''
    };
  });
  
  console.log('格式化完成，宫位数量:', formattedPalaces.length);
  
  // 5. 测试星曜分类
  console.log('\n5. 测试星曜分类...');
  formattedPalaces.forEach((palace, index) => {
    if (palace.starNames && palace.starNames.length > 0) {
      const groups = classifyStars(palace.starNames);
      console.log(`${palace.name}:`, {
        stars: palace.starNames,
        main: groups.main,
        aux: groups.aux,
        misc: groups.misc,
        fourHua: groups.fourHua
      });
    }
  });
  
  // 6. 测试格局分析
  console.log('\n6. 测试格局分析...');
  const center = {
    name: testProfile.name,
    wuxingju: `${chartData.wuxingJu}局`
  };
  
  const patterns = analyzePatterns(formattedPalaces, center);
  console.log('格局分析结果:', patterns.length, '个格局');
  
  console.log('\n🎉 完整流程测试成功！');
  console.log('排盘数据已准备就绪，可以传递给排盘组件');
  
} catch (error) {
  console.error('❌ 流程测试失败:', error.message);
  console.error('错误详情:', error);
} 