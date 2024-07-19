import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { pageAccessRules } from '../config/pageAccessRules';

export const useRoleCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isLoading, setIsLoading] = useState(true);
  const { VITE_REACT_APP_API_HOST } = import.meta.env;
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      const checkUserAccess = async () => {
        try {
          const userId = localStorage.getItem("_id");
          if (!userId) {
            navigate("/", { replace: true });
            localStorage.clear();
            return;
          }

          const response = await axios.get(`${VITE_REACT_APP_API_HOST}/api/users/${userId}`);
          const { role, isActive } = response.data;
          if (!isActive) {
            alert(
              "Your account has been disabled. Please contact an administrator."
            );
            navigate("/", { replace: true });
            localStorage.clear();
            return;
          }

          const allowedRoles = pageAccessRules[currentPath] || [];

          if (!allowedRoles.includes(role)) {
            navigate("/forbidden", { replace: true });
          }
        } catch (error) {
          console.error("Error checking user access:", error);
          if (
            axios.isAxiosError(error) &&
            error.response?.status === 404
          ) {
            alert("User not found. Please log in again.");
          } else {
            alert("An error occurred. Please try again later.");
          }
          navigate("/login", { replace: true });
          localStorage.clear();
        } finally {
          setIsLoading(false);
        }
      };

      checkUserAccess();
    }

    return () => {
      effectRan.current = true;
    };
  }, [currentPath, navigate, VITE_REACT_APP_API_HOST]);

  return isLoading;
};