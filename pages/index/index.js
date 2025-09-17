const { buildChartSummary, buildPalaceList, buildFortunes, loadActiveProfile } = require('../../utils/zwds');
const { analyzePatterns } = require('../../utils/pattern-analysis');
const api = require('../../utils/zwds-api');
const { computeChartWithIztro, computeRawChart } = require('../../utils/iztro-adapter');

Page({
  data: {
    chart: {
      palaces: [],
      center: {}
    },
    // 命例选择相关数据
    profiles: [],
    currentProfileIndex: 0,
    showSelector: false,
    // 添加流年数据
    flowYear: {
      currentFlowYear: {
        heavenlyStem: '乙',
        earthlyBranch: '巳',
        year: 2024
      }
    }
  },

  onLoad() {
    console.log('🚀 页面加载开始');
    this.initializeProfiles();
    this.loadCurrentProfile();
  },

  // 初始化命例数据
  initializeProfiles() {
    const app = getApp();
    const profiles = app.getAllProfiles();
    const currentIndex = wx.getStorageSync('activeProfileIndex') || 0;
    
    this.setData({
      profiles: profiles,
      currentProfileIndex: currentIndex
    });
    
    console.log('📋 命例数据初始化完成:', {
      profiles: profiles.length,
      currentIndex
    });
  },

  // 加载当前选中的命例
  loadCurrentProfile() {
    const app = getApp();
    const currentProfile = app.getCurrentProfile();
    
    console.log('👤 当前命例:', currentProfile);
    
    if (currentProfile && currentProfile.id !== 'empty') {
      // 有效的命例数据，进行排盘计算
      this.calculateChart(currentProfile);
    } else {
      // 空命例或无效数据，显示空白排盘
      this.showEmptyChart();
    }
  },

  // 计算排盘（使用iztro适配器）
  calculateChart(profile) {
    console.log('🧮 开始计算排盘:', profile.name);
    
    try {
      // 首先尝试使用iztro适配器
      const iztroResult = this.tryIztroCalculation(profile);
      
      if (iztroResult) {
        console.log('✅ 使用iztro计算成功');
        const chartData = this.convertIztroToChart(iztroResult, profile);
        this.setData({ chart: chartData });
      } else {
        console.log('⚠️ iztro不可用，使用模拟数据');
        const chartData = this.generateMockChart(profile);
        this.setData({ chart: chartData });
      }
      
      console.log('✅ 排盘计算完成');
    } catch (error) {
      console.error('❌ 排盘计算失败:', error);
      wx.showToast({
        title: '排盘计算失败',
        icon: 'error'
      });
      // 失败时显示空白排盘
      this.showEmptyChart();
    }
  },

  // 尝试使用iztro计算
  tryIztroCalculation(profile) {
    try {
      // 使用适配器尝试计算
      const rawChart = computeRawChart(profile);
      if (rawChart) {
        return rawChart;
      }
      
      // 尝试使用适配器的高级接口
      const chartResult = computeChartWithIztro(profile);
      if (chartResult && chartResult.__raw) {
        return chartResult.__raw;
      }
      
      return null;
    } catch (error) {
      console.warn('iztro计算失败:', error);
      return null;
    }
  },

  // 转换iztro数据为前端格式
  convertIztroToChart(astrolabe, profile) {
    try {
      return {
        palaces: this.convertIztroPalaces(astrolabe),
        center: this.convertIztroCenter(astrolabe, profile)
      };
    } catch (error) {
      console.error('转换iztro数据失败:', error);
      return this.generateMockChart(profile);
    }
  },

  // 转换iztro宫位数据
  convertIztroPalaces(astrolabe) {
    const palaces = [];
    
    // 尝试从不同可能的字段获取宫位数据
    const palaceData = astrolabe.palaces || astrolabe.gong || astrolabe.palaceList || [];
    
    palaceData.forEach((palace, index) => {
      const convertedPalace = {
        name: palace.name || palace.label || `宫位${index + 1}`,
        index: index,
        branch: palace.earthlyBranch || palace.branch || '—',
        heavenlyStem: palace.heavenlyStem || palace.stem || '—',
        stars: this.convertIztroStars(palace),
        gods: this.convertIztroGods(palace)
      };
      
      palaces.push(convertedPalace);
    });

    console.log('��️ 转换后的宫位数据:', palaces);
    return palaces;
  },

  // 转换iztro星曜数据
  convertIztroStars(palace) {
    const allStars = [];
    
    // 主星
    if (palace.majorStars && Array.isArray(palace.majorStars)) {
      palace.majorStars.forEach(star => {
        allStars.push({
          name: star.name || star,
          brightness: star.brightness || '平',
          type: 'major'
        });
      });
    }

    // 辅星
    if (palace.minorStars && Array.isArray(palace.minorStars)) {
      palace.minorStars.forEach(star => {
        allStars.push({
          name: star.name || star,
          brightness: star.brightness || '平',
          type: 'minor'
        });
      });
    }

    // 杂曜
    if (palace.adjectiveStars && Array.isArray(palace.adjectiveStars)) {
      palace.adjectiveStars.forEach(star => {
        allStars.push({
          name: star.name || star,
          brightness: star.brightness || '平',
          type: 'adjective'
        });
      });
    }

    // 兼容其他格式
    if (palace.stars && Array.isArray(palace.stars)) {
      palace.stars.forEach(star => {
        allStars.push({
          name: star.name || star,
          brightness: star.brightness || '平',
          type: 'star'
        });
      });
    }

    return allStars;
  },

  // 转换iztro神煞数据
  convertIztroGods(palace) {
    const gods = [];
    
    // 从不同字段提取神煞信息
    if (palace.changsheng12) gods.push(palace.changsheng12);
    if (palace.boshi12) gods.push(palace.boshi12);
    if (palace.jiangqian12) gods.push(palace.jiangqian12);
    if (palace.suiqian12) gods.push(palace.suiqian12);
    
    // 兼容其他格式
    if (palace.gods && Array.isArray(palace.gods)) {
      palace.gods.forEach(god => {
        gods.push(god.name || god);
      });
    }
    
    return gods;
  },

  // 转换iztro中宫数据
  convertIztroCenter(astrolabe, profile) {
    return {
      name: profile.name,
      gender: profile.gender,
      solarDate: profile.date,
      lunarDate: astrolabe.lunarDate || '—',
      city: profile.city,
      clockTime: `${profile.date} ${profile.time}`,
      trueSolarTime: profile.trueSolarTime ? '已转换' : '未转换',
      lifeMaster: astrolabe.soul || '—',
      bodyMaster: astrolabe.body || '—',
      ziDou: astrolabe.earthlyBranchOfSoulPalace || '—',
      fiveElements: astrolabe.fiveElementsClass || '—',
      sign: astrolabe.sign || '—',
      zodiac: astrolabe.zodiac || '—',
      fourPillars: this.extractFourPillars(astrolabe)
    };
  },

  // 提取四柱信息
  extractFourPillars(astrolabe) {
    if (astrolabe.chineseDate && typeof astrolabe.chineseDate === 'string') {
      const parts = astrolabe.chineseDate.split(' ');
      return {
        year: parts[0] || '—',
        month: parts[1] || '—',
        day: parts[2] || '—',
        hour: parts[3] || '—'
      };
    }
    
    if (astrolabe.rawDates && astrolabe.rawDates.chineseDate) {
      const cd = astrolabe.rawDates.chineseDate;
      return {
        year: cd.yearly ? `${cd.yearly[0]}${cd.yearly[1]}` : '—',
        month: cd.monthly ? `${cd.monthly[0]}${cd.monthly[1]}` : '—',
        day: cd.daily ? `${cd.daily[0]}${cd.daily[1]}` : '—',
        hour: cd.hourly ? `${cd.hourly[0]}${cd.hourly[1]}` : '—'
      };
    }
    
    return {
      year: '—',
      month: '—',
      day: '—',
      hour: '—'
    };
  },

  // 生成模拟排盘数据
  generateMockChart(profile) {
    return {
      palaces: this.generateMockPalaces(profile),
      center: this.generateMockCenter(profile)
    };
  },

  // 生成模拟宫位数据
  generateMockPalaces(profile) {
    if (profile.id === 'empty') {
      return this.generateEmptyPalacesWithStructure();
    }
    
    return this.generateMockPalacesWithData(profile);
  },

  // 生成有数据的宫位（模拟数据）
  generateMockPalacesWithData(profile) {
    const mockPalaceData = [
      {
        name: '命宫',
        index: 0,
        branch: '寅',
        heavenlyStem: '甲',
        stars: this.generateMockStars(0),
        gods: this.generateMockGods(0)
      },
      {
        name: '兄弟宫',
        index: 1,
        branch: '卯',
        heavenlyStem: '乙',
        stars: this.generateMockStars(1),
        gods: this.generateMockGods(1)
      },
      {
        name: '夫妻宫',
        index: 2,
        branch: '辰',
        heavenlyStem: '丙',
        stars: this.generateMockStars(2),
        gods: this.generateMockGods(2)
      },
      {
        name: '子女宫',
        index: 3,
        branch: '巳',
        heavenlyStem: '丁',
        stars: this.generateMockStars(3),
        gods: this.generateMockGods(3)
      },
      {
        name: '财帛宫',
        index: 4,
        branch: '午',
        heavenlyStem: '戊',
        stars: this.generateMockStars(4),
        gods: this.generateMockGods(4)
      },
      {
        name: '疾厄宫',
        index: 5,
        branch: '未',
        heavenlyStem: '己',
        stars: this.generateMockStars(5),
        gods: this.generateMockGods(5)
      },
      {
        name: '迁移宫',
        index: 6,
        branch: '申',
        heavenlyStem: '庚',
        stars: this.generateMockStars(6),
        gods: this.generateMockGods(6)
      },
      {
        name: '交友宫',
        index: 7,
        branch: '酉',
        heavenlyStem: '辛',
        stars: this.generateMockStars(7),
        gods: this.generateMockGods(7)
      },
      {
        name: '官禄宫',
        index: 8,
        branch: '戌',
        heavenlyStem: '壬',
        stars: this.generateMockStars(8),
        gods: this.generateMockGods(8)
      },
      {
        name: '田宅宫',
        index: 9,
        branch: '亥',
        heavenlyStem: '癸',
        stars: this.generateMockStars(9),
        gods: this.generateMockGods(9)
      },
      {
        name: '福德宫',
        index: 10,
        branch: '子',
        heavenlyStem: '甲',
        stars: this.generateMockStars(10),
        gods: this.generateMockGods(10)
      },
      {
        name: '父母宫',
        index: 11,
        branch: '丑',
        heavenlyStem: '乙',
        stars: this.generateMockStars(11),
        gods: this.generateMockGods(11)
      }
    ];
    
    return mockPalaceData;
  },

  // 生成空白宫位结构
  generateEmptyPalacesWithStructure() {
    const standardPalaceNames = [
      '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
      '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
    ];
    
    return standardPalaceNames.map((name, index) => ({
      name: name,
      index: index,
      branch: '—',
      heavenlyStem: '—',
      stars: [],
      gods: []
    }));
  },

  // 生成模拟星曜数据
  generateMockStars(palaceIndex) {
    const allStars = [
      '紫微', '天机', '太阳', '武曲', '天同', '廉贞',
      '天府', '太阴', '贪狼', '巨门', '天相', '天梁',
      '七杀', '破军', '左辅', '右弼', '文昌', '文曲'
    ];
    
    const starCount = Math.floor(Math.random() * 3) + 1;
    const selectedStars = [];
    
    for (let i = 0; i < starCount; i++) {
      const randomIndex = (palaceIndex * 3 + i) % allStars.length;
      selectedStars.push({
        name: allStars[randomIndex],
        brightness: ['庙', '旺', '得', '利', '平', '不'][Math.floor(Math.random() * 6)],
        type: i === 0 ? 'major' : 'minor'
      });
    }
    
    return selectedStars;
  },

  // 生成模拟中宫数据
  generateMockCenter(profile) {
    return {
      name: profile.name,
      gender: profile.gender,
      solarDate: profile.date,
      lunarDate: '庚午年腊月初七',
      city: profile.city,
      clockTime: `${profile.date} ${profile.time}`,
      trueSolarTime: profile.trueSolarTime ? '已转换' : '未转换',
      lifeMaster: '贪狼',
      bodyMaster: '天机',
      ziDou: '子',
      fiveElements: '水二局',
      sign: '水瓶座',
      zodiac: '马',
      fourPillars: {
        year: '辛未',
        month: '庚寅', 
        day: '癸巳',
        hour: '甲子'
      }
    };
  },

  // 生成模拟神煞数据
  generateMockGods(palaceIndex) {
    const mockGods = [
      ['岁建', '青龙', '博士'],
      ['晦气', '丧门', '力士'],
      ['龙德', '白虎', '青龙'],
      ['紫微', '天德', '月德'],
      ['天喜', '红鸾', '天姚'],
      ['孤辰', '寡宿', '蜚廉'],
      ['破碎', '华盖', '咸池'],
      ['天空', '劫煞', '灾煞'],
      ['天刑', '指背', '咸池'],
      ['月煞', '亡神', '天德'],
      ['解神', '天喜', '红鸾'],
      ['天马', '驿马', '华盖']
    ];
    
    return mockGods[palaceIndex] || [];
  },

  // 显示空白排盘
  showEmptyChart() {
    console.log('📄 显示空白排盘');
    
    this.setData({
      chart: {
        palaces: this.generateEmptyPalacesWithStructure(),
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
          fiveElements: '—',
          sign: '—',
          zodiac: '—',
          fourPillars: {
            year: '—',
            month: '—',
            day: '—',
            hour: '—'
          }
        }
      }
    });
  },

  // 显示命例选择器 - 使用原生ActionSheet
  showProfileSelector() {
    console.log('📋 显示命例选择器');
    
    const app = getApp();
    const profiles = app.getAllProfiles();
    
    // 构建ActionSheet的选项数组
    const itemList = profiles.map(profile => {
      const currentIndex = this.data.currentProfileIndex;
      const isActive = profiles[currentIndex] && profiles[currentIndex].id === profile.id;
      return `${isActive ? '✓ ' : ''}${profile.name}`;
    });
    
    wx.showActionSheet({
      itemList: itemList,
      success: (res) => {
        console.log('🎯 用户选择了命例:', res.tapIndex);
        this.selectProfileByIndex(res.tapIndex);
      },
      fail: (res) => {
        console.log('❌ 用户取消选择:', res);
      }
    });
  },

  // 根据索引选择命例
  selectProfileByIndex(index) {
    const app = getApp();
    const profiles = app.getAllProfiles();
    
    if (index >= 0 && index < profiles.length) {
      const selectedProfile = app.switchProfile(index);
      
      console.log('🔄 切换命例:', selectedProfile.name);
      
      this.setData({
        currentProfileIndex: index
      });
      
      // 重新加载排盘数据
      this.loadCurrentProfile();
      
      wx.showToast({
        title: `已切换到${selectedProfile.name}`,
        icon: 'success'
      });
    }
  },

  // 隐藏命例选择器（保留方法，但不再使用）
  hideProfileSelector() {
    console.log('📋 隐藏命例选择器');
    this.setData({
      showSelector: false
    });
  },

  // 选择命例（保留方法，但不再使用）
  selectProfile(e) {
    const index = e.currentTarget.dataset.index;
    const app = getApp();
    const selectedProfile = app.switchProfile(index);
    
    console.log('🔄 切换命例:', selectedProfile.name);
    
    this.setData({
      currentProfileIndex: index,
      showSelector: false
    });
    
    // 重新加载排盘数据
    this.loadCurrentProfile();
    
    wx.showToast({
      title: `已切换到${selectedProfile.name}`,
      icon: 'success'
    });
  },

  // 设置页面跳转
  goSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  // 测试功能（保留用于调试）
  testChart() {
    console.log('🧪 测试排盘功能');
    this.loadCurrentProfile();
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
      stars: palace.stars
    });
  }
});
