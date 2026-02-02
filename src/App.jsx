import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Bot, Database, MessageSquare, ExternalLink } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import KnowledgeManager from './KnowledgeManager';

function Navigation() {
    const location = useLocation();
    const isAdmin = location.pathname === '/admin';

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
                <div style={{ background: 'var(--primary)', p: '6px', borderRadius: '8px', display: 'flex' }}>
                    {isAdmin ? <Database size={20} color="white" /> : <Bot size={20} color="white" />}
                </div>
                <span style={{ fontWeight: '700', letterSpacing: '0.5px' }}>
                    {isAdmin ? 'ADMIN PANEL' : 'PROCESS AI BOT'}
                </span>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
                <Link to="/" style={{
                    color: location.pathname === '/' ? '#60a5fa' : 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                }}>
                    <MessageSquare size={16} /> AI Chat Link
                </Link>
                <Link to="/admin" style={{
                    color: location.pathname === '/admin' ? '#60a5fa' : 'white',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                }}>
                    <Database size={16} /> Admin Storage Link
                </Link>
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
            </div>
        </Router>
    );
}

export default App;
