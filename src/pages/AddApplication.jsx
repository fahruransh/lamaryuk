import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import JobApplicationForm from '../components/applications/JobApplicationForm';
import useStore from '../store/useStore';

export default function AddApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications } = useStore();

  const isEdit = Boolean(id);
  const existing = isEdit ? applications.find(a => a.id === id) : null;

  return (
    <div className="animate-fade-in pb-4">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-primary-100">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center active:scale-90 transition-all">
            <ArrowLeft size={18} className="text-primary-500" />
          </button>
          <div>
            <h1 className="font-extrabold text-gray-800 text-lg leading-tight">
              {isEdit ? 'Edit Lamaran ✏️' : 'Tambah Lamaran 💌'}
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              {isEdit ? 'Perbarui data lamaranmu' : 'Ayo catat perjalanan kariermu 🌷'}
            </p>
          </div>
        </div>
      </div>

      <JobApplicationForm initialData={existing} isEdit={isEdit} />
    </div>
  );
}
