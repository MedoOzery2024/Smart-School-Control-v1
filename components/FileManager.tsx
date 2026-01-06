import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, FileText, Image as ImageIcon, FileSpreadsheet, File as FileIcon, 
  Trash2, Upload, Download, RefreshCw, HardDrive, Lock, Search
} from 'lucide-react';
import { SchoolFile, UserRole } from '../types';
import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, orderBy, onSnapshot } from 'firebase/firestore';
import { useLanguage } from '../LanguageContext';

interface FileManagerProps {
  userRole: UserRole;
  userName: string;
}

const FileManager: React.FC<FileManagerProps> = ({ userRole, userName }) => {
  const [files, setFiles] = useState<SchoolFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Define allowed roles for this component
  const allowedRoles = [UserRole.ADMIN, UserRole.IT, UserRole.CONTROL, UserRole.TEACHER];
  const isAllowed = allowedRoles.includes(userRole);

  useEffect(() => {
    if (!isAllowed || !db) return;

    setLoading(true);
    // Role-based isolation: Query files where uploaderRole matches current user's role
    // This strictly enforces that users only see files uploaded by their role group.
    const q = query(
      collection(db, "files"), 
      where("uploaderRole", "==", userRole)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedFiles: SchoolFile[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SchoolFile));
      // Sort client-side by date desc
      fetchedFiles.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      setFiles(fetchedFiles);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userRole]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size check (Limit to 1MB for Firestore storage demo to prevent quota issues)
    if (file.size > 1024 * 1024) {
      alert(t('fileTooLarge'));
      return;
    }

    setUploading(true);
    try {
      // Convert to Base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result as string;
        
        const newFile: Omit<SchoolFile, 'id'> = {
          name: file.name,
          type: file.type,
          size: file.size,
          url: base64String, // Storing base64 directly in Firestore for demo persistence
          uploadedBy: userName,
          uploaderRole: userRole,
          uploadDate: new Date().toISOString()
        };

        if (db) {
          await addDoc(collection(db, "files"), newFile);
        } else {
          // Fallback mock
          setFiles(prev => [{ ...newFile, id: `mock_${Date.now()}` } as SchoolFile, ...prev]);
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      alert("Error uploading file");
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDeleteFile'))) return;

    try {
      if (db && !id.startsWith('mock_')) {
        await deleteDoc(doc(db, "files", id));
      } else {
        setFiles(prev => prev.filter(f => f.id !== id));
      }
    } catch (error) {
      console.error("Error deleting file", error);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image')) return <ImageIcon className="w-8 h-8 text-purple-500" />;
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('csv')) return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return <FileText className="w-8 h-8 text-orange-500" />; 
    if (mimeType.includes('word') || mimeType.includes('document')) return <FileText className="w-8 h-8 text-blue-500" />;
    return <FileIcon className="w-8 h-8 text-gray-400" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter files based on search term
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAllowed) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
        <Lock className="w-16 h-16 mb-4 text-red-500/50" />
        <h2 className="text-xl font-bold text-white mb-2">{t('accessRestricted')}</h2>
        <p>This module is only for IT, Control, and Teacher staff.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between bg-darkgray p-6 rounded-xl border border-gold-700/20 shadow-lg gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-4 rounded-full bg-gold-500/10 border border-gold-500/20">
            <HardDrive className="w-8 h-8 text-gold-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{t('fileManager')}</h2>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              {t('role')}: <span className="text-gold-500 font-bold">{userRole}</span> (Private Storage)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
           {/* Search Input */}
           <div className="relative flex-1 md:flex-none">
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder={t('search')} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 bg-black/40 border border-gray-700 rounded-lg px-10 py-2.5 text-white outline-none focus:border-gold-500 transition-all text-sm"
              />
           </div>

           <input 
             type="file" 
             ref={fileInputRef}
             className="hidden" 
             onChange={handleUpload}
             accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
           />
           <button 
             onClick={() => fileInputRef.current?.click()}
             disabled={uploading}
             className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold rounded-lg shadow-lg shadow-gold-900/20 transition-all disabled:opacity-50 whitespace-nowrap"
           >
             {uploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
             {uploading ? 'Uploading...' : t('uploadFile')}
           </button>
        </div>
      </div>

      {loading && files.length === 0 ? (
         <div className="text-center py-10 text-gray-500 flex flex-col items-center">
            <RefreshCw className="w-8 h-8 animate-spin mb-2" /> 
            Loading...
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-black/20 rounded-xl border border-dashed border-gray-800">
               <Folder className="w-16 h-16 text-gray-700 mb-4" />
               <p className="text-gray-500">{searchTerm ? 'No files match your search' : t('noFiles')}</p>
            </div>
          ) : (
            filteredFiles.map(file => (
              <div key={file.id} className="bg-darkgray p-4 rounded-xl border border-gray-800 hover:border-gold-500/50 transition-all group relative animate-fadeIn">
                 <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-black/40 rounded-lg group-hover:bg-gold-500/10 transition-colors">
                       {getFileIcon(file.type)}
                    </div>
                    <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={file.url} 
                        download={file.name}
                        className="p-2 text-gray-500 hover:text-gold-500 hover:bg-gold-500/10 rounded transition-colors"
                        title={t('download')}
                      >
                         <Download className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={() => handleDelete(file.id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        title={t('delete')}
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                 </div>
                 
                 <h4 className="font-bold text-white mb-1 truncate text-sm" title={file.name}>{file.name}</h4>
                 <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{formatSize(file.size)}</span>
                    <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                 </div>
                 
                 <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-400 flex items-center gap-1">
                    <span className="text-gold-600">By:</span> {file.uploadedBy}
                 </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FileManager;
