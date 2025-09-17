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
        time: '02:00',
        city: '太原市',
        calendarType: 'solar',
        trueSolarTime: true,
        description: '公历1991年1月22日太原出生的男性'
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
        description: '2000年1月22日北京出生的女性'
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
        description: '2005年1月22日广州出生的女性'
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
