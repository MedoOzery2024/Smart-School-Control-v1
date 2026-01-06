import React, { useState, useEffect } from 'react';
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
import FileManager from './components/FileManager';
import Settings from './components/Settings';
import Logo from './components/Logo';
import { LanguageProvider } from './LanguageContext';

// Firebase Imports
import { auth, db } from './firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  deleteUser 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch, 
  deleteDoc 
} from 'firebase/firestore';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.ADMIN);
  const [currentSchoolName, setCurrentSchoolName] = useState(MOCK_SCHOOL.name);
  const [currentSchoolType, setCurrentSchoolType] = useState<SchoolType>(MOCK_SCHOOL.type);
  const [currentSchoolId, setCurrentSchoolId] = useState('');
  const [currentFullName, setCurrentFullName] = useState('');
  const [loading, setLoading] = useState(true);

  // Auth State
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [registerType, setRegisterType] = useState<'NEW_SCHOOL' | 'JOIN_SCHOOL'>('NEW_SCHOOL');

  // Form States
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  
  // Registration Specific States
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolType, setNewSchoolType] = useState<SchoolType>(SchoolType.GOVERNMENT);
  const [managerName, setManagerName] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [regSchoolId, setRegSchoolId] = useState('');

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Check Auth State on Load
  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch User Role & School Data from Firestore
        if (db) {
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setCurrentUserRole(userData.role as UserRole);
                    setCurrentSchoolName(userData.schoolName || 'Smart School');
                    setCurrentSchoolType(userData.schoolType || SchoolType.GOVERNMENT);
                    setCurrentFullName(userData.fullName || 'User');
                    setCurrentSchoolId(userData.schoolId || '');
                }
            } catch (e) {
                console.error("Error fetching user data", e);
            }
        }
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addNotification = (note: Omit<Notification, 'id' | 'read'>) => {
    const newNote: Notification = {
      id: Date.now().toString(),
      read: false,
      ...note
    };
    setNotifications(prev => [newNote, ...prev]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        alert("Firebase لم يتم تهيئته. تأكد من ملف firebaseConfig.ts");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        console.error(error);
        alert("فشل تسجيل الدخول: " + error.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) {
         alert("Firebase not configured");
         return;
    }

    try {
        // 1. Create Auth User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Prepare Data
        let userData: any = {
            uid: user.uid,
            email: email,
            fullName: fullName || managerName,
            role: role,
            createdAt: new Date().toISOString()
        };

        if (registerType === 'NEW_SCHOOL') {
             const schoolId = 'SCH_' + Math.floor(Math.random() * 10000);
             userData.role = UserRole.ADMIN;
             userData.schoolId = schoolId;
             userData.schoolName = newSchoolName;
             userData.schoolType = newSchoolType;
             // Update local state immediately for better UX
             setCurrentSchoolName(newSchoolName);
             setCurrentSchoolId(schoolId);
             alert(`تم إنشاء المدرسة! المعرف: ${schoolId}`);
        } else {
            userData.schoolId = regSchoolId;
        }

        // 3. Save to Firestore
        await setDoc(doc(db, "users", user.uid), userData);
        
        // Reset View
        setAuthMode('LOGIN');
        setPassword('');
        alert('تم إنشاء الحساب بنجاح! قم بتسجيل الدخول.');

    } catch (error: any) {
        console.error(error);
        alert("خطأ في التسجيل: " + error.message);
    }
  };

  const handleDeleteSchool = async () => {
    if (!auth || !auth.currentUser || !db) return;
    
    setLoading(true);
    
    try {
        const user = auth.currentUser;
        
        // 1. Try to delete associated data first (Users, Files, etc.)
        // Note: Without Cloud Functions or specific Security Rules, deleting other users' docs might fail.
        // We will try our best to clean up Firestore.
        if (currentSchoolId) {
            const batch = writeBatch(db);
            
            // Delete Users Docs
            const usersRef = collection(db, "users");
            const qUsers = query(usersRef, where("schoolId", "==", currentSchoolId));
            const usersSnapshot = await getDocs(qUsers);
            usersSnapshot.forEach((doc) => batch.delete(doc.ref));

            // Delete Attendance Docs
            const attRef = collection(db, "attendance");
            const qAtt = query(attRef, where("schoolId", "==", currentSchoolId));
            const attSnapshot = await getDocs(qAtt);
            attSnapshot.forEach((doc) => batch.delete(doc.ref));

            // Delete Schedules
            const schRef = collection(db, "schedules");
            const qSch = query(schRef, where("schoolId", "==", currentSchoolId));
            const schSnapshot = await getDocs(qSch);
            schSnapshot.forEach((doc) => batch.delete(doc.ref));

            try {
                await batch.commit();
            } catch (batchError) {
                console.warn("Partial delete failure (likely permissions):", batchError);
                // Continue to delete current user anyway
            }
        }

        // 2. Delete the CURRENT Authentication User
        // Note: We cannot delete OTHER users from Auth using client-side SDK.
        await deleteDoc(doc(db, "users", user.uid)); // Ensure own doc is gone
        await deleteUser(user);

        alert('تم حذف حسابك وبيانات المدرسة المتاحة لك بنجاح.');
        
        // Reset Local State
        setIsLoggedIn(false);
        setEmail('');
        setPassword('');
        setAuthMode('LOGIN');
        setView('DASHBOARD');
        
    } catch (error: any) {
        console.error("Delete Error:", error);
        if (error.code === 'auth/requires-recent-login') {
            alert("لأسباب أمنية، يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى لإتمام عملية حذف الحساب.");
        } else if (error.code === 'permission-denied') {
             // Handle the specific permission error the user reported
             // If we can't delete others, we at least delete ourselves.
             try {
                await deleteDoc(doc(db, "users", auth.currentUser.uid));
                await deleteUser(auth.currentUser);
                alert("تم حذف حسابك الشخصي. لم نتمكن من حذف بيانات المدرسة بالكامل بسبب الصلاحيات، ولكن لا يمكن الوصول للحساب مرة أخرى.");
                handleLogout();
             } catch (e) {
                alert("فشل حذف الحساب. يرجى مراجعة الدعم الفني.");
             }
        } else {
            alert("حدث خطأ أثناء حذف البيانات: " + error.message);
        }
    } finally {
        setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (auth) {
        await signOut(auth);
    }
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setAuthMode('LOGIN');
    setView('DASHBOARD');
  };

  if (loading) {
      return <div className="min-h-screen bg-deepblack flex items-center justify-center text-gold-500 font-bold">جاري التحميل...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-deepblack flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gold-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-[80px]"></div>

        <div className="w-full max-w-md bg-darkgray/50 backdrop-blur-xl border border-gold-700/30 p-8 rounded-2xl shadow-2xl relative z-10">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
               <Logo size={80} />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">SSC Control</h1>
            <p className="text-gold-500 font-semibold text-lg">نظام كنترول متصل سحابياً</p>
          </div>

          {!auth && (
              <div className="bg-red-900/30 border border-red-500/50 p-2 rounded text-red-200 text-xs text-center mb-4">
                  تنبيه: لم يتم تهيئة Firebase. يرجى ضبط ملف firebaseConfig.ts. <br/>
              </div>
          )}

          {authMode === 'LOGIN' ? (
             <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                    placeholder="name@school.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">كلمة المرور</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
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
                  <div>
                     <label className="block text-xs text-gray-400 mb-1">البريد الإلكتروني</label>
                     <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none text-sm" />
                   </div>

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
      {/* Pass role to Dashboard for personalized view */}
      {view === 'DASHBOARD' && <Dashboard role={currentUserRole} />}
      {view === 'USERS' && <UserManagement currentUserRole={currentUserRole} schoolType={currentSchoolType} onDeleteSchool={handleDeleteSchool} />}
      {view === 'ATTENDANCE' && <Attendance onAddNotification={addNotification} />}
      {view === 'TEACHER_STATS' && <TeacherStats />}
      {view === 'SCHEDULE' && <Schedule />}
      {view === 'AI_GENERATOR' && <AIGenerator />}
      {view === 'EXAMS' && <ExamBuilder />}
      {view === 'RESULTS' && <ResultsManager userRole={currentUserRole} />}
      {view === 'CERTIFICATES' && <Certificates />}
      {view === 'STUDY_MATERIALS' && <StudyMaterials />}
      {view === 'FILE_MANAGER' && <FileManager userRole={currentUserRole} userName={currentFullName} />}
      {view === 'SETTINGS' && <Settings userRole={currentUserRole} />}
    </Layout>
  );
}

// Wrap App in LanguageProvider
export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}