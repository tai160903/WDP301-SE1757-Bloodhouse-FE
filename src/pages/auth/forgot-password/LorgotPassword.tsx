import React, { useState } from 'react';
import { forgotPassword } from '@/services/auth';

interface ForgotPasswordFormData {
  email: string;
}

interface FormErrors extends Partial<Record<keyof ForgotPasswordFormData, string>> {}

const inputClass =
  'w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm';

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.email) newErrors.email = 'Email là bắt buộc';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Định dạng email không hợp lệ';
    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors({});
    setMessage(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await forgotPassword(formData.email);
      setMessage('✅ Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!');
      setErrorMsg(null);
    } catch (error: any) {
      setErrorMsg(error.message || '❌ Gửi yêu cầu thất bại');
      setMessage(null);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
      <nav className="w-full max-w-2xl flex justify-between items-center mb-4 px-4 text-gray-800 hover:text-red-600">
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

      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center text-red-600 mb-4">Quên mật khẩu</h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>
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

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-1.5 rounded-md font-semibold hover:bg-red-700 transition text-sm"
            >
              Gửi liên kết
            </button>
          </div>

          {message && (
            <div className="mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm text-center font-medium">
              {message}
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm text-center font-medium">
              {errorMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
