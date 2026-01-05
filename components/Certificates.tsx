import React, { useState } from 'react';
import { Award, Printer, LayoutTemplate, Palette, Type } from 'lucide-react';
import { MOCK_SCHOOL } from '../constants';

const Certificates: React.FC = () => {
  const [template, setTemplate] = useState<'CLASSIC' | 'MODERN' | 'ELEGANT'>('MODERN');
  const [customTitle, setCustomTitle] = useState('شهادة تقدير');
  const [primaryColor, setPrimaryColor] = useState('#EAB308'); // Gold

  const renderCertificatePreview = () => {
    // Styles based on template
    const baseStyle = "w-full aspect-[1.414] bg-white text-black p-10 relative shadow-2xl overflow-hidden flex flex-col items-center text-center";
    
    if (template === 'CLASSIC') {
      return (
        <div className={baseStyle} style={{ fontFamily: 'serif', border: `20px double ${primaryColor}` }}>
           <div className="absolute top-10 left-10 opacity-20"><Award size={100} color={primaryColor} /></div>
           <div className="absolute bottom-10 right-10 opacity-20"><Award size={100} color={primaryColor} /></div>
           
           <h1 className="text-4xl font-bold mt-10 mb-4">{MOCK_SCHOOL.name}</h1>
           <h2 className="text-6xl font-black mb-8 text-gray-800" style={{ color: primaryColor }}>{customTitle}</h2>
           
           <p className="text-xl mt-8">تشهد إدارة المدرسة بأن الطالب</p>
           <p className="text-4xl font-bold my-4 border-b-2 border-black pb-2 px-10">أحمد محمد محمود</p>
           <p className="text-xl">قد اجتاز الصف <span className="font-bold">الأول الإعدادي</span> بنجاح وتفوق</p>
           
           <div className="mt-auto flex justify-between w-full px-20 mb-10">
              <div className="text-center">
                 <p className="border-t border-black pt-2 w-40">مدير المدرسة</p>
              </div>
              <div className="text-center">
                 <p className="text-xl font-bold text-gray-600">{new Date().toLocaleDateString('ar-EG')}</p>
              </div>
           </div>
        </div>
      );
    } 
    
    if (template === 'MODERN') {
       return (
        <div className={`${baseStyle} bg-slate-50`} style={{ fontFamily: 'sans-serif' }}>
           <div className="absolute top-0 left-0 w-full h-4" style={{ backgroundColor: primaryColor }}></div>
           <div className="absolute bottom-0 right-0 w-full h-4" style={{ backgroundColor: primaryColor }}></div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-gray-900 rounded-bl-full z-0"></div>

           <div className="z-10 w-full">
              <div className="flex justify-between items-center w-full mb-12">
                 <h3 className="text-2xl font-bold text-gray-600">{MOCK_SCHOOL.name}</h3>
                 <Award size={48} color={primaryColor} />
              </div>

              <h1 className="text-5xl font-black mb-6 uppercase tracking-widest text-gray-900">{customTitle}</h1>
              
              <div className="my-10">
                 <p className="text-gray-500 mb-2">مقدمة إلى الطالب المتفوق</p>
                 <h2 className="text-4xl font-bold text-gray-800 py-2" style={{ color: primaryColor }}>أحمد محمد محمود</h2>
                 <p className="text-gray-500 mt-4 max-w-lg mx-auto">
                    تقديراً لجهوده المتميزة وتفوقه الدراسي في العام الحالي وحصوله على تقدير امتياز.
                 </p>
              </div>

              <div className="flex justify-center gap-20 mt-12">
                 <div className="text-center">
                    <div className="w-40 h-10 border-b border-gray-400 mb-2"></div>
                    <p className="text-sm text-gray-500">توقيع المدير</p>
                 </div>
                 <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                    ختم المدرسة
                 </div>
              </div>
           </div>
        </div>
       );
    }

    // ELEGANT
    return (
      <div className={baseStyle} style={{ backgroundColor: '#fffbf0' }}>
         <div className="absolute inset-4 border border-gray-800"></div>
         <div className="absolute inset-6 border border-gray-400"></div>
         
         <div className="relative z-10 mt-10">
            <Award className="mx-auto mb-6" size={64} color={primaryColor} />
            <h2 className="text-2xl tracking-widest uppercase mb-2">{MOCK_SCHOOL.name}</h2>
            <div className="w-16 h-1 bg-gray-800 mx-auto mb-10"></div>
            
            <h1 className="text-5xl font-serif italic mb-6" style={{ color: primaryColor }}>{customTitle}</h1>
            
            <p className="text-lg text-gray-600 my-4">يمنح هذا التقدير للطالب</p>
            <p className="text-3xl font-bold font-serif my-4">أحمد محمد محمود</p>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
               لتفوقه الدراسي والأخلاقي خلال العام الدراسي الحالي
            </p>
            
            <div className="mt-16 flex justify-around w-full">
               <div className="text-center">
                  <p className="font-serif italic text-gray-500 mb-8">التاريخ</p>
                  <p className="font-bold">{new Date().toLocaleDateString('ar-EG')}</p>
               </div>
               <div className="text-center">
                  <p className="font-serif italic text-gray-500 mb-8">التوقيع</p>
                  <p className="font-bold font-serif text-xl">مدير المدرسة</p>
               </div>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Settings Panel */}
      <div className="lg:col-span-1 bg-darkgray border border-gold-700/20 rounded-xl p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-gold-500" />
          تخصيص الشهادة
        </h2>

        <div className="space-y-6">
           <div>
              <label className="block text-sm text-gray-400 mb-2">القالب</label>
              <div className="grid grid-cols-3 gap-2">
                 {['CLASSIC', 'MODERN', 'ELEGANT'].map(t => (
                   <button
                     key={t}
                     onClick={() => setTemplate(t as any)}
                     className={`p-2 text-xs rounded border transition-all ${
                       template === t ? 'bg-gold-600 text-black border-gold-600' : 'bg-black/30 text-gray-400 border-gray-700 hover:border-gray-500'
                     }`}
                   >
                     {t === 'CLASSIC' ? 'كلاسيكي' : t === 'MODERN' ? 'حديث' : 'أنيق'}
                   </button>
                 ))}
              </div>
           </div>

           <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Type className="w-4 h-4" /> عنوان الشهادة
              </label>
              <input 
                type="text" 
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white"
              />
           </div>

           <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4" /> اللون الأساسي
              </label>
              <div className="flex gap-3">
                 {['#EAB308', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6'].map(c => (
                    <button
                      key={c}
                      onClick={() => setPrimaryColor(c)}
                      className={`w-8 h-8 rounded-full border-2 ${primaryColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                 ))}
              </div>
           </div>

           <hr className="border-gray-800" />

           <button 
             onClick={() => window.print()}
             className="w-full bg-gold-600 hover:bg-gold-500 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg"
           >
             <Printer className="w-5 h-5" />
             طباعة / حفظ PDF
           </button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-8 flex items-center justify-center overflow-auto relative">
         <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded text-xs text-gray-400">
            معاينة حية
         </div>
         <div className="w-full max-w-2xl transform scale-90 origin-center shadow-2xl">
            {renderCertificatePreview()}
         </div>
      </div>
    </div>
  );
};

export default Certificates;
