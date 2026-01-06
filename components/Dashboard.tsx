import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Users, GraduationCap, School, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';
import { useLanguage } from '../LanguageContext';

// Default empty data
const emptyData = [
  { name: 'Primary', passed: 0, failed: 0, avg: 0 },
  { name: 'Prep', passed: 0, failed: 0, avg: 0 },
  { name: 'Secondary', passed: 0, failed: 0, avg: 0 },
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
             <StatCard title={t('myClasses')} value="0" icon={Clock} sub="No classes" />
             <StatCard title={t('totalStudents')} value="0" icon={Users} sub="Total" />
             <StatCard title={t('pendingGrading')} value="0" icon={AlertCircle} sub="Assignments" />
             <StatCard title={t('activeExams')} value="0" icon={BookOpen} sub="Active" />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Classes Widget */}
              <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20 flex items-center justify-center">
                 <div className="text-center text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No upcoming classes scheduled</p>
                 </div>
              </div>

              {/* Student Performance Widget */}
              <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20 flex items-center justify-center">
                 <div className="text-center text-gray-500">
                    <p>No performance data available</p>
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
        <StatCard title={t('totalStudents')} value="0" icon={Users} sub="+0 New" />
        <StatCard title={t('teacherStats')} value="0" icon={GraduationCap} sub="Staff" />
        <StatCard title="Classrooms" value="0" icon={School} sub="Occupancy" />
        <StatCard title={t('activeExams')} value="0" icon={BookOpen} sub="Today" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass Rate Chart */}
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
          <h3 className="text-lg font-bold text-white mb-6">Student Results Analysis</h3>
          <div className="h-80 w-full flex items-center justify-center text-gray-500">
              No data available to display chart.
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20">
          <h3 className="text-lg font-bold text-white mb-6">Student Distribution</h3>
          <div className="h-80 w-full flex items-center justify-center text-gray-500">
              No data available.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;