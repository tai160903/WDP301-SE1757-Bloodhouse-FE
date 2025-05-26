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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Users,
  MapPin,
  Mail,
  Phone,
  UserCheck,
  Building2,
  Stethoscope,
  Calendar,
} from "lucide-react";

function StaffManagement() {
  // Mock data for blood donation staff
  const [staffs, setStaffs] = useState([
    {
      id: 1,
      name: "Dr. James Wilson",
      position: "Medical Director",
      facility: "Central Blood Bank",
      email: "james.wilson@bloodhouse.org",
      phone: "(555) 123-4567",
      joinDate: "2018-03-12",
      status: "Active",
      department: "Medical",
      experience: "15 years",
    },
    {
      id: 2,
      name: "Dr. Maria Rodriguez",
      position: "Senior Phlebotomist",
      facility: "East District Donation Center",
      email: "maria.r@bloodhouse.org",
      phone: "(555) 234-5678",
      joinDate: "2019-05-20",
      status: "Active",
      department: "Collection",
      experience: "8 years",
    },
    {
      id: 3,
      name: "Thomas Jenkins",
      position: "Lab Technician",
      facility: "Central Blood Bank",
      email: "thomas.j@bloodhouse.org",
      phone: "(555) 345-6789",
      joinDate: "2020-08-15",
      status: "On Leave",
      department: "Laboratory",
      experience: "5 years",
    },
    {
      id: 4,
      name: "Sarah Patel",
      position: "Nurse",
      facility: "West Wing Collection Center",
      email: "sarah.p@bloodhouse.org",
      phone: "(555) 456-7890",
      joinDate: "2021-02-10",
      status: "Active",
      department: "Medical",
      experience: "7 years",
    },
    {
      id: 5,
      name: "Robert Chen",
      position: "Administrative Assistant",
      facility: "South Storage Facility",
      email: "robert.c@bloodhouse.org",
      phone: "(555) 567-8901",
      joinDate: "2021-10-05",
      status: "Inactive",
      department: "Administration",
      experience: "3 years",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaffs = staffs.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "On Leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Medical":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Collection":
        return "bg-red-100 text-red-800 border-red-200";
      case "Laboratory":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Administration":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const uniqueFacilities = [...new Set(staffs.map((staff) => staff.facility))]
    .length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Staff Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage blood donation center personnel
              </p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add New Staff
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Staff
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {staffs.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Staff
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {staffs.filter((s) => s.status === "Active").length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Facilities Covered
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {uniqueFacilities}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Medical Staff
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {staffs.filter((s) => s.department === "Medical").length}
                  </p>
                </div>
                <Stethoscope className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search staff by name, position, facility, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-blue-300"
              />
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Staff Member
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Position & Department
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Facility
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Contact Information
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Employment
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
                  {filteredStaffs.map((staff) => (
                    <TableRow
                      key={staff.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                              {getInitials(staff.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {staff.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {staff.id.toString().padStart(4, "0")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {staff.position}
                          </div>
                          <Badge
                            variant="outline"
                            className={`mt-1 text-xs ${getDepartmentColor(
                              staff.department
                            )}`}
                          >
                            {staff.department}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-gray-900">
                            {staff.facility}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{staff.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{staff.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Joined:{" "}
                              {new Date(staff.joinDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Experience: {staff.experience}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-medium ${getStatusColor(
                            staff.status
                          )}`}
                        >
                          {staff.status}
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

            {filteredStaffs.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No staff members found
                </h3>
                <p className="text-gray-500">
                  No staff members match your search criteria. Try adjusting
                  your search terms.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StaffManagement;
