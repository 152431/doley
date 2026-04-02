# 物联网控制平台微信小程序

一个功能完整的微信小程序物联网控制平台，支持多种设备类型的管理与控制。

## 功能特性

### 设备类型支持
- **智能灯光** - 亮度调节、色温控制、颜色选择、场景模式
- **传感器** - 温度、湿度、空气质量、光照强度等数据监测
- **环境控制** - 空调、新风系统等设备的温度、模式、风速控制
- **安防设备** - 智能门锁、摄像头监控、告警管理
- **机械手舵机** - 多通道舵机角度控制、预设动作、手动操控

### 核心功能模块

#### 1. 设备控制
- 设备开关控制
- 实时状态反馈
- 参数调节（亮度、温度、角度等）
- 场景联动

#### 2. 数据监控
- 实时传感器数据展示
- 历史数据图表
- 阈值告警设置
- 数据趋势分析

#### 3. 设备管理
- 设备添加/删除
- 设备分组
- 房间管理
- 设备状态监控

#### 4. 智能场景
- 一键场景执行
- 自动化规则设置
- 定时任务管理
- 场景编辑与分享

## 项目结构

```
├── app.js                 # 小程序入口
├── app.json               # 小程序配置
├── app.wxss               # 全局样式
├── project.config.json    # 项目配置
├── sitemap.json           # 站点地图
├── api/                   # API接口
│   └── index.js           # 接口定义
├── utils/                 # 工具函数
│   └── util.js            # 通用工具
├── pages/                 # 页面
│   ├── index/             # 首页
│   ├── devices/           # 设备管理
│   ├── control/           # 设备控制
│   ├── monitor/           # 数据监控
│   ├── scenes/            # 智能场景
│   └── profile/           # 个人中心
├── components/            # 公共组件
│   ├── device-card/       # 设备卡片
│   ├── slider-control/    # 滑块控制
│   ├── empty-state/       # 空状态
│   └── loading/           # 加载组件
└── assets/                # 静态资源
    ├── icons/             # 图标
    └── styles/            # 样式
```

## 使用说明

### 开发环境配置

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

2. 导入项目
   - 打开微信开发者工具
   - 选择"导入项目"
   - 选择本项目目录
   - 填写 AppID（可在 project.config.json 中修改）

3. 配置服务器地址
   - 修改 `app.js` 中的 `baseUrl` 和 `wsUrl`
   - 根据实际后端服务地址进行配置

### 后端接口对接

项目预设了完整的 API 接口定义，位于 `api/index.js`：

- `deviceApi` - 设备管理接口
- `sensorApi` - 传感器数据接口
- `lightApi` - 灯光控制接口
- `environmentApi` - 环境控制接口
- `securityApi` - 安防设备接口
- `servoApi` - 舵机控制接口
- `sceneApi` - 场景管理接口
- `userApi` - 用户相关接口

### 图标资源

项目使用 iconfont 图标，需要：
1. 在 iconfont.cn 创建图标项目
2. 下载字体文件替换 `assets/styles/iconfont.wxss`
3. 或使用图片图标放置在 `assets/icons/` 目录

## 技术栈

- 微信小程序原生框架
- WXSS 样式
- Component 组件化开发
- Promise 异步处理

## 注意事项

1. 首次运行需要配置合法的 AppID
2. 网络请求需要在小程序后台配置服务器域名
3. 部分功能需要真机调试才能正常使用
4. WebSocket 连接需要 wss 协议支持

## 版本历史

### v1.0.0
- 初始版本发布
- 支持五种设备类型
- 完整的控制、监控、场景功能
- 响应式UI设计
