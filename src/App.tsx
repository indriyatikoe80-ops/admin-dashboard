import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const DashboardHome = () => (
  <div style={{ padding: '20px' }}>
    <h2>Selamat Datang di Admin Dashboard</h2>
    <p>Gunakan menu di samping untuk mengelola aplikasi belajar anak.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
      <div style={cardStyle}>
        <h3>Total Pengguna</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>0</p>
      </div>
      <div style={cardStyle}>
        <h3>Lisensi Aktif</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>0</p>
      </div>
      <div style={cardStyle}>
        <h3>Aktivitas Hari Ini</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>0</p>
      </div>
    </div>
  </div>
);

const UserManagement = () => <div style={{ padding: '20px' }}><h2>Manajemen Pengguna</h2><p>Daftar pengguna akan muncul di sini.</p></div>;
const LicenseSettings = () => <div style={{ padding: '20px' }}><h2>Pengaturan Lisensi</h2><p>Kelola kode aktivasi dan status premium.</p></div>;

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)'
};

function App() {
  return (
    <HashRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: 'white' }}>
        {/* Sidebar */}
        <nav style={{ width: '250px', background: '#1e293b', padding: '20px', borderRight: '1px solid #334155' }}>
          <h1 style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#38bdf8' }}>Admin Panel</h1>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}><Link to="/" style={linkStyle}>Dashboard</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/users" style={linkStyle}>Pengguna</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/licenses" style={linkStyle}>Lisensi</Link></li>
          </ul>
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1 }}>
          <header style={{ padding: '20px', background: '#1e293b', borderBottom: '1px solid #334155' }}>
            <h1>Aplikasi Belajar Anak</h1>
          </header>
          
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/licenses" element={<LicenseSettings />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

const linkStyle = {
  color: '#cbd5e1',
  textDecoration: 'none',
  display: 'block',
  padding: '10px',
  borderRadius: '8px',
  transition: 'background 0.2s'
};

export default App;
