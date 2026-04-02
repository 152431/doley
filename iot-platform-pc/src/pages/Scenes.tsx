import { Zap, Play, Pause, Edit, Trash2, Plus, Clock, Calendar } from 'lucide-react';
import { useAppStore } from '../store';

export default function Scenes() {
  const scenes = useAppStore((state) => state.scenes);
  const toggleScene = useAppStore((state) => state.toggleScene);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">智能场景</h1>
          <p className="text-gray-500 mt-1">管理您的自动化场景</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus size={18} className="mr-2" />
          创建场景
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                    scene.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{scene.name}</h3>
                  <p className="text-sm text-gray-500">{scene.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleScene(scene.id)}
                className={`w-14 h-8 rounded-full transition-colors relative ${
                  scene.enabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    scene.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={16} className="mr-2" />
                <span>触发条件: {scene.triggers.join(', ')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Zap size={16} className="mr-2" />
                <span>执行动作: {scene.actions.length} 个</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  scene.enabled
                    ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                {scene.enabled ? <Pause size={16} className="mr-1" /> : <Play size={16} className="mr-1" />}
                {scene.enabled ? '暂停' : '执行'}
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
