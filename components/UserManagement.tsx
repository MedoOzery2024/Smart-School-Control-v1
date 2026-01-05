import React, { useState } from 'react';
import { User, UserRole, SchoolStage } from '../types';
import { Plus, Trash2, FileSpreadsheet, Key, AlertOctagon, UserCheck } from 'lucide-react';
import { MOCK_USERS } from '../constants';

interface UserManagementProps {
  currentUserRole: UserRole;
  onDeleteSchool: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUserRole, onDeleteSchool }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.STUDENT);

  const filteredUsers = users.filter(u => u.role === activeTab);

  // Permission Logic
  const canManageUsers = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.IT;
  const canDeleteSchool = currentUserRole === UserRole.ADMIN;

  const handleDeleteUser = (id: string) => {
    if (!canManageUsers) return;
    if (confirm('تحذير: هل أنت متأكد من حذف هذا المستخدم؟ سيتم فقدان جميع بياناته.')) {
      setUsers(prev => prev.filter(u => u.id !== id));
      alert('تم حذف المستخدم بنجاح.');
    }
  };

  const handleResetPassword = (id: string, name: string) => {
    if (!canManageUsers) return;
    const newPass = prompt(`إعادة تعيين كلمة المرور للمستخدم: ${name}\nأدخل كلمة المرور الجديدة:`);
    if (newPass) {
      alert(`تم تغيير كلمة مرور ${name} بنجاح.`);
    }
  };

  const handleDeleteSchoolAccount = () => {
    if (!canDeleteSchool) return;
    const confirmName = prompt("تحذير خطير جداً!\nأنت على وشك حذف الحساب المدرسي بالكامل وجميع البيانات المرتبطة به.\nللتأكيد، يرجى كتابة 'حذف المدرسة' :");
    if (confirmName === 'حذف المدرسة') {
       onDeleteSchool();
    }
  };

  const handleAddMock = () => {
    if (!canManageUsers) return;
    const newUser: User = {
      id: `new_${Date.now()}`,
      username: `user_${Date.now()}`,
      fullName: 'مستخدم جديد',
      role: activeTab,
      schoolId: 'sch_01',
      stage: SchoolStage.PRIMARY
    };
    setUsers([...users, newUser]);
  };

  if (!canManageUsers) {
    return <div className="text-center p-10 text-red-500">ليس لديك صلاحية للوصول إلى هذه الصفحة.</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Admin Zone - School Deletion */}
      {canDeleteSchool && (
        <div className="bg-red-900/10 border border-red-900/50 p-4 rounded-xl flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <AlertOctagon className="text-red-500 w-8 h-8" />
             <div>
               <h3 className="text-red-500 font-bold">منطقة الخطر (المدير فقط)</h3>
               <p className="text-xs text-gray-400">حذف الحساب المدرسي بالكامل (لا يمكن التراجع)</p>
             </div>
          </div>
          <button 
            onClick={handleDeleteSchoolAccount}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold shadow-lg"
          >
            حذف الحساب المدرسي
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-darkgray p-1 rounded-lg border border-gold-700/20 overflow-x-auto">
          {[UserRole.STUDENT, UserRole.TEACHER, UserRole.CONTROL, UserRole.IT, UserRole.STAFF].map(role => (
             <button
               key={role}
               onClick={() => setActiveTab(role)}
               className={`px-4 py-2 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                 activeTab === role 
                 ? 'bg-gold-600 text-black shadow-lg' 
                 : 'text-gray-400 hover:text-white'
               }`}
             >
               {role === UserRole.STUDENT ? 'الطلاب' : 
                role === UserRole.TEACHER ? 'المعلمون' : 
                role === UserRole.CONTROL ? 'الكنترول' : 
                role === UserRole.IT ? 'IT' : 'إداريين'}
             </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-700/20 text-green-400 border border-green-700/50 rounded hover:bg-green-700/30">
            <FileSpreadsheet className="w-4 h-4" />
            استيراد Excel
          </button>
          <button onClick={handleAddMock} className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-black font-bold rounded hover:bg-gold-500">
            <Plus className="w-4 h-4" />
            إضافة جديد
          </button>
        </div>
      </div>

      <div className="bg-darkgray rounded-xl border border-gold-700/20 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-black/40 text-gold-500">
            <tr>
              <th className="p-4">اسم المستخدم</th>
              <th className="p-4">الاسم الكامل</th>
              <th className="p-4">المرحلة</th>
              <th className="p-4 text-center">الإجراءات (IT / Admin)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">لا يوجد بيانات لعرضها</td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-gray-300">{user.username}</td>
                  <td className="p-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-gray-500" />
                      {user.fullName}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{user.stage || '-'}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button 
                      onClick={() => handleResetPassword(user.id, user.fullName)}
                      className="p-2 text-blue-400 hover:bg-blue-900/20 rounded border border-blue-900/30"
                      title="إعادة تعيين كلمة المرور"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-red-500 hover:bg-red-900/20 rounded border border-red-900/30"
                      title="حذف الحساب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;