import { useNavigate } from 'react-router-dom';
import {
  Smartphone,
  Activity,
  Zap,
  AlertTriangle,
  Play,
  Plus,
  BarChart3,
  Target,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppStore } from '../store';

export default function Dashboard() {
  const navigate = useNavigate();
  const devices = useAppStore((state) => state.devices);
  const deviceData = useAppStore((state) => state.deviceData);
  const alerts = useAppStore((state) => state.alerts);
  const scenes = useAppStore((state) => state.scenes);

  const onlineDevices = devices.filter((d) => d.online).length;
  const offlineDevices = devices.length - onlineDevices;
  const activeAlerts = alerts.filter((a) => a.status === 'active').length;

  const chartData = deviceData.slice(-12).map((data) => ({
    time: new Date(data.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    temperature: data.temperature,
    humidity: data.humidity,
  }));

  const quickActions = [
    { icon: <Smartphone size={24} />, label: '设备管理', action: () => navigate('/devices') },
    { icon: <Play size={24} />, label: '快速控制', action: () => navigate('/control') },
    { icon: <BarChart3 size={24} />, label: '查看数据', action: () => navigate('/monitor') },
    { icon: <Target size={24} />, label: '智能场景', action: () => navigate('/scenes') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">首页仪表板</h1>
          <p className="text-gray-500 mt-1">欢迎回来！查看您的物联网设备状态</p>
        </div>
        <button
          onClick={() => navigate('/devices')}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          添加设备
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">在线设备</p>
              <p className="text-3xl font-bold mt-2">{onlineDevices}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Smartphone size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">离线设备</p>
              <p className="text-3xl font-bold mt-2">{offlineDevices}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Smartphone size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">活跃场景</p>
              <p className="text-3xl font-bold mt-2">{scenes.filter((s) => s.enabled).length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">活动告警</p>
              <p className="text-3xl font-bold mt-2">{activeAlerts}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">实时数据监控</h2>
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-sm text-blue-600">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                温度
              </span>
              <span className="flex items-center text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                湿度
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-shadow text-gray-600 group-hover:text-primary-600">
                  {action.icon}
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">最近告警</h2>
        <div className="space-y-3">
          {alerts.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              className="flex items-center p-4 bg-gray-50 rounded-lg"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                  alert.level === 'high'
                    ? 'bg-red-100 text-red-600'
                    : alert.level === 'medium'
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{alert.message}</p>
                <p className="text-sm text-gray-500">
                  {new Date(alert.timestamp).toLocaleString('zh-CN')}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  alert.status === 'active'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                {alert.status === 'active' ? '活动' : '已解决'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
