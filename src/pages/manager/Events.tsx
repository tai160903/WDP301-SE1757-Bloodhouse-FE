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

// Fix Leaflet default marker icon issue
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
    title: "Community Blood Drive",
    description: "Join us for our monthly community blood drive event",
    status: "DRAFT",
    startTime: "2024-03-15T09:00",
    endTime: "2024-03-15T17:00",
    address: "123 Main St, City",
    expectedParticipants: 100,
    registeredParticipants: 45,
    contactPhone: "(555) 123-4567",
    contactEmail: "blooddrive@example.com",
    isPublic: true,
  },
];

// Default center coordinates (Ho Chi Minh City)
const defaultCenter = {
  lat: 10.8231,
  lng: 106.6297,
};

// Map click handler component
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

// Add MapUpdater component to handle map updates
function MapUpdater({ center }: { center: L.LatLng }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [map, center]);

  return null;
}

// Add type for Nominatim response
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

  // Watch start and end time values
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
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
            "User-Agent": "BloodHouse_App/1.0",
          },
        }
      );

      if (response.data && response.data[0]) {
        const { lat, lon } = response.data[0];
        setSelectedLocation(L.latLng(parseFloat(lat), parseFloat(lon)));
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle image preview
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

  // Get current date-time in ISO format for min attribute
  const getCurrentDateTime = () => {
    const now = new Date();
    return format(now, "yyyy-MM-dd'T'HH:mm");
  };

  // Reset form and preview
  const resetForm = () => {
    reset();
    setSelectedLocation(null);
    setAddress("");
    setImagePreview(null);
  };

  const onSubmit = async (data: EventFormData) => {
    if (!selectedLocation) {
      toast.error("Please select a location on the map");
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
        toast.success("Event draft created successfully");
      }

      setIsAddDialogOpen(false);
      reset();
      setSelectedLocation(null);
      setAddress("");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event draft");
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
          <h1 className="text-3xl font-bold tracking-tight">
            Events Management
          </h1>
          <p className="text-muted-foreground">
            Create and manage blood donation events
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
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Create New Blood Donation Event</DialogTitle>
                <DialogDescription>
                  Create a new blood donation event and set its location
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    {...register("title", { required: "Title is required" })}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter event description..."
                    {...register("description", {
                      required: "Description is required",
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
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      min={getCurrentDateTime()}
                      {...register("startTime", {
                        required: "Start time is required",
                        validate: (value) => {
                          const now = new Date();
                          const selectedDate = new Date(value);
                          return selectedDate > now || "Start time must be in the future";
                        }
                      })}
                    />
                    {errors.startTime && (
                      <p className="text-sm text-red-500">
                        {errors.startTime.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      min={startTime || getCurrentDateTime()}
                      {...register("endTime", {
                        required: "End time is required",
                        validate: (value) => {
                          if (!startTime) return true;
                          const endDate = new Date(value);
                          const startDate = new Date(startTime);
                          return endDate > startDate || "End time must be after start time";
                        }
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
                  <Label htmlFor="file">Banner Image</Label>
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
                        alt="Preview"
                        className="max-h-40 rounded-md object-contain"
                      />
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="address"
                      placeholder="Enter event address"
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
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Location Map</Label>
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
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="Enter contact phone"
                      {...register("contactPhone", {
                        required: "Contact phone is required",
                      })}
                    />
                    {errors.contactPhone && (
                      <p className="text-sm text-red-500">
                        {errors.contactPhone.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="Enter contact email"
                      {...register("contactEmail", {
                        required: "Contact email is required",
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
                      Expected Participants
                    </Label>
                    <Input
                      id="expectedParticipants"
                      type="number"
                      min="1"
                      {...register("expectedParticipants", {
                        required: "Expected participants is required",
                        min: { value: 1, message: "Must be at least 1" },
                      })}
                    />
                    {errors.expectedParticipants && (
                      <p className="text-sm text-red-500">
                        {errors.expectedParticipants.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="isPublic">Visibility</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("isPublic", value === "true")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Public</SelectItem>
                        <SelectItem value="false">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rest of the component remains the same */}
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">92%</div>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blood Donation Events</CardTitle>
          <CardDescription>
            Manage upcoming and past blood donation events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Details</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Contact: {event.contactPhone}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
