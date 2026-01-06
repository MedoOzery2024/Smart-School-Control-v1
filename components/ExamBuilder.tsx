import React, { useState } from 'react';
import { Exam, SchoolStage } from '../types';

const ExamBuilder: React.FC = () => {
  // Mock Exam Data for UI
  const [examTitle, setExamTitle] = useState('');
  const [totalScore, setTotalScore] = useState(100);

  const calculateGrade = (score: number, max: number) => {
    const percent = (score / max) * 100;
    let grade = 'راسب';
    if (percent >= 85) grade = 'امتياز';
    else if (percent >= 75) grade = 'جيد جداً';
    else if (percent >= 65) grade = 'جيد';
    else if (percent >= 50) grade = 'مقبول';
    
    return { percent: percent.toFixed(1), grade };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Create Exam */}
      <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">إنشاء امتحان جديد</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">عنوان الامتحان</label>
            <input 
              type="text" 
              className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none" 
              value={examTitle}
              onChange={e => setExamTitle(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
             <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">الدرجة العظمى</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none" 
                  value={totalScore}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                        setTotalScore(val);
                    } else if (e.target.value === '') {
                        setTotalScore(0);
                    }
                  }}
                  onKeyDown={(e) => {
                    // Prevent negative signs, plus signs, and scientific notation
                    if (['-', '+', 'e', 'E'].includes(e.key)) {
                        e.preventDefault();
                    }
                  }}
                />
             </div>
             <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">الترم</label>
                <select className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none">
                  <option>الأول</option>
                  <option>الثاني</option>
                </select>
             </div>
          </div>
          <button className="w-full bg-gold-600 text-black font-bold py-2 rounded hover:bg-gold-500 mt-4 transition-colors shadow-lg">
            حفظ الامتحان
          </button>
        </div>
      </div>

      {/* Grading Calculator Demo */}
      <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">حاسبة الدرجات الفورية</h2>
        <div className="space-y-4">
           <div className="p-4 bg-black/20 rounded border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                 <span>طالب: نموذج 1</span>
                 <input 
                   type="number" 
                   placeholder="الدرجة" 
                   className="w-20 bg-black border border-gray-600 rounded p-1 text-center text-white"
                   defaultValue={88}
                 />
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                 <span>النسبة: 88%</span>
                 <span className="text-green-400 font-bold">امتياز</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-green-500 h-full w-[88%]"></div>
              </div>
           </div>

           <div className="p-4 bg-black/20 rounded border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                 <span>طالب: نموذج 2</span>
                 <input 
                   type="number" 
                   placeholder="الدرجة" 
                   className="w-20 bg-black border border-gray-600 rounded p-1 text-center text-white"
                   defaultValue={45}
                 />
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                 <span>النسبة: 45%</span>
                 <span className="text-red-400 font-bold">راسب</span>
              </div>
              <div className="w-full bg-gray-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-red-500 h-full w-[45%]"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExamBuilder;