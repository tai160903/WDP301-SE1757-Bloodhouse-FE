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
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  getBloodInventory,
  createBloodInventory,
  // getBloodInventoryDetail,
} from "@/services/bloodinventory";
import { getFacilities } from "@/services/location/facility";
import { getBloodComponents } from "@/services/bloodComponent/blood-component";
import { getBloodGroups } from "@/services/bloodGroup/blood-group";
import { useNavigate } from "react-router-dom";

export default function BloodInventory() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [bloodInventory, setBloodInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [facility, setFacility] = useState<any[]>([]);
  const [components, setComponents] = useState<any[]>([]);
  const [bloodGroups, setBloodGroups] = useState<any[]>([]);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    groupId: "",
    componentId: "",
    facilityId: "",
    totalQuantity: "",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Expiring Soon":
        return "bg-orange-100 text-orange-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await getBloodInventory();
      setBloodInventory(data);
    } catch (error) {
      console.error("Error fetching blood inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    const fetchFacility = async () => {
      setLoading(true);
      try {
        const data = await getFacilities();
        setFacility(data.data.result);
      } catch (error) {
        console.error("Error fetching blood inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
  }, []);

  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      try {
        const data = await getBloodComponents();
        setComponents(data);
      } catch (err: any) {
        console.log(err.message || "Không thể tải danh sách thành phần máu.");
      } finally {
        setLoading(false);
      }
    };
    fetchComponents();
  }, []);

  useEffect(() => {
    const fetchBloodGroups = async () => {
      setLoading(true);
      try {
        const data = await getBloodGroups();
        setBloodGroups(data);
      } catch (err: any) {
        console.log(err.message || "Không thể tải danh sách nhóm máu");
      } finally {
        setLoading(false);
      }
    };
    fetchBloodGroups();
  }, []);

  const handleCreateBloodInventory = async () => {
    try {
      const payload = {
        ...formData,
        totalQuantity: Number(formData.totalQuantity),
      };
      await createBloodInventory(payload);
      setIsAddDialogOpen(false);
      fetchInventory();
    } catch (error) {
      console.error("Failed to create blood inventory", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kho máu</h1>
          <p className="text-muted-foreground">
            Quản lý đơn vị máu và theo dõi mức dự trữ
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm đơn vị máu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm đơn vị máu</DialogTitle>
              <DialogDescription>Thêm 1 đơn vị máu vào kho</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="componentId" className="text-right">
                  Nhóm máu
                </Label>
                <Select
                  value={formData.groupId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, groupId: value })
                  }
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Lựa chọn nhóm máu" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group._id} value={group._id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="groupId" className="text-right">
                  Thành phần
                </Label>
                <Select
                  value={formData.componentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, componentId: value })
                  }
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Lựa chọn thành phần máu" />
                  </SelectTrigger>
                  <SelectContent>
                    {components.map((component) => (
                      <SelectItem key={component._id} value={component._id}>
                        {component.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="facilityId" className="text-right">
                  Chi nhánh
                </Label>
                <Select
                  value={formData.facilityId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, facilityId: value })
                  }
                >
                  <SelectTrigger className="col-span-3 w-full">
                    <SelectValue placeholder="Lựa chọn chi nhánh" />
                  </SelectTrigger>
                  <SelectContent>
                    {facility.map((facility) => (
                      <SelectItem key={facility._id} value={facility._id}>
                        {facility.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalQuantity" className="text-right">
                  Số lượng
                </Label>
                <Input
                  id="totalQuantity"
                  type="number"
                  value={formData.totalQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, totalQuantity: e.target.value })
                  }
                  placeholder="Đơn vị"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateBloodInventory}>
                Thêm vào kho
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn vị</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">293</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Số lượng ít</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hết hạn sớm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Số lượng nguy cấp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">1</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "2rem" }}>Kho máu</CardTitle>
            <CardDescription>
              Mức độ và tình trạng dự trữ máu hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thành phần máu</TableHead>
                  <TableHead>Nhhóm máu</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Chi nhánh</TableHead>
                  {/* <TableHead>Trạng thái</TableHead> */}
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bloodInventory.map((item) => (
                  <TableRow
                    key={item._id}
                    onClick={() => navigate(`detail/${item._id}`)}
                  >
                    <TableCell className="font-medium">
                      {item.componentId.name}
                    </TableCell>
                    <TableCell>{item.groupId.name}</TableCell>
                    <TableCell>{item.totalQuantity} đơn vị</TableCell>
                    <TableCell>{item.facilityId.name}</TableCell>
                    {/* <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell> */}
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
      )}
    </div>
  );
}
