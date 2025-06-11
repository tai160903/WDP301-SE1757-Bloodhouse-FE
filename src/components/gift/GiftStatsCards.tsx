import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Gift, TrendingUp, AlertTriangle } from "lucide-react";
import { getGiftStats, GiftStats } from "@/services/gift";
import { getGiftCategoryText } from "@/utils/changeText";
import { toast } from "sonner";

interface GiftStatsCardsProps {
  onStatsUpdate?: (stats: GiftStats | null) => void;
}

export function GiftStatsCards({ onStatsUpdate }: GiftStatsCardsProps) {
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
      onStatsUpdate?.(response.data);
    } catch (error: any) {
      console.error('Error fetching gift stats:', error);
      toast.error(error.message || "Không thể tải thống kê quà tặng.");
      setStats(null);
      onStatsUpdate?.(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-l-4 border-l-gray-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              Không thể tải thống kê
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Tổng số đơn vị quà tặng */}
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tổng số đơn vị quà tặng
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalItems.toLocaleString()}
              </p>
            </div>
            <Package className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>

      {/* Tổng số danh mục */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tổng số danh mục
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalCategories}
              </p>
            </div>
            <Gift className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      {/* Danh mục phổ biến */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Danh mục phổ biến
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {getGiftCategoryText(stats.mostPopularCategory.category)}
              </p>
              <p className="text-xs text-gray-500">
                {stats.mostPopularCategory.count} sản phẩm
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      {/* Đơn vị sắp hết */}
      <Card className="border-l-4 border-l-orange-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Đơn vị sắp hết
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.lowStockItems}
              </p>
              <p className="text-xs text-gray-500">
                Cần bổ sung
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 