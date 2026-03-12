import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ChevronDown, Calendar, Building2, MapPin, Briefcase, Link, Phone, DollarSign, FileText, Send } from 'lucide-react';
import { STATUS_OPTIONS, METODE_OPTIONS, SUMBER_OPTIONS } from '../../utils/constants';
import { getTodayString } from '../../utils/helpers';
import { useApplications } from '../../hooks/useApplications';
import useStore from '../../store/useStore';

const EMPTY_FORM = {
  perusahaan: '', posisi: '', kota: '', tanggal_lamar: getTodayString(),
  metode_kirim: '', sumber_lowongan: '', status: 'Sudah Dilamar',
  kontak_hr: '', link_lowongan: '', estimasi_gaji: '', catatan: '',
};

function Field({ label, required, error, children, icon: Icon }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-1.5">
        {Icon && <Icon size={14} className="text-primary-400" />}
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder, name }) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="input-field appearance-none pr-10"
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.emoji ? `${opt.emoji} ${opt.label}` : opt}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

export default function JobApplicationForm({ initialData, isEdit = false }) {
  const navigate = useNavigate();
  const { addApplication, updateApplication } = useApplications();
  const { draftForm, setDraftForm, showToast } = useStore();

  const [form, setForm]     = useState(initialData || draftForm || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Autosave draft every 2 seconds when not editing
  useEffect(() => {
    if (!isEdit) {
      const timer = setTimeout(() => setDraftForm(form), 2000);
      return () => clearTimeout(timer);
    }
  }, [form, isEdit, setDraftForm]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.perusahaan.trim()) errs.perusahaan = 'Nama perusahaan wajib diisi';
    if (!form.posisi.trim())     errs.posisi     = 'Posisi wajib diisi';
    if (!form.kota.trim())       errs.kota       = 'Kota wajib diisi';
    if (!form.tanggal_lamar)     errs.tanggal_lamar = 'Tanggal lamar wajib diisi';
    if (!form.status)            errs.status     = 'Status wajib dipilih';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('Mohon lengkapi field yang wajib diisi 💌', 'error');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await updateApplication(initialData.id, form);
        navigate(`/detail/${initialData.id}`);
      } else {
        const saved = await addApplication(form);
        setDraftForm(null);
        navigate(`/detail/${saved.id}`);
      }
    } catch (err) {
      showToast('Terjadi kesalahan, coba lagi ya 😢', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-32 pt-2">
      {/* Section: Informasi Utama */}
      <div className="card space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <span>🏢</span> Informasi Perusahaan
        </h3>

        <Field label="Nama Perusahaan" required error={errors.perusahaan} icon={Building2}>
          <input name="perusahaan" value={form.perusahaan} onChange={handleChange}
            placeholder="contoh: PT. Maju Bersama" className="input-field" />
        </Field>

        <Field label="Posisi yang Dilamar" required error={errors.posisi} icon={Briefcase}>
          <input name="posisi" value={form.posisi} onChange={handleChange}
            placeholder="contoh: Frontend Developer" className="input-field" />
        </Field>

        <Field label="Kota" required error={errors.kota} icon={MapPin}>
          <input name="kota" value={form.kota} onChange={handleChange}
            placeholder="contoh: Jakarta Selatan" className="input-field" />
        </Field>
      </div>

      {/* Section: Tanggal & Status */}
      <div className="card space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <span>📅</span> Tanggal & Status
        </h3>

        <Field label="Tanggal Lamar" required error={errors.tanggal_lamar} icon={Calendar}>
          <input type="date" name="tanggal_lamar" value={form.tanggal_lamar}
            onChange={handleChange} className="input-field" />
        </Field>

        <Field label="Status Lamaran" required error={errors.status}>
          <SelectField name="status" value={form.status} onChange={handleChange}
            options={STATUS_OPTIONS} placeholder="Pilih status..." />
        </Field>
      </div>

      {/* Section: Cara & Sumber */}
      <div className="card space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <span>📨</span> Cara & Sumber
        </h3>

        <Field label="Metode Kirim" icon={Send}>
          <SelectField name="metode_kirim" value={form.metode_kirim} onChange={handleChange}
            options={METODE_OPTIONS} placeholder="Pilih metode..." />
        </Field>

        <Field label="Sumber Lowongan">
          <SelectField name="sumber_lowongan" value={form.sumber_lowongan} onChange={handleChange}
            options={SUMBER_OPTIONS} placeholder="Pilih sumber..." />
        </Field>
      </div>

      {/* Section: Kontak & Info Tambahan */}
      <div className="card space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <span>💬</span> Info Tambahan
        </h3>

        <Field label="Kontak HR" icon={Phone}>
          <input name="kontak_hr" value={form.kontak_hr} onChange={handleChange}
            placeholder="No. HP / Email HR" className="input-field" />
        </Field>

        <Field label="Link Lowongan" icon={Link}>
          <input name="link_lowongan" value={form.link_lowongan} onChange={handleChange}
            placeholder="https://..." className="input-field" type="url" />
        </Field>

        <Field label="Estimasi Gaji" icon={DollarSign}>
          <input name="estimasi_gaji" value={form.estimasi_gaji} onChange={handleChange}
            placeholder="contoh: 5.000.000 - 8.000.000" className="input-field" />
        </Field>

        <Field label="Catatan" icon={FileText}>
          <textarea name="catatan" value={form.catatan} onChange={handleChange}
            placeholder="Tulis catatan tentang lamaran ini... 📝"
            className="input-field resize-none" rows={3} />
        </Field>
      </div>

      {/* Sticky submit button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 z-40">
        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
          <Save size={20} />
          {loading ? 'Menyimpan…' : isEdit ? 'Simpan Perubahan ✨' : 'Simpan Lamaran 💌'}
        </button>
      </div>
    </form>
  );
}
