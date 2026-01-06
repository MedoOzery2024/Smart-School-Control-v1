import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, UserRole, SchoolStage, SchoolType } from '../types';
import { Plus, Trash2, UserCheck, X, Save, Download, Pencil, Upload, Database, Wifi, Search, AlertTriangle } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../LanguageContext';

interface UserManagementProps {
  currentUserRole: UserRole;
  schoolType: SchoolType;
  onDeleteSchool: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUserRole, schoolType, onDeleteSchool }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.STUDENT);
  const [searchTerm, setSearchTerm] = useState(''); // Search State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [useRealDb, setUseRealDb] = useState(!!db);
  const { t } = useLanguage();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    role: UserRole.STUDENT,
    stage: SchoolStage.PRIMARY,
    gradeLevel: ''
  });

  // Delete School Confirmation State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Fetch Users
  useEffect(() => {
    if (!db) return;
    setIsSyncing(true);
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        const fetchedUsers: User[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as User));
        setUsers(fetchedUsers);
        setIsSyncing(false);
    });
    return () => unsubscribe();
  }, []);

  // Enhanced Search Logic (Fuzzy-like)
  const filteredUsers = useMemo(() => {
     let result = users.filter(u => u.role === activeTab);
     if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase().trim();
        result = result.filter(u => 
           u.fullName.toLowerCase().includes(lowerTerm) || 
           u.username.toLowerCase().includes(lowerTerm) ||
           (u.stage && u.stage.toLowerCase().includes(lowerTerm)) ||
           (u.gradeLevel && u.gradeLevel.toLowerCase().includes(lowerTerm))
        );
     }
     return result;
  }, [users, activeTab, searchTerm]);

  // Permission Logic
  const canManageUsers = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.IT;
  const canDeleteSchool = currentUserRole === UserRole.ADMIN;

  const handleDeleteUser = async (id: string) => {
    if (!canManageUsers) return;
    if (confirm('Warning: Delete this user?')) {
       if (db && !id.startsWith('u_')) {
           await deleteDoc(doc(db, "users", id));
       }
       setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const confirmDeleteSchool = () => {
    if (deleteConfirmation === 'Delete School') {
        onDeleteSchool();
    } else {
        alert('Incorrect confirmation text.');
    }
  };

  const openAddUserModal = () => {
    setEditingUserId(null);
    setFormData({
        username: '',
        fullName: '',
        password: '',
        role: activeTab,
        stage: SchoolStage.PRIMARY,
        gradeLevel: ''
    });
    setIsModalOpen(true);
  };

  const openEditUserModal = (user: User) => {
    setEditingUserId(user.id);
    setFormData({
        username: user.username,
        fullName: user.fullName,
        password: '', // Clear password field for security, user can enter new one to reset
        role: user.role,
        stage: user.stage || SchoolStage.PRIMARY,
        gradeLevel: user.gradeLevel || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.fullName) return;

    const userData: any = {
      username: formData.username,
      fullName: formData.fullName,
      role: formData.role,
      schoolId: 'sch_01',
      stage: (formData.role === UserRole.STUDENT || formData.role === UserRole.TEACHER) ? formData.stage : undefined,
      gradeLevel: (formData.role === UserRole.STUDENT) ? formData.gradeLevel : undefined,
    };

    if (formData.password) {
        userData.password = formData.password;
    }

    try {
        if (editingUserId) {
            if (db && !editingUserId.startsWith('u_')) {
               await updateDoc(doc(db, "users", editingUserId), userData);
            }
            setUsers(users.map(u => u.id === editingUserId ? { ...u, ...userData } : u));
        } else {
            if (db) {
                await addDoc(collection(db, "users"), userData);
            } else {
                const newUser = { id: `u_${Date.now()}`, ...userData, password: formData.password };
                setUsers([...users, newUser]);
            }
        }
        setIsModalOpen(false);
    } catch (e) {
        console.error(e);
        alert("DB Error");
    }
  };

  if (!canManageUsers) {
    return <div className="text-center p-10 text-red-500">Access Denied.</div>;
  }

  return (
    <div className="space-y-6 relative">
      {/* Database Status */}
      <div className="flex justify-between items-center mb-2">
         <div className="flex items-center gap-2 text-xs">
            <Database className={`w-4 h-4 ${useRealDb ? 'text-green-500' : 'text-gray-500'}`} />
            <span className={useRealDb ? 'text-green-400' : 'text-gray-500'}>
               {useRealDb ? 'Live DB' : 'Mock Mode'}
            </span>
            {isSyncing && <span className="text-gold-500 flex items-center gap-1"><Wifi className="w-3 h-3 animate-pulse" /> Syncing...</span>}
         </div>
      </div>

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
               {role}
             </button>
          ))}
        </div>
        
        <div className="flex gap-2">
           <div className="relative">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
              <input 
                type="text"
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/40 border border-gray-700 rounded px-10 py-2 text-white outline-none focus:border-gold-500"
              />
           </div>
          <button onClick={openAddUserModal} className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-black font-bold rounded hover:bg-gold-500">
            <Plus className="w-4 h-4" />
            {t('addNew')}
          </button>
        </div>
      </div>

      <div className="bg-darkgray rounded-xl border border-gold-700/20 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-black/40 text-gold-500">
            <tr>
              <th className="p-4">Username</th>
              <th className="p-4">Full Name</th>
              <th className="p-4">Details</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                    {searchTerm ? 'No matches found.' : 'No users found in this category.'}
                </td>
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
                  <td className="p-4 text-gray-400">
                      {user.stage && <span className="ml-2 bg-gray-800 px-2 py-0.5 rounded text-xs">{user.stage}</span>}
                      {user.gradeLevel && <span className="bg-gray-800 px-2 py-0.5 rounded text-xs">{user.gradeLevel}</span>}
                      {!user.stage && !user.gradeLevel && '-'}
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button 
                      onClick={() => openEditUserModal(user)}
                      className="p-2 text-gold-400 hover:bg-gold-900/20 rounded border border-gold-900/30"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-red-500 hover:bg-red-900/20 rounded border border-red-900/30"
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

      {/* Danger Zone (Admin Only) */}
      {currentUserRole === UserRole.ADMIN && (
        <div className="mt-10 border border-red-900/50 bg-red-900/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4 text-red-500">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-lg font-bold">Danger Zone</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Deleting the school account will permanently remove all associated users, data, and files. This action cannot be undone.
          </p>
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Delete School
          </button>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-darkgray border border-gold-700/30 rounded-xl p-6 w-full max-w-md shadow-2xl animate-fadeIn">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
                    <h3 className="text-xl font-bold text-white">
                        {editingUserId ? 'Edit User' : 'Add New User'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSaveUser} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                        <input required type="text" className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Username / Email</label>
                        <input required type="text" className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password {editingUserId && '(Leave blank to keep current)'}</label>
                        <input type="password" className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder={editingUserId ? "Set new password" : "Required"} required={!editingUserId} />
                    </div>
                    
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Role</label>
                        <select 
                            className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                        >
                            <option value={UserRole.STUDENT}>Student</option>
                            <option value={UserRole.TEACHER}>Teacher</option>
                            <option value={UserRole.CONTROL}>Control Staff</option>
                            <option value={UserRole.IT}>IT Specialist</option>
                            <option value={UserRole.STAFF}>General Staff</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold py-2 rounded mt-2">
                        <Save className="w-5 h-5 inline mr-2" /> Save User
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* Delete School Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-darkgray border border-red-500/50 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Confirm School Deletion</h3>
            <p className="text-gray-300 mb-4">
                To confirm, please type <span className="font-bold text-red-500">Delete School</span> below.
            </p>
            <input 
                type="text" 
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white mb-4 outline-none focus:border-red-500"
                placeholder="Delete School"
            />
            <div className="flex justify-end gap-2">
                <button 
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                >
                Cancel
                </button>
                <button 
                    onClick={confirmDeleteSchool}
                    disabled={deleteConfirmation !== 'Delete School'}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Delete Permanently
                </button>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;