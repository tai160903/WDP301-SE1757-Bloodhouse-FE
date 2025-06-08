"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Building2,
  MapPin,
  Activity,
  Warehouse,
  Phone,
  Clock,
  Users,
} from "lucide-react";
import {
  deleteFacility,
  getFacilities,
  getFacilityById,
} from "@/services/location/facility";
import { getBloodInventory } from "@/services/bloodinventory";
import { getTotalStaff } from "@/services/facilityStaff";
import CreateFacilityModal from "@/components/facilities/CreateFacilityModal";
import { toast } from "sonner";

interface Facility {
  _id: string;
  name: string;
  code?: string;
  address?: string;
  contactPhone: string;
  contactEmail?: string;
  isActive: boolean;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  managerId?: string;
  doctorIds?: string[];
  nurseIds?: string[];
  imageUrl?: string;
  schedules: {
    day: string;
    openTime: string;
    closeTime: string;
  }[];
}

interface BloodInventory {
  _id: string;
  facilityId: {
    _id: string;
    name: string;
    address: string;
    code: string;
  };
  componentId: {
    _id: string;
    name: string;
  };
  groupId: {
    _id: string;
    name: string;
  };
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
}

function FacilityManagement() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [bloodInventory, setBloodInventory] = useState<BloodInventory[]>([]);
  const [totalStaff, setTotalStaff] = useState<number>(0);
  const [staffCounts, setStaffCounts] = useState<Record<string, number>>({});

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null
  );

  useEffect(() => {
    fetchFacilities();
    fetchBloodInventory();
  }, []);

  useEffect(() => {
    const fetchStaffCounts = async () => {
      const facilityIds = facilities.map((f) => f._id);
      try {
        const staffData = await Promise.all(
          facilityIds.map(async (facilityId) => {
            const res = await getTotalStaff(facilityId);
            return { facilityId, total: res.data.total };
          })
        );
        const counts: Record<string, number> = {};
        staffData.forEach(({ facilityId, total }) => {
          counts[facilityId] = total;
        });
        setStaffCounts(counts);
        setTotalStaff(
          Object.values(counts).reduce((sum, count) => sum + count, 0)
        );
      } catch (error) {
        console.error("Error fetching total staff:", error);
      }
    };
    if (facilities.length > 0) {
      fetchStaffCounts();
    }
  }, [facilities]);

  const fetchFacilities = async () => {
    try {
      const response = await getFacilities();
      setFacilities(response?.data?.result || []);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  const fetchBloodInventory = async () => {
    try {
      const response = await getBloodInventory();
      setBloodInventory(response?.data || []);
    } catch (error) {
      console.error("Error fetching blood inventory:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleEditFacility = async (facilityId: string) => {
    try {
      const response = await getFacilityById(facilityId);
      if (response?.data) {
        const facilityData = {
          ...response.data,
          location: response.data.location ?? {
            type: "Point",
            coordinates: [0, 0],
          },
        };
        setSelectedFacility(facilityData);
        setIsCreateModalOpen(true);
      } else {
        console.error("Facility not found");
      }
    } catch (error) {
      console.error("Error fetching facility details:", error);
    }
  };

  // Fix the delete functionality and other issues
  const handleDeleteFacility = async (facilityId: string) => {
    try {
      // Get confirmation from user
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this facility? This action cannot be undone."
      );
      if (!confirmDelete) return;

      // Delete the facility
      await deleteFacility(facilityId);
      toast.success("Facility deleted successfully");
      fetchFacilities(); // Refresh the list
    } catch (error) {
      console.error("Error deleting facility:", error);
      toast.error("Failed to delete facility. Please try again.");
    }
  };

  const filteredFacilities = facilities.filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (facility.address &&
        facility.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      facility.contactPhone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-full">
              <Building2 className="h-8 w-8 text-slate-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Facility Management
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor and manage blood donation facilities
              </p>
            </div>
          </div>
          <Button
            className="bg-slate-600 hover:bg-slate-700 text-white shadow-lg"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Facility
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-slate-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Facilities
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {facilities.length}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-slate-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Facilities
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {facilities.filter((facility) => facility.isActive).length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Capacity
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bloodInventory
                      .reduce((total, item) => total + item.totalQuantity, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">units</p>
                </div>
                <Warehouse className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Staff
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalStaff.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0 py-0">
          <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2 py-4">
              <Building2 className="h-5 w-5" />
              Facility Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search facilities by name, location, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-slate-300"
              />
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Facility Information
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Location & Contact
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Operations
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFacilities.length > 0 &&
                    filteredFacilities.map((facility) => (
                      <TableRow
                        key={facility._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {facility.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span>{facility.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              <span>{facility.contactPhone}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-3 w-3" />
                              <span>
                                {facility.schedules &&
                                facility.schedules.length > 0
                                  ? `${facility.schedules[0].openTime} - ${facility.schedules[0].closeTime}`
                                  : "No schedule"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="h-3 w-3" />
                              <span>
                                {staffCounts[facility._id] ?? 0}{" "}
                                {(staffCounts[facility._id] ?? 0) === 1
                                  ? "staff member"
                                  : "staff members"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`font-medium ${getStatusColor(
                              facility.isActive ? "Active" : "Inactive"
                            )}`}
                          >
                            {facility.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50 hover:border-blue-300"
                              onClick={() => handleEditFacility(facility._id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-red-50 hover:border-red-300 text-red-600"
                              onClick={() => handleDeleteFacility(facility._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {filteredFacilities.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No facilities found
                </h3>
                <p className="text-gray-500">
                  No facilities match your search criteria. Try adjusting your
                  search terms.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <CreateFacilityModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedFacility(null);
          }}
          onSuccess={fetchFacilities}
          initialData={selectedFacility}
        />
      </div>
    </div>
  );
}

export default FacilityManagement;
