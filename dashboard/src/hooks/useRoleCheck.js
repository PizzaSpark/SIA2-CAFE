import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const pageAccessRules = {
  "/dashboard": ["Admin", "Owner", "Staff", "Customer"],
  "/users": ["Admin", "Owner"],
  "/stocks": ["Admin", "Owner"],
  "/menu": ["Admin", "Owner"],
  "/recipe": ["Admin", "Owner"],
  "/order": ["Admin", "Owner", "Staff", "Customer"],
  "/savemore": ["Admin", "Owner"],
  "/auditlog": ["Admin", "Owner", "Staff"],
};

export const useRoleCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const userId = localStorage.getItem("_id");
        if (!userId) {
          navigate("/", { replace: true });
          return;
        }

        const response = await axios.get(`/api/users/${userId}`);
        const { role, isActive } = response.data;
        console.log(response.data);
        if (!isActive) {
          alert(
            "Your account has been disabled. Please contact an administrator."
          );
          navigate("/", { replace: true });
          return;
        }

        const allowedRoles = pageAccessRules[currentPath] || [];

        if (!allowedRoles.includes(role)) {
          // Redirect to an unauthorized page or the login page
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
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAccess();
  }, [currentPath, navigate]);
  return isLoading;
};