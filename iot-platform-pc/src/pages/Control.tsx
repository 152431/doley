import { Power, Sun, Thermometer, Fan, Lock, Settings2 } from 'lucide-react';
import { useAppStore } from '../store';

export default function Control() {
  const devices = useAppStore((state) => state.devices);
  const toggleDeviceStatus = useAppStore((state) => state.toggleDeviceStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设备控制</h1>
        <p className="text-gray-500 mt-1">实时控制您的物联网设备</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {devices.map((device) => (
          <div
            key={device.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                    device.status === 'on' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {device.type === 'light' && <Sun size={24} />}
                  {device.type === 'climate' && <Thermometer size={24} />}
                  {device.type === 'security' && <Lock size={24} />}
                  {device.type === 'servo' && <Settings2 size={24} />}
                  {device.type === 'sensor' && <Fan size={24} />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{device.name}</h3>
                  <p className="text-sm text-gray-500">{device.location.room}</p>
                </div>
              </div>
              <button
                onClick={() => toggleDeviceStatus(device.id)}
                className={`w-14 h-8 rounded-full transition-colors relative ${
                  device.status === 'on' ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    device.status === 'on' ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {device.type === 'light' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">亮度</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">色温</label>
                  <div className="flex space-x-2">
                    {['暖光', '自然光', '冷光'].map((temp, i) => (
                      <button
                        key={i}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          i === 1
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {temp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {device.type === 'climate' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">温度</label>
                  <div className="flex items-center justify-center space-x-4">
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      -
                    </button>
                    <span className="text-3xl font-bold text-gray-900">24°C</span>
                    <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">模式</label>
                  <div className="flex space-x-2">
                    {['制冷', '制热', '除湿', '送风'].map((mode, i) => (
                      <button
                        key={i}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          i === 0
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
