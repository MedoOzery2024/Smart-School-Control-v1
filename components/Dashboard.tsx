import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Users, GraduationCap, School, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';
import { useLanguage } from '../LanguageContext';

const data = [
  { name: 'Primary', passed: 400, failed: 24, avg: 85 },
  { name: 'Prep', passed: 300, failed: 45, avg: 78 },
  { name: 'Secondary', passed: 200, failed: 30, avg: 82 },
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

const Dashboard: React.FC<{ role?: UserRole }> = ({ role }) => {
  const { t } = useLanguage();

  // Personalized Dashboard for Teachers
  if (role === UserRole.TEACHER) {
     return (
        <div className="space-y-6">
           <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-white">{t('welcome')}, Teacher!</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <StatCard title={t('myClasses')} value="5" icon={Clock} sub="Next: Math 101" />
             <StatCard title={t('totalStudents')} value="125" icon={Users} sub="Across 3 grades" />
             <StatCard title={t('pendingGrading')} value="12" icon={AlertCircle} sub="Assignments" />
             <StatCard title={t('activeExams')} value="2" icon={BookOpen} sub="Closing today" />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Classes Widget */}
              <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
                 <h3 className="text-lg font-bold text-white mb-4">{t('myClasses')}</h3>
                 <div className="space-y-3">
                    {[
                       { time: '08:00 AM', subject: 'Mathematics', grade: 'Grade 10-A', room: 'Room 101' },
                       { time: '09:30 AM', subject: 'Algebra', grade: 'Grade 11-B', room: 'Lab 2' },
                       { time: '11:00 AM', subject: 'Geometry', grade: 'Grade 9-C', room: 'Room 104' },
                    ].map((cls, idx) => (
                       <div key={idx} className="flex items-center p-3 bg-black/30 rounded-lg border-l-4 border-gold-500">
                          <div className="w-20 font-mono text-gold-400 text-sm font-bold">{cls.time}</div>
                          <div className="flex-1 px-4">
                             <div className="text-white font-bold">{cls.subject}</div>
                             <div className="text-xs text-gray-500">{cls.grade}</div>
                          </div>
                          <div className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{cls.room}</div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Student Performance Widget */}
              <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
                 <h3 className="text-lg font-bold text-white mb-4">{t('studentPerformance')}</h3>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={[
                          { name: 'Week 1', avg: 75 },
                          { name: 'Week 2', avg: 82 },
                          { name: 'Week 3', avg: 78 },
                          { name: 'Week 4', avg: 88 },
                       ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="name" stroke="#666" />
                          <YAxis stroke="#666" domain={[0, 100]} />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid #333' }} />
                          <Bar dataKey="avg" fill="#EAB308" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  // Default Admin Dashboard
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('totalStudents')} value="1,250" icon={Users} sub="+50 New" />
        <StatCard title={t('teacherStats')} value="84" icon={GraduationCap} sub="All Depts" />
        <StatCard title="Classrooms" value="42" icon={School} sub="90% Occupancy" />
        <StatCard title={t('activeExams')} value="12" icon={BookOpen} sub="Today" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass Rate Chart */}
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
          <h3 className="text-lg font-bold text-white mb-6">Student Results Analysis</h3>
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
                <Bar dataKey="passed" name={t('pass')} fill="#EAB308" radius={[4, 4, 0, 0]} />
                <Bar dataKey="failed" name={t('fail')} fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
          <h3 className="text-lg font-bold text-white mb-6">Student Distribution</h3>
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
