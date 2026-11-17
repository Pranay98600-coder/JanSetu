
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Landmark, Lock, Mail } from 'lucide-react';

import authService from '../services/authService';

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      const authData = await authService.login(
        email,
        password
      );

      if (authData.user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (authData.user.role === 'CITIZEN') {
        navigate('/', { replace: true });
      } else if (authData.user.role === 'OFFICER') {
        navigate('/', { replace: true });
      }

    } catch (err) {

      console.error('Login failed:', err);

      setError(
        err.response?.data?.message ||
        'Invalid email or password. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-brand">
          <Landmark size={35} />
          <h1>JanSetu</h1>
          <span>जनसेतु</span>
        </div>

        <h2>Welcome Back</h2>

        <p className="login-subtitle">
          Sign in to your JanSetu account
        </p>

        <form onSubmit={handleLogin}>

          <label>Email Address</label>

          <div className="login-input">
            <Mail size={18} />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>

          <div className="login-input">
            <Lock size={18} />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <div className="login-footer">
          <Link to="/">Back to Home</Link>
        </div>

      </div>

    </div>
  );
}

export default Login;
