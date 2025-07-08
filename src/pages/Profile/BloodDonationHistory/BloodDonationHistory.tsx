import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  History,
  Calendar,
  MapPin,
  Droplet,
  CheckCircle,
  Clock,
  Heart,
  TrendingUp,
  ScanQrCode,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDonationDate, getDonationStatusInfo } from "@/utils/changeText";
import { bloodDonationRegisHistory } from "@/services/bloodDonationRegis";

const BloodDonationHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [donationHistory, setDonationHistory] = useState<any>([]);
  const [metaData, setMetaData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const translateStatus = (status: string) => {
    const translate = {
      pending_approval: "Chờ duyệt",
      rejected_registration: "Từ chối đăng ký",
      registered: "Đã đăng ký",
      checked_in: "Đã điểm danh",
      in_consult: "Đang tư vấn",
      rejected: "Bị từ chối",
      waiting_donation: "Chờ hiến máu",
      donating: "Đang hiến máu",
      donated: "Đã hiến máu",
      resting: "Nghỉ ngời",
      post_rest_check: "Kiểm tra sau nghỉ ngơi",
      completed: "Hoàn tất",
      cancelled: "Đã hủy",
    };

    return translate[status];
  };

  const fetchDonationHistory = async () => {
    setLoading(true);
    try {
      const response = await bloodDonationRegisHistory();

      if (response.status === 200) {
        console.log(response.message);
        setDonationHistory(response.data.data);
        const meta = response.metadata;
        setLimit(meta.limit);
        setTotalItems(meta.total);
        setTotalPages(meta.totalPages);
        setCurrentPage(meta.page);
      }
    } catch (error) {
      console.error("Error fetching donation history:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    fetchDonationHistory();
  }, [currentPage]);

  const completedDonations = donationHistory.filter(
    (item: any) => item.status === "COMPLETED"
  );
  const totalVolume = completedDonations.reduce((sum, item) => {
    const volume = parseInt(item.volume.replace("ml", "")) || 0;
    return sum + volume;
  }, 0);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-3 rounded-full">
              <History className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                Lịch sử hiến máu
              </h1>
              <p className="text-muted-foreground">
                Theo dõi hành trình hiến máu của bạn
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar activeTab="history" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Statistics Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-accent p-4 rounded-full">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tổng lần hiến
                    </p>
                    <p className="text-2xl font-bold">
                      {completedDonations.length}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-accent p-4 rounded-full">
                    <Droplet className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tổng lượng máu
                    </p>
                    <p className="text-2xl font-bold">{totalVolume}ml</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-accent p-4 rounded-full">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Mạng sống cứu
                    </p>
                    <p className="text-2xl font-bold">
                      {completedDonations.length * 3}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div> */}

            {/* History Table Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Danh sách lần hiến máu
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-accent">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Ngày hiến
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Địa điểm
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Trạng thái
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Droplet className="h-4 w-4" />
                            Lượng máu
                          </div>
                        </th>
                        <th className="text-left py-4 px-6 font-medium text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <ScanQrCode className="h-4 w-4" />
                            Mã
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {donationHistory.map((item: any) => {
                        return (
                          <tr
                            key={item._id}
                            onClick={() =>
                              navigate(`/donation-history/${item._id}`)
                            }
                            className="cursor-pointer"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {formatDonationDate(item.preferredDate)}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <p className="font-medium">
                                  {item.facilityId.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {item.facilityId.address}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <Badge variant="outline" className="font-medium">
                                {translateStatus(item.status)}
                              </Badge>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Droplet
                                  className={`h-4 w-4 ${
                                    item.status === "COMPLETED"
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  }`}
                                />
                                <span
                                  className={`font-medium ${
                                    item.status === "COMPLETED"
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {item.expectedQuantity} ml
                                </span>
                                {item.bloodGroupId && (
                                  <Badge variant="outline" className="ml-2">
                                    {item.bloodGroupId.name}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                {item.code}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t bg-accent/50">
                  {/* <div className="text-sm text-muted-foreground">
                    Hiển thị {(currentPage - 1) * limit + 1} đến{" "}
                    {Math.min(currentPage * limit, totalItems)} trong số{" "}
                    {totalItems} lần hiến máu
                  </div> */}
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={`cursor-pointer transition-colors ${
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                                className={`cursor-pointer transition-colors ${
                                  currentPage === page
                                    ? "bg-primary text-primary-foreground"
                                    : ""
                                }`}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </React.Fragment>
                        ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={`cursor-pointer transition-colors ${
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodDonationHistory;
