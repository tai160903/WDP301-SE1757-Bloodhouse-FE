import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white">
      <div className="text-center p-8 max-w-lg">
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-red-600 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Không Tìm Thấy Trang</h1>
        <p className="text-lg text-gray-600 mb-6">
          Có vẻ như trang bạn đang tìm kiếm đã "hiến" vị trí của mình cho nơi khác! Hãy thử kiểm tra lại
          đường dẫn hoặc quay về trang chính để tiếp tục hành trình sẻ chia yêu thương.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition duration-300"
        >
          Quay Về Trang Chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
