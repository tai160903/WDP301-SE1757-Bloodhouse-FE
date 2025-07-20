import { register } from '@/services/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors extends Partial<Record<keyof RegisterFormData, string>> {}

const inputClass =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-gray-900 placeholder-gray-400 text-sm hover:border-red-300';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

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
        // window.location.href = '/auth/login';
        navigate('/auth/login');
      } catch (error: any) {
        setErrors({ password: error.message || 'Đăng ký thất bại' });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex flex-col items-center justify-center px-4 py-12">
      <nav className="w-full max-w-5xl flex justify-between items-center mb-10 px-8 py-5 bg-white/80 backdrop-blur-lg rounded-full shadow-lg">
        <span className="font-extrabold text-xl text-red-600 tracking-tight">BloodHouse</span>
        <div className="space-x-8">
          <a href="/" className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-semibold text-sm">
            Trang chủ
          </a>
          <a href="/contact" className="text-gray-700 hover:text-red-600 transition-colors duration-300 font-semibold text-sm">
            Liên hệ
          </a>
        </div>
      </nav>

      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row transform hover:scale-[1.01] transition-transform duration-500">
        <div className="md:w-1/2 bg-gradient-to-b from-red-200 to-red-100 flex items-center justify-center p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-20"></div>
          <img
            src="https://cdn3.iconfinder.com/data/icons/blood-donation-25/128/blood-drop-medical-donation-256.png"
            alt="Blood Donation"
            className="max-w-[240px] animate-pulse-slow transform hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="md:w-1/2 p-10">
          <h2 className="text-4xl font-extrabold text-center text-red-600 mb-8 tracking-tight animate-fade-in">
            Đăng ký tài khoản
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                placeholder="abc@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={inputClass}
              />
              {errors.email && <p className="text-xs text-red-500 mt-2 animate-shake">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={inputClass}
              />
              {errors.password && <p className="text-xs text-red-500 mt-2 animate-shake">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={inputClass}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-2 animate-shake">{errors.confirmPassword}</p>}
            </div>
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Đăng ký
              </button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              Đã có tài khoản?{' '}
              <a href="/auth/login" className="text-red-600 hover:text-red-700 font-semibold hover:underline transition-colors duration-200">
                Đăng nhập
              </a>
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Register;