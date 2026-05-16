import { HashRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'https://candrabuwana80-api-belajar-anak.hf.space/api';

// --- STYLES ---
const cardStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)'
};

const linkStyle = {
  color: '#cbd5e1',
  textDecoration: 'none',
  display: 'block',
  padding: '12px',
  borderRadius: '8px',
  transition: 'all 0.2s',
  marginBottom: '5px'
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
      setError(err.response?.data?.error || 'Login gagal. Periksa email/password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}>
      <form onSubmit={handleSubmit} style={{ background: '#1e293b', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#38bdf8' }}>Admin Login</h2>
        {error && <div style={{ background: '#ef444422', color: '#f87171', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', border: '1px solid #ef444444' }}>{error}</div>}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', outline: 'none' }} placeholder="admin@email.com" />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', outline: 'none' }} placeholder="••••••••" />
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>
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

  if (loading) return <div style={{ padding: '20px' }}>Memuat data...</div>;

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ marginBottom: '20px' }}>Ringkasan Data</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px' }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' }}>Pesanan Pending</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#fbbf24' }}>{stats?.pending_requests || 0}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' }}>Lisensi Aktif</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#34d399' }}>{stats?.active_licenses || 0}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Lisensi</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#38bdf8' }}>{stats?.total_licenses || 0}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: '14px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Pesanan</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#a78bfa' }}>{stats?.total_requests || 0}</p>
        </div>
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
    <div style={{ padding: '30px' }}>
      <h2 style={{ marginBottom: '20px' }}>Daftar Lisensi</h2>
      {loading ? <p>Memuat...</p> : (
        <div style={{ overflowX: 'auto', background: '#1e293b', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '14px' }}>
                <th style={{ padding: '15px' }}>Kode Lisensi</th>
                <th style={{ padding: '15px' }}>Email User</th>
                <th style={{ padding: '15px' }}>Status</th>
                <th style={{ padding: '15px' }}>Tanggal Aktivasi</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((lic: any) => (
                <tr key={lic.id} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '15px', fontWeight: '500', color: '#38bdf8' }}>{lic.license_code}</td>
                  <td style={{ padding: '15px' }}>{lic.user_email}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: lic.status === 'ACTIVE' ? '#065f46' : '#1e293b', color: lic.status === 'ACTIVE' ? '#34d399' : '#94a3b8' }}>
                      {lic.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: '#64748b' }}>{lic.activated_at ? new Date(lic.activated_at).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
              {licenses.length === 0 && <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Belum ada data lisensi.</td></tr>}
            </tbody>
          </table>
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
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: 'white' }}>
        {/* Sidebar */}
        <nav style={{ width: '260px', background: '#1e293b', padding: '30px 20px', borderRight: '1px solid #334155' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '1.4rem', color: '#38bdf8', margin: 0 }}>Taman Belajar</h1>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Admin Dashboard</p>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/" style={linkStyle}>Dashboard</Link></li>
            <li><Link to="/licenses" style={linkStyle}>Manajemen Lisensi</Link></li>
          </ul>

          <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
            <div style={{ padding: '15px', background: '#0f172a', borderRadius: '12px', marginBottom: '15px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'white' }}>{admin?.name}</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>{admin?.role}</p>
            </div>
            <button onClick={handleLogout} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ef444444', background: 'transparent', color: '#f87171', cursor: 'pointer' }}>
              Log Out
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
