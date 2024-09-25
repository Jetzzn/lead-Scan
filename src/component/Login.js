import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserCredentials } from '../utils/airtableUtils';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const fetchedCredentials = await getUserCredentials();
      setCredentials(fetchedCredentials);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching credentials:', err);
      setError('Failed to load user data. Please try again later.');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const user = credentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (user) {
      onLogin({ username: user.username }); // We only need to pass the username
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  if (loading) return <div>Loading user data...</div>;

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', padding: '20px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="Username">Username:</label>
          <input
            type="text"
            id="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="Password">Password:</label>
          <input
            type="Password"
            id="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;