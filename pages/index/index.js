const { buildChartSummary, buildPalaceList, buildFortunes, loadActiveProfile } = require('../../utils/zwds');
const { analyzePatterns } = require('../../utils/pattern-analysis');
const api = require('../../utils/zwds-api');

// 引入iztro库进行紫微斗数计算
const { astro } = require('iztro');

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

  // 计算排盘（使用iztro库进行真实计算）
  calculateChart(profile) {
    console.log('🧮 开始计算排盘:', profile.name);
    
    try {
      // 使用iztro库进行紫微斗数排盘计算
      const astrolabe = this.generateAstrolabe(profile);
      
      if (astrolabe) {
        const chartData = this.convertAstrolabeToChart(astrolabe, profile);
        
        this.setData({
          chart: chartData
        });
        
        console.log('✅ 排盘计算完成:', chartData);
      } else {
        throw new Error('无法生成星盘');
      }
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

  // 使用iztro库生成星盘
  generateAstrolabe(profile) {
    try {
      console.log('📅 生成星盘参数:', {
        date: profile.date,
        time: profile.time,
        gender: profile.gender
      });

      // 将时间字符串转换为时辰索引
      const timeIndex = this.convertTimeToIndex(profile.time);
      
      // 使用iztro库生成星盘
      const astrolabe = astro.bySolar(
        profile.date,           // 阳历日期
        timeIndex,              // 时辰索引
        profile.gender          // 性别
      );

      console.log('🌟 iztro生成的星盘:', astrolabe);
      return astrolabe;
    } catch (error) {
      console.error('❌ 生成星盘失败:', error);
      return null;
    }
  },

  // 将时间字符串转换为时辰索引
  convertTimeToIndex(timeStr) {
    // 解析时间字符串，如 "04:00"
    const [hour] = timeStr.split(':').map(Number);
    
    // 时辰对照表
    const timeIndexMap = {
      23: 0, 0: 0, 1: 0,        // 子时 23:00-01:00
      2: 1, 3: 1,               // 丑时 01:00-03:00
      4: 2, 5: 2,               // 寅时 03:00-05:00
      6: 3, 7: 3,               // 卯时 05:00-07:00
      8: 4, 9: 4,               // 辰时 07:00-09:00
      10: 5, 11: 5,             // 工时 09:00-11:00
      12: 6, 13: 6,             // 午时 11:00-13:00
      14: 7, 15: 7,             // 未时 13:00-15:00
      16: 8, 17: 8,             // 申时 15:00-17:00
      18: 9, 19: 9,             // 酉时 17:00-19:00
      20: 10, 21: 10,           // 戌时 19:00-21:00
      22: 11                    // 亥时 21:00-23:00
    };

    return timeIndexMap[hour] || 0;
  },

  // 将iztro星盘数据转换为前端需要的格式
  convertAstrolabeToChart(astrolabe, profile) {
    return {
      palaces: this.convertPalaces(astrolabe),
      center: this.convertCenter(astrolabe, profile)
    };
  },

  // 转换宫位数据
  convertPalaces(astrolabe) {
    const palaces = [];
    
    // iztro返回的palaces数组，按照命宫开始的顺序排列
    astrolabe.palaces.forEach((palace, index) => {
      const convertedPalace = {
        name: palace.name,                    // 宫位名称（如：命宫、兄弟宫等）
        index: index,                         // 宫位索引
        branch: palace.earthlyBranch,         // 地支
        heavenlyStem: palace.heavenlyStem,    // 天干
        stars: this.convertStars(palace.majorStars, palace.minorStars, palace.adjectiveStars),
        gods: this.convertGods(palace)        // 神煞
      };
      
      palaces.push(convertedPalace);
    });

    console.log('🏛️ 转换后的宫位数据:', palaces);
    return palaces;
  },

  // 转换星曜数据
  convertStars(majorStars = [], minorStars = [], adjectiveStars = []) {
    const allStars = [];

    // 主星
    majorStars.forEach(star => {
      allStars.push({
        name: star.name,
        brightness: star.brightness || '平',
        type: 'major'
      });
    });

    // 辅星
    minorStars.forEach(star => {
      allStars.push({
        name: star.name,
        brightness: star.brightness || '平',
        type: 'minor'
      });
    });

    // 杂曜
    adjectiveStars.forEach(star => {
      allStars.push({
        name: star.name,
        brightness: star.brightness || '平',
        type: 'adjective'
      });
    });

    return allStars;
  },

  // 转换神煞数据
  convertGods(palace) {
    const gods = [];
    
    // 从iztro的宫位数据中提取神煞信息
    // iztro在不同字段中存储了各种神煞信息
    
    // 长生十二神
    if (palace.changsheng12) {
      gods.push(palace.changsheng12);
    }
    
    // 博士十二神
    if (palace.boshi12) {
      gods.push(palace.boshi12);
    }
    
    // 将前十二神
    if (palace.jiangqian12) {
      gods.push(palace.jiangqian12);
    }
    
    // 岁前十二神
    if (palace.suiqian12) {
      gods.push(palace.suiqian12);
    }
    
    return gods;
  },

  // 转换中宫数据
  convertCenter(astrolabe, profile) {
    return {
      name: profile.name,
      gender: profile.gender,
      solarDate: profile.date,
      lunarDate: astrolabe.lunarDate,
      city: profile.city,
      clockTime: `${profile.date} ${profile.time}`,
      trueSolarTime: profile.trueSolarTime ? '已转换' : '未转换',
      lifeMaster: astrolabe.soul,        // 命主
      bodyMaster: astrolabe.body,        // 身主
      ziDou: astrolabe.earthlyBranchOfSoulPalace, // 紫微斗数中的紫斗位置
      fiveElements: astrolabe.fiveElementsClass,
      sign: astrolabe.sign,
      zodiac: astrolabe.zodiac,
      fourPillars: {
        year: astrolabe.chineseDate.split(' ')[0],
        month: astrolabe.chineseDate.split(' ')[1],
        day: astrolabe.chineseDate.split(' ')[2],
        hour: astrolabe.chineseDate.split(' ')[3]
      }
    };
  },

  // 生成空白宫位结构（用于空命例）
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
