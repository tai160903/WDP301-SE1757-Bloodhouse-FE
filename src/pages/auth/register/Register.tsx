import { register } from '@/services/auth';
import React, { useState } from 'react';

interface RegisterFormData {
  fullName: string;
  birthDay: string;
  sex: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  street: string;
  city: string;
  country: string;
  idCard: string;
}

interface FormErrors extends Partial<Record<keyof RegisterFormData, string>> {}

const inputClass =
  'w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    birthDay: '',
    sex: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    street: '',
    city: '',
    country: '',
    idCard: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Họ và tên là bắt buộc';
    if (!formData.birthDay) newErrors.birthDay = 'Ngày sinh là bắt buộc';
    if (!formData.sex) newErrors.sex = 'Giới tính là bắt buộc';
    if (!formData.phone) newErrors.phone = 'Số điện thoại là bắt buộc';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại phải có 10 chữ số';
    if (!formData.email) newErrors.email = 'Email là bắt buộc';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Định dạng email không hợp lệ';
    if (!formData.password) newErrors.password = 'Mật khẩu là bắt buộc';
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    if (!formData.street) newErrors.street = 'Địa chỉ là bắt buộc';
    if (!formData.city) newErrors.city = 'Thành phố là bắt buộc';
    if (!formData.country) newErrors.country = 'Quốc gia là bắt buộc';
    if (!formData.idCard) newErrors.idCard = 'CMND/CCCD là bắt buộc';
    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length === 0) {
    try {
      const response = await register(formData);
      console.log('Đăng ký thành công:', response);
      window.location.href = "/auth/login";
    } catch (error: any) {
      setErrors({ password: error.message || 'Đăng ký thất bại' });
    }
  } else {
    setErrors(validationErrors);
  }
};


  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-start px-4 py-10">
      <nav className="w-full max-w-6xl flex justify-between items-center mb-6 px-4 text-gray-800 hover:text-red-600">
        <span className="font-semibold text-lg">Chào mừng đến với BloodHouse</span>
        <div className="space-x-6">
          <a href="/" className="text-gray-800 hover:text-red-600 transition-colors duration-200">
            Trang chủ
          </a>
          <a href="/" className="text-gray-800 hover:text-red-600 transition-colors duration-200">
            Liên hệ
          </a>
        </div>
      </nav>

      <div className="w-full max-w-6xl bg-white shadow-md rounded-xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-6">
          <img
            src="https://cdn3.iconfinder.com/data/icons/blood-donation-25/128/blood-drop-medical-donation-256.png"
            alt="Blood Donation"
            className="max-w-[280px]"
          />
        </div>
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-semibold text-center text-red-600 mb-6">Đăng ký tài khoản</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label>Họ và tên *</label>
              <input
                type="text"
                name="fullName"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleInputChange}
                className={inputClass}
              />
              {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Birthday and Sex */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label>Ngày sinh *</label>
                <input
                  type="date"
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.birthDay && <p className="text-sm text-red-500 mt-1">{errors.birthDay}</p>}
              </div>
              <div className="flex-1">
                <label>Giới tính *</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
                {errors.sex && <p className="text-sm text-red-500 mt-1">{errors.sex}</p>}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="0987654321"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div className="flex-1">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="abc@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Password */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label>Mật khẩu *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div className="flex-1">
                <label>Xác nhận mật khẩu *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div>
              <label>CMND/CCCD *</label>
              <input
                type="text"
                name="idCard"
                placeholder="0123456789"
                value={formData.idCard}
                onChange={handleInputChange}
                className={inputClass}
              />
              {errors.idCard && <p className="text-sm text-red-500 mt-1">{errors.idCard}</p>}
            </div>

            <div>
              <label>Địa chỉ *</label>
              <input
                type="text"
                name="street"
                placeholder="Số nhà, đường..."
                value={formData.street}
                onChange={handleInputChange}
                className={inputClass}
              />
              {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street}</p>}
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label>Thành phố *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div className="flex-1">
                <label>Quốc gia *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition"
              >
                Đăng ký
              </button>
            </div>

            {/* Google Login */}
            <div className="pt-4">
              <div className="text-center text-gray-500">HOẶC</div>
              <button
                type="button"
                onClick={() => console.log('Google Signup')}
                className="mt-3 w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 hover:bg-gray-100"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                Đăng ký với Google
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
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
