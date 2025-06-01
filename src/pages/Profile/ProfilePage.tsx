import { getUserProfile, userProfiles } from "@/services/users";
import React, { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Calendar,
  Phone,
  MapPin,
  Award,
  Heart,
  Edit,
  Loader2,
  History,
  HandHeart,
  LogOut,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import ProfileSidebar from "@/components/profile/ProfileSidebar";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Họ và tên phải có ít nhất 2 ký tự",
  }),
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  phone: z.string().min(10, {
    message: "Số điện thoại không hợp lệ",
  }),
  gender: z.string(),
  birthDate: z.string(),
  address: z.string(),
});

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<userProfiles>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      gender: "",
      birthDate: "",
      address: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        setProfile(res);
        // Update form default values with profile data
        form.reset({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          gender: res.data.gender || "",
          birthDate: res.data.birthDate || "",
          address: res.data.address || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Handle form submission
    console.log(values);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-full">
              <User className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Thông tin cá nhân
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý thông tin cá nhân của bạn
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
          >
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa thông tin
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <ProfileSidebar activeTab="profile" />

          {/* Profile Info Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Card */}
            <Card className="shadow-xl border-0 py-0 gap-0">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
                  <User className="h-5 w-5" />
                  Hồ sơ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <img
                    src={profile?.data.avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-orange-100"
                  />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {profile?.data.fullName || "Chưa cập nhật"}
                  </h3>
                  <p className="text-gray-500 mb-4">{profile?.data.email}</p>
                  <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-800"
                  >
                    Thành viên
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <Card className="shadow-xl border-0 py-0 gap-0">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
                  <Mail className="h-5 w-5" />
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-500 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="font-medium">{profile?.data.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-500 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Số điện thoại
                    </p>
                    <p className="font-medium">
                      {profile?.data.phone || "Chưa cập nhật"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-500 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Địa chỉ
                    </p>
                    <p className="font-medium">
                      {profile?.data.address || "Chưa cập nhật"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-500 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ngày sinh
                    </p>
                    <p className="font-medium">
                      {profile?.data.birthDate || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 py-0 gap-0">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
                  <Award className="h-5 w-5" />
                  Thành tích
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-500 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Số lần hiến máu
                    </p>
                    <p className="font-medium">
                      {profile?.data.donationCount || 0} lần
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-500 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Điểm tích lũy
                    </p>
                    <p className="font-medium">
                      {profile?.data.points || 0} điểm
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cá nhân của bạn
            </DialogDescription>
          </DialogHeader>
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Nam</SelectItem>
                        <SelectItem value="female">Nữ</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
