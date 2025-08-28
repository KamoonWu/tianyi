Page({
  data: {
    profiles: [],
    activeProfileIndex: 0,
    calendarOptions: ['农历', '公历'],
    genderOptions: ['男', '女', '未知']
  },

  onShow() {
    const profiles = wx.getStorageSync('profiles') || [];
    const activeProfileIndex = wx.getStorageSync('activeProfileIndex') || 0;
    this.setData({ profiles, activeProfileIndex });
  },

  addProfile() {
    if (this.data.profiles.length >= 2) return;
    const newProfile = {
      name: '新档案',
      gender: 'unknown',
      calendarType: 'lunar',
      city: '北京市',
      trueSolarTime: true,
      date: '2001-12-01',
      time: '12:20'
    };
    const profiles = [...this.data.profiles, newProfile];
    this.setData({ profiles });
  },

  onFieldChange(e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    const profiles = this.data.profiles.slice();
    profiles[index][field] = value;
    this.setData({ profiles });
  },

  onPickerChange(e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    const profiles = this.data.profiles.slice();
    profiles[index][field] = value;
    this.setData({ profiles });
  },

  onCalendarChange(e) {
    const { index, field } = e.currentTarget.dataset;
    const selected = Number(e.detail.value);
    const profiles = this.data.profiles.slice();
    profiles[index][field] = selected === 0 ? 'lunar' : 'solar';
    this.setData({ profiles });
  },

  onGenderChange(e) {
    const { index, field } = e.currentTarget.dataset;
    const selected = Number(e.detail.value);
    const map = ['male', 'female', 'unknown'];
    const profiles = this.data.profiles.slice();
    profiles[index][field] = map[selected] || 'unknown';
    this.setData({ profiles });
  },

  onSwitchChange(e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    const profiles = this.data.profiles.slice();
    profiles[index][field] = !!value;
    this.setData({ profiles });
  },

  chooseActive(e) {
    const index = Number(e.currentTarget.dataset.index);
    this.setData({ activeProfileIndex: index });
  },

  saveProfiles() {
    wx.setStorageSync('profiles', this.data.profiles);
    wx.setStorageSync('activeProfileIndex', this.data.activeProfileIndex);
    wx.showToast({ title: '已保存', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 400);
  }
});

