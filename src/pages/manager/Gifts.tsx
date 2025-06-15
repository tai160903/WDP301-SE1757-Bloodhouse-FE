"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GiftStatsCards } from "@/components/gift/GiftStatsCards";
import { GiftPackageManager } from "@/components/gift/GiftPackageManager";
import { GiftInventoryManager } from "@/components/gift/GiftInventoryManager";
import { GiftDistributionHistory } from "@/components/gift/GiftDistributionHistory";
import { GiftBudgetManager } from "@/components/gift/GiftBudgetManager";
import { Package, Warehouse, History, DollarSign } from "lucide-react";

export default function Gifts() {
  const [activeTab, setActiveTab] = useState("packages");

  const handleStatsUpdate = () => {
    // Refresh data when stats are updated
    console.log("Stats updated");
  };

  const handlePackageUpdate = () => {
    // Refresh data when packages are updated
    console.log("Packages updated");
  };

  const handleInventoryUpdate = () => {
    // Refresh data when inventory is updated
    console.log("Inventory updated");
  };

  const handleBudgetUpdate = () => {
    // Refresh data when budget is updated
    console.log("Budget updated");
  };

  const handleExportReport = () => {
    // Handle report export
    console.log("Export report");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý quà tặng</h1>
          <p className="text-muted-foreground">
            Quản lý gói quà, kho hàng, ngân sách và lịch sử phát quà cho người hiến máu
          </p>
        </div>
      </div>

      {/* Gift Statistics Cards */}
      {/* <GiftStatsCards onStatsUpdate={handleStatsUpdate} /> */}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Gói quà
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Warehouse className="w-4 h-4" />
            Kho hàng
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Lịch sử
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Ngân sách
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-6">
          <GiftPackageManager onPackageUpdate={handlePackageUpdate} />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <GiftInventoryManager onInventoryUpdate={handleInventoryUpdate} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <GiftDistributionHistory onExport={handleExportReport} />
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <GiftBudgetManager onBudgetUpdate={handleBudgetUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 