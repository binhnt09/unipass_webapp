import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  university: string;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isSeller: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'buyer@fpt.edu.vn': {
    password: 'buyer123',
    user: {
      id: '1',
      name: 'Minh Hoàng',
      email: 'buyer@fpt.edu.vn',
      role: 'buyer',
      university: 'ĐH FPT',
      phone: '0987 654 321',
      avatar: 'MH',
    },
  },
  'seller@fpt.edu.vn': {
    password: 'seller123',
    user: {
      id: '2',
      name: 'Nam Nguyễn',
      email: 'seller@fpt.edu.vn',
      role: 'seller',
      university: 'ĐH FPT',
      phone: '0912 345 678',
      avatar: 'NN',
    },
  },
  'admin@fpt.edu.vn': {
    password: 'admin123',
    user: {
      id: '3',
      name: 'Admin Manager',
      email: 'admin@fpt.edu.vn',
      role: 'admin',
      university: 'ĐH FPT',
      phone: '0999 999 999',
      avatar: 'AM',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('unipass_user');
    const loginTimestamp = localStorage.getItem('unipass_login_time');

    // Check if session expired (30 minutes = 1800000 ms)
    const SESSION_TIMEOUT = 30 * 60 * 1000;
    if (storedUser && loginTimestamp) {
      const currentTime = Date.now();
      const loginTime = parseInt(loginTimestamp, 10);

      if (currentTime - loginTime > SESSION_TIMEOUT) {
        // Session expired - clear storage and return null
        localStorage.removeItem('unipass_user');
        localStorage.removeItem('unipass_login_time');
        return null;
      }
    }

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (email: string, password: string): boolean => {
    const userAccount = MOCK_USERS[email.toLowerCase()];

    if (userAccount && userAccount.password === password) {
      setUser(userAccount.user);
      localStorage.setItem('unipass_user', JSON.stringify(userAccount.user));
      localStorage.setItem('unipass_login_time', Date.now().toString());
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unipass_user');
    localStorage.removeItem('unipass_login_time');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isSeller: user?.role === 'seller',
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
