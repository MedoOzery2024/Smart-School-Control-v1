import React, { useState } from 'react';
import { WEEK_DAYS, PERIODS, SUBJECTS } from '../constants';

const Schedule: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState('PRIMARY');
  // Simple state to simulate schedule data
  const [scheduleData, setScheduleData] = useState<Record<string, string>>({});

  const handleCellClick = (dayIdx: number, periodIdx: number) => {
    const key = `${dayIdx}-${periodIdx}`;
    // Simple toggle for demo or prompt
    const subject = prompt("أدخل اسم المادة:", "لغة عربية");
    if (subject) {
        setScheduleData(prev => ({
          ...prev,
          [key]: subject
        }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-darkgray p-4 rounded-xl border border-gold-700/20">
        <h2 className="text-xl font-bold text-white">الجداول المدرسية</h2>
        <div className="flex gap-4">
           <select 
             className="bg-black/40 border border-gray-700 rounded px-4 py-2 text-white focus:border-gold-500 outline-none"
             value={selectedStage}
             onChange={(e) => setSelectedStage(e.target.value)}
           >
             <option value="KG">رياض أطفال</option>
             <option value="PRIMARY">الابتدائية</option>
             <option value="PREP">الإعدادية</option>
             <option value="SECONDARY">الثانوية</option>
           </select>
           <button className="bg-gold-600 hover:bg-gold-500 text-black font-bold px-4 py-2 rounded">
             توزيع تلقائي (AI)
           </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-darkgray rounded-xl border border-gold-700/20 shadow-xl">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="p-4 bg-black/40 text-gold-500 font-bold border-b border-gray-800">اليوم / الحصة</th>
              {PERIODS.map(p => (
                <th key={p.id} className="p-4 bg-black/40 text-gray-300 font-semibold border-b border-gray-800 min-w-[120px]">
                  <div>{p.label}</div>
                  <div className="text-xs text-gray-500 font-normal mt-1">{p.start} - {p.end}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WEEK_DAYS.map((day, dayIdx) => (
              <tr key={day} className="hover:bg-white/5 transition-colors">
                <td className="p-4 bg-black/20 font-bold text-gold-600 border-r border-gray-800 border-b border-gray-800/50">
                  {day}
                </td>
                {PERIODS.map((period, periodIdx) => {
                   const key = `${dayIdx}-${period.id}`;
                   const content = scheduleData[key];
                   return (
                    <td 
                      key={period.id} 
                      onClick={() => handleCellClick(dayIdx, period.id)}
                      className="p-2 border-r border-gray-800 border-b border-gray-800/50 cursor-pointer group"
                    >
                      <div className={`
                        min-h-[60px] rounded-lg flex items-center justify-center text-sm font-medium transition-all
                        ${content ? 'bg-gold-900/20 text-gold-200 border border-gold-900/50' : 'bg-transparent text-gray-600 group-hover:bg-white/5'}
                      `}>
                        {content || '+ إضافة'}
                      </div>
                    </td>
                   );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;