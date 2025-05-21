import React, { useState } from 'react';

interface RegisterFormData {
  fullName: string;
  birthDay: string;
  sex: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  birthDay?: string;
  sex?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    birthDay: '',
    sex: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Gửi data tới backend ở đây
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-50 to-white flex items-center justify-center py-6">
      <div className="relative w-full max-w-6xl">
        <nav className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 text-gray-800">
          <span>Chào mừng đến với BloodHouse</span>
          <div className="space-x-6">
            <a href="/" className="hover:text-red-600">Trang chủ</a>
            <a href="/" className="hover:text-red-600">Liên hệ</a>
          </div>
        </nav>

        <div className="flex bg-white shadow-xl rounded-lg overflow-hidden mt-12">
          <div className="w-1/2 p-4 flex items-center justify-center bg-gray-100">
            <img
              src="https://cdn3.iconfinder.com/data/icons/blood-donation-25/128/blood-drop-medical-donation-256.png"
              alt="Blood Donation"
              className="max-w-full h-auto max-h-[360px] object-contain"
            />
          </div>

          <div className="w-1/2 p-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-red-600">Đăng ký tài khoản</h2>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Họ và Tên *</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-red-500"
                />
                {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="sex" className="text-sm font-medium text-gray-700">Giới Tính *</label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                {errors.sex && <p className="text-sm text-red-600">{errors.sex}</p>}
              </div>

              <div>
                <label htmlFor="birthDay" className="text-sm font-medium text-gray-700">Ngày Sinh *</label>
                <input
                  id="birthDay"
                  type="date"
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-red-500"
                />
                {errors.birthDay && <p className="text-sm text-red-600">{errors.birthDay}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Số Điện Thoại *</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập email"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Mật khẩu *</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập mật khẩu"
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Xác nhận mật khẩu *</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-100 focus:ring-2 focus:ring-red-500"
                  placeholder="Xác nhận mật khẩu"
                />
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Đăng Ký
                </button>
              </div>
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
                onClick={() => console.log('Sign up with Google')}
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google Icon"
                  className="w-5 h-5"
                />
                Đăng ký với Google
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <a href="/auth/login" className="text-red-600 hover:underline">
                Đăng nhập
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

