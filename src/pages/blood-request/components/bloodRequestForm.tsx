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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { forwardRef } from "react";
import { createBloodRequest } from "@/services/bloodRequest";
import { getBloodGroups } from "@/services/bloodGroup/blood-group";
import { getBloodComponents } from "@/services/bloodComponent/blood-component";
import { getFacilities } from "@/services/location/facility";

const FormInput = forwardRef((props: any, ref) => (
  <Input {...props} ref={ref} />
));
FormInput.displayName = "FormInput";

interface BloodRequestFormProps {
  isUrgent: boolean;
}

const formSchema = z.object({
  patientName: z.string().min(2, { message: "Tên bệnh nhân là bắt buộc" }),
  patientAge: z.string().optional(),
  bloodType: z.string().optional(),
  componentType: z.string().optional(),
  units: z.string().optional(),
  hospital: z.string().optional(),
  requiredDate: z.date().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z
    .string()
    .email({ message: "Email không hợp lệ" })
    .optional()
    .or(z.literal("")),
  reason: z.string().optional(),
  medicalDetails: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với các điều khoản và điều kiện",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function BloodRequestForm({ isUrgent }: BloodRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bloodGroups, setBloodGroups] = useState<any[]>([]);
  const [bloodComponents, setBloodComponents] = useState<any[]>([]);
  const [facility, setFacility] = useState<any[]>([]);

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
        setFacility(data.data.result);
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
      patientAge: "",
      bloodType: "",
      componentType: "",
      units: "",
      hospital: "",
      requiredDate: new Date(),
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      reason: "",
      medicalDetails: "",
      consent: false,
    },
  });

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    try {
      await createBloodRequest(
        {
          groupId: values.bloodType || "",
          quantity: Number(values.units || 1),
          address: values.hospital || "",
          reason: values.reason || "",
          preferredDate: values.requiredDate || new Date(),
          componentId: values.componentType || undefined,
          isUrgent: isUrgent,
          note: values.medicalDetails || "",
        },
        []
      );

      form.reset();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên bệnh nhân</FormLabel>
                <FormControl>
                  <FormInput
                    placeholder="Nhập tên bệnh nhân"
                    {...field}
                    aria-invalid={!!form.formState.errors.patientName}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patientAge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tuổi bệnh nhân</FormLabel>
                <FormControl>
                  <FormInput
                    type="number"
                    placeholder="Nhập tuổi bệnh nhân"
                    {...field}
                    aria-invalid={!!form.formState.errors.patientAge}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bloodType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhóm máu yêu cầu</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className="w-full"
                      aria-label="Chọn nhóm máu"
                    >
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
            name="componentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thành phần máu</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className="w-full"
                      aria-label="Chọn thành phần máu"
                    >
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
            name="units"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượng đơn vị</FormLabel>
                <FormControl>
                  <FormInput
                    type="number"
                    placeholder="Nhập số lượng đơn vị"
                    {...field}
                    aria-invalid={!!form.formState.errors.units}
                  />
                </FormControl>
                <FormDescription>Số đơn vị máu cần thiết</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hospital"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bệnh viện/Cơ sở y tế</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className="w-full"
                      aria-label="Nhập tên bệnh viện"
                    >
                      <SelectValue placeholder="Nhập tên bệnh viện" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {facility.map((facility) => (
                      <SelectItem key={facility._id} value={facility._id}>
                        {facility.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Nơi máu sẽ được sử dụng</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requiredDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày cần máu</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        aria-label="Chọn ngày cần máu"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
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
                        date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
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
                    aria-invalid={!!form.formState.errors.contactName}
                  />
                </FormControl>
                <FormDescription>
                  Tên người liên hệ về yêu cầu này
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại liên hệ</FormLabel>
                <FormControl>
                  <FormInput
                    placeholder="Nhập số điện thoại liên hệ"
                    {...field}
                    aria-invalid={!!form.formState.errors.contactPhone}
                  />
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
                    aria-invalid={!!form.formState.errors.contactEmail}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isUrgent && (
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lý do khẩn cấp</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Vui lòng giải thích lý do yêu cầu này khẩn cấp"
                    className="resize-none"
                    {...field}
                    value={field.value ?? ""}
                    aria-invalid={!!form.formState.errors.reason}
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

        <FormField
          control={form.control}
          name="medicalDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chi tiết y tế</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Vui lòng cung cấp thông tin y tế liên quan"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""}
                  aria-invalid={!!form.formState.errors.medicalDetails}
                />
              </FormControl>
              <FormDescription>
                Bao gồm thông tin y tế liên quan như chẩn đoán, quy trình, v.v.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="Đồng ý với điều khoản"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Tôi xác nhận tất cả thông tin được cung cấp là chính xác và
                  đầy đủ
                </FormLabel>
                <FormDescription>
                  Bằng cách đánh dấu vào ô này, bạn đồng ý với việc xử lý yêu
                  cầu này và chia sẻ thông tin liên quan với người hiến máu tiềm
                  năng.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

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
            className={isUrgent ? "bg-red-600 hover:bg-red-700" : ""}
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
