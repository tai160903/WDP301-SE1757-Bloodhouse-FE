import { getAllFacilities } from "@/services/facility";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Facility: React.FC = () => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await getAllFacilities();
        if (response.status === 200) {
          setFacilities(response.data.result);
        }
        // setTotalPages(response.data.totalPages);
        setTotalItems(response.data.total);
      } catch (err) {
        console.error("Lỗi khi load blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 container mx-auto">
      {facilities.map((facility) => (
        <div
          key={facility._id}
          className="bg-white rounded shadow hover:shadow-lg transition duration-300"
        >
          <Link to={`/facility/${facility._id}`}>
            <img
              src={facility.mainImage.url}
              alt={facility.name}
              className="w-full h-48 object-cover rounded-t"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">
                {facility.name}
              </h2>
              <p className="text-gray-700 text-sm line-clamp-3">
                {facility.address}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Đánh giá: {facility.avgRating}
              </p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Facility;
