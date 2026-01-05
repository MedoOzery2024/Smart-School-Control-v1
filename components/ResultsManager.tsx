import React, { useState, useRef } from 'react';
import { GraduationCap, Upload, Search, AlertTriangle, CheckCircle, XCircle, FileSpreadsheet, Trophy } from 'lucide-react';
import ExcelJS from 'exceljs';
import { UserRole } from '../types';

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

interface ResultsManagerProps {
  userRole: UserRole;
}

const ResultsManager: React.FC<ResultsManagerProps> = ({ userRole }) => {
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // Initial Mock Data
  const [students, setStudents] = useState<StudentGradeData[]>([
    { id: '1', name: 'أحمد محمود', stage: 'PREP', subjects: { 'عربي': 85, 'إنجليزي': 70, 'رياضيات': 60, 'علوم': 75, 'دراسات': 80 }, status: 'PASS', failedSubjects: [] },
    { id: '2', name: 'سارة علي', stage: 'PREP', subjects: { 'عربي': 40, 'إنجليزي': 35, 'رياضيات': 55, 'علوم': 60, 'دراسات': 50 }, status: 'RETAKE', failedSubjects: ['عربي', 'إنجليزي'] }, 
    { id: '3', name: 'خالد عمر', stage: 'SECONDARY', subjects: { 'عربي': 30, 'إنجليزي': 20, 'رياضيات': 25, 'فيزياء': 40, 'كيمياء': 35 }, status: 'FAIL', failedSubjects: ['عربي', 'إنجليزي', 'رياضيات', 'فيزياء', 'كيمياء'] }, 
  ]);

  const subjectList = ['عربي', 'إنجليزي', 'رياضيات', 'علوم', 'دراسات', 'فيزياء', 'كيمياء'];

  // --- Logic for Students (View Only) ---
  if (userRole === UserRole.STUDENT) {
    // Mock the logged in student as the first one for demo
    const myResult = students[0]; 
    return (
      <div className="max-w-2xl mx-auto space-y-6">
         <div className="bg-darkgray p-8 rounded-xl border border-gold-700/30 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-600 via-yellow-400 to-gold-600"></div>
            <Trophy className="w-20 h-20 text-gold-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">نتيجة الطالب</h2>
            <h3 className="text-xl text-gold-400 mb-6">{myResult.name}</h3>
            
            <div className={`inline-block px-6 py-2 rounded-full text-lg font-bold border ${
              myResult.status === 'PASS' ? 'bg-green-900/30 text-green-400 border-green-500' : 
              myResult.status === 'RETAKE' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500' : 'bg-red-900/30 text-red-400 border-red-500'
            }`}>
              {myResult.status === 'PASS' ? 'ناجح ومنقول للصف التالي' : myResult.status === 'RETAKE' ? 'له دور ثاني' : 'راسب'}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
               {Object.entries(myResult.subjects).map(([sub, score]) => (
                 <div key={sub} className="bg-black/40 p-3 rounded flex justify-between items-center border border-gray-800">
                    <span className="text-gray-300">{sub}</span>
                    <span className={`font-mono font-bold ${(score as number) >= 50 ? 'text-green-400' : 'text-red-400'}`}>{score as number}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    );
  }

  // --- Logic for Admin, Control, IT (Edit Mode) ---
  
  // Helper function to calculate status for a single student
  const calculateStudentStatus = (subjects: Record<string, number>) => {
    const failedSubjects: string[] = [];
    for (const [subj, score] of Object.entries(subjects)) {
      if (score < 50) failedSubjects.push(subj);
    }

    let status: 'PASS' | 'RETAKE' | 'FAIL' = 'PASS';
    if (failedSubjects.length > 0) {
      if (failedSubjects.length <= 2) status = 'RETAKE'; // دور ثاني
      else status = 'FAIL'; // راسب (معيد)
    }
    return { status, failedSubjects };
  };

  const calculateAllStatus = () => {
    const updated = students.map(s => {
      const { status, failedSubjects } = calculateStudentStatus(s.subjects);
      return { ...s, status, failedSubjects };
    });
    setStudents(updated);
    alert('تم إعادة حساب النتائج لجميع الطلاب بنجاح');
  };

  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('نتائج الطلاب');

      // Define Headers
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'الاسم', key: 'name', width: 30 },
        { header: 'المرحلة', key: 'stage', width: 15 },
        ...subjectList.map(sub => ({ header: sub, key: sub, width: 15 })),
        { header: 'الحالة', key: 'status', width: 15 },
        { header: 'المواد الراسبة', key: 'notes', width: 30 },
      ];

      // Add Data
      students.forEach(s => {
        const rowData: any = {
          id: s.id,
          name: s.name,
          stage: s.stage,
          status: s.status === 'PASS' ? 'ناجح' : s.status === 'RETAKE' ? 'دور ثاني' : 'راسب',
          notes: s.failedSubjects?.join(', ') || ''
        };
        // Add subject scores
        subjectList.forEach(sub => {
          rowData[sub] = s.subjects[sub] || 0;
        });
        worksheet.addRow(rowData);
      });

      // Style Header
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCA8A04' } }; // Gold

      // Write Buffer
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Download Link
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `نتائج_الطلاب_${new Date().toISOString().split('T')[0]}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء تصدير الملف');
    } finally {
      setLoading(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setLoading(true);
    const file = e.target.files[0];
    
    try {
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.getWorksheet(1);

      if (!worksheet) throw new Error("الملف لا يحتوي على أوراق عمل");

      const newStudents: StudentGradeData[] = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip Header

        // Assuming Column Order: ID (1), Name (2), Stage (3), Subj1 (4), Subj2 (5)...
        const id = row.getCell(1).value?.toString() || `imp_${Date.now()}_${rowNumber}`;
        const name = row.getCell(2).value?.toString() || 'غير محدد';
        const stage = row.getCell(3).value?.toString() || 'PRIMARY';

        const subjects: Record<string, number> = {};
        
        // Dynamic mapping for subjects (Columns 4 to 3 + subjectList.length)
        subjectList.forEach((sub, idx) => {
          let score = Number(row.getCell(idx + 4).value);
          
          // Validation: Ensure score is number and 0-100
          if (isNaN(score)) score = 0;
          if (score < 0) score = 0;
          if (score > 100) score = 100;
          
          subjects[sub] = score;
        });

        // Calculate status immediately upon import
        const { status, failedSubjects } = calculateStudentStatus(subjects);

        newStudents.push({
          id,
          name,
          stage,
          subjects,
          status,
          failedSubjects
        });
      });

      setStudents(newStudents);
      alert(`تم استيراد ${newStudents.length} سجل طالب بنجاح!`);
      
    } catch (error) {
      console.error(error);
      alert('فشل استيراد الملف. يرجى التأكد من أن الملف هو ملف Excel (.xlsx) صالح.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    }
  };

  const filteredStudents = filterStage === 'ALL' ? students : students.filter(s => s.stage === filterStage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-darkgray p-4 rounded-xl border border-gold-700/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold-500/10 rounded-lg">
             <GraduationCap className="w-6 h-6 text-gold-500" />
          </div>
          <h2 className="text-xl font-bold text-white">إدارة الكنترول ورصد الدرجات</h2>
        </div>
        <div className="flex gap-2">
           <input 
             type="file" 
             accept=".xlsx, .xls" 
             className="hidden" 
             ref={fileInputRef} 
             onChange={handleFileChange}
           />
           <button 
             onClick={handleImportClick} 
             disabled={loading}
             className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/50 rounded hover:bg-blue-600/30 transition-colors disabled:opacity-50"
           >
             <Upload className="w-4 h-4" /> 
             {loading ? 'جاري المعالجة...' : 'استيراد Excel'}
           </button>
           <button 
             onClick={handleExportExcel} 
             disabled={loading}
             className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/50 rounded hover:bg-green-600/30 transition-colors disabled:opacity-50"
           >
             <FileSpreadsheet className="w-4 h-4" /> 
             {loading ? 'جاري التصدير...' : 'تصدير Excel'}
           </button>
        </div>
      </div>

      <div className="bg-darkgray rounded-xl border border-gold-700/20 p-4">
        <div className="flex flex-wrap gap-4 mb-4">
           <button onClick={calculateAllStatus} className="bg-gold-600 hover:bg-gold-500 text-black font-bold px-6 py-2 rounded shadow-lg shadow-gold-900/20 transition-all">
             تحديث النتائج
           </button>
           <div className="relative">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
              <select 
                className="bg-black/40 border border-gray-700 rounded px-10 py-2 text-white outline-none focus:border-gold-500"
                onChange={(e) => setFilterStage(e.target.value)}
              >
                <option value="ALL">كل المراحل</option>
                <option value="PRIMARY">الابتدائية</option>
                <option value="PREP">الإعدادية</option>
                <option value="SECONDARY">الثانوية</option>
              </select>
           </div>
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
              {filteredStudents.length === 0 ? (
                <tr><td colSpan={subjectList.length + 4} className="p-4 text-center text-gray-500">لا توجد بيانات</td></tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-semibold text-white">{student.name}</td>
                    <td className="p-3 text-gray-400 text-xs">{student.stage}</td>
                    {subjectList.map(sub => {
                      const score = student.subjects[sub] || 0;
                      const isFail = score < 50;
                      return (
                        <td key={sub} className={`p-3 text-center font-mono ${isFail ? 'text-red-500 font-bold bg-red-900/10' : 'text-green-400'}`}>
                          {score}
                        </td>
                      );
                    })}
                    <td className="p-3 text-center">
                      {student.status === 'PASS' && (
                        <span className="flex items-center justify-center gap-1 px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs border border-green-800">
                          <CheckCircle className="w-3 h-3" /> ناجح
                        </span>
                      )}
                      {student.status === 'RETAKE' && (
                        <span className="flex items-center justify-center gap-1 px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded text-xs border border-yellow-800">
                          <AlertTriangle className="w-3 h-3" /> دور ثاني
                        </span>
                      )}
                      {student.status === 'FAIL' && (
                        <span className="flex items-center justify-center gap-1 px-2 py-1 bg-red-900/30 text-red-400 rounded text-xs border border-red-800">
                          <XCircle className="w-3 h-3" /> راسب
                        </span>
                      )}
                      {!student.status && <span className="text-gray-600">-</span>}
                    </td>
                    <td className="p-3 text-xs text-gray-400">
                      {student.failedSubjects && student.failedSubjects.length > 0 ? `رسب في: ${student.failedSubjects.join(', ')}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsManager;