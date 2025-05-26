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
import { Search, Edit, Trash2, Plus, Heart, Droplets } from "lucide-react";

function BloodDonorManagement() {
  // Mock data for blood donors
  const [donors, setDonors] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      bloodType: "O+",
      phone: "+1 (555) 123-4567",
      lastDonation: "2024-01-15",
      status: "Eligible",
      totalDonations: 12,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      bloodType: "A-",
      phone: "+1 (555) 234-5678",
      lastDonation: "2024-02-20",
      status: "Eligible",
      totalDonations: 8,
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      bloodType: "B+",
      phone: "+1 (555) 345-6789",
      lastDonation: "2024-03-10",
      status: "Deferred",
      totalDonations: 15,
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      bloodType: "AB+",
      phone: "+1 (555) 456-7890",
      lastDonation: "2024-01-28",
      status: "Eligible",
      totalDonations: 5,
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael@example.com",
      bloodType: "O-",
      phone: "+1 (555) 567-8901",
      lastDonation: "2024-03-05",
      status: "Eligible",
      totalDonations: 20,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredDonors = donors.filter(
    (donor) =>
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBloodTypeColor = (bloodType: string) => {
    const colors = {
      "O+": "bg-red-100 text-red-800 border-red-200",
      "O-": "bg-red-200 text-red-900 border-red-300",
      "A+": "bg-blue-100 text-blue-800 border-blue-200",
      "A-": "bg-blue-200 text-blue-900 border-blue-300",
      "B+": "bg-green-100 text-green-800 border-green-200",
      "B-": "bg-green-200 text-green-900 border-green-300",
      "AB+": "bg-purple-100 text-purple-800 border-purple-200",
      "AB-": "bg-purple-200 text-purple-900 border-purple-300",
    };
    return (
      colors[bloodType as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getStatusColor = (status: string) => {
    return status === "Eligible"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-full">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Blood Donor Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track blood donors efficiently
              </p>
            </div>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add New Donor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Donors
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {donors.length}
                  </p>
                </div>
                <Droplets className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Eligible Donors
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {donors.filter((d) => d.status === "Eligible").length}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Donations
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {donors.reduce(
                      (sum, donor) => sum + donor.totalDonations,
                      0
                    )}
                  </p>
                </div>
                <Droplets className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Universal Donors (O-)
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {donors.filter((d) => d.bloodType === "O-").length}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Donor Directory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search donors by name, email, or blood type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-red-300"
              />
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Donor Information
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Contact
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Blood Type
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Last Donation
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Total Donations
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDonors.map((donor) => (
                    <TableRow
                      key={donor.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">
                            {donor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {donor.id.toString().padStart(4, "0")}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm text-gray-900">
                            {donor.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {donor.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-semibold ${getBloodTypeColor(
                            donor.bloodType
                          )}`}
                        >
                          {donor.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {new Date(donor.lastDonation).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-medium ${getStatusColor(
                            donor.status
                          )}`}
                        >
                          {donor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-4 w-4 text-red-500" />
                          <span className="font-medium">
                            {donor.totalDonations}
                          </span>
                        </div>
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

            {filteredDonors.length === 0 && (
              <div className="text-center py-12">
                <Droplets className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No donors found
                </h3>
                <p className="text-gray-500">
                  No donors match your search criteria. Try adjusting your
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

export default BloodDonorManagement;
