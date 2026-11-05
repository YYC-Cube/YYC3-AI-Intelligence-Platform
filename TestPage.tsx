export default function TestPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-4">YYC3 · AI Platform Test</h1>
          <p className="text-xl text-blue-100 mb-6">测试页面 - 验证React渲染是否正常</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-white font-bold text-lg">状态</div>
              <div className="text-blue-100">✅ 正常运行</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-white font-bold text-lg">端口</div>
              <div className="text-blue-100">3201</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">功能测试</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-slate-700">React组件渲染</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-slate-700">Tailwind CSS样式</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-slate-700">Lucide图标库</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-slate-700">响应式布局</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => (window.location.href = '/')}
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
            >
              返回主页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
