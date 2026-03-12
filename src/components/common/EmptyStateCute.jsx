import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmptyStateCute({
  title = 'Belum ada lamaran nih',
  subtitle = 'Yuk mulai catat perjalanan kariermu! 💌',
  showButton = true,
  buttonText = '+ Tambah Lamaran Pertama',
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      {/* Cute illustration */}
      <div className="text-7xl mb-4 animate-float">📭</div>
      <div className="flex gap-2 text-3xl mb-6">
        <span className="animate-bounce" style={{ animationDelay: '0s' }}>🌸</span>
        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🌷</span>
      </div>

      <h3 className="text-xl font-extrabold text-gray-700 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-xs">{subtitle}</p>

      {showButton && (
        <button
          onClick={() => navigate('/add')}
          className="btn-primary text-sm px-8"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
