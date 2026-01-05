import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { User, Activity, FileText, CheckCircle } from 'lucide-react';

const TeacherStats: React.FC = () => {
  const teacherPerformance = [
    { name: 'أ. محمد (رياضيات)', students: 120, exams: 5, avgScore: 85, attendance: 95 },
    { name: 'أ. سارة (علوم)', students: 110, exams: 4, avgScore: 78, attendance: 92 },
    { name: 'أ. أحمد (عربي)', students: 130, exams: 6, avgScore: 82, attendance: 90 },
    { name: 'أ. علي (إنجليزي)', students: 115, exams: 3, avgScore: 75, attendance: 88 },
    { name: 'أ. ندى (دراسات)', students: 125, exams: 5, avgScore: 88, attendance: 96 },
  ];

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
               <h3 className="text-3xl font-bold text-white">84</h3>
            </div>
            <User className="text-gold-500 w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
          <div className="flex justify-between items-start">
            <div>
               <p className="text-gray-400 text-sm">الامتحانات النشطة</p>
               <h3 className="text-3xl font-bold text-white">23</h3>
            </div>
            <FileText className="text-blue-500 w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
           <div className="flex justify-between items-start">
            <div>
               <p className="text-gray-400 text-sm">متوسط نسبة النجاح</p>
               <h3 className="text-3xl font-bold text-green-400">82%</h3>
            </div>
            <CheckCircle className="text-green-500 w-8 h-8 opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
          <h3 className="text-lg font-bold text-white mb-6">متوسط درجات الطلاب لكل معلم</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teacherPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#666" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" stroke="#999" width={100} tick={{fontSize: 12}} />
                <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #333' }} />
                <Bar dataKey="avgScore" name="متوسط الدرجات %" fill="#EAB308" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
          <h3 className="text-lg font-bold text-white mb-6">نشاط المعلمين (عدد الامتحانات)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={teacherPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" tick={{fontSize: 10}} />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #333' }} />
                <Area type="monotone" dataKey="exams" name="عدد الامتحانات" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Detailed Table */}
      <div className="bg-darkgray rounded-xl border border-gold-700/20 overflow-hidden">
         <table className="w-full text-right">
            <thead className="bg-black/40 text-gray-300">
               <tr>
                  <th className="p-4">المعلم</th>
                  <th className="p-4">عدد الطلاب</th>
                  <th className="p-4">الامتحانات</th>
                  <th className="p-4">نسبة الحضور %</th>
                  <th className="p-4">التقييم العام</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
               {teacherPerformance.map((t, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                     <td className="p-4 font-semibold text-white">{t.name}</td>
                     <td className="p-4 text-gray-400">{t.students}</td>
                     <td className="p-4 text-gray-400">{t.exams}</td>
                     <td className="p-4 text-gray-400">{t.attendance}%</td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${t.avgScore >= 80 ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                           {t.avgScore >= 85 ? 'ممتاز' : t.avgScore >= 75 ? 'جيد جداً' : 'جيد'}
                        </span>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default TeacherStats;
