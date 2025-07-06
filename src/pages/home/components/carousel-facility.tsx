import { Button } from "@/components/ui/button";
import Carousel from "@/components/ui/carousel";
import FacilityCard from "@/pages/home/components/facility-card";
import { getAllFacilities } from "@/services/facility";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CarouselFacility: React.FC<any> = () => {
  const [facilities, setFacilities] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllFacility = async () => {
    setLoading(true);
    try {
      const response = await getAllFacilities();
      if (response.status === 200) {
        setFacilities(response?.data?.result);
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFacility();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (facilities.length === 0)
    return (
      <div className="p-4 text-center text-muted-foreground">
        Không có cơ sở nào được tìm thấy.
      </div>
    );

  return (
    <div className="py-16">
      <div className="container space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-red-600">
              Danh sách cơ sở nổi bật
            </h2>
            <p className="text-muted-foreground mt-2">
              Những cơ sở hỗ trợ hiến máu uy tín và hiệu quả
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/locations">
              Xem tất cả cơ sở <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Carousel
          items={facilities.map((facility: any) => (
            <FacilityCard
              key={facility?._id}
              _id={facility?._id}
              address={facility?.address}
              name={facility?.name}
              image={facility?.mainImage?.url}
              avgRating={facility?.avgRating}
            />
          ))}
        />
      </div>
    </div>
  );
};

export default CarouselFacility;
