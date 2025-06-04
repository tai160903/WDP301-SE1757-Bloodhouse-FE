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
import { Plus, Edit, Trash2, Gift } from "lucide-react";

const gifts = [
  {
    id: 1,
    name: "Blood Donor T-Shirt",
    category: "Apparel",
    quantity: 150,
    cost: 12.99,
    description: "Comfortable cotton t-shirt with blood donor logo",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Thank You Mug",
    category: "Drinkware",
    quantity: 75,
    cost: 8.5,
    description: "Ceramic mug with appreciation message",
    status: "In Stock",
  },
  {
    id: 3,
    name: "Donor Certificate",
    category: "Certificate",
    quantity: 500,
    cost: 2.0,
    description: "Official blood donation certificate",
    status: "In Stock",
  },
  {
    id: 4,
    name: "Stress Ball",
    category: "Wellness",
    quantity: 25,
    cost: 3.99,
    description: "Heart-shaped stress relief ball",
    status: "Low Stock",
  },
  {
    id: 5,
    name: "Water Bottle",
    category: "Drinkware",
    quantity: 0,
    cost: 15.99,
    description: "Insulated water bottle with facility logo",
    status: "Out of Stock",
  },
];

const giftDistributions = [
  {
    id: 1,
    donorName: "John Smith",
    giftName: "Blood Donor T-Shirt",
    distributionDate: "2024-01-05",
    occasion: "First Time Donor",
  },
  {
    id: 2,
    donorName: "Sarah Johnson",
    giftName: "Thank You Mug",
    distributionDate: "2024-01-04",
    occasion: "10th Donation",
  },
  {
    id: 3,
    donorName: "Mike Davis",
    giftName: "Donor Certificate",
    distributionDate: "2024-01-03",
    occasion: "Regular Donation",
  },
];

export default function Gifts() {
  const [isAddGiftDialogOpen, setIsAddGiftDialogOpen] = useState(false);
  const [isDistributeDialogOpen, setIsDistributeDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gift Management</h1>
          <p className="text-muted-foreground">
            Manage gifts and rewards for blood donors
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog
            open={isDistributeDialogOpen}
            onOpenChange={setIsDistributeDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Gift className="w-4 h-4 mr-2" />
                Distribute Gift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Distribute Gift</DialogTitle>
                <DialogDescription>
                  Record gift distribution to a donor
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="donorName">Donor Name</Label>
                  <Input id="donorName" placeholder="Enter donor name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="giftSelect">Select Gift</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a gift" />
                    </SelectTrigger>
                    <SelectContent>
                      {gifts
                        .filter((gift) => gift.status !== "Out of Stock")
                        .map((gift) => (
                          <SelectItem key={gift.id} value={gift.name}>
                            {gift.name} (Available: {gift.quantity})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="occasion">Occasion</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="First Time Donor">
                        First Time Donor
                      </SelectItem>
                      <SelectItem value="Regular Donation">
                        Regular Donation
                      </SelectItem>
                      <SelectItem value="5th Donation">5th Donation</SelectItem>
                      <SelectItem value="10th Donation">
                        10th Donation
                      </SelectItem>
                      <SelectItem value="Special Recognition">
                        Special Recognition
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional notes..." />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => setIsDistributeDialogOpen(false)}
                >
                  Distribute Gift
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog
            open={isAddGiftDialogOpen}
            onOpenChange={setIsAddGiftDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Gift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Gift</DialogTitle>
                <DialogDescription>
                  Add a new gift item to the inventory
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="giftName">Gift Name</Label>
                  <Input id="giftName" placeholder="Enter gift name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apparel">Apparel</SelectItem>
                      <SelectItem value="Drinkware">Drinkware</SelectItem>
                      <SelectItem value="Certificate">Certificate</SelectItem>
                      <SelectItem value="Wellness">Wellness</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cost">Cost per Unit</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Gift description..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => setIsAddGiftDialogOpen(false)}
                >
                  Add Gift
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Gift Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Gifts in Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">750</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Distributed This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,247</div>
          </CardContent>
        </Card>
      </div>

      {/* Gift Inventory */}
      <Card>
        <CardHeader>
          <CardTitle>Gift Inventory</CardTitle>
          <CardDescription>Manage gift items and stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gift Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost per Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gifts.map((gift) => (
                <TableRow key={gift.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{gift.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {gift.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{gift.category}</TableCell>
                  <TableCell>{gift.quantity}</TableCell>
                  <TableCell>${gift.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(gift.status)}>
                      {gift.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
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

      {/* Recent Distributions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Gift Distributions</CardTitle>
          <CardDescription>
            Track recent gift distributions to donors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor Name</TableHead>
                <TableHead>Gift</TableHead>
                <TableHead>Occasion</TableHead>
                <TableHead>Distribution Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {giftDistributions.map((distribution) => (
                <TableRow key={distribution.id}>
                  <TableCell className="font-medium">
                    {distribution.donorName}
                  </TableCell>
                  <TableCell>{distribution.giftName}</TableCell>
                  <TableCell>{distribution.occasion}</TableCell>
                  <TableCell>{distribution.distributionDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
