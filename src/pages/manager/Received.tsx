"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, CheckCircle, XCircle } from "lucide-react";

const receivedRequests = [
  {
    id: 1,
    requestId: "REQ-2024-001",
    fromHospital: "Metro General Hospital",
    bloodType: "O-",
    unitsRequested: 4,
    urgencyLevel: "Emergency",
    receivedDate: "2024-01-05",
    status: "Pending Review",
    contactPerson: "Dr. Amanda Rodriguez",
    contactPhone: "+1-555-0201",
    reason: "Emergency surgery - multiple trauma patients",
    notes: "Patient requires immediate transfusion. Critical condition.",
  },
  {
    id: 2,
    requestId: "REQ-2024-002",
    fromHospital: "Children's Medical Center",
    bloodType: "A+",
    unitsRequested: 2,
    urgencyLevel: "Urgent",
    receivedDate: "2024-01-04",
    status: "Approved",
    contactPerson: "Dr. James Wilson",
    contactPhone: "+1-555-0202",
    reason: "Pediatric surgery scheduled for tomorrow",
    notes: "Patient is 8 years old, requires careful handling.",
  },
  {
    id: 3,
    requestId: "REQ-2024-003",
    fromHospital: "University Hospital",
    bloodType: "B+",
    unitsRequested: 3,
    urgencyLevel: "Routine",
    receivedDate: "2024-01-03",
    status: "Fulfilled",
    contactPerson: "Dr. Lisa Chen",
    contactPhone: "+1-555-0203",
    reason: "Scheduled surgery next week",
    notes: "Standard procedure, flexible timing.",
  },
  {
    id: 4,
    requestId: "REQ-2024-004",
    fromHospital: "Regional Medical Center",
    bloodType: "AB-",
    unitsRequested: 1,
    urgencyLevel: "Urgent",
    receivedDate: "2024-01-02",
    status: "Rejected",
    contactPerson: "Dr. Robert Kim",
    contactPhone: "+1-555-0204",
    reason: "Rare blood type needed for surgery",
    notes: "Unfortunately, we don't have AB- units available.",
  },
];

export default function ReceivedRequests() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseType, setResponseType] = useState<"approve" | "reject">(
    "approve"
  );

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
      case "Pending Review":
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

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const handleResponse = (request: any, type: "approve" | "reject") => {
    setSelectedRequest(request);
    setResponseType(type);
    setIsResponseDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Received Requests</h1>
        <p className="text-muted-foreground">
          Review and respond to blood donation requests from hospitals
        </p>
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
            <div className="text-2xl font-bold">47</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Emergency Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Fulfilled This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Incoming Requests</CardTitle>
          <CardDescription>
            Blood donation requests received from hospitals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receivedRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.requestId}
                  </TableCell>
                  <TableCell>{request.fromHospital}</TableCell>
                  <TableCell>{request.bloodType}</TableCell>
                  <TableCell>{request.unitsRequested}</TableCell>
                  <TableCell>
                    <Badge className={getUrgencyColor(request.urgencyLevel)}>
                      {request.urgencyLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.receivedDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRequest(request)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {request.status === "Pending Review" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600"
                            onClick={() => handleResponse(request, "approve")}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => handleResponse(request, "reject")}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Complete information about the blood donation request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Request ID</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.requestId}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Hospital</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.fromHospital}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Contact Person</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.contactPerson}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.contactPhone}
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
                  <Label className="text-sm font-medium">Units Requested</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.unitsRequested}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Urgency</Label>
                  <Badge
                    className={getUrgencyColor(selectedRequest.urgencyLevel)}
                  >
                    {selectedRequest.urgencyLevel}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Reason for Request
                </Label>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.reason}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Additional Notes</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.notes}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Received Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.receivedDate}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current Status</Label>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status}
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

      {/* Response Dialog */}
      <Dialog
        open={isResponseDialogOpen}
        onOpenChange={setIsResponseDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {responseType === "approve"
                ? "Approve Request"
                : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {responseType === "approve"
                ? "Approve this blood donation request and schedule fulfillment"
                : "Reject this request and provide a reason"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label className="text-sm font-medium">Response Notes</Label>
              <Textarea
                placeholder={
                  responseType === "approve"
                    ? "Add any notes about fulfillment timeline or special instructions..."
                    : "Please provide a reason for rejection..."
                }
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResponseDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsResponseDialogOpen(false)}
              className={
                responseType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {responseType === "approve"
                ? "Approve Request"
                : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
