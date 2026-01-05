import React, { useState } from 'react';
import { SchoolType } from '../types';
import { Settings as SettingsIcon, Save, School } from 'lucide-react';

const Settings: React.FC = () => {
  const [schoolName, setSchoolName] = useState('مدرسة المستقبل الدولية');
  const [schoolType, setSchoolType] = useState<SchoolType>(SchoolType.INTERNATIONAL);
  const [managerName, setManagerName] = useState('أ. أحمد المدير');

  const handleSave = () => {
    alert('تم حفظ إعدادات المدرسة بنجاح!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-gold-500/10 border border-gold-500/20">
          <SettingsIcon className="w-6 h-6 text-gold-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">إعدادات المدرسة</h2>
          <p className="text-gray-400 text-sm">إدارة نوع المدرسة والبيانات الأساسية</p>
        </div>
      </div>

      <div className="bg-darkgray border border-gold-700/30 rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-300 mb-1">اسم المدرسة</label>
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
               <label className="block text-sm font-medium text-gray-300 mb-1">نوع المدرسة</label>
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
               <p className="text-xs text-gray-500 mt-1">
                 {schoolType === SchoolType.GOVERNMENT && 'نظام التعليم الحكومي العام.'}
                 {schoolType === SchoolType.LANGUAGE && 'نظام اللغات القومي.'}
                 {schoolType === SchoolType.EXPERIMENTAL && 'نظام التجريبيات المتميز.'}
                 {schoolType === SchoolType.INTERNATIONAL && 'نظام التعليم الدولي (IG/American).'}
               </p>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-300 mb-1">اسم المدير المسئول</label>
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
               <label className="block text-sm font-medium text-gray-300 mb-1">شعار المدرسة</label>
               <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:border-gold-500/50 hover:bg-black/20 transition-all cursor-pointer">
                 <School className="w-12 h-12 mb-2 opacity-50" />
                 <span className="text-sm">اضغط لرفع الشعار</span>
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-300 mb-1">خيارات إضافية</label>
               <div className="bg-black/20 p-3 rounded-lg border border-gray-800 space-y-2">
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" className="accent-gold-500" defaultChecked />
                   <span className="text-sm text-gray-300">تفعيل الحضور والغياب الإلكتروني</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="checkbox" className="accent-gold-500" defaultChecked />
                   <span className="text-sm text-gray-300">السماح لأولياء الأمور بالدخول</span>
                 </label>
               </div>
             </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6 flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-gold-600 hover:bg-gold-500 text-black font-bold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-gold-900/20"
          >
            <Save className="w-5 h-5" />
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
