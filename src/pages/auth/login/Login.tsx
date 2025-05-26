import React, { useState } from 'react';
import { login } from '@/services/auth';

interface LoginFormData {
  emailOrPhone: string;
  password: string;
}

interface FormErrors {
  emailOrPhone?: string;
  password?: string;
}

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrPhone: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    const isEmail = /\S+@\S+\.\S+/.test(formData.emailOrPhone);
    const isPhone = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(formData.emailOrPhone);

    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = 'Email hoặc số điện thoại là bắt buộc';
    } else if (!isEmail && !isPhone) {
      newErrors.emailOrPhone = 'Email hoặc số điện thoại không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response: any = await login(formData.emailOrPhone, formData.password);
        console.log(response);

        if (response.status === 200) {
          console.log("Login successful");
          localStorage.setItem("token", response.data.tokens.accessToken);
          window.location.href = "/";
        } else {
          setErrors((prev) => ({
            ...prev,
            password: "Mật khẩu hoặc email/SĐT không đúng",
          }));
        }
      } catch (error: any) {
        console.error("Login failed:", error);
        setErrors((prev) => ({
          ...prev,
          password: error.message || "Đăng nhập thất bại",
        }));
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-50 to-white flex items-center justify-center">
      <div className="relative w-full max-w-6xl">
        <nav className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 text-gray-800 hover:text-red-600">
          <span>Chào mừng đến với BloodHouse</span>
          <div className="space-x-6">
            <a href="/" className="text-gray-800 hover:text-red-600 transition-colors duration-200">
              Trang chủ
            </a>
            <a href="/" className="text-gray-800 hover:text-red-600 transition-colors duration-200">
              Liên hệ
            </a>
          </div>
        </nav>

        <div className="flex bg-white shadow-2xl rounded-lg overflow-hidden mt-16">
          <div className="w-1/2 p-8 flex items-center justify-center from-red-50 to-white">
            <img
              src="https://th.bing.com/th/id/OIP.O0hMvTIq2lDMkEDHpL-6KAHaHa?rs=1&pid=ImgDetMain"
              alt="Blood Donation"
              className="h-96 w-96 object-cover"
            />
          </div>

          <div className="w-1/2 p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-red-600">BloodHouse</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700">
                  Email hoặc SĐT *
                </label>
                <input
                  id="emailOrPhone"
                  type="text"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-100"
                  placeholder="Nhập email hoặc số điện thoại của bạn"
                />
                {errors.emailOrPhone && <p className="mt-1 text-sm text-red-600">{errors.emailOrPhone}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu *
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-100"
                  placeholder="Nhập mật khẩu của bạn"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-700">
                  <input type="checkbox" className="mr-2 focus:ring-red-500" />
                  Giữ tôi đăng nhập
                </label>
                <a href="/auth/forgot-password" className="text-sm text-red-600 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={loading}
              >
                {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
              </button>
            </form>

            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">HOẶC</span>
                </div>
              </div>

              <button
                className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => console.log('Sign in with Google')}
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google Icon"
                  className="w-5 h-5"
                />
                Đăng nhập với Google
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              Bạn chưa có tài khoản?{' '}
              <a href="/auth/register" className="text-red-600 hover:underline">
                Đăng ký
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
