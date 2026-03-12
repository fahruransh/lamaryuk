import React, { useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { useInstallPwa } from '../../hooks/useInstallPwa';

export default function InstallPwaPrompt() {
  const { isInstallable, isInstalled, install } = useInstallPwa();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || isInstalled || dismissed) return null;

  return (
    <div className="mx-4 animate-slide-up">
      <div className="card bg-gradient-to-r from-primary-50 to-lavender-50 border-primary-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-2xl flex items-center justify-center shrink-0">
            <Smartphone size={20} className="text-primary-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 text-sm">Install LamarYuk di HP-mu! 📱</p>
            <p className="text-xs text-gray-500 mt-0.5">Akses lebih cepat dari home screen</p>
            <button
              onClick={install}
              className="mt-2 btn-primary py-2 px-4 text-xs"
            >
              <Download size={14} className="inline mr-1" />
              Install Sekarang
            </button>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
