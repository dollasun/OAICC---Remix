import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { careerCategoriesStorage, careersStorage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import BulkDeleteModal from '../../Common/BulkDeleteModal';
import CategoryModal from './CategoryModal';

export default function AdminCareerCategories() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  useEffect(() => {
    setCategories(careerCategoriesStorage.get());
    setCareers(careersStorage.get());
  }, []);

  const handleSaveCategory = (name: string) => {
    if (editingCategory) {
      const updatedCategories = categories.map(cat => 
        cat.id === editingCategory.id ? { ...cat, name } : cat
      );
      
      // Update careers with new category name if name changed
      const updatedCareers = careers.map(c => 
        c.category === editingCategory.name ? { ...c, category: name } : c
      );
      
      setCategories(updatedCategories);
      setCareers(updatedCareers);
      careerCategoriesStorage.save(updatedCategories);
      careersStorage.save(updatedCareers);
      showToast('Category updated successfully!');
    } else {
      const newCategory = {
        id: Date.now(),
        name,
        createdAt: new Date().toLocaleDateString(),
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      careerCategoriesStorage.save(updatedCategories);
      showToast('Category created successfully!');
    }
    setEditingCategory(null);
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    try {
      const categoryIdsToDelete = new Set(itemsToDelete.map(c => c.id));
      const updatedCategories = categories.filter(c => !categoryIdsToDelete.has(c.id));
      const updatedCareers = careers.filter(c => !categoryIdsToDelete.has(categories.find(cat => cat.name === c.category)?.id));
      
      setCategories(updatedCategories);
      setCareers(updatedCareers);
      careerCategoriesStorage.save(updatedCategories);
      careersStorage.save(updatedCareers);
      
      showToast(`Successfully deleted ${itemsToDelete.length} category${itemsToDelete.length === 1 ? '' : 's'} and associated careers!`);
      setIsDeleteModalOpen(false);
      setItemsToDelete([]);
    } finally {
      setIsDeleting(false);
    }
  };

  const getCareerCount = (categoryName: string) => careers.filter(c => c.category === categoryName).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Career Categories</h1>
          <p className="text-slate-500 font-medium mt-1">Manage career categories and their associated paths.</p>
        </div>
        <button 
          onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand text-white font-bold rounded-xl shadow-sm shadow-brand/5 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-5 h-5" /> Create Category
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 bg-brand/10 text-brand rounded-xl flex items-center justify-center`}>
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Categories</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{categories.length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center`}>
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Careers</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{careers.length}</p>
            </div>
          </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">#</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">CATEGORY NAME</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">CAREERS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">DATE CREATED</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
            {categories.map((cat, index) => (
              <tr key={cat.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors">
                <td className="px-6 py-6 text-slate-500">{index + 1}</td>
                <td className="px-6 py-6 font-bold text-slate-900 dark:text-white">{cat.name}</td>
                <td className="px-6 py-6 text-slate-500">{getCareerCount(cat.name)}</td>
                <td className="px-6 py-6 text-slate-500">{cat.createdAt}</td>
                <td className="px-6 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="p-2 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-all"><Edit2 className="w-5 h-5" /></button>
                    <button onClick={() => { setItemsToDelete([cat]); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BulkDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemCount={itemsToDelete.length}
        itemType="Category"
        items={itemsToDelete.map(c => ({
          id: c.id,
          name: c.name,
        }))}
        isDeleting={isDeleting}
      />
      
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        initialData={editingCategory}
      />
    </div>
  );
}
