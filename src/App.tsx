import { HashRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'https://candrabuwana80-api-belajar-anak.hf.space/api';

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
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Dashboard Overview</h2>
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
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Manajemen Lisensi</h2>
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

// --- MAIN APP ---

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
      <div style={{ display: 'flex', minHeight: '100vh', background: theme.bg, color: theme.text }}>
        {/* Sidebar */}
        <nav style={{ 
          width: '280px', 
          background: theme.sidebar, 
          padding: '40px 24px', 
          borderRight: `1px solid ${theme.border}`,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ marginBottom: '48px', padding: '0 8px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: theme.accent, letterSpacing: '-0.02em', margin: 0 }}>Taman Belajar</h1>
            <p style={{ fontSize: '12px', fontWeight: '600', color: theme.textMuted, marginTop: '4px' }}>CONTROL PANEL</p>
          </div>
          
          <div style={{ flex: 1 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', color: theme.accent, fontWeight: '600', marginBottom: '8px' }}>
               Dashboard
            </Link>
            <Link to="/licenses" style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', color: theme.textMuted, fontWeight: '500', marginBottom: '8px' }}>
               Licenses
            </Link>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '14px', marginBottom: '16px' }}>
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
                cursor: 'pointer' 
              }}
            >
              Sign Out
            </button>
          </div>
        </nav>

        {/* Content */}
        <main style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/licenses" element={<LicenseManagement />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
