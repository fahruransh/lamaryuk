import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, Heart, ExternalLink, Copy, MapPin, Calendar, Send, Building2, Phone, DollarSign, FileText, ChevronDown } from "lucide-react";
import StatusBadge from "../components/applications/StatusBadge";
import { STATUS_OPTIONS } from "../utils/constants";
import { formatDate, formatDateTime } from "../utils/helpers";
import { useApplications } from "../hooks/useApplications";
import useStore from "../store/useStore";

function InfoRow({ icon: Icon, label, value, linkable }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-primary-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        {linkable
          ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary-500 truncate block">{value}</a>
          : <p className="text-sm font-semibold text-gray-700 break-words">{value}</p>}
      </div>
    </div>
  );
}

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications } = useStore();
  const { deleteApplication, updateApplication, toggleFavorite } = useApplications();
  const { showToast } = useStore();
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const app = applications.find(a => a.id === id);
  if (!app) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="text-6xl">&#128542;</div>
      <p className="font-bold text-gray-600">Lamaran tidak ditemukan</p>
      <button onClick={() => navigate("/history")} className="btn-primary">Kembali</button>
    </div>
  );

  const isFav = app.is_favorit === "true";
  async function handleDelete() { await deleteApplication(app.id); navigate("/history"); }
  async function handleStatusChange(s) { await updateApplication(app.id, { status: s }); setShowStatusPicker(false); }
  function handleCopyLink() {
    if (app.link_lowongan) { navigator.clipboard.writeText(app.link_lowongan); showToast("Link berhasil disalin!", "success"); }
  }

  return (
    <div className="animate-fade-in pb-28">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-primary-100">
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center active:scale-90 transition-all">
            <ArrowLeft size={18} className="text-primary-500" />
          </button>
          <span className="font-extrabold text-gray-800">Detail Lamaran</span>
          <button onClick={() => toggleFavorite(app.id)} className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center active:scale-90 transition-all">
            <Heart size={18} className={isFav ? "fill-rose-400 text-rose-400" : "text-gray-400"} />
          </button>
        </div>
      </div>
      <div className="px-4 py-5 space-y-4">
        <div className="card bg-gradient-to-br from-primary-50 to-lavender-50 border-primary-100">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl shrink-0">&#127970;</div>
            <StatusBadge status={app.status} size="md" />
          </div>
          <h2 className="text-xl font-black text-gray-800 mb-1">{app.perusahaan}</h2>
          <p className="text-primary-500 font-bold text-base mb-3">{app.posisi}</p>
          <div className="flex gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><MapPin size={12}/>{app.kota || "-"}</span>
            <span className="flex items-center gap-1"><Calendar size={12}/>{formatDate(app.tanggal_lamar)}</span>
          </div>
        </div>
        <div className="card">
          <button onClick={() => setShowStatusPicker(v => !v)} className="flex items-center justify-between w-full">
            <span className="font-bold text-gray-700 text-sm">Ubah Status</span>
            <ChevronDown size={16} className={"text-gray-400 transition-transform " + (showStatusPicker ? "rotate-180" : "")} />
          </button>
          {showStatusPicker && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {STATUS_OPTIONS.map(s => (
                <button key={s.value} onClick={() => handleStatusChange(s.value)}
                  className={"flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all " +
                    (app.status === s.value ? s.bg+" "+s.text+" "+s.border+" scale-95" : "bg-gray-50 text-gray-600 border-gray-100 active:scale-95")}>
                  <span>{s.emoji}</span>{s.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <h3 className="section-title mb-3">&#128221; Detail Informasi</h3>
          <InfoRow icon={Send}         label="Metode Kirim"        value={app.metode_kirim} />
          <InfoRow icon={Building2}    label="Sumber Lowongan"     value={app.sumber_lowongan} />
          <InfoRow icon={Phone}        label="Kontak HR"           value={app.kontak_hr} />
          <InfoRow icon={ExternalLink} label="Link Lowongan"       value={app.link_lowongan} linkable />
          <InfoRow icon={DollarSign}   label="Estimasi Gaji"       value={app.estimasi_gaji} />
          <InfoRow icon={FileText}     label="Catatan"             value={app.catatan} />
          <InfoRow icon={Calendar}     label="Terakhir Diperbarui" value={formatDateTime(app.updated_at)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate("/edit/"+app.id)} className="btn-secondary flex items-center justify-center gap-2 py-3">
            <Edit3 size={16} /> Edit
          </button>
          {app.link_lowongan && (
            <button onClick={handleCopyLink} className="btn-secondary flex items-center justify-center gap-2 py-3">
              <Copy size={16} /> Copy Link
            </button>
          )}
        </div>
        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-3 rounded-2xl text-rose-400 font-bold text-sm border border-rose-100 bg-rose-50 active:scale-95 transition-all">
            &#128465; Hapus Lamaran
          </button>
        ) : (
          <div className="card border-rose-100 bg-rose-50 text-center space-y-3">
            <p className="font-bold text-rose-600 text-sm">Yakin mau dihapus?</p>
            <p className="text-xs text-gray-500">Data tidak bisa dikembalikan ya</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 btn-secondary py-2 text-sm">Batal</button>
              <button onClick={handleDelete} className="flex-1 py-2 rounded-2xl bg-rose-400 text-white font-bold text-sm active:scale-95 transition-all">Hapus</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}