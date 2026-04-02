import { Users, Settings, Activity, Shield, Database, Bell, Clock } from 'lucide-react';
import { useAppStore } from '../store';

export default function Platform() {
  const users = useAppStore((state) => state.users);
  const logs = useAppStore((state) => state.logs);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">平台管理</h1>
        <p className="text-gray-500 mt-1">管理系统配置和用户</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷设置</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors text-left">
                <Settings size={20} className="mr-3" />
                <span className="font-medium">系统设置</span>
              </button>
              <button className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors text-left">
                <Shield size={20} className="mr-3" />
                <span className="font-medium">安全设置</span>
              </button>
              <button className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors text-left">
                <Database size={20} className="mr-3" />
                <span className="font-medium">数据管理</span>
              </button>
              <button className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors text-left">
                <Bell size={20} className="mr-3" />
                <span className="font-medium">通知设置</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">用户管理</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-medium mr-4">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {user.role === 'admin' ? '管理员' : '操作员'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">系统日志</h2>
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 mt-0.5 ${
                      log.type === 'operation'
                        ? 'bg-blue-100 text-blue-600'
                        : log.type === 'system'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    <Activity size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{log.message}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock size={12} className="mr-1" />
                      {new Date(log.timestamp).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
