import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, CalendarCheck, Search, Loader2 } from 'lucide-react';
import { Notification, User } from '../types';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface AttendanceProps {
  onAddNotification: (note: Omit<Notification, 'id' | 'read'>) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ onAddNotification }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendanceLog, setAttendanceLog] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Students from Firestore
  useEffect(() => {
    if (!db) {
        setLoading(false);
        return;
    }
    
    // Query users where role is STUDENT
    const q = query(collection(db, "users"), where("role", "==", "STUDENT"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedStudents = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.fullName,
                grade: data.gradeLevel || 'Unknown Grade'
            };
        });
        setStudents(fetchedStudents);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMark = (studentId: string, studentName: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceLog(prev => ({ ...prev, [studentId]: status }));
    
    if (status === 'ABSENT') {
      onAddNotification({
        title: 'تنبيه غياب',
        message: `تم تسجيل غياب الطالب ${studentName} اليوم.`,
        type: 'ALERT',
        time: new Date().toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})
      });
    } else if (status === 'LATE') {
       onAddNotification({
        title: 'تنبيه تأخير',
        message: `تم تسجيل تأخير الطالب ${studentName} عن الطابور الصباحي.`,
        type: 'WARNING',
        time: new Date().toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})
      });
    }
  };

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-gold-500/10 border border-gold-500/20">
          <CalendarCheck className="w-6 h-6 text-gold-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">دفتر الحضور والغياب</h2>
          <p className="text-gray-400 text-sm">تسجيل حضور الطلاب وإرسال إشعارات للإدارة</p>
        </div>
      </div>

      <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
         <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
               <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="بحث عن طالب..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-black/40 border border-gray-700 rounded-full px-10 py-2 text-white outline-none focus:border-gold-500"
               />
            </div>
            <div className="text-gray-400 text-sm">
               تاريخ اليوم: <span className="text-gold-500 font-bold">{new Date().toLocaleDateString('ar-EG')}</span>
            </div>
         </div>

         <div className="grid gap-4">
            {loading ? (
               <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                   <Loader2 className="animate-spin w-8 h-8 mb-2" />
                   جاري تحميل الطلاب...
               </div>
            ) : filteredStudents.length === 0 ? (
               <p className="text-center text-gray-500 py-8">
                  {students.length === 0 ? 'لا يوجد طلاب مسجلين في النظام بعد' : 'لا يوجد طلاب مطابقين للبحث'}
               </p>
            ) : (
               filteredStudents.map(student => (
                  <div key={student.id} className="flex flex-col md:flex-row justify-between items-center bg-black/20 p-4 rounded-lg border border-gray-800 hover:border-gold-500/30 transition-all">
                     <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white">
                           {student.name[0]}
                        </div>
                        <div>
                           <h4 className="font-bold text-white">{student.name}</h4>
                           <p className="text-xs text-gray-500">{student.grade}</p>
                        </div>
                     </div>

                     <div className="flex gap-2">
                        <button 
                           onClick={() => handleMark(student.id, student.name, 'PRESENT')}
                           className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${attendanceLog[student.id] === 'PRESENT' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                        >
                           <UserCheck className="w-4 h-4" /> حاضر
                        </button>
                        <button 
                           onClick={() => handleMark(student.id, student.name, 'LATE')}
                           className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${attendanceLog[student.id] === 'LATE' ? 'bg-yellow-600 text-black font-bold shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                        >
                           <Clock className="w-4 h-4" /> متأخر
                        </button>
                        <button 
                           onClick={() => handleMark(student.id, student.name, 'ABSENT')}
                           className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${attendanceLog[student.id] === 'ABSENT' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                        >
                           <UserX className="w-4 h-4" /> غائب
                        </button>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
    </div>
  );
};

export default Attendance;