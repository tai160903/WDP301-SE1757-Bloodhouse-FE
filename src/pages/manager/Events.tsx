import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Eye, MapPin, Calendar, Users } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createEvent, getAllEventsByFacilityId } from "@/services/event";
import useAuth from "@/hooks/useAuth";
import { format } from "date-fns";

// Sửa lỗi biểu tượng mặc định của Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const sampleEvents = [
  {
    id: 1,
    title: "Ngày Hiến Máu Cộng Đồng",
    description: "Tham gia sự kiện hiến máu cộng đồng hàng tháng của chúng tôi",
    status: "BẢN NHÁP",
    startTime: "2024-03-15T09:00",
    endTime: "2024-03-15T17:00",
    address: "123 Đường Chính, Thành phố",
    expectedParticipants: 100,
    registeredParticipants: 45,
    contactPhone: "(555) 123-4567",
    contactEmail: "hienmau@example.com",
    isPublic: true,
  },
];

// Tọa độ trung tâm mặc định (Thành phố Hồ Chí Minh)
const defaultCenter = {
  lat: 10.8231,
  lng: 106.6297,
};

// Thành phần xử lý nhấp chuột trên bản đồ
function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (latlng: L.LatLng) => void;
}) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

// Thêm thành phần MapUpdater để xử lý cập nhật bản đồ
function MapUpdater({ center }: { center: L.LatLng }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [map, center]);

  return null;
}

// Thêm kiểu cho phản hồi Nominatim
interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

interface EventFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  expectedParticipants: number;
  isPublic: boolean;
  file?: FileList;
}

export default function Events() {
  const { userFacilityId } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<L.LatLng | null>(
    null
  );
  const [address, setAddress] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<EventFormData>();

  // Theo dõi giá trị thời gian bắt đầu và kết thúc
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ĐÃ ĐĂNG":
        return "bg-green-100 text-green-800";
      case "BẢN NHÁP":
        return "bg-yellow-100 text-yellow-800";
      case "ĐÃ HỦY":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleLocationSelect = (latlng: L.LatLng) => {
    setSelectedLocation(latlng);
  };

  const handleAddressSearch = async () => {
    if (!address.trim()) return;

    setIsSearching(true);
    try {
      const response = await axios.get<NominatimResponse[]>(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: address,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "Ứng_dụng_BloodHouse/1.0",
          },
        }
      );

      if (response.data && response.data[0]) {
        const { lat, lon } = response.data[0];
        setSelectedLocation(L.latLng(parseFloat(lat), parseFloat(lon)));
      }
    } catch (error) {
      console.error("Lỗi khi mã hóa địa chỉ:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Xử lý xem trước hình ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Lấy ngày giờ hiện tại theo định dạng ISO cho thuộc tính min
  const getCurrentDateTime = () => {
    const now = new Date();
    return format(now, "yyyy-MM-dd'T'HH:mm");
  };

  // Đặt lại biểu mẫu và xem trước
  const resetForm = () => {
    reset();
    setSelectedLocation(null);
    setAddress("");
    setImagePreview(null);
  };

  const onSubmit = async (data: EventFormData) => {
    if (!selectedLocation) {
      toast.error("Vui lòng chọn một vị trí trên bản đồ");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("startTime", data.startTime);
      formData.append("endTime", data.endTime);
      formData.append("address", data.address);
      formData.append("latitude", selectedLocation.lat.toString());
      formData.append("longitude", selectedLocation.lng.toString());
      formData.append("contactPhone", data.contactPhone);
      formData.append("contactEmail", data.contactEmail);
      formData.append(
        "expectedParticipants",
        data.expectedParticipants.toString()
      );
      formData.append("isPublic", data.isPublic.toString());
      formData.append("facilityId", userFacilityId || "");

      if (data.file?.[0]) {
        formData.append("file", data.file[0]);
      }

      const response = await createEvent(formData);

      if (response.status === 201) {
        toast.success("Bản nháp sự kiện đã được tạo thành công");
      }

      setIsAddDialogOpen(false);
      reset();
      setSelectedLocation(null);
      setAddress("");
    } catch (error) {
      console.error("Lỗi khi tạo sự kiện:", error);
      toast.error("Không thể tạo bản nháp sự kiện");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (address) {
      setValue("address", address);
    }
  }, [address, setValue]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userFacilityId) return;
      const response = await getAllEventsByFacilityId(userFacilityId);
      setEvents(response.data);
    };
    fetchEvents();
  }, [userFacilityId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản Lý Sự Kiện</h1>
          <p className="text-muted-foreground">
            Tạo và quản lý các sự kiện hiến máu
          </p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              resetForm();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Sự Kiện Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Tạo Sự Kiện Hiến Máu Mới</DialogTitle>
                <DialogDescription>
                  Tạo một sự kiện hiến máu mới và thiết lập vị trí của nó
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Tiêu Đề Sự Kiện</Label>
                  <Input
                    id="title"
                    placeholder="Nhập tiêu đề sự kiện"
                    {...register("title", { required: "Tiêu đề là bắt buộc" })}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Mô Tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Nhập mô tả sự kiện..."
                    {...register("description", {
                      required: "Mô tả là bắt buộc",
                    })}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Thời Gian Bắt Đầu</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      min={getCurrentDateTime()}
                      {...register("startTime", {
                        required: "Thời gian bắt đầu là bắt buộc",
                        validate: (value) => {
                          const now = new Date();
                          const selectedDate = new Date(value);
                          return (
                            selectedDate > now ||
                            "Thời gian bắt đầu phải ở tương lai"
                          );
                        },
                      })}
                    />
                    {errors.startTime && (
                      <p className="text-sm text-red-500">
                        {errors.startTime.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">Thời Gian Kết Thúc</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      min={startTime || getCurrentDateTime()}
                      {...register("endTime", {
                        required: "Thời gian kết thúc là bắt buộc",
                        validate: (value) => {
                          if (!startTime) return true;
                          const endDate = new Date(value);
                          const startDate = new Date(startTime);
                          return (
                            endDate > startDate ||
                            "Thời gian kết thúc phải sau thời gian bắt đầu"
                          );
                        },
                      })}
                    />
                    {errors.endTime && (
                      <p className="text-sm text-red-500">
                        {errors.endTime.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="file">Hình Ảnh Banner</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    {...register("file")}
                    onChange={(e) => {
                      register("file").onChange(e);
                      handleImageChange(e);
                    }}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Xem trước"
                        className="max-h-40 rounded-md object-contain"
                      />
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Địa Chỉ</Label>
                  <div className="flex gap-2">
                    <Input
                      id="address"
                      placeholder="Nhập địa chỉ sự kiện"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddressSearch()
                      }
                    />
                    <Button
                      type="button"
                      onClick={handleAddressSearch}
                      disabled={isSearching}
                    >
                      {isSearching ? "Đang tìm kiếm..." : "Tìm kiếm"}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Bản Đồ Vị Trí</Label>
                  <div
                    className="border rounded-md overflow-hidden"
                    style={{ height: "400px" }}
                  >
                    <MapContainer
                      center={
                        selectedLocation
                          ? [selectedLocation.lat, selectedLocation.lng]
                          : [defaultCenter.lat, defaultCenter.lng]
                      }
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationMarker onLocationSelect={handleLocationSelect} />
                      {selectedLocation && (
                        <>
                          <Marker position={selectedLocation} />
                          <MapUpdater center={selectedLocation} />
                        </>
                      )}
                    </MapContainer>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contactPhone">Số Điện Thoại Liên Hệ</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="Nhập số điện thoại liên hệ"
                      {...register("contactPhone", {
                        required: "Số điện thoại liên hệ là bắt buộc",
                      })}
                    />
                    {errors.contactPhone && (
                      <p className="text-sm text-red-500">
                        {errors.contactPhone.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactEmail">Email Liên Hệ</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="Nhập email liên hệ"
                      {...register("contactEmail", {
                        required: "Email liên hệ là bắt buộc",
                      })}
                    />
                    {errors.contactEmail && (
                      <p className="text-sm text-red-500">
                        {errors.contactEmail.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expectedParticipants">
                      Số Người Tham Gia Dự Kiến
                    </Label>
                    <Input
                      id="expectedParticipants"
                      type="number"
                      min="1"
                      {...register("expectedParticipants", {
                        required: "Số người tham gia dự kiến là bắt buộc",
                        min: { value: 1, message: "Phải ít nhất là 1" },
                      })}
                    />
                    {errors.expectedParticipants && (
                      <p className="text-sm text-red-500">
                        {errors.expectedParticipants.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="isPublic">Tính Công Khai</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("isPublic", value === "true")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tính công khai" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Công khai</SelectItem>
                        <SelectItem value="false">Riêng tư</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Đang tạo..." : "Tạo Sự Kiện"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bảng Sự Kiện */}
      <Card>
        <CardHeader>
          <CardTitle>Các Sự Kiện Hiến Máu</CardTitle>
          <CardDescription>
            Quản lý các sự kiện hiến máu sắp tới và đã qua
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chi Tiết Sự Kiện</TableHead>
                <TableHead>Ngày & Giờ</TableHead>
                <TableHead>Vị Trí</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Người Tham Gia</TableHead>
                <TableHead className="text-right">Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length > 0 ? (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Liên hệ: {event.contactPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(event.startTime), "dd/MM/yyyy")}
                        <br />
                        {format(new Date(event.startTime), "HH:mm")} -
                        {format(new Date(event.endTime), "HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {event.registeredParticipants || 0}/
                        {event.expectedParticipants}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <Calendar className="w-12 h-12 text-gray-400" />
                      <p className="text-lg font-medium text-gray-500">
                        Không có sự kiện
                      </p>
                      <p className="text-sm text-gray-400">
                        Chưa có sự kiện nào được tạo. Hãy tạo sự kiện đầu tiên!
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
