/**
 * Utility functions for text transformation and translation
 */

// Role text mapping
export const getRoleText = (role?: string): string => {
  const roleMap: { [key: string]: string } = {
    ADMIN: "Quản trị viên",
    MANAGER: "Quản lý",
    DOCTOR: "Bác sĩ",
    NURSE: "Y tá",
    TRANSPORTER: "Vận chuyển",
    MEMBER: "Thành viên",
  };
  return roleMap[role || "MEMBER"] || "Thành viên";
};

// Status text mapping
export const getStatusText = (status?: string): string => {
  const statusMap: { [key: string]: string } = {
    ACTIVE: "Hoạt động",
    INACTIVE: "Không hoạt động",
    VERIFIED: "Đã xác minh",
    PENDING: "Chờ xác minh",
  };
  return statusMap[status || "PENDING"] || "Chờ xác minh";
};

// Gender text mapping - updated to handle both cases
export const getSexText = (sex?: string): string => {
  const normalizedSex = sex?.toLowerCase();
  return normalizedSex === "male" ? "Nam" : normalizedSex === "female" ? "Nữ" : "Chưa cập nhật";
};

// Profile level text
export const getProfileLevelText = (level?: number): string => {
  const levelMap: { [key: number]: string } = {
    1: "Cơ bản",
    2: "Đã xác minh",
    3: "Nâng cao",
  };
  return levelMap[level || 1] || `Cấp ${level || 1}`;
};

// Blood availability status
export const getAvailabilityText = (isAvailable?: boolean): string => {
  return isAvailable ? "Sẵn sàng hiến máu" : "Không sẵn sàng";
};

// Format phone number
export const formatPhoneNumber = (phone?: string): string => {
  if (!phone) return "Chưa cập nhật";
  // Format Vietnamese phone number
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
};

// Format year of birth to readable format
export const formatYearOfBirth = (yob?: string | number): string => {
  if (!yob) return "Chưa cập nhật";
  const year = typeof yob === 'string' ? parseInt(yob) : yob;
  if (isNaN(year)) return "Chưa cập nhật";
  
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  return `${year} (${age} tuổi)`;
};

// Format date for donation history
export const formatDonationDate = (dateString?: string): string => {
  if (!dateString) return "Chưa có";
  
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};

// Get donation status text and color
export const getDonationStatusInfo = (status?: string) => {
  const statusMap: { [key: string]: { text: string; className: string } } = {
    COMPLETED: { 
      text: "Hoàn thành", 
      className: "bg-emerald-100 text-emerald-700 border-emerald-200" 
    },
    CANCELLED: { 
      text: "Đã hủy", 
      className: "bg-red-100 text-red-700 border-red-200" 
    },
    PENDING: { 
      text: "Chờ xử lý", 
      className: "bg-amber-100 text-amber-700 border-amber-200" 
    },
    SCHEDULED: { 
      text: "Đã đặt lịch", 
      className: "bg-blue-100 text-blue-700 border-blue-200" 
    },
  };
  
  return statusMap[status || "PENDING"] || {
    text: status || "Không xác định",
    className: "bg-gray-100 text-gray-700 border-gray-200"
  };
};

// Get status badge variant
export const getStatusBadgeVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "VERIFIED":
    case "ACTIVE":
      return "default";
    case "PENDING":
      return "secondary";
    case "INACTIVE":
      return "destructive";
    default:
      return "outline";
  }
};

// Get status badge class with vibrant colors
export const getStatusBadgeClass = (status?: string): string => {
  switch (status) {
    case "VERIFIED":
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "INACTIVE":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
