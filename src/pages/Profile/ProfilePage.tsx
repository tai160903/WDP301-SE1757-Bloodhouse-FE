import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Heart,
  Edit,
  Loader2,
  CheckCircle,
  AlertCircle,
  Shield,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { userAPI } from "@/utils/axiosInstance";
import { 
  getRoleText, 
  getStatusText, 
  getSexText, 
  getProfileLevelText, 
  getAvailabilityText,
  formatPhoneNumber,
  formatYearOfBirth
} from "@/utils/changeText";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import VerifyLevel2Page from './VerifyLevel2Page';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Họ và tên phải có ít nhất 2 ký tự",
  }),
  phone: z.string().min(10, {
    message: "Số điện thoại không hợp lệ",
  }),
  sex: z.enum(["Nam", "Nữ"], {
    required_error: "Vui lòng chọn giới tính",
  }),
  address: z.string().min(5, {
    message: "Địa chỉ phải có ít nhất 5 ký tự",
  }),
  yob: z.string().min(4, {
    message: "Năm sinh không hợp lệ",
  }),
});

interface UserProfile {
  _id: string;
  fullName?: string;
  email: string;
  phone?: string;
  address?: string;
  sex?: "Nam" | "Nữ";
  yob?: string;
  avatar?: string;
  bloodId?: {
    _id: string;
    name: string;
  };
  isVerified?: boolean;
  status?: string;
  profileLevel?: number;
  role?: string;
  idCard?: string;
  isAvailable?: boolean;
}

interface APIResponse<T> {
  message: string;
  data: T;
}

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showVerifyLevel2, setShowVerifyLevel2] = useState(false);
  const [showUploadCCCDModal, setShowUploadCCCDModal] = useState(false);
  const [verifyLevel2Data, setVerifyLevel2Data] = useState<any>(null);
  const [showConfirmCloseUpload, setShowConfirmCloseUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      sex: "Nam",
      address: "",
      yob: "",
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.get("/me");
      const profileData = (response.data as APIResponse<UserProfile>).data;
      setProfile(profileData);
      
      // Update form with profile data
      form.reset({
        fullName: profileData.fullName || "",
        phone: profileData.phone || "",
        sex: profileData.sex || "Nam",
        address: profileData.address || "",
        yob: profileData.yob || "",
      });
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      setError(error.response?.data?.message || "Có lỗi xảy ra khi tải thông tin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);

      const response = await userAPI.patch("/profile", values);
      const updatedProfile = (response.data as APIResponse<UserProfile>).data;
      
      setProfile(prev => ({ ...prev, ...updatedProfile }));
      setSuccess("Cập nhật thông tin thành công!");
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setUpdating(false);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải thông tin</h2>
          <p className="text-gray-600 mb-4">Vui lòng thử lại sau</p>
          <Button onClick={fetchProfile} variant="outline">Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-3 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">Thông tin cá nhân</h1>
              <p className="text-muted-foreground">Quản lý và cập nhật thông tin của bạn</p>
            </div>
          </div>
          <Button
            onClick={() => {
              setIsEditing(true);
              clearMessages();
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa thông tin
          </Button>
        </div>
        {/* Nút xác thực mức 2 nếu profileLevel === 1 */}
        {profile?.profileLevel === 1 && (
          <div className="mb-6 flex justify-end">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg flex items-center gap-2 animate-pulse"
              size="lg"
              onClick={() => setShowUploadCCCDModal(true)}
            >
              <CheckCircle className="w-5 h-5" />
              Xác thực mức 2
            </Button>
          </div>
        )}

        {/* Success/Error Messages */}
        {success && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar activeTab="profile" />
          </div>

          {/* Profile Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Overview Card */}
            <Card className="shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Hồ sơ cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <img
                      src={profile.avatar || "/images/default-avatar.png"}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-accent"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/default-avatar.png";
                      }}
                    />
                    {profile.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold mb-2">
                      {profile.fullName || "Người dùng"}
                    </h2>
                    <p className="text-muted-foreground mb-3">{profile.email}</p>
                    
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Badge variant="outline">
                        <Star className="h-3 w-3 mr-1" />
                        {getRoleText(profile.role)}
                      </Badge>
                      <Badge variant="outline">
                        <Shield className="h-3 w-3 mr-1" />
                        {getStatusText(profile.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getProfileLevelText(profile.profileLevel)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="font-medium text-foreground">{profile.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Số điện thoại</label>
                      <p className="font-medium text-foreground">{formatPhoneNumber(profile.phone)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Giới tính</label>
                      <p className="font-medium text-foreground">{getSexText(profile.sex)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Năm sinh</label>
                      <p className="font-medium text-foreground">{formatYearOfBirth(profile.yob)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Địa chỉ</label>
                      <p className="font-medium text-foreground">{profile.address || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nhóm máu</label>
                      <p className="font-medium text-foreground">{profile.bloodId?.name || "Chưa cập nhật"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blood Donation Status */}
            <Card className="shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Trạng thái hiến máu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary p-3 rounded-full">
                      <Heart className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{getAvailabilityText(profile.isAvailable)}</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.isAvailable 
                          ? "Bạn có thể tham gia hiến máu" 
                          : "Hiện tại chưa thể hiến máu"
                        }
                      </p>
                    </div>
                  </div>
                  <Badge variant={profile.isAvailable ? "default" : "secondary"}>
                    {profile.isAvailable ? "Sẵn sàng" : "Chưa sẵn sàng"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cá nhân của bạn
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ và tên" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="yob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Năm sinh</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập năm sinh (YYYY)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    clearMessages();
                  }}
                  disabled={updating}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal upload CCCD */}
      <Dialog
        open={showUploadCCCDModal}
        onOpenChange={(open) => {
          if (!open && verifyLevel2Data) {
            setShowConfirmCloseUpload(true);
          } else if (!open) {
            setShowUploadCCCDModal(false);
          } else {
            setShowUploadCCCDModal(true);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload CCCD/CMND</DialogTitle>
            <DialogDescription>
              Vui lòng tải lên ảnh hoặc file CCCD/CMND để tự động nhận diện thông tin.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setUploadError(null);
              setUploading(true);
              const file = fileInputRef.current?.files?.[0];
              if (!file) {
                setUploadError('Vui lòng chọn file');
                setUploading(false);
                return;
              }
              try {
                const formData = new FormData();
                formData.append('cccd', file);
                const res = await userAPI.post('/kyc/upload-cccd', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                });
                const data = (res.data as APIResponse<any>).data;
                setVerifyLevel2Data({
                  idCard: data.idCard || '',
                  fullName: data.fullName || '',
                  yob: data.dob ? formatYobToDateInput(data.dob) : '',
                  address: data.address || '',
                  sex: data.sex?.toUpperCase() === 'NAM' ? 'Nam' : 'Nữ',
                });
                setShowUploadCCCDModal(false);
                setShowVerifyLevel2(true);
                setPreviewUrl(null);
              } catch (err: any) {
                setUploadError(err?.response?.data?.message || 'Upload thất bại');
              } finally {
                setUploading(false);
              }
            }}
            className="space-y-4"
          >
            <input
              type="file"
              name="cccd"
              accept="image/*,.pdf"
              ref={fileInputRef}
              className="block w-full border rounded-md px-3 py-2"
              required
              onChange={e => {
                const file = e.target.files?.[0];
                if (file && file.type.startsWith('image/')) {
                  setPreviewUrl(URL.createObjectURL(file));
                } else {
                  setPreviewUrl(null);
                }
              }}
            />
            {previewUrl && (
              <div className="mb-2 flex justify-center">
                <img src={previewUrl} alt="CCCD preview" className="max-h-48 rounded shadow" />
              </div>
            )}
            {uploadError && <div className="text-red-500 text-sm">{uploadError}</div>}
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  if (verifyLevel2Data) {
                    setShowConfirmCloseUpload(true);
                  } else {
                    setShowUploadCCCDModal(false);
                  }
                }}
                disabled={uploading}
              >
                Đóng
              </Button>
              <Button type="submit" disabled={uploading}>{uploading ? 'Đang upload...' : 'Tiếp tục'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal xác thực mức 2 */}
      <VerifyLevel2Page fetchProfile={fetchProfile} open={showVerifyLevel2} onClose={() => setShowVerifyLevel2(false)} initialData={verifyLevel2Data} />
    </div>
  );
};

// Helper: convert dd/mm/yyyy or yyyy-mm-dd to yyyy-mm-dd
function formatYobToDateInput(yob: string | undefined): string {
  if (!yob) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(yob)) return yob; // yyyy-mm-dd
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(yob)) {
    const [day, month, year] = yob.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return yob;
}

export default ProfilePage;
