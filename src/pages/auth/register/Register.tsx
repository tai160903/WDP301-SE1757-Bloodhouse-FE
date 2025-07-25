"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Droplet,
  Eye,
  EyeOff,
  Heart,
  Shield,
  ArrowLeft,
  UserPlus,
  CheckCircle,
} from "lucide-react";
import { register } from "@/services/auth";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Định dạng email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear general error when user modifies input
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await register({
          email: formData.email,
          password: formData.password,
        });
        console.log("Đăng ký thành công:", response);
        navigate("/auth/login");
      } catch (error: any) {
        setErrors({ general: error.message || "Đăng ký thất bại" });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Hero background with gradient and pattern */}
        <div className="absolute inset-0 hero-gradient">
          <div className="absolute inset-0 bg-[url('/images/pattern-dots.png')] bg-repeat opacity-10"></div>
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/15 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-40 right-10 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Droplet className="h-8 w-8 text-white" />
              </div>
              <span className="font-bold text-2xl">BloodHouse</span>
            </div>

            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                Tham gia cộng đồng <br />
                <span className="text-white/90">Hiến máu cứu người</span>
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                Đăng ký tài khoản để bắt đầu hành trình ý nghĩa và góp phần cứu
                sống nhiều mạng người.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <UserPlus className="h-5 w-5 text-white mx-auto mb-1" />
                <div className="text-xl font-bold text-white">5,000+</div>
                <div className="text-xs text-white/80">Thành viên</div>
              </div>
              <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Heart className="h-5 w-5 text-white mx-auto mb-1" />
                <div className="text-xl font-bold text-white">300+</div>
                <div className="text-xs text-white/80">Mạng sống</div>
              </div>
              <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Shield className="h-5 w-5 text-white mx-auto mb-1" />
                <div className="text-xl font-bold text-white">24/7</div>
                <div className="text-xs text-white/80">Hỗ trợ</div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/80 text-sm">
                  Đăng ký nhanh chóng và dễ dàng
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/80 text-sm">
                  Quản lý thông tin cá nhân an toàn
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/80 text-sm">
                  Nhận thông báo về các chiến dịch hiến máu
                </span>
              </div>
            </div>

            {/* Decorative card */}
            <div className="relative max-w-sm">
              <div className="absolute -top-2 -left-2 w-12 h-12 bg-white/20 rounded-full blur-lg"></div>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/15 rounded-full blur-lg"></div>
              <div className="relative bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      Trở thành người hùng
                    </div>
                    <div className="text-white/80 text-xs">
                      trong cộng đồng hiến máu
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header for mobile */}
        <div className="lg:hidden bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Droplet className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg text-primary">BloodHouse</span>
            </Link>
            <Link
              to="/"
              className="flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Trang chủ
            </Link>
          </div>
        </div>

        {/* Navigation for desktop */}
        <div className="hidden lg:block p-6 bg-background">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                <Droplet className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl text-primary">BloodHouse</span>
            </Link>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <Link
                to="/about"
                className="hover:text-primary transition-colors"
              >
                Giới thiệu
              </Link>
              <Link
                to="/contact"
                className="hover:text-primary transition-colors"
              >
                Liên hệ
              </Link>
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Đăng ký tài khoản
              </h2>
              <p className="text-muted-foreground">
                Tạo tài khoản mới để tham gia cộng đồng hiến máu
              </p>
            </div>

            {/* Display general error */}
            {errors.general && (
              <Alert
                variant="destructive"
                className="mb-6 border-red-500 bg-red-50"
              >
                <AlertDescription className="text-red-700 font-medium">
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : ""
                  }
                />
                {errors.email && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tạo mật khẩu mạnh"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200 pr-10"
                        : "pr-10"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200 pr-10"
                        : "pr-10"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
                </Button>
              </div>
            </form>

            <Separator className="my-6" />

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Đã có tài khoản? </span>
              <Link
                to="/auth/login"
                className="text-primary hover:underline font-medium"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
