import React, { useState } from 'react';
import { resetPassword } from '@/services/users/index'; // hàm bạn đã viết
import { useLocation , useNavigate} from 'react-router-dom';
const inputClass =
  'w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const token = queryParams.get('token');
const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, newPassword); 
      setSuccess('✅ Đặt lại mật khẩu thành công!');
      setNewPassword('');
      setConfirmPassword('');
        navigate('/auth/login');
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center text-red-600 mb-4">Đặt lại mật khẩu</h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          Vui lòng nhập mật khẩu mới bên dưới để thay đổi.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition text-sm"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận đặt lại mật khẩu'}
          </button>

          {error && <p className="text-sm text-red-600 text-center mt-2">{error}</p>}
          {success && <p className="text-sm text-green-600 text-center mt-2">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
