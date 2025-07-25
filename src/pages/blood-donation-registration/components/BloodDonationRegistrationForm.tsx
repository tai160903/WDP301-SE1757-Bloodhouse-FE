"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CalendarIcon,
  MapPin,
  Droplets,
  Heart,
  FileText,
  Loader2,
  Info,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { instance } from "@/services/instance";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

// Updated Schema without source and time fields
const formSchema = z.object({
  facilityId: z.string().min(1, "Vui lòng chọn trung tâm hiến máu"),
  bloodGroupId: z.string().min(1, "Vui lòng chọn nhóm máu"),
  expectedQuantity: z
    .number({
      required_error: "Vui lòng nhập lượng máu",
      invalid_type_error: "Lượng máu phải là một số",
    })
    .nonnegative("Lượng máu không được là số âm")
    .min(100, "Lượng máu phải ít nhất 100 mL")
    .max(500, "Lượng máu không được vượt quá 500 mL")
    .optional(),
  date: z
    .date({
      required_error: "Vui lòng chọn ngày hiến máu",
    })
    .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Ngày hiến máu không thể là ngày trong quá khứ",
    }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function BloodDonationRegistrationForm({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  const [facilities, setFacilities] = useState<
    { id: string; name: string; address?: string }[]
  >([]);
  const [bloodGroups, setBloodGroups] = useState<
    { id: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const { isAuthenticated } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilityId: "",
      bloodGroupId: "",
      expectedQuantity: undefined,
      date: undefined,
      notes: "",
    },
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [fRes, bgRes] = await Promise.all([
          instance.get("/facility"),
          instance.get("/blood-group"),
        ]);
        setFacilities(
          fRes.data.data.result.map((f: any) => ({
            id: f._id,
            name: f.name,
            address: f.address || "",
          }))
        );
        setBloodGroups(
          bgRes.data.data.map((bg: any) => ({
            id: bg._id,
            name: bg.name,
          }))
        );
      } catch (err) {
        console.error("Lỗi fetch dropdown:", err);
        setErrorLoading("Không thể tải dữ liệu, thử tải lại trang.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      // Set default time to 9:00 AM for the selected date
      const preferredDate = format(
        new Date(
          values.date.getFullYear(),
          values.date.getMonth(),
          values.date.getDate(),
          9,
          0
        ),
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );

      const payload = {
        facilityId: values.facilityId,
        source: "Tự nguyện", // Default source
        bloodGroupId: values.bloodGroupId,
        expectedQuantity: values.expectedQuantity ?? 0,
        preferredDate,
        notes: values.notes,
      };

      console.log("Submitting payload:", payload);
      const { data } = await instance.post(
        "/blood-donation-registration",
        payload
      );

      toast.success(
        data.message ||
          "Đăng ký hiến máu thành công! Chúng tôi sẽ liên hệ với bạn để xác nhận lịch hẹn.",
        {
          duration: 3000,
        }
      );

      // Reset form
      form.reset({
        facilityId: "",
        bloodGroupId: "",
        expectedQuantity: undefined,
        date: undefined,
        notes: "",
      });

      setFormKey((prev) => prev + 1);
      console.log("Form state after reset:", form.getValues());

      setTimeout(() => {
        toast.dismiss();
      }, 3000);

      onSuccess?.(data);
    } catch (error: any) {
      console.error("Submission error:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        message: error.message,
      });

      toast.error(
        error?.response?.status === 404
          ? "Không tìm thấy endpoint. Vui lòng kiểm tra backend hoặc gateway."
          : error?.response?.data?.message ||
              "Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại sau.",
        { duration: 8000 }
      );

      onError?.(error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <Heart className="h-4 w-4 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <span className="text-sm text-muted-foreground">
            Đang tải dữ liệu...
          </span>
        </div>
      </div>
    );
  }

  if (errorLoading) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{errorLoading}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#F0FFF4",
              color: "#2F855A",
              border: "1px solid #68D391",
            },
          },
          error: {
            style: {
              background: "#FFF5F5",
              color: "#C53030",
              border: "1px solid #F87171",
            },
          },
        }}
      />

      {!isAuthenticated && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Yêu cầu đăng nhập</AlertTitle>
          <AlertDescription>
            Bạn cần đăng nhập để có thể đăng ký hiến máu.
          </AlertDescription>
        </Alert>
      )}

      <Form key={formKey} {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Thông tin hiến máu */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Thông tin hiến máu</h3>
              <p className="text-sm text-muted-foreground">
                Vui lòng điền đầy đủ thông tin dưới đây
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trung tâm hiến máu */}
              <FormField
                control={form.control}
                name="facilityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Trung tâm hiến máu
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trung tâm hiến máu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem key={facility.id} value={facility.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {facility.name}
                              </span>
                              {facility.address && (
                                <span className="text-xs text-muted-foreground">
                                  {facility.address}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nhóm máu */}
              <FormField
                control={form.control}
                name="bloodGroupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      Nhóm máu
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhóm máu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodGroups.map((bg) => (
                          <SelectItem key={bg.id} value={bg.id}>
                            <Badge variant="outline" className="font-medium">
                              {bg.name}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Lượng máu dự kiến */}
              <FormField
                control={form.control}
                name="expectedQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      Lượng máu dự kiến (mL)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100-500 mL"
                        min="100"
                        max="500"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ngày hiến máu */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      Ngày hiến máu
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "EEEE, dd MMMM yyyy", {
                                  locale: vi,
                                })
                              : "Chọn ngày hiến máu"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          locale={vi}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Thông tin bổ sung */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Thông tin bổ sung</h3>
              <p className="text-sm text-muted-foreground">
                Ghi chú hoặc yêu cầu đặc biệt (không bắt buộc)
              </p>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Ghi chú
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ví dụ: Tiền sử bệnh lý, thuốc đang sử dụng, yêu cầu đặc biệt..."
                      className="min-h-[80px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="w-full sm:w-auto min-w-[200px]"
              disabled={submitting || !isAuthenticated}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Đăng ký hiến máu
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
