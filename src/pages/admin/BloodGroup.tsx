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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Droplets,
  AlertTriangle,
  Users,
  TrendingUp,
  Calendar,
  RefreshCw,
  Activity,
} from "lucide-react";

function BloodGroupManagement() {
  // Enhanced mock data for blood group inventory
  const [bloodGroups, setBloodGroups] = useState([
    {
      id: 1,
      type: "A+",
      inventory: 450,
      capacity: 600,
      donorsCount: 1254,
      lastUpdated: "2024-06-15",
      status: "Adequate",
      weeklyUsage: 85,
      daysRemaining: 5.3,
      compatibility: ["A+", "AB+"],
    },
    {
      id: 2,
      type: "A-",
      inventory: 120,
      capacity: 300,
      donorsCount: 382,
      lastUpdated: "2024-06-14",
      status: "Low",
      weeklyUsage: 45,
      daysRemaining: 2.7,
      compatibility: ["A+", "A-", "AB+", "AB-"],
    },
    {
      id: 3,
      type: "B+",
      inventory: 320,
      capacity: 500,
      donorsCount: 978,
      lastUpdated: "2024-06-15",
      status: "Adequate",
      weeklyUsage: 65,
      daysRemaining: 4.9,
      compatibility: ["B+", "AB+"],
    },
    {
      id: 4,
      type: "B-",
      inventory: 85,
      capacity: 250,
      donorsCount: 214,
      lastUpdated: "2024-06-13",
      status: "Low",
      weeklyUsage: 35,
      daysRemaining: 2.4,
      compatibility: ["B+", "B-", "AB+", "AB-"],
    },
    {
      id: 5,
      type: "AB+",
      inventory: 110,
      capacity: 200,
      donorsCount: 367,
      lastUpdated: "2024-06-15",
      status: "Adequate",
      weeklyUsage: 25,
      daysRemaining: 4.4,
      compatibility: ["AB+"],
    },
    {
      id: 6,
      type: "AB-",
      inventory: 45,
      capacity: 150,
      donorsCount: 126,
      lastUpdated: "2024-06-12",
      status: "Critical",
      weeklyUsage: 20,
      daysRemaining: 2.3,
      compatibility: ["AB+", "AB-"],
    },
    {
      id: 7,
      type: "O+",
      inventory: 480,
      capacity: 700,
      donorsCount: 1567,
      lastUpdated: "2024-06-15",
      status: "Adequate",
      weeklyUsage: 120,
      daysRemaining: 4.0,
      compatibility: ["O+", "A+", "B+", "AB+"],
    },
    {
      id: 8,
      type: "O-",
      inventory: 65,
      capacity: 400,
      donorsCount: 198,
      lastUpdated: "2024-06-14",
      status: "Critical",
      weeklyUsage: 80,
      daysRemaining: 0.8,
      compatibility: ["All blood types"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredBloodGroups = bloodGroups.filter(
    (group) =>
      group.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Adequate":
        return "bg-green-100 text-green-800 border-green-200";
      case "Low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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

  const getInventoryPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const totalInventory = bloodGroups.reduce(
    (sum, group) => sum + group.inventory,
    0
  );
  const totalDonors = bloodGroups.reduce(
    (sum, group) => sum + group.donorsCount,
    0
  );
  const lowSupplyCount = bloodGroups.filter(
    (group) => group.status === "Low"
  ).length;
  const criticalSupplyCount = bloodGroups.filter(
    (group) => group.status === "Critical"
  ).length;
  const criticalGroups = bloodGroups.filter(
    (group) => group.status === "Critical"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-full">
              <Droplets className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Blood Group Management
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor blood inventory and supply levels
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-300">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Update Inventory
            </Button>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalGroups.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Critical Supply Alert:</strong>{" "}
              {criticalGroups.map((group) => group.type).join(", ")} blood types
              are critically low. Immediate action required.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Inventory
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalInventory.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">units</p>
                </div>
                <Droplets className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Registered Donors
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalDonors.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Low Supply
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {lowSupplyCount}
                  </p>
                  <p className="text-xs text-gray-500">blood types</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Critical Supply
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {criticalSupplyCount}
                  </p>
                  <p className="text-xs text-gray-500">blood types</p>
                </div>
                <Activity className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Blood Type Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search blood groups by type or status..."
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
                      Blood Type
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Inventory Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Donors & Usage
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Supply Timeline
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
                  {filteredBloodGroups.map((group) => (
                    <TableRow
                      key={group.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold text-lg">
                            {group.type}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              Type {group.type}
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getBloodTypeColor(
                                group.type
                              )}`}
                            >
                              {group.type === "O-"
                                ? "Universal Donor"
                                : `Compatible: ${group.compatibility.length}`}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">
                              {group.inventory} units
                            </span>
                            <span className="text-gray-500">
                              / {group.capacity}
                            </span>
                          </div>
                          <Progress
                            value={getInventoryPercentage(
                              group.inventory,
                              group.capacity
                            )}
                            className="h-2"
                          />
                          <div className="text-xs text-gray-500">
                            {getInventoryPercentage(
                              group.inventory,
                              group.capacity
                            )}
                            % capacity
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-3 w-3 text-blue-500" />
                            <span className="font-medium">
                              {group.donorsCount.toLocaleString()}
                            </span>
                            <span className="text-gray-500">donors</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>{group.weeklyUsage} units/week</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">
                              Updated:{" "}
                              {new Date(group.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span
                              className={`font-medium ${
                                group.daysRemaining < 2
                                  ? "text-red-600"
                                  : group.daysRemaining < 4
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }`}
                            >
                              {group.daysRemaining.toFixed(1)} days remaining
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-medium ${getStatusColor(
                            group.status
                          )}`}
                        >
                          {group.status}
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

            {filteredBloodGroups.length === 0 && (
              <div className="text-center py-12">
                <Droplets className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No blood groups found
                </h3>
                <p className="text-gray-500">
                  No blood groups match your search criteria. Try adjusting your
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

export default BloodGroupManagement;
