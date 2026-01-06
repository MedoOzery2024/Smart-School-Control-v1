import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { User, Activity, FileText, CheckCircle } from 'lucide-react';

const TeacherStats: React.FC = () => {
  // Empty initial data
  const teacherPerformance: any[] = [];

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
               <h3 className="text-3xl font-bold text-white">0</h3>
            </div>
            <User className="text-gold-500 w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
          <div className="flex justify-between items-start">
            <div>
               <p className="text-gray-400 text-sm">الامتحانات النشطة</p>
               <h3 className="text-3xl font-bold text-white">0</h3>
            </div>
            <FileText className="text-blue-500 w-8 h-8 opacity-50" />
          </div>
        </div>
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
           <div className="flex justify-between items-start">
            <div>
               <p className="text-gray-400 text-sm">متوسط نسبة النجاح</p>
               <h3 className="text-3xl font-bold text-green-400">0%</h3>
            </div>
            <CheckCircle className="text-green-500 w-8 h-8 opacity-50" />
          </div>
        </div>
      </div>

      {teacherPerformance.length === 0 ? (
          <div className="bg-darkgray p-10 rounded-xl border border-gold-700/20 text-center text-gray-500">
              لا توجد بيانات للمعلمين حالياً
          </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
             {/* ... more charts ... */}
          </div>
      )}
    </div>
  );
};

export default TeacherStats;