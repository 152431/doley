import { useState } from 'react';
import { Smartphone, Search, Filter, Plus, Edit, Trash2, Power, Battery, Wifi } from 'lucide-react';
import { useAppStore } from '../store';

export default function Devices() {
  const devices = useAppStore((state) => state.devices);
  const toggleDeviceStatus = useAppStore((state) => state.toggleDeviceStatus);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDevices = devices.filter((device) =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'light':
        return '💡';
      case 'sensor':
        return '🌡️';
      case 'climate':
        return '❄️';
      case 'security':
        return '🔒';
      case 'servo':
        return '⚙️';
      default:
        return '📱';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">设备管理</h1>
          <p className="text-gray-500 mt-1">管理您的所有物联网设备</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus size={18} className="mr-2" />
          添加设备
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索设备..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={18} className="mr-2" />
            筛选
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="text-3xl mr-3">{getDeviceTypeIcon(device.type)}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{device.name}</h3>
                  <p className="text-sm text-gray-500">{device.location.room} · {device.location.floor}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span
                  className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    device.online ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Wifi size={12} className="mr-1" />
                  {device.online ? '在线' : '离线'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Battery size={16} className="mr-1" />
                电量: {device.battery}%
              </div>
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    device.status === 'on' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {device.status === 'on' ? '开启' : '关闭'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => toggleDeviceStatus(device.id)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  device.status === 'on'
                    ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                }`}
              >
                <Power size={16} className="mr-1" />
                {device.status === 'on' ? '关闭' : '开启'}
              </button>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Edit size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
