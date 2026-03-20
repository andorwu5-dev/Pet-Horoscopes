import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, PawPrint, Calendar, Heart, Info, RefreshCw, Wand2, Quote } from 'lucide-react';
import { getPetFortune, PetInfo } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [petInfo, setPetInfo] = useState<PetInfo>({
    name: '',
    type: '猫',
    breed: '',
    birthday: '',
    personality: '',
  });
  const [fortune, setFortune] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'result'>('input');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPetInfo(prev => ({ ...prev, [name]: value }));
  };

  const generateFortune = async () => {
    if (!petInfo.name || !petInfo.breed) {
      alert('请填写宠物的名字和品种哦！');
      return;
    }
    setLoading(true);
    const result = await getPetFortune(petInfo);
    setFortune(result);
    setLoading(false);
    setStep('result');
  };

  const reset = () => {
    setStep('input');
    setFortune(null);
  };

  return (
    <div className="min-h-screen font-sans text-stone-800 pb-12">
      {/* Header */}
      <header className="pt-12 pb-8 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block mb-2"
        >
          <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
            <Sparkles size={24} />
            <span className="text-sm font-medium tracking-widest uppercase">灵宠命理馆</span>
            <Sparkles size={24} />
          </div>
          <h1 className="text-5xl font-display text-stone-900 mb-4">萌宠运势</h1>
          <p className="text-stone-500 max-w-md mx-auto">
            输入爱宠信息，由AI命理大师为您揭秘宠物的性格密码与未来运势。
          </p>
        </motion.div>
      </header>

      <main className="max-w-2xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {step === 'input' ? (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="pet-card p-8"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-stone-600">
                      <PawPrint size={16} className="text-amber-500" />
                      宠物姓名
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="如：豆包"
                      value={petInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-stone-600">
                      <Info size={16} className="text-amber-500" />
                      宠物类型
                    </label>
                    <select
                      name="type"
                      value={petInfo.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all bg-white"
                    >
                      <option value="猫">猫咪</option>
                      <option value="狗">狗狗</option>
                      <option value="仓鼠">仓鼠</option>
                      <option value="兔子">兔子</option>
                      <option value="鸟">鸟类</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-stone-600">
                      <Quote size={16} className="text-amber-500" />
                      宠物品种
                    </label>
                    <input
                      type="text"
                      name="breed"
                      placeholder="如：布偶猫 / 柯基"
                      value={petInfo.breed}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-stone-600">
                      <Calendar size={16} className="text-amber-500" />
                      生日或年龄
                    </label>
                    <input
                      type="text"
                      name="birthday"
                      placeholder="如：2023-05-20 或 2岁"
                      value={petInfo.birthday}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-stone-600">
                    <Heart size={16} className="text-amber-500" />
                    性格特点
                  </label>
                  <textarea
                    name="personality"
                    placeholder="描述一下它的性格，比如：活泼好动、胆小粘人、拆家小能手..."
                    value={petInfo.personality}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  onClick={generateFortune}
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-amber-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin" size={20} />
                      正在窥探天机...
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      开启测算
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result-display"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="pet-card p-8 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-12 -right-12 text-amber-50 opacity-10 rotate-12">
                  <PawPrint size={200} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8 border-b border-stone-100 pb-4">
                    <div>
                      <h2 className="text-2xl font-display text-stone-900">{petInfo.name} 的运势报告</h2>
                      <p className="text-sm text-stone-500">{petInfo.breed} · {petInfo.type}</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-full text-amber-600">
                      <Sparkles size={24} />
                    </div>
                  </div>

                  <div className="prose prose-stone max-w-none fortune-text">
                    <ReactMarkdown>{fortune || ''}</ReactMarkdown>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={reset}
                  className="flex-1 bg-white border-2 border-amber-600 text-amber-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-amber-50 transition-all active:scale-95"
                >
                  <RefreshCw size={20} />
                  重新测算
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-stone-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-stone-900 transition-all active:scale-95"
                >
                  保存报告
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-stone-400 text-xs px-4">
        <p>© 2026 灵宠命理馆 · AI 驱动的宠物趣味算命</p>
        <p className="mt-1">测算结果仅供娱乐，请科学养宠，给予爱宠更多陪伴。</p>
      </footer>
    </div>
  );
}
