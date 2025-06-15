import { register } from '@/services/auth';
import React, { useState } from 'react';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors extends Partial<Record<keyof RegisterFormData, string>> {}

const inputClass =
  'w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.email) newErrors.email = 'Email là bắt buộc';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Định dạng email không hợp lệ';
    if (!formData.password) newErrors.password = 'Mật khẩu là bắt buộc';
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
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
      try {
        const response = await register({
          email: formData.email,
          password: formData.password,
        });
        console.log('Đăng ký thành công:', response);
        window.location.href = '/auth/login';
      } catch (error: any) {
        setErrors({ password: error.message || 'Đăng ký thất bại' });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-start px-4 py-6">
      <nav className="w-full max-w-6xl flex justify-between items-center mb-4 px-4 text-gray-800 hover:text-red-600">
        <span className="font-semibold text-base">Chào mừng đến với BloodHouse</span>
        <div className="space-x-4">
          <a href="/" className="text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm">
            Trang chủ
          </a>
          <a href="/" className="text-gray-800 hover:text-red-600 transition-colors duration-200 text-sm">
            Liên hệ
          </a>
        </div>
      </nav>

      <div className="w-full max-w-6xl bg-white shadow-md rounded-xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-4">
          <img
            src="https://cdn3.iconfinder.com/data/icons/blood-donation-25/128/blood-drop-medical-donation-256.png"
            alt="Blood Donation"
            className="max-w-[200px]"
          />
        </div>
        <div className="md:w-1/2 p-4">
          <h2 className="text-2xl font-semibold text-center text-red-600 mb-4">Đăng ký tài khoản</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm">Email *</label>
              <input
                type="email"
                name="email"
                placeholder="abc@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={inputClass}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm">Mật khẩu *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={inputClass}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="text-sm">Xác nhận mật khẩu *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={inputClass}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-1.5 rounded-md font-semibold hover:bg-red-700 transition text-sm"
              >
                Đăng ký
              </button>
            </div>
            <p className="text-center text-xs text-gray-600 mt-3">
              Đã có tài khoản?{' '}
              <a href="/auth/login" className="text-red-600 hover:underline">
                Đăng nhập
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;