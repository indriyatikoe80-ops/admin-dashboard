import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Automatically detect local host or cloud host
const API_BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:5000/api' 
  : 'https://candrabuwana80-api-belajar-anak.hf.space/api';

// --- STYLES & THEME ---
const theme = {
  bg: '#0f172a',
  sidebar: '#1e293b',
  card: 'rgba(30, 41, 59, 0.7)',
  accent: '#38bdf8',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  border: 'rgba(255, 255, 255, 0.08)',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

const cardStyle = {
  background: theme.card,
  padding: '24px',
  borderRadius: '16px',
  border: `1px solid ${theme.border}`,
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: `1px solid ${theme.border}`,
  background: '#0f172a',
  color: 'white',
  fontSize: '15px',
  outline: 'none',
  marginTop: '8px',
};

// --- COMPONENTS ---

const LoginPage = ({ onLogin }: { onLogin: (token: string, admin: any) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/login`, { email, password });
      onLogin(res.data.token, res.data.admin);
    } catch (err: any) {
      const serverError = err.response?.data?.details || err.response?.data?.error || 'Login gagal. Periksa koneksi.';
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      width: '100%', 
      minHeight: '100vh', 
      background: `radial-gradient(circle at top right, #1e293b, ${theme.bg})`,
      padding: '20px'
    }}>
      <div style={{ ...cardStyle, width: '100%', maxWidth: '420px', padding: '48px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: theme.accent, marginBottom: '8px' }}>Admin Portal</h2>
          <p style={{ color: theme.textMuted, fontSize: '15px' }}>Selamat datang kembali, Admin.</p>
        </div>

        {error && (
          <div style={{ background: '#ef444415', color: '#f87171', padding: '12px', borderRadius: '10px', marginBottom: '24px', fontSize: '13px', border: '1px solid #ef444433' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textMuted }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={inputStyle} 
              placeholder="admin@email.com" 
            />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textMuted }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={inputStyle} 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%', 
              padding: '14px', 
              borderRadius: '10px', 
              border: 'none', 
              background: theme.accent, 
              color: theme.bg, 
              fontWeight: '700', 
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer', 
              transition: 'transform 0.2s',
              boxShadow: `0 4px 14px 0 rgba(56, 189, 248, 0.39)`
            }}
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

const DashboardHome = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.get(`${API_BASE_URL}/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.stats);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '40px', color: theme.textMuted }}>Mengambil data statistik...</div>;

  const statItems = [
    { label: 'Pesanan Pending', value: stats?.pending_requests || 0, color: theme.warning },
    { label: 'Lisensi Aktif', value: stats?.active_licenses || 0, color: theme.success },
    { label: 'Total Lisensi', value: stats?.total_licenses || 0, color: theme.accent },
    { label: 'Total Pesanan', value: stats?.total_requests || 0, color: '#a78bfa' },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Dashboard Overview</h2>
        <p style={{ color: theme.textMuted }}>Pantau aktivitas lisensi dan pesanan Anda di sini.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {statItems.map((item, i) => (
          <div key={i} style={cardStyle}>
            <h3 style={{ fontSize: '13px', fontWeight: '600', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              {item.label}
            </h3>
            <p style={{ fontSize: '36px', fontWeight: '800', color: item.color, margin: 0 }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const RequestsManagement = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_BASE_URL}/admin/all-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data.requests);
    } catch (err) {
      console.error('Failed to fetch requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
    if (!window.confirm('Setujui pembayaran dan kirimkan kode lisensi premium?')) return;
    setActionLoading(`approve-${id}`);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.post(`${API_BASE_URL}/admin/approve-request/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Sukses disetujui! Kode lisensi generated: ${res.data.license_code}`);
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menyetujui request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = window.prompt('Masukkan alasan penolakan bukti pembayaran:');
    if (reason === null) return;
    if (!reason.trim()) return alert('Alasan penolakan wajib diisi!');

    setActionLoading(`reject-${id}`);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`${API_BASE_URL}/admin/reject-request/${id}`, { reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Pesan penolakan berhasil dikirim ke user.');
      fetchRequests();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menolak request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendEmail = async (id: number) => {
    setActionLoading(`email-${id}`);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`${API_BASE_URL}/admin/resend-email/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Kode lisensi berhasil dikirim ulang ke EMAIL pengguna!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mengirim ulang email');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendWA = async (id: number) => {
    setActionLoading(`wa-${id}`);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`${API_BASE_URL}/admin/resend-whatsapp/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Kode lisensi berhasil dikirim ulang ke WHATSAPP pengguna!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mengirim ulang WhatsApp');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Permintaan Lisensi</h2>
        <p style={{ color: theme.textMuted }}>Review bukti pembayaran dan verifikasi lisensi pembeli.</p>
      </div>

      {loading ? <p style={{ color: theme.textMuted }}>Memuat data permintaan...</p> : (
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}`, background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '18px 24px', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>WAKTU</th>
                  <th style={{ padding: '18px 24px', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>USER EMAIL</th>
                  <th style={{ padding: '18px 24px', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>WHATSAPP</th>
                  <th style={{ padding: '18px 24px', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>DURASI</th>
                  <th style={{ padding: '18px 24px', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>BUKTI BAYAR</th>
                  <th style={{ padding: '18px 24px', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>STATUS</th>
                  <th style={{ padding: '18px 24px', fontSize: '13px', fontWeight: '600', color: theme.textMuted, textAlign: 'center' }}>AKSI & KIRIM ULANG</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req: any) => (
                  <tr key={req.id} style={{ borderBottom: `1px solid ${theme.border}`, transition: 'background 0.2s' }}>
                    <td style={{ padding: '18px 24px', color: theme.textMuted, fontSize: '13px' }}>
                      {new Date(req.requested_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '18px 24px', fontWeight: '600', color: theme.text }}>{req.email}</td>
                    <td style={{ padding: '18px 24px', color: theme.text }}>{req.whatsapp || '-'}</td>
                    <td style={{ padding: '18px 24px', color: theme.accent, fontWeight: '700' }}>{req.duration}</td>
                    <td style={{ padding: '18px 24px' }}>
                      {req.payment_proof_path ? (
                        <img 
                          src={`${API_BASE_URL.replace('/api', '')}${req.payment_proof_path}`} 
                          alt="Bukti Transfer" 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${theme.border}`, cursor: 'zoom-in' }}
                          onClick={() => setSelectedImage(`${API_BASE_URL.replace('/api', '')}${req.payment_proof_path}`)}
                        />
                      ) : '-'}
                    </td>
                    <td style={{ padding: '18px 24px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '11px', 
                        fontWeight: '700',
                        background: req.status === 'APPROVED' ? '#065f4633' : req.status === 'PENDING' ? '#78350f33' : '#7f1d1d33', 
                        color: req.status === 'APPROVED' ? theme.success : req.status === 'PENDING' ? theme.warning : theme.danger,
                        border: `1px solid ${req.status === 'APPROVED' ? '#065f4655' : req.status === 'PENDING' ? '#78350f55' : '#7f1d1d55'}`
                      }}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '18px 24px', textAlign: 'center' }}>
                      {req.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            disabled={actionLoading !== null}
                            onClick={() => handleApprove(req.id)}
                            style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: theme.success, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                          >
                            {actionLoading === `approve-${req.id}` ? '✓...' : 'Setujui'}
                          </button>
                          <button 
                            disabled={actionLoading !== null}
                            onClick={() => handleReject(req.id)}
                            style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: theme.danger, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                          >
                            {actionLoading === `reject-${req.id}` ? '✗...' : 'Tolak'}
                          </button>
                        </div>
                      ) : req.status === 'APPROVED' ? (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            disabled={actionLoading !== null}
                            onClick={() => handleResendEmail(req.id)}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: `1px solid ${theme.accent}`, background: 'transparent', color: theme.accent, fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                            title="Kirim Ulang Lisensi ke Email Pengguna"
                          >
                            📧 Kirim Ulang Email
                          </button>
                          <button 
                            disabled={actionLoading !== null || !req.whatsapp}
                            onClick={() => handleResendWA(req.id)}
                            style={{ 
                              padding: '8px 12px', 
                              borderRadius: '8px', 
                              border: `1px solid ${req.whatsapp ? '#25D366' : theme.border}`, 
                              background: 'transparent', 
                              color: req.whatsapp ? '#25D366' : theme.textMuted, 
                              fontWeight: '600', 
                              fontSize: '12px', 
                              cursor: req.whatsapp ? 'pointer' : 'not-allowed',
                              opacity: req.whatsapp ? 1 : 0.5
                            }}
                            title={req.whatsapp ? "Kirim Ulang Lisensi ke WhatsApp Pengguna" : "Pengguna tidak mencantumkan nomor WhatsApp"}
                          >
                            💬 Kirim Ulang WA
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: theme.textMuted, fontSize: '12px' }}>Ditolak: "{req.rejection_reason || '-'}"</span>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: theme.textMuted }}>
                      Belum ada data permintaan lisensi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lightbox / Modal Image Preview */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'zoom-out' }}
        >
          <img 
            src={selectedImage} 
            alt="Full Preview" 
            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} 
          />
        </div>
      )}
    </div>
  );
};

const LicenseManagement = () => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.get(`${API_BASE_URL}/admin/active-licenses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLicenses(res.data.licenses);
      } catch (err) {
        console.error('Failed to fetch licenses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLicenses();
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Manajemen Lisensi</h2>
        <p style={{ color: theme.textMuted }}>Daftar seluruh lisensi yang terdaftar di sistem.</p>
      </div>

      {loading ? <p style={{ color: theme.textMuted }}>Memuat data lisensi...</p> : (
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}`, background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '18px 24px', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>LICENSE CODE</th>
                  <th style={{ padding: '18px 24px', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>USER EMAIL</th>
                  <th style={{ padding: '18px 24px', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>STATUS</th>
                  <th style={{ padding: '18px 24px', fontSize: '13px', fontWeight: '600', color: theme.textMuted }}>ACTIVATED AT</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((lic: any) => (
                  <tr key={lic.id} style={{ borderBottom: `1px solid ${theme.border}`, transition: 'background 0.2s' }}>
                    <td style={{ padding: '18px 24px', fontWeight: '600', color: theme.accent }}>{lic.license_code}</td>
                    <td style={{ padding: '18px 24px', color: theme.text }}>{lic.user_email}</td>
                    <td style={{ padding: '18px 24px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '11px', 
                        fontWeight: '700',
                        background: lic.status === 'ACTIVE' ? '#065f4633' : '#33415533', 
                        color: lic.status === 'ACTIVE' ? theme.success : theme.textMuted,
                        border: `1px solid ${lic.status === 'ACTIVE' ? '#065f4655' : '#33415555'}`
                      }}>
                        {lic.status}
                      </span>
                    </td>
                    <td style={{ padding: '18px 24px', color: theme.textMuted, fontSize: '14px' }}>
                      {lic.activated_at ? new Date(lic.activated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                  </tr>
                ))}
                {licenses.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: theme.textMuted }}>
                      Belum ada data lisensi yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsManagement = () => {
  const [configs, setConfigs] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchConfigs = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_BASE_URL}/admin/system-config`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const configMap: any = {};
      res.data.configs.forEach((item: any) => {
        configMap[item.config_key] = item.config_value;
      });
      setConfigs(configMap);
    } catch (err) {
      console.error('Failed to fetch system configs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleChange = (key: string, value: string) => {
    setConfigs((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('admin_token');
      const payload = Object.keys(configs).map(key => ({
        config_key: key,
        config_value: configs[key]
      }));
      await axios.post(`${API_BASE_URL}/admin/system-config`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✓ Konfigurasi berhasil disimpan!');
      setTimeout(() => setMessage(''), 3000);
      fetchConfigs();
    } catch (err) {
      alert('Gagal menyimpan konfigurasi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: theme.textMuted }}>Mengambil data konfigurasi...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Pengaturan Lisensi & Harga</h2>
        <p style={{ color: theme.textMuted }}>Sesuaikan harga paket, biaya administrasi, dan informasi bank pembayaran di sini.</p>
      </div>

      {message && (
        <div style={{ background: '#10b98115', color: '#34d399', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', border: '1px solid #10b98133', fontWeight: 'bold' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* BANK ACCOUNT */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: theme.accent }}>💳 Rekening Bank Pembayaran</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Nama Bank (misal: BCA, Mandiri)</label>
              <input 
                type="text" 
                value={configs['bank_name'] || 'BCA'} 
                onChange={(e) => handleChange('bank_name', e.target.value)} 
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Nomor Rekening</label>
              <input 
                type="text" 
                value={configs['bca_number'] || '1234567890'} 
                onChange={(e) => handleChange('bca_number', e.target.value)} 
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Nama Pemilik Rekening</label>
              <input 
                type="text" 
                value={configs['bca_name'] || 'Aplikasi Belajar Anak'} 
                onChange={(e) => handleChange('bca_name', e.target.value)} 
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* PACKAGE 1 MONTH */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: theme.accent }}>📦 Paket Premium 1 Bulan</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Harga Asli (Coret) (Rp)</label>
              <input 
                type="number" 
                value={configs['original_price_1_month'] || '35000'} 
                onChange={(e) => handleChange('original_price_1_month', e.target.value)} 
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Harga Promo (Rp)</label>
              <input 
                type="number" 
                value={configs['price_1_month'] || '15000'} 
                onChange={(e) => handleChange('price_1_month', e.target.value)} 
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Biaya Administrasi (Rp)</label>
              <input 
                type="number" 
                value={configs['fee_1_month'] || '1000'} 
                onChange={(e) => handleChange('fee_1_month', e.target.value)} 
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Label Promo</label>
              <input 
                type="text" 
                value={configs['promo_1_month'] || 'Diskon 57%'} 
                onChange={(e) => handleChange('promo_1_month', e.target.value)} 
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* PACKAGE 6 MONTHS */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: theme.accent }}>📦 Paket Premium 6 Bulan</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Harga Asli (Coret) (Rp)</label>
              <input 
                type="number" 
                value={configs['original_price_6_months'] || '120000'} 
                onChange={(e) => handleChange('original_price_6_months', e.target.value)} 
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Harga Promo (Rp)</label>
              <input 
                type="number" 
                value={configs['price_6_months'] || '50000'} 
                onChange={(e) => handleChange('price_6_months', e.target.value)} 
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Biaya Administrasi (Rp)</label>
              <input 
                type="number" 
                value={configs['fee_6_months'] || '2000'} 
                onChange={(e) => handleChange('fee_6_months', e.target.value)} 
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Label Promo</label>
              <input 
                type="text" 
                value={configs['promo_6_months'] || 'Diskon 58%'} 
                onChange={(e) => handleChange('promo_6_months', e.target.value)} 
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* PACKAGE LIFETIME */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: theme.accent }}>📦 Paket Premium Selamanya (Lifetime)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Harga Asli (Coret) (Rp)</label>
              <input 
                type="number" 
                value={configs['original_price_lifetime'] || '250000'} 
                onChange={(e) => handleChange('original_price_lifetime', e.target.value)} 
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Harga Promo (Rp)</label>
              <input 
                type="number" 
                value={configs['price_lifetime'] || '99000'} 
                onChange={(e) => handleChange('price_lifetime', e.target.value)} 
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Biaya Administrasi (Rp)</label>
              <input 
                type="number" 
                value={configs['fee_lifetime'] || '3000'} 
                onChange={(e) => handleChange('fee_lifetime', e.target.value)} 
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: theme.textMuted }}>Label Promo</label>
              <input 
                type="text" 
                value={configs['promo_lifetime'] || 'Diskon 60%'} 
                onChange={(e) => handleChange('promo_lifetime', e.target.value)} 
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving} 
          style={{ 
            padding: '16px', 
            borderRadius: '10px', 
            border: 'none', 
            background: theme.accent, 
            color: theme.bg, 
            fontWeight: '700', 
            fontSize: '16px',
            cursor: saving ? 'not-allowed' : 'pointer', 
            boxShadow: `0 4px 14px 0 rgba(56, 189, 248, 0.39)`,
            textAlign: 'center'
          }}
        >
          {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
        </button>
      </form>
    </div>
  );
};

// --- MAIN APP INNER ---

const AppContent = ({ admin, handleLogout }: { admin: any, handleLogout: () => void }) => {
  const location = useLocation();

  const getLinkStyle = (path: string) => {
    const isActive = location.pathname === path;
    return {
      display: 'flex',
      alignItems: 'center',
      padding: '14px 20px',
      borderRadius: '12px',
      background: isActive ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
      color: isActive ? theme.accent : theme.textMuted,
      fontWeight: '600',
      marginBottom: '8px',
      textDecoration: 'none',
      fontSize: '15px',
      transition: 'all 0.2s',
      borderLeft: isActive ? `4px solid ${theme.accent}` : '4px solid transparent',
    };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: theme.bg, color: theme.text }}>
      {/* Sidebar */}
      <nav style={{ 
        width: '280px', 
        background: theme.sidebar, 
        padding: '40px 24px', 
        borderRight: `1px solid ${theme.border}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0
      }}>
        <div style={{ marginBottom: '48px', padding: '0 8px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: theme.accent, letterSpacing: '-0.02em', margin: 0 }}>Aplikasi Belajar Anak</h1>
          <p style={{ fontSize: '11px', fontWeight: '700', color: theme.textMuted, marginTop: '4px', letterSpacing: '0.05em' }}>CONTROL PANEL</p>
        </div>
        
        <div style={{ flex: 1 }}>
          <Link to="/" style={getLinkStyle('/')}>
             📊 Dashboard Overview
          </Link>
          <Link to="/requests" style={getLinkStyle('/requests')}>
             📩 Permintaan Lisensi
          </Link>
          <Link to="/licenses" style={getLinkStyle('/licenses')}>
             🔑 Lisensi Aktif
          </Link>
          <Link to="/settings" style={getLinkStyle('/settings')}>
             ⚙️ Pengaturan Lisensi
          </Link>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '14px', marginBottom: '16px', border: `1px solid ${theme.border}` }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{admin?.name}</p>
            <p style={{ margin: 0, fontSize: '12px', color: theme.textMuted }}>{admin?.role}</p>
          </div>
          <button 
            onClick={handleLogout} 
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '10px', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              background: 'transparent', 
              color: '#f87171', 
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Content Area */}
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto', background: `radial-gradient(circle at bottom left, #0f172a, #1e293b)` }}>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/requests" element={<RequestsManagement />} />
          <Route path="/licenses" element={<LicenseManagement />} />
          <Route path="/settings" element={<SettingsManagement />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

// --- MAIN WRAPPER ---

function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [admin, setAdmin] = useState<any>(JSON.parse(localStorage.getItem('admin_user') || 'null'));

  const handleLogin = (newToken: string, newAdmin: any) => {
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin_user', JSON.stringify(newAdmin));
    setToken(newToken);
    setAdmin(newAdmin);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setAdmin(null);
  };

  if (!token) return <LoginPage onLogin={handleLogin} />;

  return (
    <HashRouter>
      <AppContent admin={admin} handleLogout={handleLogout} />
    </HashRouter>
  );
}

export default App;
