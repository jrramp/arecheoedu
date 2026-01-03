import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockSignUp } from '../context/AuthContext';
import '../styles/Auth.css';

const AdminSetup: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const createDefaultUser = async () => {
    setStatus('loading');
    setMessage('Creating default user...');

    try {
      const user = await mockSignUp(
        'cyber@example.com',
        'turtle2025',
        'Cyber Archaeologist'
      );
      
      localStorage.setItem('mockAuthUser', JSON.stringify(user));

      setStatus('success');
      setMessage(
        '✓ Default user created successfully!\n' +
        'Email: cyber@example.com\n' +
        'Password: turtle2025\n\n' +
        'You can now login with these credentials.'
      );
    } catch (error: any) {
      if (error.message.includes('email-already-in-use')) {
        setStatus('success');
        setMessage(
          '✓ Default user already exists!\n' +
          'Email: cyber@example.com\n' +
          'Password: turtle2025\n\n' +
          'You can login with these credentials.'
        );
      } else {
        setStatus('error');
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🔧 Admin Setup</h1>
        <h2>Create Default User</h2>
        <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '5px', color: '#004085', fontSize: '12px' }}>
          ℹ️ <strong>Demo Mode Active</strong><br />
          Using mock authentication (no Firebase needed)
        </div>

        <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h3>Default User Credentials</h3>
          <p><strong>Email:</strong> cyber@example.com</p>
          <p><strong>Password:</strong> turtle2025</p>
          <p><strong>Name:</strong> Cyber Archaeologist</p>
        </div>

        <button
          className="submit-btn"
          onClick={createDefaultUser}
          disabled={status === 'loading'}
          style={{ marginBottom: '20px' }}
        >
          {status === 'loading' ? 'Creating...' : 'Create Default User'}
        </button>

        {message && (
          <div
            style={{
              padding: '15px',
              borderRadius: '5px',
              marginTop: '15px',
              backgroundColor:
                status === 'success'
                  ? '#d4edda'
                  : status === 'error'
                  ? '#f8d7da'
                  : '#e7f3ff',
              color:
                status === 'success'
                  ? '#155724'
                  : status === 'error'
                  ? '#721c24'
                  : '#004085',
              border: `2px solid ${
                status === 'success'
                  ? '#28a745'
                  : status === 'error'
                  ? '#dc3545'
                  : '#0066cc'
              }`,
              whiteSpace: 'pre-wrap',
            }}
          >
            {message}
          </div>
        )}

        <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
          <p>
            <strong>Note:</strong> This is demo mode with mock authentication. No Firebase credentials required!
          </p>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button className="nav-link-btn" onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
