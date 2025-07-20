import React, { useState, useEffect } from "react";
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
  Users,
  Shield,
  ArrowLeft,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";

interface LoginFormData {
  emailOrPhone: string;
  password: string;
}

interface FormErrors {
  emailOrPhone?: string;
  password?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const {
    signIn,
    loading,
    error,
    clearError,
    isAuthenticated,
    isAdmin,
    isManager,
    isDoctor,
    isNurse,
    isStaff,
  } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else if (isManager || isNurse || isDoctor || isStaff) {
        navigate("/manager/requests", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, navigate, isAdmin, isManager]);

  // Clear auth errors when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        clearError();
      }
    };
  }, [error, clearError]);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    const isEmail = /\S+@\S+\.\S+/.test(formData.emailOrPhone);
    const isPhone = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(formData.emailOrPhone);

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Vui lòng nhập email hoặc số điện thoại";
    } else if (!isEmail && !isPhone) {
      newErrors.emailOrPhone =
        "Định dạng email hoặc số điện thoại không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
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

    // Clear auth error when user modifies input
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    if (error) {
      clearError();
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        await signIn({
          emailOrPhone: formData.emailOrPhone.trim(),
          password: formData.password,
        });
      } catch (err) {
        console.error("Đăng nhập thất bại:", err);
        // Error is handled by Redux and will show in the error state
      }
    } else {
      setErrors(validationErrors);
    }
  };

  // Translate backend error messages to Vietnamese
  const getVietnameseErrorMessage = (errorMessage: string): string => {
    const errorMap: { [key: string]: string } = {
      "Email or phone does not exist": "Email hoặc số điện thoại không tồn tại",
      "Password is incorrect": "Mật khẩu không chính xác",
      "Account is inactive": "Tài khoản đã bị vô hiệu hóa",
      "Email/Phone and password are required":
        "Email/SĐT và mật khẩu là bắt buộc",
      "Login failed": "Đăng nhập thất bại, vui lòng thử lại",
      "Network Error": "Lỗi kết nối mạng, vui lòng kiểm tra internet",
      "Request failed with status code 500": "Lỗi server, vui lòng thử lại sau",
    };

    return (
      errorMap[errorMessage] ||
      errorMessage ||
      "Đã xảy ra lỗi, vui lòng thử lại"
    );
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
                Mỗi giọt máu <br />
                <span className="text-white/90">Cứu một mạng người</span>
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                Đăng nhập để tiếp tục hành trình hiến máu cứu người và góp phần
                xây dựng cộng đồng khỏe mạnh.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Heart className="h-5 w-5 text-white mx-auto mb-1" />
                <div className="text-xl font-bold text-white">2,500+</div>
                <div className="text-xs text-white/80">Người hiến</div>
              </div>
              <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Users className="h-5 w-5 text-white mx-auto mb-1" />
                <div className="text-xl font-bold text-white">150+</div>
                <div className="text-xs text-white/80">Mạng sống</div>
              </div>
              <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Shield className="h-5 w-5 text-white mx-auto mb-1" />
                <div className="text-xl font-bold text-white">100%</div>
                <div className="text-xs text-white/80">An toàn</div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/80 text-sm">
                  Quy trình hiến máu an toàn và chuyên nghiệp
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/80 text-sm">
                  Đặt lịch hẹn dễ dàng và linh hoạt
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-white/80 text-sm">
                  Theo dõi lịch sử hiến máu chi tiết
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
                    <Droplet className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      Cứu sống 3 người
                    </div>
                    <div className="text-white/80 text-xs">
                      với mỗi lần hiến máu
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
                Đăng nhập
              </h2>
              <p className="text-muted-foreground">
                Nhập thông tin để truy cập tài khoản của bạn
              </p>
            </div>

            {/* Display auth error */}
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 border-red-500 bg-red-50"
              >
                <AlertDescription className="text-red-700 font-medium">
                  {getVietnameseErrorMessage(error)}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailOrPhone">Email hoặc số điện thoại</Label>
                <Input
                  id="emailOrPhone"
                  name="emailOrPhone"
                  type="text"
                  placeholder="Nhập email hoặc số điện thoại"
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={
                    errors.emailOrPhone
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : ""
                  }
                />
                {errors.emailOrPhone && (
                  <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.emailOrPhone}
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
                    placeholder="Nhập mật khẩu của bạn"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border"
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Ghi nhớ đăng nhập
                  </Label>
                </div>
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Chưa có tài khoản? </span>
              <Link
                to="/auth/register"
                className="text-primary hover:underline font-medium"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
