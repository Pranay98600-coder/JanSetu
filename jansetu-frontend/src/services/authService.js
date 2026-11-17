
import api from './api';

const authService = {

  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password
    });

    const authData = response.data;

    sessionStorage.setItem('accessToken', authData.accessToken);

    sessionStorage.setItem(
      'user',
      JSON.stringify(authData.user)
    );

    // Store token expiry time (expiresIn is in seconds)
    const expiresAt = Date.now() + authData.expiresIn * 1000;

    sessionStorage.setItem('expiresAt', String(expiresAt));

    return authData;
  },

  logout() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('expiresAt');
  },

  getToken() {
    return sessionStorage.getItem('accessToken');
  },

  getUser() {
    const user = sessionStorage.getItem('user');

    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    const token = this.getToken();
    const expiresAt = Number(sessionStorage.getItem('expiresAt'));

    if (!token || !expiresAt || Date.now() >= expiresAt) {
      this.logout();
      return false;
    }

    return true;
  },

  hasRole(role) {
    if (!this.isAuthenticated()) {
      return false;
    }

    const user = this.getUser();

    return user?.role === role;
  }

};

export default authService;
