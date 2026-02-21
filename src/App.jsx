import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Bot, Database, MessageSquare } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import KnowledgeManager from './KnowledgeManager';

function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const isAdmin = location.pathname === '/admin';

    const handleAdminClick = (e) => {
        e.preventDefault(); // Chặn chuyển trang ngay lập tức

        // Nếu đang ở trang Admin rồi thì không làm gì cả
        if (location.pathname === '/admin') return;

        const pin = window.prompt("🔒 Vui lòng nhập mã PIN quản trị viên:");

        if (pin === "321654") {
            navigate('/admin');
        } else if (pin !== null) {
            alert("⛔ Mã PIN không chính xác!");
        }
    };

    return (
        <nav style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(15px)',
            padding: '12px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--glass-border)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                    {isAdmin ? <Database size={20} color="white" /> : <Bot size={20} color="white" />}
                </div>
                <span style={{ fontWeight: '700', letterSpacing: '0.5px', color: 'white' }}>
                    {isAdmin ? 'ADMIN PANEL' : 'TRỢ LÝ VẬN HÀNH GHN'}
                </span>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
                <Link to="/" style={{
                    color: location.pathname === '/' ? '#00a0fa' : 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    borderBottom: location.pathname === '/' ? '2px solid #00a0fa' : '2px solid transparent',
                    paddingBottom: '4px'
                }}>
                    <MessageSquare size={16} /> AI Chat
                </Link>

                <a href="/admin" onClick={handleAdminClick} style={{
                    color: location.pathname === '/admin' ? '#ff8a00' : 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    borderBottom: location.pathname === '/admin' ? '2px solid #ff8a00' : '2px solid transparent',
                    paddingBottom: '4px'
                }}>
                    <Database size={16} /> Admin Storage
                </a>
            </div>
        </nav>
    );
}

function App() {
    return (
        <Router>
            <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '60px' }}>
                <Navigation />
                <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Routes>
                        <Route path="/" element={<ChatInterface />} />
                        <Route path="/admin" element={<KnowledgeManager />} />
                    </Routes>
                </main>
                <footer style={{
                    position: 'fixed',
                    bottom: '12px',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.3)',
                    letterSpacing: '0.5px',
                    pointerEvents: 'none',
                    zIndex: 1000
                }}>
                    Sản phẩm được tạo bởi ĐạtTT LnD
                </footer>
            </div>
        </Router>
    );
}

export default App;
