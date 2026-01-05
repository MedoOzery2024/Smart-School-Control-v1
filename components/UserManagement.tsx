import React, { useState } from 'react';
import { User, UserRole, SchoolStage } from '../types';
import { Plus, Trash2, FileSpreadsheet, UserPlus } from 'lucide-react';
import { MOCK_USERS } from '../constants';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.STUDENT);

  const filteredUsers = users.filter(u => u.role === activeTab);

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من الحذف النهائي؟ لا يمكن التراجع.')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleAddMock = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-darkgray p-1 rounded-lg border border-gold-700/20">
          {[UserRole.STUDENT, UserRole.TEACHER, UserRole.STAFF].map(role => (
             <button
               key={role}
               onClick={() => setActiveTab(role)}
               className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
                 activeTab === role 
                 ? 'bg-gold-600 text-black shadow-lg' 
                 : 'text-gray-400 hover:text-white'
               }`}
             >
               {role === UserRole.STUDENT ? 'الطلاب' : role === UserRole.TEACHER ? 'المعلمون' : 'الموظفون'}
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
              <th className="p-4 text-center">الإجراءات</th>
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
                  <td className="p-4 font-semibold text-white">{user.fullName}</td>
                  <td className="p-4 text-gray-400">{user.stage || '-'}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-red-500 hover:bg-red-900/20 rounded"
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
