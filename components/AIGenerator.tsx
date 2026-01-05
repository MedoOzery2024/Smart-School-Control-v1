import React, { useState } from 'react';
import { generateQuestionsAI } from '../services/geminiService';
import { Sparkles, Download, Copy, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { Question } from '../types';

const AIGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [stage, setStage] = useState('PREP');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const generated = await generateQuestionsAI(topic, count, stage, difficulty);
      setQuestions(generated);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء التوليد');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Simple mock export to text
    const text = questions.map((q, i) => `س${i+1}: ${q.text}\n${q.options.map(o=>`- ${o}`).join('\n')}\nالإجابة: ${q.options[q.correctAnswer]}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exams_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-darkgray border border-gold-700/30 rounded-xl p-6 shadow-lg shadow-black/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-gold-500/10 border border-gold-500/20">
            <Sparkles className="w-6 h-6 text-gold-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">مولد الأسئلة الذكي</h2>
            <p className="text-gray-400 text-sm">توليد اختبارات ومحتوى تعليمي باستخدام Gemini AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">موضوع الاختبار أو نص المحتوى</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="أدخل النص هنا أو عنوان الدرس... (مثال: الفاعل ونائب الفاعل، قوانين نيوتن)"
                className="w-full h-32 bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">عدد الأسئلة</label>
                <input 
                  type="number" 
                  min="1" 
                  max="50"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white focus:border-gold-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">المرحلة الدراسية</label>
                <select 
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-white focus:border-gold-500 outline-none"
                >
                  <option value="PRIMARY">الابتدائية</option>
                  <option value="PREP">الإعدادية</option>
                  <option value="SECONDARY">الثانوية</option>
                </select>
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-300 mb-1">مستوى الصعوبة</label>
               <div className="flex gap-2 bg-black/40 p-1 rounded-lg border border-gray-700">
                  {['EASY', 'MEDIUM', 'HARD'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setDifficulty(lvl)}
                      className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${
                        difficulty === lvl ? 'bg-gold-600 text-black' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {lvl === 'EASY' ? 'سهل' : lvl === 'MEDIUM' ? 'متوسط' : 'صعب'}
                    </button>
                  ))}
               </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-black font-bold rounded-lg hover:from-gold-500 hover:to-gold-400 transition-all shadow-lg shadow-gold-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? 'جاري التوليد...' : 'توليد الأسئلة الآن'}
            </button>
          </div>

          <div className="bg-black/20 rounded-xl p-4 border border-white/5 overflow-y-auto max-h-[500px] scrollbar-thin">
            {questions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <FileText className="w-12 h-12 mb-2 opacity-20" />
                <p>ستظهر الأسئلة المولدة هنا</p>
              </div>
            ) : (
              <div className="space-y-4">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold">النتائج ({questions.length})</h3>
                    <button onClick={handleExport} className="text-gold-400 hover:text-gold-300 flex items-center gap-1 text-sm">
                       <Download className="w-4 h-4" /> تصدير
                    </button>
                 </div>
                 {questions.map((q, idx) => (
                   <div key={q.id} className="bg-darkgray p-4 rounded-lg border border-gray-800 hover:border-gold-500/30 transition-colors">
                     <div className="flex justify-between gap-2 mb-2">
                       <span className="text-gold-500 font-bold text-sm">س{idx+1}</span>
                       <span className={`text-xs px-2 py-0.5 rounded ${q.difficulty === 'HARD' ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
                         {q.difficulty}
                       </span>
                     </div>
                     <p className="text-white mb-3 text-sm font-semibold">{q.text}</p>
                     <div className="space-y-1">
                       {q.options.map((opt, i) => (
                         <div key={i} className={`p-2 rounded text-xs flex items-center justify-between ${i === q.correctAnswer ? 'bg-green-900/20 border border-green-800 text-green-200' : 'bg-black/30 text-gray-400'}`}>
                            <span>{opt}</span>
                            {i === q.correctAnswer && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                         </div>
                       ))}
                     </div>
                     <p className="mt-2 text-xs text-gray-500 border-t border-gray-800 pt-2">
                       <span className="text-gold-700">الشرح: </span> {q.explanation}
                     </p>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
