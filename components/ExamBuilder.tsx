import React, { useState, useEffect } from 'react';
import { Exam, SchoolStage } from '../types';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, getDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import { Loader2, FileText } from 'lucide-react';

const ExamBuilder: React.FC = () => {
  const [examTitle, setExamTitle] = useState('');
  const [totalScore, setTotalScore] = useState(100);
  const [saving, setSaving] = useState(false);
  const [schoolId, setSchoolId] = useState('');
  const [exams, setExams] = useState<any[]>([]);

  // 1. Get School ID
  useEffect(() => {
    const fetchSchool = async () => {
      if (!auth?.currentUser || !db) return;
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        setSchoolId(userDoc.data().schoolId);
      }
    };
    fetchSchool();
  }, []);

  // 2. Fetch Exams
  useEffect(() => {
    if (!db || !schoolId) return;
    const q = query(collection(db, "exams"), where("schoolId", "==", schoolId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        setExams(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
    });
    return () => unsubscribe();
  }, [schoolId]);

  const handleCreateExam = async () => {
     if (!db || !schoolId || !examTitle) return;
     setSaving(true);
     try {
         await addDoc(collection(db, "exams"), {
             schoolId,
             title: examTitle,
             totalMarks: totalScore,
             date: new Date().toISOString(),
             teacherId: auth.currentUser?.uid
         });
         setExamTitle('');
         alert("تم إنشاء الامتحان بنجاح");
     } catch(e) {
         console.error(e);
         alert("خطأ أثناء الإنشاء");
     } finally {
         setSaving(false);
     }
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
              placeholder="مثال: اختبار شهر أكتوبر"
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
          <button 
             onClick={handleCreateExam}
             disabled={saving || !examTitle}
             className="w-full bg-gold-600 text-black font-bold py-2 rounded hover:bg-gold-500 mt-4 transition-colors shadow-lg flex justify-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 className="animate-spin w-5 h-5" />}
            حفظ الامتحان
          </button>
        </div>
      </div>

      {/* Exam List */}
      <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">الامتحانات المسجلة</h2>
        <div className="space-y-4 max-h-80 overflow-y-auto">
            {exams.length === 0 ? (
                <p className="text-gray-500 text-center py-4">لا توجد امتحانات مسجلة</p>
            ) : (
                exams.map(exam => (
                    <div key={exam.id} className="p-3 bg-black/20 rounded border border-gray-800 flex justify-between items-center">
                        <div>
                            <h4 className="text-white font-bold">{exam.title}</h4>
                            <p className="text-xs text-gray-500">الدرجة: {exam.totalMarks}</p>
                        </div>
                        <FileText className="text-gold-500 w-5 h-5" />
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default ExamBuilder;