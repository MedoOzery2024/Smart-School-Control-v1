import React, { useState } from 'react';
import { ViewState, UserRole, SchoolType, SchoolStage, Notification } from './types';
import { MOCK_SCHOOL } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import Schedule from './components/Schedule';
import Attendance from './components/Attendance';
import AIGenerator from './components/AIGenerator';
import ExamBuilder from './components/ExamBuilder';
import ResultsManager from './components/ResultsManager';
import Certificates from './components/Certificates';
import TeacherStats from './components/TeacherStats';
import StudyMaterials from './components/StudyMaterials';
import Settings from './components/Settings';
import Logo from './components/Logo';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [currentSchoolName, setCurrentSchoolName] = useState(MOCK_SCHOOL.name);

  // Auth State
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [registerType, setRegisterType] = useState<'NEW_SCHOOL' | 'JOIN_SCHOOL'>('NEW_SCHOOL');

  // Form States
  const [schoolId, setSchoolId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration Specific States
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolType, setNewSchoolType] = useState<SchoolType>(SchoolType.GOVERNMENT);
  const [managerName, setManagerName] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [regSchoolId, setRegSchoolId] = useState('');

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'النظام', message: 'نظام الكنترول جاهز للعمل', type: 'INFO', time: 'الآن', read: false },
  ]);

  const addNotification = (note: Omit<Notification, 'id' | 'read'>) => {
    const newNote: Notification = {
      id: Date.now().toString(),
      read: false,
      ...note
    };
    setNotifications(prev => [newNote, ...prev]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (schoolId && username && password) {
      setIsLoggedIn(true);
      
      // Role Simulation Logic based on Username for Demo
      const u = username.toLowerCase();
      if (u.includes('admin')) setCurrentUserRole(UserRole.ADMIN);
      else if (u.includes('it')) setCurrentUserRole(UserRole.IT);
      else if (u.includes('control')) setCurrentUserRole(UserRole.CONTROL);
      else if (u.includes('teacher')) setCurrentUserRole(UserRole.TEACHER);
      else if (u.includes('student')) setCurrentUserRole(UserRole.STUDENT);
      else setCurrentUserRole(UserRole.ADMIN); // Default to Admin for testing if no match
      
      setCurrentSchoolName(MOCK_SCHOOL.name); 

      // Set initial view based on role
      if (u.includes('student')) setView('EXAMS');
      else setView('DASHBOARD');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate Registration Logic
    if (registerType === 'NEW_SCHOOL') {
        const generatedId = 'SCH_' + Math.floor(Math.random() * 10000);
        alert(`تم إنشاء المدرسة بنجاح!\nمعرف المدرسة الخاص بك هو: ${generatedId}\nيرجى حفظه للدخول.`);
        setSchoolId(generatedId);
        setCurrentSchoolName(newSchoolName);
        setUsername(managerName.split(' ')[0] || 'admin');
    } else {
        alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        setSchoolId(regSchoolId);
        setUsername(username);
    }
    
    // Switch to Login Mode
    setAuthMode('LOGIN');
    setPassword('');
  };

  const handleDeleteSchool = () => {
    // Only available to Admin inside UserManagement
    alert('تم حذف الحساب المدرسي وجميع البيانات نهائياً.');
    handleLogout();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSchoolId('');
    setUsername('');
    setPassword('');
    setAuthMode('LOGIN');
    setView('DASHBOARD');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-deepblack flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Abstract Gold Background Shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gold-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-[80px]"></div>

        <div className="w-full max-w-md bg-darkgray/50 backdrop-blur-xl border border-gold-700/30 p-8 rounded-2xl shadow-2xl relative z-10">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
               <Logo size={80} />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">SSC Control</h1>
            <p className="text-gold-500 font-semibold text-lg">نظام الكنترول المدرسي الذكي</p>
          </div>

          {authMode === 'LOGIN' ? (
             <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">معرف المدرسة (School ID)</label>
                  <input 
                    type="text" 
                    required
                    value={schoolId}
                    onChange={e => setSchoolId(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                    placeholder="SCH_XXXX"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1">اسم المستخدم</label>
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                    placeholder="Admin / IT / Control / Teacher / Student"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">كلمة المرور</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                    placeholder="********"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-lg shadow-lg shadow-gold-900/20 transition-all transform hover:scale-[1.02] mt-4"
                >
                  تسجيل الدخول
                </button>

                <p className="text-center text-sm text-gray-400 mt-4">
                   ليس لديك حساب؟ 
                   <button 
                     type="button" 
                     onClick={() => setAuthMode('REGISTER')}
                     className="text-gold-500 hover:text-gold-400 font-bold mr-1 underline"
                   >
                     إنشاء حساب جديد
                   </button>
                </p>
             </form>
          ) : (
            <div className="animate-fadeIn">
               <div className="flex mb-4 bg-black/40 rounded-lg p-1">
                  <button 
                     onClick={() => setRegisterType('NEW_SCHOOL')}
                     className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${registerType === 'NEW_SCHOOL' ? 'bg-gold-600 text-black shadow' : 'text-gray-400 hover:text-white'}`}
                  >
                     إنشاء مدرسة
                  </button>
                  <button 
                     onClick={() => setRegisterType('JOIN_SCHOOL')}
                     className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${registerType === 'JOIN_SCHOOL' ? 'bg-gold-600 text-black shadow' : 'text-gray-400 hover:text-white'}`}
                  >
                     تسجيل مستخدم
                  </button>
               </div>

               <form onSubmit={handleRegister} className="space-y-3">
                  {registerType === 'NEW_SCHOOL' ? (
                    <>
                       <div>
                         <label className="block text-xs text-gray-400 mb-1">اسم المدرسة</label>
                         <input required type="text" value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none text-sm" />
                       </div>
                       <div>
                         <label className="block text-xs text-gray-400 mb-1">اسم المدير المسئول</label>
                         <input required type="text" value={managerName} onChange={e => setManagerName(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none text-sm" />
                       </div>
                       <div>
                         <label className="block text-xs text-gray-400 mb-1">نوع المدرسة</label>
                         <select value={newSchoolType} onChange={e => setNewSchoolType(e.target.value as SchoolType)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none text-sm">
                            <option value={SchoolType.GOVERNMENT}>حكومي</option>
                            <option value={SchoolType.LANGUAGE}>لغات</option>
                            <option value={SchoolType.INTERNATIONAL}>انترناشونال</option>
                         </select>
                       </div>
                    </>
                  ) : (
                    <>
                       <div>
                         <label className="block text-xs text-gray-400 mb-1">معرف المدرسة (School ID)</label>
                         <input required type="text" value={regSchoolId} onChange={e => setRegSchoolId(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none text-sm" placeholder="اطلب المعرف من مدير المدرسة" />
                       </div>
                       <div className="flex gap-2">
                          <div className="flex-1">
                             <label className="block text-xs text-gray-400 mb-1">الاسم الكامل</label>
                             <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none text-sm" />
                          </div>
                          <div className="flex-1">
                             <label className="block text-xs text-gray-400 mb-1">نوع الحساب</label>
                             <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none text-sm">
                                <option value={UserRole.STUDENT}>طالب</option>
                                <option value={UserRole.TEACHER}>معلم</option>
                                <option value={UserRole.CONTROL}>موظف كنترول</option>
                                <option value={UserRole.IT}>مسؤول IT</option>
                             </select>
                          </div>
                       </div>
                       <div>
                         <label className="block text-xs text-gray-400 mb-1">اسم المستخدم</label>
                         <input required type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none text-sm" />
                       </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">كلمة المرور</label>
                    <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none text-sm" />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-lg shadow-lg mt-2"
                  >
                    {registerType === 'NEW_SCHOOL' ? 'إنشاء المدرسة' : 'إنشاء الحساب'}
                  </button>
               </form>

               <button 
                  onClick={() => setAuthMode('LOGIN')}
                  className="w-full mt-4 text-xs text-gray-500 hover:text-gold-500"
               >
                  العودة لتسجيل الدخول
               </button>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      currentView={view} 
      setView={setView} 
      userRole={currentUserRole}
      onLogout={handleLogout}
      schoolName={currentSchoolName}
      notifications={notifications}
    >
      {view === 'DASHBOARD' && <Dashboard />}
      {view === 'USERS' && <UserManagement currentUserRole={currentUserRole} onDeleteSchool={handleDeleteSchool} />}
      {view === 'ATTENDANCE' && <Attendance onAddNotification={addNotification} />}
      {view === 'TEACHER_STATS' && <TeacherStats />}
      {view === 'SCHEDULE' && <Schedule />}
      {view === 'AI_GENERATOR' && <AIGenerator />}
      {view === 'EXAMS' && <ExamBuilder />}
      {view === 'RESULTS' && <ResultsManager userRole={currentUserRole} />}
      {view === 'CERTIFICATES' && <Certificates />}
      {view === 'STUDY_MATERIALS' && <StudyMaterials />}
      {view === 'SETTINGS' && <Settings />}
    </Layout>
  );
}

export default App;