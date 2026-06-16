import { createContext, useContext, useState } from "react";
import axios from "axios";

const AdminContext = createContext();
const API = import.meta.env.VITE_BACKEND_URL;
export const AdminProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/students`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        students,
        loading,
        refreshStudents: fetchStudents, // ✅ IMPORTANT
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
