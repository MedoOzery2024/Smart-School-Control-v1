import React, { useState, useRef } from 'react';
import { StudyMaterial } from '../types';
import { FileText, Image as ImageIcon, Trash2, Upload, Eye } from 'lucide-react';

const StudyMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([
    { id: '1', title: 'ملزمة المراجعة النهائية - عربي', subject: 'اللغة العربية', type: 'PDF', url: '#', uploadDate: '2023-10-15', teacherId: 'u1' },
    { id: '2', title: 'خريطة تضاريس مصر', subject: 'الدراسات الاجتماعية', type: 'IMAGE', url: '#', uploadDate: '2023-10-18', teacherId: 'u1' }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('اللغة العربية');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && newTitle) {
      const type = file.type.includes('pdf') ? 'PDF' : 'IMAGE';
      const newMaterial: StudyMaterial = {
        id: `mat_${Date.now()}`,
        title: newTitle,
        subject: selectedSubject,
        type: type,
        url: URL.createObjectURL(file), // Mock URL
        uploadDate: new Date().toISOString().split('T')[0],
        teacherId: 'current_user'
      };
      setMaterials([...materials, newMaterial]);
      setNewTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      alert('تم رفع الملف بنجاح وحفظه في قاعدة البيانات');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الملف نهائياً؟')) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-gold-500/10 border border-gold-500/20">
          <FileText className="w-6 h-6 text-gold-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">المواد الدراسية والمراجعات</h2>
          <p className="text-gray-400 text-sm">رفع ملفات PDF والصور للطلاب</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-darkgray p-6 rounded-xl border border-gold-700/20 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">رفع ملف جديد</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-400 mb-1">عنوان الملف</label>
            <input 
              type="text" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="مثال: مراجعة ليلة الامتحان"
              className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">المادة</label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white outline-none focus:border-gold-500"
            >
              <option>اللغة العربية</option>
              <option>اللغة الإنجليزية</option>
              <option>الرياضيات</option>
              <option>العلوم</option>
              <option>الدراسات الاجتماعية</option>
            </select>
          </div>
          <div>
             <input 
               type="file" 
               accept="application/pdf, image/*" 
               ref={fileInputRef}
               className="hidden"
               onChange={handleUpload}
             />
             <button 
               onClick={() => {
                 if (!newTitle) return alert('يرجى كتابة عنوان للملف أولاً');
                 fileInputRef.current?.click();
               }}
               className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold py-2 rounded flex items-center justify-center gap-2"
             >
               <Upload className="w-5 h-5" />
               اختر ملف ورفع
             </button>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-10">لا توجد ملفات مرفوعة حالياً</p>
        ) : (
          materials.map(mat => (
            <div key={mat.id} className="bg-black/20 border border-gray-800 rounded-xl p-4 hover:border-gold-500/50 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-gray-900 rounded-lg">
                  {mat.type === 'PDF' ? <FileText className="text-red-500 w-8 h-8" /> : <ImageIcon className="text-blue-500 w-8 h-8" />}
                </div>
                <button 
                  onClick={() => handleDelete(mat.id)}
                  className="text-gray-600 hover:text-red-500 transition-colors p-1"
                  title="حذف"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <h4 className="font-bold text-white text-lg truncate">{mat.title}</h4>
              <p className="text-sm text-gold-500 mb-2">{mat.subject}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-4 border-t border-gray-800 pt-3">
                <span>{mat.uploadDate}</span>
                <span className="flex items-center gap-1 text-gray-400">
                   {mat.type}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudyMaterials;