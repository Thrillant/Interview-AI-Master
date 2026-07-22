import React from 'react';

const Loader = () => {
    return (
        <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#13131a', color: '#f0f0f6', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(168, 85, 247, 0.3)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 1s linear infinite' }}>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
                <p style={{ color: '#8888a8', fontSize: '0.9rem', fontWeight: 500 }}>Loading...</p>
            </div>
        </main>
    );
};

export default Loader;
