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
  selectIsStaff,
  selectIsAdmin,
  selectIsManager,
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const auth = useSelector(selectAuth);
  const user = useSelector(selectUser);
  const tokens = useSelector(selectTokens);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const userRole = useSelector(selectUserRole);
  const userFacilityId = useSelector(selectUserFacilityId);
  const isStaff = useSelector(selectIsStaff);
  const isAdmin = useSelector(selectIsAdmin);
  const isManager = useSelector(selectIsManager);

  // Actions
  const handleSignUp = useCallback(
    (userData) => dispatch(signUp(userData)),
    [dispatch]
  );

  const handleSignIn = useCallback(
    (credentials) => dispatch(signIn(credentials)),
    [dispatch]
  );

  const handleSignOut = useCallback(
    () => dispatch(signOut()),
    [dispatch]
  );

  const handleRefreshToken = useCallback(
    () => dispatch(refreshToken()),
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
    (userData) => dispatch(updateUser(userData)),
    [dispatch]
  );

  // Helper functions
  const hasRole = useCallback(
    (roles) => {
      if (!userRole) return false;
      if (Array.isArray(roles)) {
        return roles.includes(userRole);
      }
      return userRole === roles;
    },
    [userRole]
  );

  const hasPermission = useCallback(
    (permission) => {
      // Add your permission logic here based on roles
      switch (permission) {
        case 'ADMIN_ACCESS':
          return isAdmin;
        case 'MANAGER_ACCESS':
          return isAdmin || isManager;
        case 'STAFF_ACCESS':
          return isAdmin || isStaff;
        case 'USER_ACCESS':
          return isAuthenticated;
        default:
          return false;
      }
    },
    [isAdmin, isManager, isStaff, isAuthenticated]
  );

  const isSameFacility = useCallback(
    (facilityId) => {
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
    isStaff,
    isAdmin,
    isManager,

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