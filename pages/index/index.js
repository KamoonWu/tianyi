const { buildChartSummary, buildPalaceList, buildFortunes, loadActiveProfile } = require('../../utils/zwds');
const { analyzePatterns } = require('../../utils/pattern-analysis');
const api = require('../../utils/zwds-api');

Page({
  data: {
    showLines: false,
    chart: {
      palaces: [],
      center: {
        name: '张三',
        fiveElements: '水二局',
        trueSolarTime: '1991-01-22 12:00',
        clockTime: '1991-01-22 12:00',
        lunarTime: '庚午年腊月初七',
        lifeMaster: '贪狼',
        bodyMaster: '天机',
        ziDou: '子',
        solarTermPillars: [
          { heavenlyStem: '庚', earthlyBranch: '午' },
          { heavenlyStem: '己', earthlyBranch: '丑' },
          { heavenlyStem: '壬', earthlyBranch: '寅' },
          { heavenlyStem: '丙', earthlyBranch: '午' }
        ],
        nonSolarTermPillars: [
          { heavenlyStem: '辛', earthlyBranch: '未' },
          { heavenlyStem: '庚', earthlyBranch: '申' },
          { heavenlyStem: '癸', earthlyBranch: '酉' },
          { heavenlyStem: '丁', earthlyBranch: '未' }
        ]
      }
    },
    profile: null,
    center: null,
    fortune: null,
    patterns: [],
    checks: [],
    // 添加流年数据
    flowYear: {
      currentFlowYear: {
        heavenlyStem: '乙', // 当前流年天干
        earthlyBranch: '巳', // 当前流年地支
        year: 2024 // 当前流年年份
      }
    }
  },

  onLoad() {
    // 加载用户档案
    this.loadActiveProfile();
    
    // 默认显示测试数据，不用点击测试按钮
    this.testChart();
  },

  // 加载活跃档案
  loadActiveProfile() {
    try {
      const profile = wx.getStorageSync('activeProfile');
      if (profile) {
        this.setData({ activeProfile: profile });
      } else {
        // 如果没有档案，创建一个默认档案用于测试
        const defaultProfile = {
          name: '测试用户',
          date: '1991-01-22',
          time: '01:00',
          gender: 'male',
          calendarType: 'lunar',
          city: '北京'
        };
        this.setData({ activeProfile: defaultProfile });
        wx.setStorageSync('activeProfile', defaultProfile);
      }
    } catch (error) {
      console.error('加载档案失败:', error);
    }
  },

  // 刷新所有数据
  refreshAll() {
    const profile = this.data.activeProfile;
    if (!profile || !profile.date || !profile.time) {
      this.setData({
        chart: { summaryText: '请先设置出生信息', palaces: [] }
      });
      return;
    }

    try {
      // 使用新的安星算法
      const { StarPlacement } = require('../../utils/star-placement');
      
      // 解析出生信息
      const birthDate = new Date(profile.date);
      const birthYear = birthDate.getFullYear();
      const birthMonth = birthDate.getMonth() + 1;
      const birthDay = birthDate.getDate();
      
      // 解析出生时间（假设格式为 "HH:MM"）
      const timeParts = profile.time.split(':');
      const birthHour = parseInt(timeParts[0]) + parseInt(timeParts[1]) / 60;
      
      // 创建安星算法实例
      const starPlacement = new StarPlacement(
        birthYear, 
        birthMonth, 
        birthDay, 
        birthHour, 
        profile.gender || 'male', 
        profile.calendarType || 'lunar'
      );
      
      // 生成排盘数据
      const chartData = starPlacement.generateChart();
      
      // 转换数据格式以匹配排盘组件期望的格式
      const formattedPalaces = chartData.palaces.map((palace, index) => {
        // 确保每个宫位都有正确的数据结构
        return {
          name: palace.name,
          branch: palace.branch,
          heavenlyStem: palace.heavenlyStem || '', // 宫干（用于右下角干支）
          stars: palace.stars || '',
          starNames: palace.starNames || [],
          index: palace.index,
          isEmpty: !palace.stars || palace.stars.trim() === ''
        };
      });
      
      console.log('原始排盘数据:', chartData);
      console.log('格式化后的宫位数据:', formattedPalaces);
      
      // 构建运限信息
      const fortunes = this.buildFortunes(profile);
      
      // 构建中宫信息
      const center = {
        name: profile.name || '未设置',
        city: profile.city || '未设置',
        date: profile.date || '',
        time: profile.time || '',
        calendarType: profile.calendarType || 'lunar',
        trueSolarTime: profile.trueSolarTime || false,
        wuxingju: chartData.wuxingJu ? `${chartData.wuxingJu}局` : '',
        fourPillars: {
          year: `${chartData.yearStem}${chartData.yearBranch}`,
          month: `${chartData.monthStem}${chartData.monthBranch}`,
          day: `${chartData.dayStem}${chartData.dayBranch}`,
          hour: `${chartData.hourStem}${chartData.hourBranch}`
        },
        calendar: profile.calendarType === 'lunar' ? '农历' : '公历',
        zodiac: this.getZodiac(chartData.yearBranch),
        constellation: this.getConstellation(birthMonth, birthDay),
        lord: this.getLord(chartData.yearBranch),
        bodyLord: this.getBodyLord(chartData.yearBranch),
        mingGong: chartData.mingGong,
        shenGong: chartData.shenGong,
        lunarDate: profile.lunarDate || profile.date || '',
        solarDate: profile.date || '',
        birthHour: profile.time || '',
        age: this.calculateAge(birthYear),
        currentLunarDate: this.getCurrentLunarDate(),
        currentSolarDate: this.getCurrentSolarDate(),
        currentTime: this.getCurrentTime()
      };
      
      // 构建运限数据
      const fortuneData = {
        decadal: fortunes.decadal ? {
          heavenlyStem: fortunes.decadal.heavenlyStem || '',
          earthlyBranch: fortunes.decadal.earthlyBranch || '',
          age: fortunes.decadal.age ? { nominalAge: fortunes.decadal.age } : null,
          palaceNames: fortunes.decadal.palaceNames || []
        } : null,
        yearly: fortunes.yearly ? {
          heavenlyStem: fortunes.yearly.heavenlyStem || '',
          earthlyBranch: fortunes.yearly.earthlyBranch || '',
          palaceNames: fortunes.yearly.palaceNames || []
        } : null,
        monthly: fortunes.monthly ? {
          heavenlyStem: fortunes.monthly.heavenlyStem || '',
          earthlyBranch: fortunes.monthly.earthlyBranch || '',
          palaceNames: fortunes.monthly.palaceNames || []
        } : null,
        daily: fortunes.daily ? {
          heavenlyStem: fortunes.daily.heavenlyStem || '',
          earthlyBranch: fortunes.daily.earthlyBranch || '',
          palaceNames: fortunes.daily.palaceNames || []
        } : null,
        hourly: fortunes.hourly ? {
          heavenlyStem: fortunes.hourly.heavenlyStem || '',
          earthlyBranch: fortunes.hourly.earthlyBranch || '',
          palaceNames: fortunes.hourly.palaceNames || []
        } : null,
        currentPalace: fortunes.currentPalace || ''
      };
      
      // 分析格局
      const patterns = this.analyzePatterns(chartData.palaces, center);
      
      console.log('准备设置数据到页面...');
      console.log('chart.palaces:', formattedPalaces);
      console.log('center:', center);
      console.log('fortune:', fortuneData);
      
      this.setData({
        chart: {
          summaryText: `基于${profile.name || '用户'}的出生信息生成`,
          palaces: formattedPalaces
        },
        center: center,
        fortune: fortuneData,
        analysis: {
          ...this.data.analysis,
          patterns: patterns
        }
      });
      
      console.log('数据设置完成，当前页面数据:');
      console.log('this.data.chart:', this.data.chart);
      console.log('this.data.center:', this.data.center);
      console.log('this.data.fortune:', this.data.fortune);
      
    } catch (error) {
      console.error('排盘生成失败:', error);
      this.setData({
        chart: { summaryText: '排盘生成失败，请检查出生信息', palaces: [] }
      });
    }
  },

  goSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  switchRange(e) {
    const range = e.currentTarget.dataset.range;
    const profile = this.data.activeProfile;
    const fortunes = buildFortunes(profile, range);
    this.setData({ fortunes });
  },

  runDiagnostics() {
    // 示例：对命宫/紫微等进行判断，展示接口用法
    const palace = '命宫';
    const star = '紫微';
    const checks = {
      palaceHasStars: api.palaceHasStars(palace, [star]),
      sanFangHasStars: api.sanFangSiZhengHasStars(palace, [star]),
      sanFangHasHua: api.sanFangSiZhengHasHua(palace, ['化禄','化权','化科','化忌']),
      starHasHua: api.starHasHua(star),
      starSanFangHasHua: api.starSanFangSiZhengHasHua(star),
      starIsBright: api.starIsBrightness(star, '庙') || api.starIsBrightness(star, '旺'),
      siHuaByJia: api.getSiHuaByTianGan('甲'),
      starPalace: api.getPalaceOfStar(star)?.name || null,
      starOpposite: api.getOppositePalaceOfStar(star) || null,
      isPalaceEmpty: api.isPalaceEmpty(palace),
      palaceFlyToSelf: api.palaceHasFlyingStarsTo(palace, palace),
      palaceFourHuaTargets: api.getPalaceFourHuaTargets(palace)
    };
    this.setData({ checks });
  },

  // 宫位点击事件
  onPalaceClick(e) {
    console.log('🎯 主页面收到宫位点击事件:', e.detail);
    
    const { palaceIndex, palace } = e.detail;
    
    // 安全检查
    if (!palace) {
      console.error('❌ 宫位数据为空:', e.detail);
      wx.showToast({
        title: '宫位数据无效',
        icon: 'error',
        duration: 2000
      });
      return;
    }
    
    // 显示宫位信息
    const palaceName = palace.name || `宫位${palaceIndex}`;
    wx.showToast({
      title: `点击了${palaceName}`,
      icon: 'none',
      duration: 2000
    });
    
    console.log('🎯 宫位详情:', {
      index: palaceIndex,
      name: palace.name,
      branch: palace.branch,
      row: palace.row,
      col: palace.col
    });
    
    // 不再自动清除高亮，让用户手动控制
    // 高亮会一直保持，直到用户点击其他宫位或手动清除
    console.log('🎯 三方四正高亮已激活，将一直保持');
  },

  // 切换连线显示
  toggleLines() {
    console.log('🔄 连线开关切换开始');
    console.log('🔄 当前showLines状态:', this.data.showLines);
    console.log('🔄 当前showLines类型:', typeof this.data.showLines);
    
    // 直接切换布尔值
    const newValue = !this.data.showLines;
    
    console.log('🔄 新值:', newValue);
    console.log('🔄 新值类型:', typeof newValue);
    
    this.setData({
      showLines: newValue
    });
    
    console.log('🔄 setData完成');
    console.log('🔄 当前showLines状态:', this.data.showLines);
    console.log('🔄 当前showLines类型:', typeof this.data.showLines);
    
    // 手动触发排盘组件重绘
    console.log('🔄 手动触发排盘组件重绘');
    const chartComponent = this.selectComponent('#zwds-chart');
    if (chartComponent) {
      console.log('🔄 找到排盘组件，调用drawChart');
      chartComponent.drawChart();
    } else {
      console.log('❌ 未找到排盘组件');
    }
  },

  // 测试排盘功能
  testChart() {
    console.log('🧪 测试排盘功能');
    
    try {
      // 直接在页面中定义示例数据，避免模块加载问题
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

      // 为测试数据补充宫干（十天干循环），仅用于展示“干支”
      const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
      const startStemIndex = 0; // 以甲起，按列表顺序顺行分配
      const samplePalacesWithStem = samplePalaces.map((p, idx) => ({
        ...p,
        heavenlyStem: STEMS[(startStemIndex + idx) % 10]
      }));
      
      // 流年数据
      const flowYearData = {
        currentFlowYear: {
          heavenlyStem: '乙',
          earthlyBranch: '巳',
          year: 2024,
          description: '乙巳年'
        }
      };
      
      console.log('✅ 示例宫位数据:', samplePalacesWithStem);
      console.log('✅ 流年数据:', flowYearData);
      
      // 验证数据完整性
      samplePalacesWithStem.forEach((palace, index) => {
        if (!palace.isEmpty) {
          console.log(`🔍 宫位 ${index}: ${palace.name} (${palace.branch}) - 星曜数量: ${palace.stars.length}`);
          palace.stars.forEach((star, starIndex) => {
            console.log(`  ${starIndex + 1}. ${star.name}${star.brightness ? ` (${star.brightness})` : ''}`);
          });
        }
      });
      
      // 更新数据
      this.setData({
        'chart.palaces': samplePalacesWithStem,
        flowYear: flowYearData
      });
      
      console.log('✅ 数据已更新到页面状态');
      console.log('🔍 检查页面数据状态:');
      console.log('  chart.palaces:', this.data.chart.palaces);
      console.log('  flowYear:', this.data.flowYear);
      
      // 等待数据更新完成后，手动触发排盘组件重绘
      setTimeout(() => {
        console.log('🔍 延迟检查数据状态:');
        console.log('  chart.palaces:', this.data.chart.palaces);
        console.log('  flowYear:', this.data.flowYear);
        
        // 手动触发排盘组件重绘
        const chartComponent = this.selectComponent('#zwds-chart');
        if (chartComponent) {
          console.log('✅ 找到排盘组件，手动触发重绘');
          if (chartComponent.drawChart) {
            chartComponent.drawChart();
            console.log('✅ 手动触发重绘完成');
          } else {
            console.log('❌ 排盘组件没有drawChart方法');
          }
        } else {
          console.log('❌ 未找到排盘组件');
        }
      }, 100);
      
      // 显示成功提示
      wx.showToast({
        title: '示例数据加载成功',
        icon: 'success',
        duration: 2000
      });
      
      console.log('✅ 示例数据已加载到排盘组件');
      
    } catch (error) {
      console.error('❌ 加载示例数据失败:', error);
      wx.showToast({
        title: '示例数据加载失败',
        icon: 'error',
        duration: 2000
      });
    }
  },

  // 获取生肖
  getZodiac(yearBranch) {
    const zodiacMap = {
      '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
      '辰': '龙', '巳': '蛇', '午': '马', '未': '羊',
      '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪'
    };
    return zodiacMap[yearBranch] || '';
  },

  // 获取星座
  getConstellation(month, day) {
    const constellations = [
      '摩羯座', '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座',
      '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座'
    ];
    
    const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22];
    let index = month - 1;
    
    if (day < dates[index]) {
      index = (index - 1 + 12) % 12;
    }
    
    return constellations[index];
  },

  // 获取命主
  getLord(yearBranch) {
    const lordMap = {
      '子': '贪狼', '丑': '巨门', '寅': '禄存', '卯': '文曲',
      '辰': '廉贞', '巳': '武曲', '午': '破军', '未': '武曲',
      '申': '廉贞', '酉': '文曲', '戌': '禄存', '亥': '巨门'
    };
    return lordMap[yearBranch] || '';
  },

  // 获取身主
  getBodyLord(yearBranch) {
    const bodyLordMap = {
      '子': '铃星', '丑': '天相', '寅': '天梁', '卯': '天同',
      '辰': '文昌', '巳': '天机', '午': '火星', '未': '天相',
      '申': '天梁', '酉': '天同', '戌': '文昌', '亥': '天机'
    };
    return bodyLordMap[yearBranch] || '';
  },

  // 计算年龄
  calculateAge(birthYear) {
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  },

  // 构建运限信息
  buildFortunes(profile) {
    // 模拟运限数据，参照 https://ziwei.pub/astrolabe/?d=19910122&t=1&leap=false&g=male&type=lunar&n=%E9%A3%8E%E5%85%88%E7%94%9F
    return {
      decadal: {
        heavenlyStem: '辛',
        earthlyBranch: '未',
        age: 35,
        palaceNames: ['夫妻', '兄弟', '命宫', '父母', '福德', '田宅', '官禄', '仆役', '迁移', '疾厄', '财帛', '子女']
      },
      yearly: {
        heavenlyStem: '乙',
        earthlyBranch: '巳',
        palaceNames: ['兄弟', '命宫', '父母', '福德', '田宅', '官禄', '仆役', '迁移', '疾厄', '财帛', '子女', '夫妻']
      },
      monthly: {
        heavenlyStem: '庚',
        earthlyBranch: '申',
        palaceNames: ['子女', '夫妻', '兄弟', '命宫', '父母', '福德', '田宅', '官禄', '仆役', '迁移', '疾厄', '财帛']
      },
      daily: {
        heavenlyStem: '戊',
        earthlyBranch: '午',
        palaceNames: ['子女', '夫妻', '兄弟', '命宫', '父母', '福德', '田宅', '官禄', '仆役', '迁移', '疾厄', '财帛']
      },
      hourly: {
        heavenlyStem: '壬',
        earthlyBranch: '子',
        palaceNames: ['子女', '夫妻', '兄弟', '命宫', '父母', '福德', '田宅', '官禄', '仆役', '迁移', '疾厄', '财帛']
      },
      currentPalace: '命宫',
      mingGong: '丑',
      shenGong: '卯',
      wuxingju: '土五局',
      mingZhu: '巨门',
      shenZhu: '天相'
    };
  },

  // 分析格局
  analyzePatterns(palaces, center) {
    try {
      const { analyzePatterns } = require('../../utils/pattern-analysis');
      return analyzePatterns(palaces, center);
    } catch (error) {
      console.error('格局分析失败:', error);
      return [];
    }
  },

  // 获取当前农历日期
  getCurrentLunarDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `${year}年${month}月${day}日`;
  },

  // 获取当前阳历日期
  getCurrentSolarDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 获取当前时间
  getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
});

