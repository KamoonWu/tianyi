const { buildChartSummary, buildPalaceList, buildFortunes, loadActiveProfile } = require('../../utils/zwds');
const { analyzePatterns } = require('../../utils/pattern-analysis');
const api = require('../../utils/zwds-api');

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

  // 计算排盘（后端逻辑，前端只负责展示）
  calculateChart(profile) {
    console.log('🧮 开始计算排盘:', profile.name);
    
    try {
      // 这里应该调用后端API进行排盘计算
      // 目前使用模拟数据展示数据结构
      const chartData = this.mockChartCalculation(profile);
      
      this.setData({
        chart: chartData
      });
      
      console.log('✅ 排盘计算完成');
    } catch (error) {
      console.error('❌ 排盘计算失败:', error);
      wx.showToast({
        title: '排盘计算失败',
        icon: 'error'
      });
    }
  },

  // 模拟后端排盘计算（实际应替换为API调用）
  mockChartCalculation(profile) {
    // 这是模拟的排盘数据结构，实际应该从后端获取
    return {
      palaces: this.generateMockPalaces(profile),
      center: this.generateMockCenter(profile)
    };
  },

  // 生成模拟宫位数据（实际应从后端API获取）
  generateMockPalaces(profile) {
    // 这里应该调用后端API获取宫位数据
    // 目前使用模拟数据展示数据结构
    
    if (profile.id === 'empty') {
      // 空命例：显示标准宫位结构但无具体数据
      return this.generateEmptyPalacesWithStructure();
    }
    
    // 有效命例：从后端获取完整的宫位数据（目前模拟）
    return this.generateMockPalacesWithData(profile);
  },

  // 生成有数据的宫位（模拟后端返回的数据结构）
  generateMockPalacesWithData(profile) {
    // 这个函数应该被后端API调用替代
    // 宫位顺序和名称应该由后端根据排盘逻辑确定
    const mockPalaceData = [
      {
        name: '命宫',
        index: 0,
        branch: '寅',
        heavenlyStem: '甲',
        stars: this.generateMockStars(0),
        gods: this.generateMockGods(0) // 神煞数据
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
        name: '奴仆宫',
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

  // 生成空白宫位结构（用于空命例）
  generateEmptyPalacesWithStructure() {
    const standardPalaceNames = [
      '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
      '迁移宫', '奴仆宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
    ];
    
    return standardPalaceNames.map((name, index) => ({
      name: name,
      index: index,
      branch: '—',
      heavenlyStem: '—',
      stars: [],
      gods: [] // 空的神煞数据
    }));
  },

  // 生成模拟星曜数据
  generateMockStars(palaceIndex) {
    const allStars = [
      '紫微', '天机', '太阳', '武曲', '天同', '廉贞',
      '天府', '太阴', '贪狼', '巨门', '天相', '天梁',
      '七杀', '破军', '左辅', '右弼', '文昌', '文曲'
    ];
    
    // 每个宫位随机分配1-3个星曜
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
      lunarDate: this.calculateLunarDate(profile.date), // 应该从后端计算
      city: profile.city,
      clockTime: `${profile.date} ${profile.time}`,
      trueSolarTime: profile.trueSolarTime ? '已转换' : '未转换',
      lifeMaster: '贪狼', // 应该从后端计算
      bodyMaster: '天机', // 应该从后端计算
      ziDou: '子', // 应该从后端计算
      fiveElements: '水二局', // 应该从后端计算
      sign: this.calculateZodiacSign(profile.date), // 应该从后端计算
      zodiac: this.calculateChineseZodiac(profile.date), // 应该从后端计算
      fourPillars: {
        year: '辛未',
        month: '庚寅', 
        day: '癸巳',
        hour: '甲子'
      } // 应该从后端计算
    };
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

  // 生成空白宫位数据（已合并到generateEmptyPalacesWithStructure）

  // 生成模拟神煞数据（应该从后端获取）
  generateMockGods(palaceIndex) {
    // 这里应该调用后端API获取神煞数据
    // 不同宫位的神煞应该根据排盘逻辑计算
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

  // 显示命例选择器
  showProfileSelector() {
    console.log('📋 显示命例选择器');
    this.setData({
      showSelector: true
    });
  },

  // 隐藏命例选择器
  hideProfileSelector() {
    console.log('📋 隐藏命例选择器');
    this.setData({
      showSelector: false
    });
  },



  // 选择命例
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

  // 辅助函数：计算农历日期（应该从后端获取）
  calculateLunarDate(solarDate) {
    // 这里应该调用后端API计算农历
    return '庚午年腊月初七'; // 模拟数据
  },

  // 辅助函数：计算星座（应该从后端获取）
  calculateZodiacSign(date) {
    // 这里应该调用后端API计算星座
    return '水瓶座'; // 模拟数据
  },

  // 辅助函数：计算生肖（应该从后端获取）
  calculateChineseZodiac(date) {
    // 这里应该调用后端API计算生肖
    const year = new Date(date).getFullYear();
    const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    return zodiacAnimals[(year - 4) % 12];
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
   },


});

