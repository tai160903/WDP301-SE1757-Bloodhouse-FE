
const BloodDonationHistory : React.FC = () => {
  
  const mockHistory = [
    {
      date: "20/01/2024",
      location: "Bệnh viện Huyết học TP.HCM",
      status: "Hoàn thành",
      volume: "350ml",
    },
    {
      date: "15/08/2023",
      location: "Trường ĐH Bách Khoa",
      status: "Hoàn thành",
      volume: "450ml",
    },
    {
      date: "01/03/2023",
      location: "Nhà văn hóa Thanh Niên",
      status: "Đã hủy",
      volume: "-",
    },
  ];
  
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto shadow">
        <h2 className="text-2xl font-semibold mb-6">Lịch sử đăng ký hiến máu</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border-b">Ngày đăng ký</th>
                <th className="px-4 py-2 text-left border-b">Địa điểm</th>
                <th className="px-4 py-2 text-left border-b">Trạng thái</th>
                <th className="px-4 py-2 text-left border-b">Lượng máu</th>
              </tr>
            </thead>
            <tbody>
              {mockHistory.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{item.date}</td>
                  <td className="px-4 py-3 border-b">{item.location}</td>
                  <td className="px-4 py-3 border-b">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        item.status === "Hoàn thành"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b">{item.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BloodDonationHistory