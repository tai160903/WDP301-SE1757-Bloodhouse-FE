"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminContext } from "@/components/AdminLayout";
import {
  Users,
  Building2,
  FileText,
  Droplets,
  Heart,
  Activity,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { getAllEvents } from "@/services/event";
import { getBloodRequests } from "@/services/bloodRequest";
import { getUsers } from "@/services/users";

// Mock data for the dashboard
const dashboardData = {
  totalUsers: 5086,
  totalBloodRequests: 342,
  totalFacilities: 12,
  totalBlogPosts: 28,
  totalBloodGroups: 8,
  activeRequests: 45,
  completedRequests: 297,
  criticalBloodTypes: 3,
};

// Chart data simulation
const chartData = [
  { label: "Users", value: 5086, color: "bg-blue-500", percentage: 85 },
  { label: "Blood Requests", value: 342, color: "bg-red-500", percentage: 68 },
  { label: "Facilities", value: 12, color: "bg-green-500", percentage: 92 },
  { label: "Blog Posts", value: 28, color: "bg-purple-500", percentage: 75 },
];

// Recent activity data
const recentActivity = [
  {
    type: "donation",
    message: "New blood donation from John Doe",
    time: "2 minutes ago",
    icon: Heart,
  },
  {
    type: "request",
    message: "Urgent O- blood request received",
    time: "5 minutes ago",
    icon: AlertTriangle,
  },
  {
    type: "facility",
    message: "Central Blood Bank updated inventory",
    time: "10 minutes ago",
    icon: Building2,
  },
  {
    type: "user",
    message: "3 new donors registered today",
    time: "15 minutes ago",
    icon: Users,
  },
];

function Dashboard() {
  const { user, userRole, isAdmin } = useAdminContext();
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalBloodRequests, setTotalBloodRequests] = useState(0);
  const [users, setUsers] = useState(0);

  const fetchTotalEvents = async () => {
    try {
      const response = await getAllEvents();
      setTotalEvents(response.data.metadata.total);
    } catch (error) {
      console.error("Error fetching total events:", error);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const response = await getUsers({});
      console.log("Total Users Response:", response);
      setUsers(response.data.metadata.total);
    } catch (error) {
      console.error("Error fetching total users:", error);
    }
  };

  // const fetchTotalBloodRequests = async () => {
  //   try {
  //     const response = await getBloodRequests();
  //     console.log("Total Blood Requests Response:", response);
  //     setTotalBloodRequests(response.data.metadata.total);
  //   } catch (error) {
  //     console.error("Error fetching total blood requests:", error);
  //   }
  // };

  useEffect(() => {
    if (isAdmin) {
      fetchTotalEvents();
      fetchTotalUsers();
    }
  }, [isAdmin]);

  return (
    <div className="p-6 bg-gradient-to-br from-red-50 via-white to-pink-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 rounded-full">
            <Activity className="h-8 w-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.fullName || user?.email || "Administrator"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={Calendar}
          label="Total Events"
          value={totalEvents}
          color="text-blue-500"
          bgColor="bg-blue-100"
        />
        <StatsCard
          icon={Droplets}
          label="Blood Requests"
          value={dashboardData.totalBloodRequests}
          color="text-red-500"
          bgColor="bg-red-100"
        />
        <StatsCard
          icon={Building2}
          label="Facilities"
          value={dashboardData.totalFacilities}
          color="text-green-500"
          bgColor="bg-green-100"
        />
        <StatsCard
          icon={FileText}
          label="Blog Posts"
          value={dashboardData.totalBlogPosts}
          color="text-purple-500"
          bgColor="bg-purple-100"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Requests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.completedRequests}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    87% success rate
                  </span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Requests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.activeRequests}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Activity className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-yellow-600">
                    Pending processing
                  </span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Critical Blood Types
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.criticalBloodTypes}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">
                    Need immediate attention
                  </span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Dashboard Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {chartData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.percentage}% of target
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <activity.icon className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Enhanced Stats Card component
function StatsCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${bgColor} rounded-full`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default Dashboard;
