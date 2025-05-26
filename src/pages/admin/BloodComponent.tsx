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
  FlaskRoundIcon as Flask,
  Thermometer,
  Calendar,
  RefreshCw,
  Activity,
  Snowflake,
  Timer,
} from "lucide-react";

function BloodComponentManagement() {
  // Enhanced mock data for blood components
  const [components, setComponents] = useState([
    {
      id: 1,
      name: "Red Blood Cells",
      source: "Whole Blood",
      inventory: 320,
      capacity: 500,
      lastUpdated: "2024-06-15",
      expiryPeriod: "42 days",
      storageTemp: "1-6°C",
      status: "Adequate",
      weeklyUsage: 85,
      daysRemaining: 3.8,
      storageType: "Refrigerated",
      uses: ["Anemia", "Blood Loss", "Surgery"],
    },
    {
      id: 2,
      name: "Platelets",
      source: "Whole Blood",
      inventory: 75,
      capacity: 150,
      lastUpdated: "2024-06-14",
      expiryPeriod: "5 days",
      storageTemp: "20-24°C",
      status: "Low",
      weeklyUsage: 45,
      daysRemaining: 1.7,
      storageType: "Room Temperature",
      uses: ["Bleeding Disorders", "Cancer Treatment", "Surgery"],
    },
    {
      id: 3,
      name: "Plasma",
      source: "Whole Blood",
      inventory: 240,
      capacity: 400,
      lastUpdated: "2024-06-15",
      expiryPeriod: "1 year (frozen)",
      storageTemp: "Below -18°C",
      status: "Adequate",
      weeklyUsage: 35,
      daysRemaining: 6.9,
      storageType: "Frozen",
      uses: ["Clotting Disorders", "Burns", "Liver Disease"],
    },
    {
      id: 4,
      name: "Cryoprecipitate",
      source: "Plasma",
      inventory: 65,
      capacity: 120,
      lastUpdated: "2024-06-13",
      expiryPeriod: "1 year (frozen)",
      storageTemp: "Below -18°C",
      status: "Low",
      weeklyUsage: 20,
      daysRemaining: 3.3,
      storageType: "Frozen",
      uses: ["Hemophilia", "Fibrinogen Deficiency", "von Willebrand Disease"],
    },
    {
      id: 5,
      name: "Granulocytes",
      source: "Whole Blood",
      inventory: 30,
      capacity: 80,
      lastUpdated: "2024-06-15",
      expiryPeriod: "24 hours",
      storageTemp: "20-24°C",
      status: "Critical",
      weeklyUsage: 25,
      daysRemaining: 1.2,
      storageType: "Room Temperature",
      uses: ["Severe Infections", "Neutropenia", "Immunocompromised Patients"],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredComponents = components.filter(
    (component) =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.storageType.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getStorageTypeColor = (storageType: string) => {
    switch (storageType) {
      case "Frozen":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Refrigerated":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "Room Temperature":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStorageIcon = (storageType: string) => {
    switch (storageType) {
      case "Frozen":
        return <Snowflake className="h-4 w-4" />;
      case "Refrigerated":
        return <Thermometer className="h-4 w-4" />;
      case "Room Temperature":
        return <Activity className="h-4 w-4" />;
      default:
        return <Thermometer className="h-4 w-4" />;
    }
  };

  const getInventoryPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const totalInventory = components.reduce(
    (sum, component) => sum + component.inventory,
    0
  );
  const lowSupplyCount = components.filter(
    (component) => component.status === "Low"
  ).length;
  const criticalSupplyCount = components.filter(
    (component) => component.status === "Critical"
  ).length;
  const criticalComponents = components.filter(
    (component) => component.status === "Critical"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <Flask className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Blood Component Management
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor blood components and storage conditions
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-300">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Update Inventory
            </Button>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalComponents.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Critical Component Alert:</strong>{" "}
              {criticalComponents.map((component) => component.name).join(", ")}{" "}
              are critically low. Immediate restocking required.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-purple-500">
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
                <Droplets className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Component Types
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {components.length}
                  </p>
                </div>
                <Flask className="h-8 w-8 text-blue-500" />
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
                  <p className="text-xs text-gray-500">components</p>
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
                  <p className="text-xs text-gray-500">components</p>
                </div>
                <Activity className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Flask className="h-5 w-5" />
              Component Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search components by name, source, status, or storage type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-purple-300"
              />
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Component Information
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Inventory Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Storage Requirements
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Usage & Timeline
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Medical Uses
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
                  {filteredComponents.map((component) => (
                    <TableRow
                      key={component.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                            <Flask className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {component.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Source: {component.source}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">
                              {component.inventory} units
                            </span>
                            <span className="text-gray-500">
                              / {component.capacity}
                            </span>
                          </div>
                          <Progress
                            value={getInventoryPercentage(
                              component.inventory,
                              component.capacity
                            )}
                            className="h-2"
                          />
                          <div className="text-xs text-gray-500">
                            {getInventoryPercentage(
                              component.inventory,
                              component.capacity
                            )}
                            % capacity
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getStorageIcon(component.storageType)}
                            <span className="text-sm font-medium">
                              {component.storageTemp}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStorageTypeColor(
                              component.storageType
                            )}`}
                          >
                            {component.storageType}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Timer className="h-3 w-3" />
                            <span>{component.expiryPeriod}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">
                              {component.weeklyUsage}
                            </span>
                            <span className="text-gray-500"> units/week</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">
                              Updated:{" "}
                              {new Date(
                                component.lastUpdated
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span
                              className={`font-medium ${
                                component.daysRemaining < 2
                                  ? "text-red-600"
                                  : component.daysRemaining < 4
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }`}
                            >
                              {component.daysRemaining.toFixed(1)} days
                              remaining
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {component.uses.slice(0, 2).map((use, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs mr-1 mb-1"
                            >
                              {use}
                            </Badge>
                          ))}
                          {component.uses.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{component.uses.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-medium ${getStatusColor(
                            component.status
                          )}`}
                        >
                          {component.status}
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

            {filteredComponents.length === 0 && (
              <div className="text-center py-12">
                <Flask className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No blood components found
                </h3>
                <p className="text-gray-500">
                  No blood components match your search criteria. Try adjusting
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

export default BloodComponentManagement;
