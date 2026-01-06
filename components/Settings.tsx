import React, { useState } from 'react';
import { SchoolType, UserRole } from '../types';
import { Settings as SettingsIcon, Save, School, Book, Globe, Languages, FlaskConical, BellRing } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Settings: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const [schoolName, setSchoolName] = useState('مدرسة المستقبل الدولية');
  const [schoolType, setSchoolType] = useState<SchoolType>(SchoolType.INTERNATIONAL);
  const [managerName, setManagerName] = useState('أ. أحمد المدير');
  const { t } = useLanguage();

  // Specific settings state
  const [secondLanguage, setSecondLanguage] = useState('French');
  const [curriculumType, setCurriculumType] = useState('IGCSE');
  const [experimentalLang, setExperimentalLang] = useState('English');
  
  // Notification Prefs
  const [notifyExams, setNotifyExams] = useState(true);
  const [notifyMaterials, setNotifyMaterials] = useState(true);
  const [notifyAttendance, setNotifyAttendance] = useState(true);

  const handleSave = () => {
    alert(t('saveSettings') + ' - Success!');
  };

  const renderTypeSpecificSettings = () => {
    switch (schoolType) {
      case SchoolType.GOVERNMENT:
        return (
          <div className="bg-black/20 p-4 rounded-lg border border-gray-800 animate-fadeIn mt-4">
            <h3 className="text-gold-500 font-bold mb-3 flex items-center gap-2">
              <Book className="w-4 h-4" /> إعدادات المدارس الحكومية
            </h3>
            <div className="space-y-3">
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="checkbox" className="accent-gold-500" defaultChecked />
                 <span className="text-sm text-gray-300">تطبيق لائحة الانضباط المدرسي الحكومية</span>
               </label>
            </div>
          </div>
        );
      case SchoolType.LANGUAGE:
        return (
           <div className="bg-black/20 p-4 rounded-lg border border-gray-800 animate-fadeIn mt-4">
            <h3 className="text-gold-500 font-bold mb-3 flex items-center gap-2">
              <Languages className="w-4 h-4" /> إعدادات مدارس اللغات
            </h3>
            <div className="space-y-3">
               <div>
                  <label className="block text-sm text-gray-400 mb-1">اللغة الأجنبية الثانية</label>
                  <select 
                    value={secondLanguage}
                    onChange={(e) => setSecondLanguage(e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-gold-500"
                  >
                    <option value="French">الفرنسية (Français)</option>
                    <option value="German">الألمانية (Deutsch)</option>
                  </select>
               </div>
            </div>
          </div>
        );
      case SchoolType.INTERNATIONAL:
        return (
           <div className="bg-black/20 p-4 rounded-lg border border-gray-800 animate-fadeIn mt-4">
            <h3 className="text-gold-500 font-bold mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" /> إعدادات المدارس الدولية
            </h3>
            <div className="space-y-3">
               <div>
                  <label className="block text-sm text-gray-400 mb-1">نظام الاعتماد (Curriculum)</label>
                  <select 
                    value={curriculumType}
                    onChange={(e) => setCurriculumType(e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-gold-500"
                  >
                    <option value="IGCSE">النظام البريطاني (IGCSE)</option>
                    <option value="SAT">النظام الأمريكي (American Diploma)</option>
                  </select>
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-gold-500/10 border border-gold-500/20">
          <SettingsIcon className="w-6 h-6 text-gold-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{t('settings')}</h2>
          <p className="text-gray-400 text-sm">Manage preferences and configurations</p>
        </div>
      </div>

      <div className="bg-darkgray border border-gold-700/30 rounded-xl p-6 shadow-lg">
        
        {/* Student Notification Preferences */}
        {userRole === UserRole.STUDENT ? (
          <div className="space-y-6">
             <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                <BellRing className="w-5 h-5 text-gold-500" />
                {t('notificationPrefs')}
             </h3>
             <div className="space-y-4">
                <label className="flex items-center justify-between p-3 bg-black/30 rounded-lg cursor-pointer hover:bg-black/50 transition">
                   <span className="text-gray-200">{t('examReminders')}</span>
                   <input type="checkbox" checked={notifyExams} onChange={e => setNotifyExams(e.target.checked)} className="accent-gold-500 w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-3 bg-black/30 rounded-lg cursor-pointer hover:bg-black/50 transition">
                   <span className="text-gray-200">{t('newMaterials')}</span>
                   <input type="checkbox" checked={notifyMaterials} onChange={e => setNotifyMaterials(e.target.checked)} className="accent-gold-500 w-5 h-5" />
                </label>
                <label className="flex items-center justify-between p-3 bg-black/30 rounded-lg cursor-pointer hover:bg-black/50 transition">
                   <span className="text-gray-200">{t('attendanceAlerts')}</span>
                   <input type="checkbox" checked={notifyAttendance} onChange={e => setNotifyAttendance(e.target.checked)} className="accent-gold-500 w-5 h-5" />
                </label>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-1">{t('schoolName')}</label>
                 <div className="relative">
                   <School className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
                   <input 
                     type="text" 
                     value={schoolName}
                     onChange={(e) => setSchoolName(e.target.value)}
                     className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 pr-10 text-white focus:border-gold-500 outline-none"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-1">School Type</label>
                 <select 
                   value={schoolType}
                   onChange={(e) => setSchoolType(e.target.value as SchoolType)}
                   className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                 >
                   <option value={SchoolType.GOVERNMENT}>حكومي</option>
                   <option value={SchoolType.LANGUAGE}>لغات</option>
                   <option value={SchoolType.EXPERIMENTAL}>تجريبي</option>
                   <option value={SchoolType.INTERNATIONAL}>انترناشونال</option>
                 </select>
               </div>

               {/* Render Type Specific Settings Here */}
               {renderTypeSpecificSettings()}

               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-1">{t('managerName')}</label>
                 <input 
                   type="text" 
                   value={managerName}
                   onChange={(e) => setManagerName(e.target.value)}
                   className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                 />
               </div>
            </div>

            <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-1">General Options</label>
                 <div className="bg-black/20 p-3 rounded-lg border border-gray-800 space-y-2">
                   <label className="flex items-center gap-2 cursor-pointer">
                     <input type="checkbox" className="accent-gold-500" defaultChecked />
                     <span className="text-sm text-gray-300">Enable e-Attendance</span>
                   </label>
                 </div>
               </div>
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-gray-800 pt-6 flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-black font-bold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-gold-900/20"
          >
            <Save className="w-5 h-5" />
            {t('saveSettings')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
