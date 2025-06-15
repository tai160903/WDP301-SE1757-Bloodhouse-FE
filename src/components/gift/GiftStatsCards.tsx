import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3,
  Gift,
  Warehouse
} from "lucide-react";
import { toast } from "sonner";
import { getGiftStats, type GiftStats } from "@/services/gift";
import { getGiftCategoryText } from "@/utils/changeText";

interface GiftStatsCardsProps {
  onStatsUpdate?: () => void;
}

export interface GiftStatsCardsRef {
  refreshStats: () => void;
}

export const GiftStatsCards = forwardRef<GiftStatsCardsRef, GiftStatsCardsProps>(
  ({ onStatsUpdate }, ref) => {
    const [stats, setStats] = useState<GiftStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchStats();
    }, []);

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getGiftStats();
        setStats(response.data);
        onStatsUpdate?.();
      } catch (error: any) {
        console.error('Error fetching gift stats:', error);
        toast.error("Không thể tải thống kê quà tặng");
      } finally {
        setLoading(false);
      }
    };

    // Expose refresh function to parent component
    useImperativeHandle(ref, () => ({
      refreshStats: fetchStats
    }));

    const getCategoryText = (category: string) => {
      return getGiftCategoryText(category);
    };

    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-6 bg-muted rounded animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!stats) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Gift className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Không có dữ liệu</p>
                  <p className="text-2xl font-bold">--</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Items */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Gift className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng quà tặng</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Categories */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Danh mục</p>
                <p className="text-2xl font-bold">{stats.totalCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Popular Category */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Danh mục phổ biến</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold">
                    {getCategoryText(stats.mostPopularCategory.category)}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {stats.mostPopularCategory.count}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`w-8 h-8 ${stats.lowStockItems > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sắp hết hàng</p>
                <p className={`text-2xl font-bold ${stats.lowStockItems > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                  {stats.lowStockItems}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        {Object.keys(stats.categoryBreakdown).length > 0 && (
          <Card className="md:col-span-2 lg:col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="w-5 h-5" />
                Phân bố theo danh mục
              </CardTitle>
              <CardDescription>
                Số lượng quà tặng theo từng danh mục
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
                  <div key={category} className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">
                      {getCategoryText(category)}
                    </p>
                    <p className="text-xl font-bold">{count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
); 