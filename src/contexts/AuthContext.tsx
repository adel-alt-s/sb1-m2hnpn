import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'admin' | 'docteur' | 'secretaire';

interface User {
  id: string;
  username: string;
  role: Role;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthUser {
  id: string;
  username: string;
  password: string;
  role: Role;
  name: string;
}

const USERS: AuthUser[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Administrateur'
  },
  {
    id: '2',
    username: 'docteur',
    password: 'docteur123',
    role: 'docteur',
    name: 'Dr. Martin'
  },
  {
    id: '3',
    username: 'secretaire',
    password: 'secretaire123',
    role: 'secretaire',
    name: 'Marie Secrétaire'
  }
];

const PERMISSIONS: { [key in Role]: string[] } = {
  admin: [
    'view_dashboard',
    'manage_users',
    'view_appointments',
    'edit_appointments',
    'view_patients',
    'edit_patients',
    'view_billing',
    'edit_billing',
    'export_data',
    'view_treatments',
    'edit_treatments',
    'view_supplies',
    'edit_supplies',
    'delete_patients',
    'delete_appointments',
    'delete_treatments'
  ],
  docteur: [
    'view_dashboard',
    'view_appointments',
    'edit_appointments',
    'view_patients',
    'edit_patients',
    'view_billing',
    'edit_billing',
    'export_data',
    'view_treatments',
    'edit_treatments',
    'view_supplies',
    'edit_supplies',
    'delete_patients',
    'delete_appointments',
    'delete_treatments'
  ],
  secretaire: [
    'view_appointments',
    'edit_appointments',
    'view_patients',
    'edit_patients',
    'view_billing',
    'edit_billing',
    'view_supplies',
    'edit_supplies'
  ]
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const foundUser = USERS.find(u => u.username === username && u.password === password);
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword as User);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return PERMISSIONS[user.role].includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}