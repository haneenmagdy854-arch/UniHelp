import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (data: Partial<UserProfile> & { password?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const defaultProfiles: Record<UserRole, UserProfile> = {
  student: {
    id: 'user-nour-01',
    name: 'Haneen Magdy',
    email: 'nour.almansour@campus.edu',
    role: 'student',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzsdr8AR31Mqn_SpbpEz66QScm7EhbrKGAFEGPMv0mZ1gj-c29PcguJwLlkvylIAW4q7oANEwjBcZ-YxlrKcLdmEDL6gnOEUXeoitgWr9iZYwWTdDeDo7seQxjSMBwNvRdxgDcMfr0C-7yhWsv0MFDnfMgQmzVcSv5zPiL20oSLVy5De5skubvVTwTwHQYCP5eWgKlZjW9EwD6zY7AoxxvldayoUBP4lTzh6aPyu-6',
    department: 'College of Engineering & Computer Science',
    building: 'Building 4 • West Wing',
    studentId: 'ST-94821',
    phone: '+966 50 123 4567'
  },
  doctor: {
    id: 'user-doctor-01',
    name: 'Dr. Khaled Al-Sabah',
    email: 'k.alsabah@campus.edu',
    role: 'doctor',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_51xEqLkXjI8W_hZhlmdQuJOZqMbOxNZ7OTfhd8zVGKgTs4a_9TM_R_kShaY6ReltRcc9A0QIB7BnHe-IhSSCx98iFOhtWlU_gcLp61yU1Igu2kCjrmSdcSwF7MeGfwlQAZ2ziTlUu66gZMhrefKKgnAtETKD05uSaW6LIscanTG20UJ7fn-Gtl71K7uQNStRHs3syd7UHXEcWwORxZ6LO3gOUfdMsZUIjW90kSQ',
    department: 'Electrical & Systems Engineering',
    building: 'Engineering Hall B • Floor 3',
    employeeId: 'DOC-4482',
    phone: '+966 54 888 2390'
  },
  admin: {
    id: 'user-admin-01',
    name: 'Facilities Command Admin',
    email: 'ops.dispatch@campus.edu',
    role: 'admin',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAw9vyy4b7MOFadoa7V5r2N_9TKQJiy_fT-ztED52IWF2Bfp8_WHEX3YL_ENC_ZyqzDneFzLRVQin3wmvwjECuJJ1obUmDyIidTaskbI_zwGqBC9F-1lVWJDDIfRTrOSHHSNd61cWvmaVYqQOqbP-caS-4defOtii1SxC7sATkfozvFXkIseebN5F9N6TCJnnDhBLFJuxFJXp9mCqQG8opIBP0CxPWHRXncpQcE3tjG',
    department: 'Campus Infrastructure & Physical Plant',
    building: 'Admin Tower • Command Core',
    employeeId: 'ADM-001',
    phone: 'Ext: 4444'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('campusfix_role');
    if (saved === 'student' || saved === 'doctor' || saved === 'admin') {
      return saved;
    }
    return 'student';
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedProfile = localStorage.getItem('campusfix_user_profile');
    if (savedProfile) {
      try {
        const profile: UserProfile = JSON.parse(savedProfile);
        if (profile.id === 'user-nour-01' && profile.name === 'Eng. Nour Al-Mansour') {
          return { ...profile, name: 'Haneen Magdy' };
        }
        return profile;
      } catch (e) {
        // fallback
      }
    }
    const saved = localStorage.getItem('campusfix_role');
    const initRole: UserRole = (saved === 'doctor' || saved === 'admin') ? saved : 'student';
    return defaultProfiles[initRole];
  });

  useEffect(() => {
    localStorage.setItem('campusfix_role', role);
    const updated = {
      ...defaultProfiles[role],
      ...(user && user.role === role ? user : {})
    };
    setUser(updated);
    localStorage.setItem('campusfix_user_profile', JSON.stringify(updated));
  }, [role]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    const newProfile = defaultProfiles[newRole];
    setUser(newProfile);
    localStorage.setItem('campusfix_user_profile', JSON.stringify(newProfile));
  };

  const login = async (email: string, chosenRole?: UserRole): Promise<boolean> => {
    const targetRole = chosenRole || 'student';
    setRole(targetRole);
    if (user) {
      setUser({ ...user, email });
    }
    return true;
  };

  const register = async (data: Partial<UserProfile> & { password?: string }): Promise<boolean> => {
    const targetRole = data.role || 'student';
    const newProfile: UserProfile = {
      ...defaultProfiles[targetRole],
      ...data,
      id: `user-${Date.now()}`
    };
    setRoleState(targetRole);
    setUser(newProfile);
    localStorage.setItem('campusfix_user_profile', JSON.stringify(newProfile));
    return true;
  };

  const logout = () => {
    setRole('student');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('campusfix_user_profile', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        setRole,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
