import type { Device, DeviceData, Alert, Scene, User, Log } from '../types';

export const mockDevices: Device[] = [
  {
    id: '1',
    name: '客厅智能灯',
    type: 'light',
    status: 'on',
    location: { room: '客厅', floor: '1楼' },
    battery: 100,
    online: true,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: '2',
    name: '卧室温度传感器',
    type: 'sensor',
    status: 'on',
    location: { room: '主卧室', floor: '2楼' },
    battery: 85,
    online: true,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: '3',
    name: '客厅空调',
    type: 'climate',
    status: 'off',
    location: { room: '客厅', floor: '1楼' },
    battery: 100,
    online: true,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: '4',
    name: '前门智能锁',
    type: 'security',
    status: 'on',
    location: { room: '前门', floor: '1楼' },
    battery: 72,
    online: true,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: '5',
    name: '窗帘舵机',
    type: 'servo',
    status: 'off',
    location: { room: '客厅', floor: '1楼' },
    battery: 95,
    online: true,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: '6',
    name: '厨房烟雾传感器',
    type: 'sensor',
    status: 'on',
    location: { room: '厨房', floor: '1楼' },
    battery: 68,
    online: true,
    lastUpdate: new Date().toISOString(),
  },
];

export const mockDeviceData: DeviceData[] = Array.from({ length: 24 }, (_, i) => ({
  id: `data-${i}`,
  deviceId: '2',
  temperature: 22 + Math.sin(i / 4) * 3,
  humidity: 50 + Math.cos(i / 3) * 10,
  timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
}));

export const mockAlerts: Alert[] = [
  {
    id: '1',
    deviceId: '6',
    type: 'warning',
    message: '厨房烟雾传感器检测到异常',
    level: 'high',
    status: 'active',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '2',
    deviceId: '4',
    type: 'info',
    message: '前门智能锁电池电量低',
    level: 'low',
    status: 'active',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    deviceId: '2',
    type: 'warning',
    message: '卧室温度过高',
    level: 'medium',
    status: 'resolved',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const mockScenes: Scene[] = [
  {
    id: '1',
    name: '回家模式',
    description: '打开客厅灯，调节空调温度',
    enabled: true,
    triggers: ['time:18:00'],
    actions: [
      { id: '1', sceneId: '1', deviceId: '1', action: 'turnOn', params: {} },
      { id: '2', sceneId: '1', deviceId: '3', action: 'setTemperature', params: { temperature: 24 } },
    ],
  },
  {
    id: '2',
    name: '睡眠模式',
    description: '关闭所有灯，调低空调温度',
    enabled: true,
    triggers: ['time:22:00'],
    actions: [
      { id: '3', sceneId: '2', deviceId: '1', action: 'turnOff', params: {} },
      { id: '4', sceneId: '2', deviceId: '3', action: 'setTemperature', params: { temperature: 22 } },
    ],
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    email: 'admin@example.com',
  },
  {
    id: '2',
    username: 'operator',
    role: 'operator',
    email: 'operator@example.com',
  },
];

export const mockLogs: Log[] = [
  {
    id: '1',
    type: 'operation',
    message: '用户 admin 登录系统',
    userId: '1',
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: '2',
    type: 'operation',
    message: '开启客厅智能灯',
    userId: '1',
    timestamp: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: '3',
    type: 'system',
    message: '系统自动备份完成',
    userId: 'system',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
];
