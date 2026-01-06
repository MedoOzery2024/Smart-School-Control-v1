import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { User, Activity, FileText, CheckCircle } from 'lucide-react';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';

const TeacherStats: React.FC = () => {
  const [stats, setStats] = useState({
      totalTeachers: 0,
      activeExams: 0,
  });

  useEffect(() => {
     const fetchStats = async () => {
         if (!db || !auth.currentUser) return;
         
         // Get School ID first
         const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
         if (!userDoc.exists()) return;
         const schoolId = userDoc.data().schoolId;

         // Get Teachers Count
         const qTeachers = query(collection(db, "users"), where("schoolId", "==", schoolId), where("role", "==", "TEACHER"));
         const tSnap = await getDocs(qTeachers);
         
         // Get Exams Count
         const qExams = query(collection(db, "exams"), where("schoolId", "==", schoolId));
         const eSnap = await getDocs(qExams);

         setStats({
             totalTeachers: tSnap.size,
             activeExams: eSnap.size
         });
     };
     fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-gold-500/10 border border-gold-500/20">
          <Activity className="w-6 h-6 text-gold-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">إحصائيات المعلمين</h2>
          <p className="text-gray-400 text-sm">تحليل الأداء والمشاركة والامتحانات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
          <div className="flex justify-between items-start">
            <div>
               <p className="text-gray-400 text-sm">إجمالي المعلمين</p>
               <h3 className="text-3xl font-bold text-white">{stats.totalTeachers}</h3>
            </div>
            <User className="text-gold-500 w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
          <div className="flex justify-between items-start">
            <div>
               <p className="text-gray-400 text-sm">الامتحانات النشطة</p>
               <h3 className="text-3xl font-bold text-white">{stats.activeExams}</h3>
            </div>
            <FileText className="text-blue-500 w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
           <div className="flex justify-between items-start">
            <div>
               <p className="text-gray-400 text-sm">متوسط نسبة النجاح</p>
               <h3 className="text-3xl font-bold text-green-400">-%</h3>
            </div>
            <CheckCircle className="text-green-500 w-8 h-8 opacity-50" />
          </div>
        </div>
      </div>

      <div className="bg-darkgray p-10 rounded-xl border border-gold-700/20 text-center text-gray-500">
          سيتم تفعيل الرسوم البيانية عند توفر بيانات كافية عن نتائج الامتحانات.
      </div>
    </div>
  );
};

export default TeacherStats;