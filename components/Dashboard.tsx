import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Users, GraduationCap, School, BookOpen } from 'lucide-react';

const data = [
  { name: 'الابتدائية', passed: 400, failed: 24, avg: 85 },
  { name: 'الإعدادية', passed: 300, failed: 45, avg: 78 },
  { name: 'الثانوية', passed: 200, failed: 30, avg: 82 },
];

const COLORS = ['#CA8A04', '#A16207', '#EAB308'];

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; sub?: string }> = ({ title, value, icon: Icon, sub }) => (
  <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20 shadow-lg relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        {sub && <p className="text-xs text-gold-500">{sub}</p>}
      </div>
      <div className="p-3 bg-gold-500/10 rounded-lg text-gold-500">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي الطلاب" value="1,250" icon={Users} sub="+50 طالب جديد" />
        <StatCard title="عدد المعلمين" value="84" icon={GraduationCap} sub="جميع التخصصات" />
        <StatCard title="الفصول الدراسية" value="42" icon={School} sub="نسبة إشغال 90%" />
        <StatCard title="الاختبارات النشطة" value="12" icon={BookOpen} sub="اليوم" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass Rate Chart */}
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
          <h3 className="text-lg font-bold text-white mb-6">تحليل نتائج الطلاب</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="passed" name="ناجح" fill="#EAB308" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" name="راسب" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
          <h3 className="text-lg font-bold text-white mb-6">توزيع الطلاب حسب المرحلة</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="passed"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
