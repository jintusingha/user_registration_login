import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="auth-form">
      <h2 className="form-title">Dashboard</h2>
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default Dashboard;