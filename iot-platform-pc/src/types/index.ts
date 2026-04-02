export interface Device {
  id: string;
  name: string;
  type: 'light' | 'sensor' | 'climate' | 'security' | 'servo';
  status: 'on' | 'off';
  location: {
    room: string;
    floor: string;
  };
  battery: number;
  online: boolean;
  lastUpdate: string;
}

export interface DeviceData {
  id: string;
  deviceId: string;
  temperature?: number;
  humidity?: number;
  value?: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  deviceId: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  level: 'low' | 'medium' | 'high';
  status: 'active' | 'resolved';
  timestamp: string;
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  triggers: string[];
  actions: SceneAction[];
}

export interface SceneAction {
  id: string;
  sceneId: string;
  deviceId: string;
  action: string;
  params: Record<string, any>;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'operator';
  email: string;
}

export interface Log {
  id: string;
  type: 'operation' | 'system' | 'error';
  message: string;
  userId: string;
  timestamp: string;
}
