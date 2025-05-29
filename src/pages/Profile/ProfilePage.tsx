import { getUserProfile, userProfiles } from "@/services/users";
import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
// import avatarImage from "../../assets/img/hero-photo.png";

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<userProfiles>();
  const [loading, setLoading] = useState(true);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        console.log(res.data);
        setProfile(res);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen p-4 bg-white-100">
      <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Thông tin cá nhân</h2>
          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <MdEdit />
            Chỉnh sửa
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <img
              src={profile?.data.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover mb-4 border"
            />
            <p className="text-gray-600">tuanminh123</p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Họ và tên</p>
              <p className="font-medium">Minh Tuấn</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{profile?.data.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Giới tính</p>
              <p className="font-medium">Nam</p>
            </div>
            <div>
              <p className="text-gray-500">Ngày sinh</p>
              <p className="font-medium">30 tháng 10, 2002</p>
            </div>
            <div>
              <p className="text-gray-500">Điểm tích lũy</p>
              <p className="font-medium">120 điểm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chỉ là placeholder nếu muốn mở */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa thông tin</h3>
            <p className="text-gray-500">Modal chỉnh sửa sẽ hiển thị ở đây.</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
