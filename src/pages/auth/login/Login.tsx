import React, { useState } from 'react';
import ImageLogin from '@/assets/Hình-Login.jpg';

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Định dạng email không hợp lệ';
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted:', formData);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-50 to-white flex items-center justify-center">
      <div className="relative w-full max-w-6xl">
        <nav className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 text-white">
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Địa chỉ Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-100"
                  placeholder="Nhập email của bạn"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu *
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password} // Đã sửa từ formData.email thành formData.password
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-100"
                  placeholder="Nhập mật khẩu của bạn"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="flex items-center text-sm text-gray-700">
                    <input type="checkbox" className="mr-2 focus:ring-red-500" />
                    Giữ tôi đăng nhập
                  </label>
                </div>
                <a href="#" className="text-sm text-red-600 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Đăng Nhập
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
