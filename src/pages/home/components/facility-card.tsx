import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FacilityProps {
  _id: string;
  image?: string;
  name: string;
  address: string;
  avgRating?: number;
}

const FacilityCard = ({
  _id,
  image,
  name,
  address,
  avgRating,
}: FacilityProps) => {
  return (
    <Card className="overflow-hidden card-hover flex flex-col h-full">
      <div className="relative h-40 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300 p-2 rounded-2xl"
        />
      </div>

      <CardHeader className="flex-1 space-y-1 px-4 pt-4 pb-2">
        <CardTitle className="text-base font-semibold line-clamp-1">
          {name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
          {address}
        </CardDescription>
        <CardDescription className="text-sm text-muted-foreground">
          Đánh giá: {avgRating ?? 0}
        </CardDescription>
      </CardHeader>

      <CardFooter className="px-4 pb-4 pt-0 mt-auto">
        <Button variant="link" className="text-primary p-0 h-auto" asChild>
          <Link to={`/facility/${_id}`}>
            Chi tiết <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FacilityCard;
