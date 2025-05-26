"use client";

import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
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
  Thermometer,
} from "lucide-react";

function FacilityManagement() {
  // Enhanced mock data for blood donation facilities
  const [facilities, setFacilities] = useState([
    {
      id: 1,
      name: "Central Blood Bank",
      address: "123 Main St, New York, NY 10001",
      capacity: 5000,
      currentStock: 4200,
      status: "Active",
      type: "Blood Bank",
      phone: "(555) 123-4567",
      operatingHours: "24/7",
      lastInspection: "2024-01-15",
      staffCount: 25,
      temperature: "-2°C",
    },
    {
      id: 2,
      name: "East District Donation Center",
      address: "456 Park Ave, Boston, MA 02101",
      capacity: 3000,
      currentStock: 2100,
      status: "Active",
      type: "Collection Center",
      phone: "(555) 234-5678",
      operatingHours: "8AM - 8PM",
      lastInspection: "2024-02-20",
      staffCount: 15,
      temperature: "22°C",
    },
    {
      id: 3,
      name: "West Wing Collection Center",
      address: "789 Lake Dr, Chicago, IL 60601",
      capacity: 2500,
      currentStock: 800,
      status: "Maintenance",
      type: "Collection Center",
      phone: "(555) 345-6789",
      operatingHours: "Closed",
      lastInspection: "2024-03-10",
      staffCount: 12,
      temperature: "N/A",
    },
    {
      id: 4,
      name: "South Storage Facility",
      address: "321 Ocean Blvd, Miami, FL 33101",
      capacity: 4000,
      currentStock: 3800,
      status: "Active",
      type: "Storage Facility",
      phone: "(555) 456-7890",
      operatingHours: "24/7",
      lastInspection: "2024-01-28",
      staffCount: 18,
      temperature: "-4°C",
    },
    {
      id: 5,
      name: "Mobile Collection Unit Alpha",
      address: "Various Locations",
      capacity: 200,
      currentStock: 150,
      status: "Active",
      type: "Mobile Unit",
      phone: "(555) 567-8901",
      operatingHours: "9AM - 5PM",
      lastInspection: "2024-03-05",
      staffCount: 6,
      temperature: "4°C",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredFacilities = facilities.filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Blood Bank":
        return "bg-red-100 text-red-800 border-red-200";
      case "Collection Center":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Storage Facility":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Mobile Unit":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCapacityPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const totalCapacity = facilities.reduce(
    (sum, facility) => sum + facility.capacity,
    0
  );
  const totalStock = facilities.reduce(
    (sum, facility) => sum + facility.currentStock,
    0
  );
  const activeFacilities = facilities.filter(
    (f) => f.status === "Active"
  ).length;
  const totalStaff = facilities.reduce(
    (sum, facility) => sum + facility.staffCount,
    0
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
          <Button className="bg-slate-600 hover:bg-slate-700 text-white shadow-lg">
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
                    {activeFacilities}
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
                    {totalCapacity.toLocaleString()}
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
                    {totalStaff}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Capacity Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5" />
              Overall Capacity Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Stock: {totalStock.toLocaleString()} units</span>
                <span>
                  Total Capacity: {totalCapacity.toLocaleString()} units
                </span>
              </div>
              <Progress
                value={getCapacityPercentage(totalStock, totalCapacity)}
                className="h-3"
              />
              <p className="text-sm text-gray-600">
                {getCapacityPercentage(totalStock, totalCapacity)}% capacity
                utilized across all facilities
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
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
                placeholder="Search facilities by name, location, or type..."
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
                      Capacity & Stock
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
                  {filteredFacilities.map((facility) => (
                    <TableRow
                      key={facility.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {facility.name}
                          </div>
                          <Badge
                            variant="outline"
                            className={`mt-1 text-xs ${getTypeColor(
                              facility.type
                            )}`}
                          >
                            {facility.type}
                          </Badge>
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
                            <span>{facility.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">
                              {facility.currentStock.toLocaleString()}
                            </span>
                            <span className="text-gray-500">
                              {" "}
                              / {facility.capacity.toLocaleString()} units
                            </span>
                          </div>
                          <Progress
                            value={getCapacityPercentage(
                              facility.currentStock,
                              facility.capacity
                            )}
                            className="h-2"
                          />
                          <div className="text-xs text-gray-500">
                            {getCapacityPercentage(
                              facility.currentStock,
                              facility.capacity
                            )}
                            % utilized
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-3 w-3" />
                            <span>{facility.operatingHours}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-3 w-3" />
                            <span>{facility.staffCount} staff</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Thermometer className="h-3 w-3" />
                            <span>{facility.temperature}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-medium ${getStatusColor(
                            facility.status
                          )}`}
                        >
                          {facility.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 hover:border-red-300 text-red-600"
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
      </div>
    </div>
  );
}

export default FacilityManagement;
