import React, { useState } from 'react';
import { GraduationCap, Upload, Download, Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { SchoolStage } from '../types';

interface StudentGradeData {
  id: string;
  name: string;
  stage: string;
  subjects: {
    [key: string]: number; // subject name: score
  };
  status?: 'PASS' | 'RETAKE' | 'FAIL';
  failedSubjects?: string[];
}

const ResultsManager: React.FC = () => {
  const [filterStage, setFilterStage] = useState<string>('ALL');
  // Mock Data
  const [students, setStudents] = useState<StudentGradeData[]>([
    { id: '1', name: 'أحمد محمود', stage: 'PREP', subjects: { 'عربي': 85, 'إنجليزي': 70, 'رياضيات': 60, 'علوم': 75, 'دراسات': 80 } },
    { id: '2', name: 'سارة علي', stage: 'PREP', subjects: { 'عربي': 40, 'إنجليزي': 35, 'رياضيات': 55, 'علوم': 60, 'دراسات': 50 } }, // Fail 2
    { id: '3', name: 'خالد عمر', stage: 'SECONDARY', subjects: { 'عربي': 30, 'إنجليزي': 20, 'رياضيات': 25, 'فيزياء': 40, 'كيمياء': 35 } }, // Fail All
  ]);

  const subjectList = ['عربي', 'إنجليزي', 'رياضيات', 'علوم', 'دراسات'];

  const calculateStatus = () => {
    const updated = students.map(s => {
      const failedSubjects: string[] = [];
      for (const [subj, score] of Object.entries(s.subjects)) {
        if ((score as number) < 50) failedSubjects.push(subj);
      }

      let status: 'PASS' | 'RETAKE' | 'FAIL' = 'PASS';
      if (failedSubjects.length > 0) {
        if (failedSubjects.length <= 2) status = 'RETAKE'; // دور ثاني
        else status = 'FAIL'; // راسب (معيد)
      }

      return { ...s, status, failedSubjects };
    });
    setStudents(updated);
  };

  const handleExport = () => {
    // Simulate Export
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "ID,Name,Stage,Arabic,English,Math,Science,Social,Status\n";
    students.forEach(s => {
      const row = [
        s.id, s.name, s.stage, 
        s.subjects['عربي'] || 0, s.subjects['إنجليزي'] || 0,
        s.subjects['رياضيات'] || 0, s.subjects['علوم'] || 0,
        s.subjects['دراسات'] || 0,
        s.status || '-'
      ].join(",");
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "school_grades.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = () => {
    alert("ميزة استيراد ملفات Excel (محاكاة): تم قراءة 50 سجل بنجاح!");
    // In real app, we would parse file here
    calculateStatus();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-darkgray p-4 rounded-xl border border-gold-700/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold-500/10 rounded-lg">
             <GraduationCap className="w-6 h-6 text-gold-500" />
          </div>
          <h2 className="text-xl font-bold text-white">رصد الدرجات وتحليل النتائج</h2>
        </div>
        <div className="flex gap-2">
           <button onClick={handleImport} className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/50 rounded hover:bg-blue-600/30">
             <Upload className="w-4 h-4" /> استيراد Excel
           </button>
           <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/50 rounded hover:bg-green-600/30">
             <Download className="w-4 h-4" /> تصدير CSV
           </button>
        </div>
      </div>

      <div className="bg-darkgray rounded-xl border border-gold-700/20 p-4">
        <div className="flex gap-4 mb-4">
           <button onClick={calculateStatus} className="bg-gold-600 hover:bg-gold-500 text-black font-bold px-6 py-2 rounded shadow-lg shadow-gold-900/20">
             حساب النتائج وتحديد الحالة
           </button>
           <select 
             className="bg-black/40 border border-gray-700 rounded px-4 py-2 text-white outline-none"
             onChange={(e) => setFilterStage(e.target.value)}
           >
             <option value="ALL">كل المراحل</option>
             <option value="PRIMARY">الابتدائية</option>
             <option value="PREP">الإعدادية</option>
             <option value="SECONDARY">الثانوية</option>
           </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-black/40 text-gray-300 text-sm">
              <tr>
                <th className="p-3 border-b border-gray-800">الاسم</th>
                <th className="p-3 border-b border-gray-800">المرحلة</th>
                {subjectList.map(sub => (
                  <th key={sub} className="p-3 border-b border-gray-800 text-center">{sub}</th>
                ))}
                <th className="p-3 border-b border-gray-800 text-center">الحالة</th>
                <th className="p-3 border-b border-gray-800">ملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-semibold text-white">{student.name}</td>
                  <td className="p-3 text-gray-400 text-xs">{student.stage}</td>
                  {subjectList.map(sub => {
                    const score = student.subjects[sub] || 0;
                    const isFail = score < 50;
                    return (
                      <td key={sub} className={`p-3 text-center font-mono ${isFail ? 'text-red-500 font-bold' : 'text-green-400'}`}>
                        {score}
                      </td>
                    );
                  })}
                  <td className="p-3 text-center">
                    {student.status === 'PASS' && <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs border border-green-800">ناجح</span>}
                    {student.status === 'RETAKE' && <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded text-xs border border-yellow-800">دور ثاني</span>}
                    {student.status === 'FAIL' && <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded text-xs border border-red-800">راسب (معيد)</span>}
                    {!student.status && <span className="text-gray-600">-</span>}
                  </td>
                  <td className="p-3 text-xs text-gray-400">
                    {student.failedSubjects && student.failedSubjects.length > 0 ? `رسب في: ${student.failedSubjects.join(', ')}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
           <span>ناجح: جميع المواد {'>'}= 50%</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
           <span>دور ثاني: رسب في مادتين أو أقل</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-red-500 rounded-full"></div>
           <span>راسب (معيد): رسب في أكثر من مادتين</span>
         </div>
      </div>
    </div>
  );
};

export default ResultsManager;