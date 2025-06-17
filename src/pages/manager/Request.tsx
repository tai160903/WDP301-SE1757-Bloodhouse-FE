"use client";

import { useEffect, useState } from "react";
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
import { Plus, Eye, CheckCircle, XCircle } from "lucide-react";
import { set } from "date-fns";
import { getBloodDonationRegis } from "@/services/bloodDonationRegis";
import { useNavigate } from "react-router-dom";

// const donationRequests = [
//   {
//     id: 1,
//     hospital: "City General Hospital",
//     bloodType: "O-",
//     units: 3,
//     urgency: "Emergency",
//     requestDate: "2024-01-05",
//     status: "Pending",
//     contact: "Dr. Smith",
//     phone: "+1-555-0123",
//   },
//   {
//     id: 2,
//     hospital: "St. Mary's Medical Center",
//     bloodType: "A+",
//     units: 2,
//     urgency: "Urgent",
//     requestDate: "2024-01-04",
//     status: "Approved",
//     contact: "Dr. Johnson",
//     phone: "+1-555-0124",
//   },
//   {
//     id: 3,
//     hospital: "Regional Hospital",
//     bloodType: "B-",
//     units: 1,
//     urgency: "Routine",
//     requestDate: "2024-01-03",
//     status: "Fulfilled",
//     contact: "Dr. Williams",
//     phone: "+1-555-0125",
//   },
// ];

export default function Requests() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [donationRequests, setDonationRequests] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Emergency":
        return "bg-red-100 text-red-800";
      case "Urgent":
        return "bg-orange-100 text-orange-800";
      case "Routine":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Fulfilled":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchDonationRequests = async () => {
      try {
        const data = await getBloodDonationRegis();
        setDonationRequests(data);
      } catch (error) {
        console.error("Error fetching donation requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationRequests();
  }, []);

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Yêu cầu hiến máu
          </h1>
          <p className="text-muted-foreground">
            Quản lý các yêu cầu hiến máu tại các bệnh viện
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Emergency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Fulfilled Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">5</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu hiến máu</CardTitle>
          <CardDescription>
            Quảnh lý và theo dõi yêu cầu hiến máu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người yêu cầu</TableHead>
                <TableHead>Nhóm máu</TableHead>
                <TableHead>Đơn vị cần</TableHead>
                <TableHead>Bệnh viện</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donationRequests.map((request: any) => (
                <TableRow
                  key={request._id}
                  onClick={() => navigate(`detail/${request._id}`)}
                >
                  <TableCell className="font-medium">
                    {request.userId.fullName}
                  </TableCell>
                  <TableCell>{request.bloodGroupId.name}</TableCell>
                  <TableCell>
                    {request.expectedQuantity.toLocaleString()} đơn vị
                  </TableCell>
                  <TableCell>{request.facilityId.name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRequest(request)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {request.status === "Pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Detailed information about the blood donation request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Hospital</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.hospital}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Contact Person</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.contact}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.phone}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Request Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.requestDate}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Blood Type</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.bloodType}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Units</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.units}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Urgency</Label>
                  <Badge className={getUrgencyColor(selectedRequest.urgency)}>
                    {selectedRequest.urgency}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
