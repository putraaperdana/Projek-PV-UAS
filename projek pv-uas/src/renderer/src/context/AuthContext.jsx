import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [peminjaman, setPeminjaman] = useState([]);
  const navigate = useNavigate();

  const hashPassword = (password) => btoa(password);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedPeminjaman = localStorage.getItem("peminjaman");
    if (storedPeminjaman) setPeminjaman(JSON.parse(storedPeminjaman));
    else {
      const initialData = [
        { id: 1, facility: "Lab Komputer", user: "Mahasiswa A", status: "pending", date: "2023-11-20" },
        { id: 2, facility: "Aula Utama", user: "Mahasiswa B", status: "approved", date: "2023-11-21" }
      ];
      setPeminjaman(initialData);
      localStorage.setItem("peminjaman", JSON.stringify(initialData));
    }
  }, []);

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const hashedPassword = hashPassword(password);
    
    const foundUser = users.find(u => u.username === username && u.password === hashedPassword);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      if (foundUser.role === 'admin') navigate('/admin');
      else navigate('/user');
      return { success: true };
    } else {
      return { success: false, message: "Username atau Password salah!" };
    }
  };

  const register = (username, password, role = 'user') => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    if (users.find(u => u.username === username)) {
      return { success: false, message: "Username sudah dipakai!" };
    }

    const newUser = {
      id: Date.now(),
      username,
      password: hashPassword(password),
      role
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    navigate('/login');
  };

  const updateStatusPeminjaman = (id, newStatus) => {
    const updatedList = peminjaman.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    setPeminjaman(updatedList);
    localStorage.setItem("peminjaman", JSON.stringify(updatedList));
  };

  return (
    <AuthContext.Provider value={{ user, peminjaman, login, register, logout, updateStatusPeminjaman }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);