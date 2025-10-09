// Utility functions untuk permission handling sesuai dokumentasi Task View

export interface UserPermissions {
  hasAccess?: boolean;
  userId?: string;
  isOwner: boolean;
  role: string;
  permissions?: {
    can_edit: boolean;
    can_comment: boolean;
    can_upload: boolean;
  };
}

/**
 * Check apakah user memiliki permission tertentu
 * @param userPermissions - Permissions user
 * @param requiredPermission - Permission yang dibutuhkan
 * @returns boolean - true jika user memiliki permission
 */
export const checkPermission = (userPermissions: UserPermissions | null, requiredPermission: string): boolean => {
  if (!userPermissions) return false;
  
  // Owner memiliki semua permissions
  if (userPermissions.isOwner) return true;
  
  // Check specific permission
  return userPermissions.permissions?.[requiredPermission as keyof typeof userPermissions.permissions] !== false;
};

/**
 * Get display name untuk role
 * @param role - Role string
 * @returns string - Display name untuk role
 */
export const getRoleDisplayName = (role: string): string => {
  const roleNames: Record<string, string> = {
    owner: 'Owner',
    admin: 'Admin',
    member: 'Member',
    viewer: 'Viewer'
  };
  return roleNames[role] || role;
};

/**
 * Check apakah user bisa manage task (edit, delete, dll)
 * @param userPermissions - Permissions user
 * @returns boolean - true jika user bisa manage task
 */
export const canManageTask = (userPermissions: UserPermissions | null): boolean => {
  return userPermissions?.isOwner || userPermissions?.role === 'admin';
};

/**
 * Check apakah user bisa edit task details
 * @param userPermissions - Permissions user
 * @returns boolean - true jika user bisa edit task details
 */
export const canEditTask = (userPermissions: UserPermissions | null): boolean => {
  if (!userPermissions) return false;
  
  // Jika user adalah owner, otomatis bisa edit
  if (userPermissions.isOwner) return true;
  
  // Jika ada object permissions, check can_edit
  if (userPermissions.permissions?.can_edit) return true;
  
  // Fallback: check role-based permission
  return canManageTask(userPermissions);
};

/**
 * Check apakah user bisa comment di task
 * @param userPermissions - Permissions user
 * @returns boolean - true jika user bisa comment
 */
export const canCommentOnTask = (userPermissions: UserPermissions | null): boolean => {
  if (!userPermissions) return false;
  
  // Owner dan admin selalu bisa comment
  if (userPermissions.isOwner || userPermissions.role === 'admin') return true;
  
  // Check specific permission jika ada
  return userPermissions.permissions?.can_comment !== false;
};

/**
 * Check apakah user bisa upload file ke task
 * @param userPermissions - Permissions user
 * @returns boolean - true jika user bisa upload file
 */
export const canUploadToTask = (userPermissions: UserPermissions | null): boolean => {
  if (!userPermissions) return false;
  
  // Owner dan admin selalu bisa upload
  if (userPermissions.isOwner || userPermissions.role === 'admin') return true;
  
  // Check specific permission jika ada
  return userPermissions.permissions?.can_upload !== false;
};

/**
 * Check apakah user bisa manage members task
 * @param userPermissions - Permissions user
 * @returns boolean - true jika user bisa manage members
 */
export const canManageTaskMembers = (userPermissions: UserPermissions | null): boolean => {
  return userPermissions?.isOwner || userPermissions?.role === 'admin';
};

/**
 * Get role badge color untuk UI
 * @param role - Role string
 * @returns string - Color untuk badge
 */
export const getRoleBadgeColor = (role: string): 'primary' | 'success' | 'info' | 'secondary' | 'default' => {
  switch (role) {
    case 'owner': return 'primary';
    case 'admin': return 'success';
    case 'member': return 'info';
    case 'viewer': return 'secondary';
    default: return 'default';
  }
};

/**
 * Get status color untuk task status
 * @param status - Task status
 * @returns string - Color untuk status
 */
export const getStatusColor = (status: string): 'info' | 'warning' | 'secondary' | 'success' | 'default' => {
  switch (status.toLowerCase()) {
    case 'todo': return 'info';
    case 'in-progress': return 'warning';
    case 'review': return 'secondary';
    case 'done': return 'success';
    default: return 'default';
  }
};
