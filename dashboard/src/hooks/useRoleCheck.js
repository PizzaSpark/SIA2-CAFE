import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const pageAccessRules = {
  '/dashboard': ['Admin', 'Owner', 'Staff', 'Customer'],
  '/users': ['Admin', 'Owner'],
  '/stocks': ['Admin', 'Owner'],
  '/menu': ['Admin', 'Owner'],
  '/recipe': ['Admin', 'Owner'],
  '/order': ['Admin', 'Owner', 'Staff', 'Customer'],
  '/savemore': ['Admin', 'Owner'],
  '/auditlog': ['Admin', 'Owner', 'Staff'],
};

export const useRoleCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    console.log(currentPath);
    const userRole = localStorage.getItem('role') || 'guest';
    const allowedRoles = pageAccessRules[currentPath] || [];

    if (!allowedRoles.includes(userRole)) {
      // Redirect to an unauthorized page or the login page
      navigate('/forbidden', { replace: true });
    }
  }, [currentPath, navigate]);
};