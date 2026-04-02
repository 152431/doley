import { create } from 'zustand';
import type { Device, DeviceData, Alert, Scene, User, Log } from '../types';
import {
  mockDevices,
  mockDeviceData,
  mockAlerts,
  mockScenes,
  mockUsers,
  mockLogs,
} from '../data/mockData';

interface AppState {
  devices: Device[];
  deviceData: DeviceData[];
  alerts: Alert[];
  scenes: Scene[];
  users: User[];
  logs: Log[];
  currentUser: User | null;
  selectedDevice: Device | null;
  
  setDevices: (devices: Device[]) => void;
  setDeviceData: (deviceData: DeviceData[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  setScenes: (scenes: Scene[]) => void;
  setUsers: (users: User[]) => void;
  setLogs: (logs: Log[]) => void;
  setCurrentUser: (user: User | null) => void;
  setSelectedDevice: (device: Device | null) => void;
  
  toggleDeviceStatus: (deviceId: string) => void;
  updateDevice: (deviceId: string, updates: Partial<Device>) => void;
  addLog: (log: Log) => void;
  resolveAlert: (alertId: string) => void;
  toggleScene: (sceneId: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  devices: mockDevices,
  deviceData: mockDeviceData,
  alerts: mockAlerts,
  scenes: mockScenes,
  users: mockUsers,
  logs: mockLogs,
  currentUser: mockUsers[0],
  selectedDevice: null,

  setDevices: (devices) => set({ devices }),
  setDeviceData: (deviceData) => set({ deviceData }),
  setAlerts: (alerts) => set({ alerts }),
  setScenes: (scenes) => set({ scenes }),
  setUsers: (users) => set({ users }),
  setLogs: (logs) => set({ logs }),
  setCurrentUser: (currentUser) => set({ currentUser }),
  setSelectedDevice: (selectedDevice) => set({ selectedDevice }),

  toggleDeviceStatus: (deviceId) =>
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === deviceId
          ? { ...device, status: device.status === 'on' ? 'off' : 'on' }
          : device
      ),
    })),

  updateDevice: (deviceId, updates) =>
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === deviceId ? { ...device, ...updates } : device
      ),
    })),

  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs],
    })),

  resolveAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      ),
    })),

  toggleScene: (sceneId) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId ? { ...scene, enabled: !scene.enabled } : scene
      ),
    })),
}));
