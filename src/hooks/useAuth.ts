import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  signUp,
  signIn,
  signOut,
  refreshToken,
  clearError,
  clearAuth,
  updateUser,
  selectAuth,
  selectUser,
  selectTokens,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
  selectUserFacilityId,
  selectUserPosition,
  selectUserFacilityName,
  selectIsStaff,
  selectIsAdmin,
  selectIsManager,
  selectIsDoctor,
  selectIsNurse,
  selectIsTransporter,
  selectIsMember,
} from '../store/slices/authSlice';

// Types
interface User {
  _id: string;
  fullName?: string;
  email: string;
  role: string;
  avatar?: string;
  address?: string;
  phone?: string;
  sex?: string;
  yob?: Date;
  status?: string;
  profileLevel?: string;
  facilityId?: string;
  position?: string;
  facilityName?: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface SignInCredentials {
  emailOrPhone: string;
  password: string;
}

interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  sex?: string;
  yob?: string;
  phone?: string;
  address?: string;
  idCard: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const auth = useSelector(selectAuth) as AuthState;
  const user = useSelector(selectUser) as User | null;
  const tokens = useSelector(selectTokens) as Tokens | null;
  const isAuthenticated = useSelector(selectIsAuthenticated) as boolean;
  const loading = useSelector(selectAuthLoading) as boolean;
  const error = useSelector(selectAuthError) as string | null;
  const userRole = useSelector(selectUserRole) as string | undefined;
  const userFacilityId = useSelector(selectUserFacilityId) as string | undefined;
  const userPosition = useSelector(selectUserPosition) as string | undefined;
  const userFacilityName = useSelector(selectUserFacilityName) as string | undefined;
  
  // Role-based selectors
  const isStaff = useSelector(selectIsStaff) as boolean;
  const isAdmin = useSelector(selectIsAdmin) as boolean;
  const isManager = useSelector(selectIsManager) as boolean;
  const isDoctor = useSelector(selectIsDoctor) as boolean;
  const isNurse = useSelector(selectIsNurse) as boolean;
  const isTransporter = useSelector(selectIsTransporter) as boolean;
  const isMember = useSelector(selectIsMember) as boolean;

  // Actions
  const handleSignUp = useCallback(
    (userData: SignUpData) => dispatch(signUp(userData) as any),
    [dispatch]
  );

  const handleSignIn = useCallback(
    (credentials: SignInCredentials) => dispatch(signIn(credentials) as any),
    [dispatch]
  );

  const handleSignOut = useCallback(
    () => dispatch(signOut() as any),
    [dispatch]
  );

  const handleRefreshToken = useCallback(
    () => dispatch(refreshToken() as any),
    [dispatch]
  );

  const handleClearError = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );

  const handleClearAuth = useCallback(
    () => dispatch(clearAuth()),
    [dispatch]
  );

  const handleUpdateUser = useCallback(
    (userData: Partial<User>) => dispatch(updateUser(userData)),
    [dispatch]
  );

  // Helper functions
  const hasRole = useCallback(
    (roles: string | string[]): boolean => {
      if (!userRole) return false;
      if (Array.isArray(roles)) {
        return roles.includes(userRole);
      }
      return userRole === roles;
    },
    [userRole]
  );

  const hasPermission = useCallback(
    (permission: string): boolean => {
      // Permission logic based on roles matching backend
      switch (permission) {
        case 'ADMIN_ACCESS':
          return isAdmin;
        case 'MANAGER_ACCESS':
          return isAdmin || isManager;
        case 'STAFF_ACCESS':
          return isAdmin || isStaff;
        case 'DOCTOR_ACCESS':
          return isAdmin || isManager || isDoctor;
        case 'NURSE_ACCESS':
          return isAdmin || isManager || isDoctor || isNurse;
        case 'TRANSPORTER_ACCESS':
          return isAdmin || isManager || isTransporter;
        case 'USER_ACCESS':
          return isAuthenticated;
        default:
          return false;
      }
    },
    [isAdmin, isManager, isStaff, isDoctor, isNurse, isTransporter, isAuthenticated]
  );

  const isSameFacility = useCallback(
    (facilityId: string): boolean => {
      if (!userFacilityId || !facilityId) return false;
      return userFacilityId === facilityId;
    },
    [userFacilityId]
  );

  return {
    // State
    auth,
    user,
    tokens,
    isAuthenticated,
    loading,
    error,
    userRole,
    userFacilityId,
    userPosition,
    userFacilityName,
    
    // Role-based booleans
    isStaff,
    isAdmin,
    isManager,
    isDoctor,
    isNurse,
    isTransporter,
    isMember,

    // Actions
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    refreshToken: handleRefreshToken,
    clearError: handleClearError,
    clearAuth: handleClearAuth,
    updateUser: handleUpdateUser,

    // Helper functions
    hasRole,
    hasPermission,
    isSameFacility,
  };
};

export default useAuth; 