import React, { createContext, useState, useEffect } from 'react';
import { api } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [beautician, setBeautician] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminInfo');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    
    const storedCustomer = localStorage.getItem('customerInfo');
    if (storedCustomer) {
      setCustomer(JSON.parse(storedCustomer));
    }

    const storedBeautician = localStorage.getItem('beauticianInfo');
    if (storedBeautician) {
      setBeautician(JSON.parse(storedBeautician));
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      setAdmin(data);
      localStorage.setItem('adminInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const customerLogin = async (email, password) => {
    try {
      const data = await api.customerLogin(email, password);
      if (data.role === 'admin') {
        setAdmin(data);
        localStorage.setItem('adminInfo', JSON.stringify(data));
      } else if (data.role === 'beautician') {
        setBeautician(data);
        localStorage.setItem('beauticianInfo', JSON.stringify(data));
      } else {
        setCustomer(data);
        localStorage.setItem('customerInfo', JSON.stringify(data));
      }
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Customer login failed');
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('adminInfo');
  };

  const customerLogout = () => {
    setCustomer(null);
    setBeautician(null);
    localStorage.removeItem('customerInfo');
    localStorage.removeItem('beauticianInfo');
  };

  return (
    <AuthContext.Provider value={{ admin, customer, beautician, login, customerLogin, logout, customerLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
