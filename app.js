import updateManager from './common/updateManager';

App({
  globalData: {
    activeProfileIndex: 0,
    profiles: [
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
      },
      {
        id: 'empty',
        name: '空',
        gender: null,
        date: null,
        time: null,
        city: null,
        calendarType: null,
        trueSolarTime: null,
        description: '空白命例，用于查看数据展示逻辑'
      }
    ]
  },

  onLaunch() {
    try {
      // 初始化用户配置
      const stored = wx.getStorageSync('profiles');
      if (!stored) {
        wx.setStorageSync('profiles', this.globalData.profiles);
        wx.setStorageSync('activeProfileIndex', 0);
      }
      updateManager();
    } catch (e) {
      console.error('初始化存储失败', e);
    }
  },

  onShow() {
    updateManager();
  },

  // 获取当前用户配置
  getCurrentProfile() {
    const index = wx.getStorageSync('activeProfileIndex') || 0;
    return this.globalData.profiles[index];
  },

  // 切换用户配置
  switchProfile(index) {
    if (index >= 0 && index < this.globalData.profiles.length) {
      wx.setStorageSync('activeProfileIndex', index);
      this.globalData.activeProfileIndex = index;
      return this.globalData.profiles[index];
    }
    return null;
  },

  // 获取所有用户配置
  getAllProfiles() {
    return this.globalData.profiles;
  }
});
