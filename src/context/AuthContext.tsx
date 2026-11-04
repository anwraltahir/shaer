import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, PoetProfile, PoetApplication } from '../types';
import { StorageService } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  poetProfile: PoetProfile | null;
  unreadNotifsCount: number;
  login: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  registerReader: (fullName: string, email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  switchRoleDemo: (role: UserRole) => void;
  submitPoetApplication: (data: Omit<PoetApplication, 'id' | 'userId' | 'userEmail' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [poetProfile, setPoetProfile] = useState<PoetProfile | null>(null);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(0);

  const loadUserData = (user: User | null) => {
    if (!user) {
      setPoetProfile(null);
      setUnreadNotifsCount(0);
      return;
    }
    // If poet, load profile
    if (user.role === 'approved_poet') {
      const profile = StorageService.getPoetByUserId(user.id);
      setPoetProfile(profile || null);
    } else {
      setPoetProfile(null);
    }

    // Load unread notifications
    const notifs = StorageService.getNotifications(user.id);
    const unread = notifs.filter(n => !n.isRead).length;
    setUnreadNotifsCount(unread);
  };

  useEffect(() => {
    loadUserData(currentUser);
  }, [currentUser]);

  const refreshUser = () => {
    if (currentUser) {
      const updated = StorageService.getUserById(currentUser.id);
      if (updated) {
        setCurrentUser(updated);
        StorageService.setCurrentUser(updated);
        loadUserData(updated);
      }
    }
  };

  const login = async (email: string): Promise<{ success: boolean; message: string }> => {
    const user = StorageService.getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'لم يتم العثور على حساب بهذا البريد الإلكتروني.' };
    }
    if (user.accountStatus === 'suspended') {
      return { success: false, message: 'عذراً، هذا الحساب موقوف من قِبل إدارة المنصة.' };
    }
    setCurrentUser(user);
    StorageService.setCurrentUser(user);
    loadUserData(user);
    return { success: true, message: 'تم تسجيل الدخول بنجاح.' };
  };

  const registerReader = async (fullName: string, email: string): Promise<{ success: boolean; message: string }> => {
    const existing = StorageService.getUserByEmail(email);
    if (existing) {
      return { success: false, message: 'يوجد حساب مسجل بالفعل بهذا البريد الإلكتروني.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName,
      email,
      role: 'reader',
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.saveUser(newUser);
    setCurrentUser(newUser);
    StorageService.setCurrentUser(newUser);
    loadUserData(newUser);
    return { success: true, message: 'تم إنشاء حساب القارئ بنجاح، مرحباً بك في شعراء السودان.' };
  };

  const logout = () => {
    setCurrentUser(null);
    StorageService.setCurrentUser(null);
    setPoetProfile(null);
    setUnreadNotifsCount(0);
  };

  const switchRoleDemo = (role: UserRole) => {
    const users = StorageService.getUsers();
    let target = users.find(u => u.role === role);
    if (!target) {
      if (role === 'guest') {
        logout();
        return;
      }
      // Create on the fly
      target = {
        id: `demo-${role}-${Date.now()}`,
        fullName: `مستخدم تجريبي (${role})`,
        email: `${role}@poets.sd`,
        role,
        accountStatus: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      StorageService.saveUser(target);
    }
    setCurrentUser(target);
    StorageService.setCurrentUser(target);
    loadUserData(target);
  };

  const submitPoetApplication = async (
    data: Omit<PoetApplication, 'id' | 'userId' | 'userEmail' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; message: string }> => {
    let user = currentUser;

    // If guest, create reader account first
    if (!user) {
      const existing = StorageService.getUserByEmail(data.fullName);
      if (existing) {
        user = existing;
      } else {
        user = {
          id: `user-${Date.now()}`,
          fullName: data.fullName,
          email: `${data.literaryName.replace(/\s+/g, '').toLowerCase() || 'poet'}@poets.sd`,
          phone: data.phone,
          role: 'pending_poet',
          accountStatus: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        StorageService.saveUser(user);
      }
      setCurrentUser(user);
      StorageService.setCurrentUser(user);
    } else {
      user.role = 'pending_poet';
      StorageService.saveUser(user);
      setCurrentUser({ ...user });
      StorageService.setCurrentUser(user);
    }

    const newApp: PoetApplication = {
      ...data,
      id: `app-${Date.now()}`,
      userId: user.id,
      userEmail: user.email,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.saveApplication(newApp);

    // Add notification to applicant
    StorageService.addNotification(
      user.id,
      'تم استلام طلب انضمامك للديوان',
      'سيقوم فريق منصة شعراء السودان بمراجعة بياناتك الأدبية ونماذج قصائدك، وسيتم إبلاغك بنتيجة المراجعة.',
      'info'
    );

    loadUserData(user);
    return {
      success: true,
      message: 'تم استلام طلبك بنجاح. سيقوم فريق منصة شعراء السودان بمراجعة بياناتك الأدبية ونماذج قصائدك، وسيتم إبلاغك بنتيجة الطلب.'
    };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        poetProfile,
        unreadNotifsCount,
        login,
        registerReader,
        logout,
        switchRoleDemo,
        submitPoetApplication,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
