import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cancel = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/login');
    }, 2000);
    return () => clearTimeout(timeout);
  }, [navigate]);
  return <div>Payment Cancelled. We will redirect you to login shortly</div>;
};

export default Cancel;
