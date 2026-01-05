import React, { useState, useEffect } from 'react';
import { 
  Menu, X, LayoutDashboard, Users, Calendar, 
  FileText, GraduationCap, Award, BrainCircuit, LogOut,
  Settings, BarChart2, Bell
} from 'lucide-react';
import { APP_NAME, DEVELOPER_NAME } from '../constants';
import { ViewState, UserRole } from '../types';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  userRole: UserRole;
  onLogout: () => void;
  schoolName: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, currentView, setView, userRole, onLogout, schoolName 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'غياب الطالب أحمد محمد (3 أيام متتالية)', time: 'منذ 10 دقائق', read: false },
    { id: 2, text: 'تم اعتماد نتائج الصف الأول الإعدادي', time: 'منذ ساعة', read: false },
  ]);

  // Clock Timer
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Date & Time
  const timeString = time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStringGregorian = time.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const dateStringHijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(time);

  const navItems = [
    { id: 'DASHBOARD', label: 'لوحة التحكم', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: 'USERS', label: 'إدارة المستخدمين', icon: Users, roles: [UserRole.ADMIN, UserRole.STAFF] },
    { id: 'TEACHER_STATS', label: 'إحصائيات المعلمين', icon: BarChart2, roles: [UserRole.ADMIN] },
    { id: 'SCHEDULE', label: 'الجداول المدرسية', icon: Calendar, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
    { id: 'EXAMS', label: 'الامتحانات', icon: FileText, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
    { id: 'RESULTS', label: 'رصد الدرجات', icon: GraduationCap, roles: [UserRole.ADMIN, UserRole.TEACHER] },
    { id: 'CERTIFICATES', label: 'الشهادات', icon: Award, roles: [UserRole.ADMIN, UserRole.STUDENT] },
    { id: 'AI_GENERATOR', label: 'الذكاء الاصطناعي', icon: BrainCircuit, roles: [UserRole.ADMIN, UserRole.TEACHER] },
    { id: 'SETTINGS', label: 'إعدادات المدرسة', icon: Settings, roles: [UserRole.ADMIN] },
  ];

  return (
    <div className="min-h-screen bg-deepblack text-gray-100 flex overflow-hidden">
      
      {/* Sidebar */}
      <aside 
        className={`bg-darkgray border-l border-gold-700/30 transition-all duration-300 flex flex-col z-20
        ${isSidebarOpen ? 'w-64' : 'w-20'} fixed h-full md:relative`}
      >
        <div className="h-24 flex items-center justify-center border-b border-gold-700/30">
           {isSidebarOpen ? (
             <div className="text-center animate-fadeIn flex flex-col items-center">
               <Logo size={48} className="mb-2" />
               <h1 className="text-sm font-bold text-gold-400">SSC Control</h1>
             </div>
           ) : (
             <Logo size={32} />
           )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {navItems.filter(item => item.roles.includes(userRole)).map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setView(item.id as ViewState)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 group
                    ${currentView === item.id 
                      ? 'bg-gold-600/20 text-gold-400 border border-gold-600/30' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-gold-200'}
                  `}
                >
                  <item.icon className={`w-6 h-6 ${isSidebarOpen ? 'ml-3' : 'mx-auto'}`} />
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gold-700/30">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center p-2 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-6 h-6" />
            {isSidebarOpen && <span className="mr-2">تسجيل خروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-deepblack relative">
        
        {/* Header */}
        <header className="h-20 bg-darkgray/80 backdrop-blur-md border-b border-gold-700/30 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/5 text-gold-500"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <h2 className="text-xl font-bold text-white hidden md:block">
              {schoolName}
            </h2>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-white/5 text-gray-300 transition-colors"
              >
                <Bell className="w-6 h-6" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-black"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute left-0 mt-2 w-80 bg-darkgray border border-gold-700/30 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-white">الإشعارات</h3>
                    <button 
                      onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
                      className="text-xs text-gold-500 hover:text-gold-400"
                    >
                      تحديد الكل كمقروء
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-gray-500 text-sm">لا توجد إشعارات جديدة</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-3 border-b border-gray-800 hover:bg-white/5 cursor-pointer ${!n.read ? 'bg-gold-500/5' : ''}`}>
                          <p className="text-sm text-gray-200">{n.text}</p>
                          <span className="text-xs text-gray-500 mt-1 block">{n.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Clock & Date Widget */}
            <div className="hidden md:flex flex-col items-end text-sm md:flex-row md:items-center md:gap-6">
              <div className="text-right">
                <div className="text-gold-400 font-bold text-lg leading-none font-mono tracking-wider">
                  {timeString}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {dateStringGregorian}
                </div>
              </div>
              <div className="hidden md:block h-8 w-px bg-gold-700/30"></div>
              <div className="text-right hidden md:block">
                <div className="text-gray-300 font-semibold">
                  {dateStringHijri}
                </div>
                <div className="text-xs text-gold-600">
                  التقويم الهجري
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 scrollbar-thin">
          {children}
        </div>

        {/* Footer */}
        <footer className="absolute bottom-0 w-full h-12 bg-black border-t border-gold-900/50 flex items-center justify-center text-xs text-gray-500 z-10">
          <p>مطور الموقع: <span className="text-gold-600 font-bold">{DEVELOPER_NAME}</span> &copy; {new Date().getFullYear()}</p>
        </footer>

      </main>
    </div>
  );
};

export default Layout;