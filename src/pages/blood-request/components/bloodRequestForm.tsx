"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { forwardRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getFacilities } from "@/services/location/facility";
import { getBloodGroups } from "@/services/bloodGroup/blood-group";
import { getBloodComponents } from "@/services/bloodComponent/blood-component";
import { createBloodRequest } from "@/services/bloodRequest";

const FormInput = forwardRef<HTMLInputElement, any>((props, ref) => (
  <Input {...props} ref={ref} />
));
FormInput.displayName = "FormInput";

interface BloodRequestFormProps {
  isUrgent: boolean;
}

// Updated schema to match API requirements
const formSchema = z.object({
  patientName: z.string().min(2, { message: "Tên bệnh nhân là bắt buộc" }),
  patientPhone: z.string().optional(),
  groupId: z.string().min(1, { message: "Nhóm máu là bắt buộc" }),
  componentId: z.string().optional(),
  quantity: z.string().min(1, { message: "Số lượng là bắt buộc" }),
  facilityId: z.string().min(1, { message: "Cơ sở y tế là bắt buộc" }),
  address: z.string().min(1, { message: "Địa chỉ giao hàng là bắt buộc" }),
  preferredDate: z.date({
    required_error: "Ngày cần máu là bắt buộc",
  }),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .optional()
    .or(z.literal("")),
  reason: z.string().min(1, { message: "Lý do y tế là bắt buộc" }),
  note: z.string().optional(),
  medicalDocuments: z
    .array(z.instanceof(File))
    .min(1, { message: "Ít nhất 1 tài liệu y tế là bắt buộc" })
    .max(5, { message: "Tối đa 5 tài liệu y tế" }),
  consent: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với các điều khoản và điều kiện",
  }),
});

type FormData = z.infer<typeof formSchema>;

// Mock API functions - replace with your actual API calls
// const createBloodRequest = async (
//   formValues: {
//     groupId: string;
//     quantity: number;
//     address: string;
//     reason: string;
//     preferredDate: Date;
//     facilityId: string;
//     componentId?: string;
//     isUrgent?: boolean;
//     latitude?: number;
//     longitude?: number;
//     note?: string;
//   },
//   medicalDocuments: File[] = []
// ): Promise<any> => {
//   try {
//     const formData = new FormData();
//     formData.append("groupId", formValues.groupId);
//     formData.append("facilityId", formValues.facilityId);
//     formData.append("quantity", String(formValues.quantity));
//     formData.append("address", formValues.address);
//     formData.append("reason", formValues.reason);
//     formData.append("preferredDate", formValues.preferredDate.toISOString());

//     if (formValues.componentId)
//       formData.append("componentId", formValues.componentId);
//     if (formValues.isUrgent !== undefined)
//       formData.append("isUrgent", String(formValues.isUrgent));
//     if (formValues.latitude !== undefined)
//       formData.append("latitude", String(formValues.latitude));
//     if (formValues.longitude !== undefined)
//       formData.append("longitude", String(formValues.longitude));
//     if (formValues.note) formData.append("note", formValues.note);

//     // Upload medical documents
//     for (const file of medicalDocuments) {
//       formData.append("medicalDocuments", file);
//     }

//     // Mock API call - replace with your actual API endpoint
//     console.log("Sending blood request:", formValues);
//     console.log("Medical documents:", medicalDocuments);

//     // Simulate API response
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ success: true, message: "Yêu cầu đã được gửi thành công" });
//       }, 1000);
//     });
//   } catch (error: any) {
//     throw new Error(error?.response?.data?.message || "Lỗi khi gọi API.");
//   }
// };

export function BloodRequestForm({ isUrgent }: BloodRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bloodGroups, setBloodGroups] = useState<any[]>([]);
  const [bloodComponents, setBloodComponents] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);

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

  useEffect(() => {
    const fetchComponents = async () => {
      setLoading(true);
      try {
        const data = await getBloodComponents();
        setBloodComponents(data);
      } catch (err: any) {
        console.log(err.message || "Không thể tải danh sách thành phần máu.");
      } finally {
        setLoading(false);
      }
    };
    fetchComponents();
  }, []);

  useEffect(() => {
    const fetchFacility = async () => {
      setLoading(true);
      try {
        const data = await getFacilities();
        setFacilities(data.data.result);
      } catch (error) {
        console.error("Error fetching blood inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      patientPhone: "",
      groupId: "",
      componentId: "",
      quantity: "",
      facilityId: "",
      address: "",
      preferredDate: new Date(),
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      reason: "",
      note: "",
      medicalDocuments: [],
      consent: false,
    },
  });

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const currentFiles = form.getValues("medicalDocuments");
    const newFiles = Array.from(files);
    const totalFiles = [...currentFiles, ...newFiles];

    if (totalFiles.length > 5) {
      alert("Tối đa 5 tài liệu y tế được phép");
      return;
    }

    form.setValue("medicalDocuments", totalFiles);
  };

  const removeFile = (index: number) => {
    const currentFiles = form.getValues("medicalDocuments");
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    form.setValue("medicalDocuments", updatedFiles);
  };

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    console.log(values);
    try {
      await createBloodRequest(
        {
          groupId: values.groupId,
          facilityId: values.facilityId,
          quantity: Number(values.quantity),
          address: values.address,
          reason: values.reason,
          preferredDate: values.preferredDate,
          componentId: values.componentId || undefined,
          isUrgent: isUrgent,
          note: values.note || "",
        },
        values.medicalDocuments
      );

      console.log(values);

      alert("Yêu cầu đã được gửi thành công!");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Patient Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin bệnh nhân</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên bệnh nhân *</FormLabel>
                    <FormControl>
                      <FormInput placeholder="Nhập tên bệnh nhân" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điện thoại bệnh nhân</FormLabel>
                    <FormControl>
                      <FormInput
                        type="number"
                        placeholder="Nhập sđt bệnh nhân"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Blood Requirements */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Yêu cầu máu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhóm máu yêu cầu *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhóm máu cần thiết" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group._id} value={group._id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="componentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thành phần máu</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thành phần máu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodComponents.map((component) => (
                          <SelectItem key={component._id} value={component._id}>
                            {component.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Chỉ định thành phần máu cần thiết
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng đơn vị *</FormLabel>
                    <FormControl>
                      <FormInput
                        type="number"
                        placeholder="Nhập số lượng đơn vị"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Số đơn vị máu cần thiết</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày cần máu *</FormLabel>
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
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày</span>
                            )}
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
                            date < new Date() ||
                            date >
                              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Thời gian cần máu (tối đa 30 ngày)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin địa điểm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="facilityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cơ sở y tế *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn cơ sở y tế" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem key={facility._id} value={facility._id}>
                            {facility.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Cơ sở y tế ưu tiên</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ giao hàng *</FormLabel>
                    <FormControl>
                      <FormInput
                        placeholder="Nhập địa chỉ chi tiết"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Địa chỉ cụ thể để giao máu
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin liên hệ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người liên hệ</FormLabel>
                    <FormControl>
                      <FormInput
                        placeholder="Nhập tên người liên hệ"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <FormInput placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email liên hệ</FormLabel>
                    <FormControl>
                      <FormInput
                        type="email"
                        placeholder="Nhập email liên hệ"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin y tế</h2>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lý do y tế *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Vui lòng mô tả lý do cần máu (chẩn đoán, tình trạng bệnh nhân...)"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Cung cấp thông tin chi tiết về lý do cần máu
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isUrgent && (
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú khẩn cấp</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Vui lòng giải thích lý do yêu cầu này khẩn cấp"
                          className="resize-none"
                          rows={3}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Cung cấp chi tiết về lý do yêu cầu này khẩn cấp
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!isUrgent && (
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú thêm</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Thông tin bổ sung (nếu có)"
                          className="resize-none"
                          rows={2}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medical Documents Upload */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Tài liệu y tế *</h2>
            <FormField
              control={form.control}
              name="medicalDocuments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload tài liệu y tế (1-5 files)</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <Upload className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Nhấp để chọn tài liệu hoặc kéo thả vào đây
                          </span>
                          <span className="text-xs text-gray-500">
                            PDF, JPG, PNG, DOC, DOCX (Tối đa 5 files)
                          </span>
                        </label>
                      </div>

                      {field.value && field.value.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Tài liệu đã chọn ({field.value.length}/5):
                          </p>
                          {field.value.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-blue-500" />
                                <span className="text-sm text-gray-700">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Tải lên các tài liệu y tế liên quan như kết quả xét nghiệm,
                    chẩn đoán, đơn thuốc... (Bắt buộc từ 1-5 files)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Consent */}
        <Card>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      Tôi xác nhận tất cả thông tin được cung cấp là chính xác
                      và đầy đủ *
                    </FormLabel>
                    <FormDescription className="text-xs">
                      Bằng cách đánh dấu vào ô này, bạn đồng ý với việc xử lý
                      yêu cầu này và chia sẻ thông tin liên quan với người hiến
                      máu tiềm năng.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            className={cn(
              "min-w-[150px]",
              isUrgent && "bg-red-600 hover:bg-red-700"
            )}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Đang gửi..."
              : isUrgent
              ? "Gửi yêu cầu khẩn cấp"
              : "Gửi yêu cầu"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default BloodRequestForm;
