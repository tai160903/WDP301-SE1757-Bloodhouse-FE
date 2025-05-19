/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Định nghĩa schema với TypeScript
const formSchema = z.object({
  facilityId: z.string().min(1, "Vui lòng chọn trung tâm hiến máu"),
  bloodGroupId: z.string().min(1, "Vui lòng chọn nhóm máu"),
  bloodComponent: z
    .enum(["Máu toàn phần", "Hồng cầu", "Huyết tương", "Tiểu cầu"])
    .optional(),
  date: z.date().optional(),
  time: z.string().optional(),
  source: z.enum(["Tự nguyện", "Yêu cầu"]).optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function BloodDonationRegistrationForm({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}) {
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilityId: "",
      bloodGroupId: "",
      bloodComponent: "Máu toàn phần",
      source: "Tự nguyện",
      notes: "",
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      // Kết hợp date và time thành preferredDate
      let preferredDate: string | undefined
      if (values.date && values.time) {
        preferredDate = format(
          new Date(
            values.date.getFullYear(),
            values.date.getMonth(),
            values.date.getDate(),
            parseInt(values.time.split(":")[0]),
            parseInt(values.time.split(":")[1])
          ),
          "yyyy-MM-dd'T'HH:mm:ss'Z'"
        )
      }

      const payload = {
        facilityId: values.facilityId,
        bloodGroupId: values.bloodGroupId,
        bloodComponent: values.bloodComponent,
        preferredDate,
        source: values.source,
        notes: values.notes,
      }

      const token = localStorage.getItem("authToken") // Thay bằng cơ chế xác thực
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Đăng ký hiến máu thất bại")
      }

      const data = await response.json()
      setFormStatus({ type: "success", message: data.message || "Đăng ký hiến máu thành công" })
      form.reset()
      onSuccess?.(data)
    } catch (error: any) {
      setFormStatus({ type: "error", message: error.message || "Có lỗi xảy ra, vui lòng thử lại" })
      onError?.(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {formStatus && (
          <Alert variant={formStatus.type === "success" ? "default" : "destructive"}>
            {formStatus.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{formStatus.type === "success" ? "Thành công" : "Lỗi"}</AlertTitle>
            <AlertDescription>{formStatus.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="facilityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trung tâm hiến máu</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue placeholder="Chọn trung tâm hiến máu" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="60f7b3a4b9c4e1234567890">Trung tâm Hiến máu Quốc gia</SelectItem>
                    <SelectItem value="60f7b3a4b9c4e1234567891">Bệnh viện Chợ Rẫy</SelectItem>
                    <SelectItem value="60f7b3a4b9c4e1234567892">Bệnh viện Bạch Mai</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bloodGroupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhóm máu</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue placeholder="Chọn nhóm máu" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="60f7b3a4b9c4e1234567800">A+</SelectItem>
                    <SelectItem value="60f7b3a4b9c4e1234567801">A-</SelectItem>
                    <SelectItem value="60f7b3a4b9c4e1234567802">B+</SelectItem>
                    <SelectItem value="60f7b3a4b9c4e1234567803">B-</SelectItem>
                    <SelectItem value="60f7b3a4b9c4e1234567804">AB+</SelectItem>
                    <SelectItem value="60f7b3a4b9c4e1234567805">AB-</SelectItem>
                    <SelectItem value="60f7b3a4b9c4e1234567806">O+</SelectItem>
                    <SelectItem value="60f7b3a4b9c4e1234567807">O-</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bloodComponent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại máu</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue placeholder="Chọn loại máu" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Máu toàn phần">Máu toàn phần</SelectItem>
                    <SelectItem value="Hồng cầu">Hồng cầu</SelectItem>
                    <SelectItem value="Huyết tương">Huyết tương</SelectItem>
                    <SelectItem value="Tiểu cầu">Tiểu cầu</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ngày hiến máu</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal hover:bg-red-50 hover:text-red-600",
                          !field.value && "text-muted-foreground"
                        )}
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
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ hiến máu</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue placeholder="Chọn giờ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="12:00">12:00</SelectItem>
                    <SelectItem value="13:00">13:00</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nguồn</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue placeholder="Chọn nguồn hiến máu" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tự nguyện">Tự nguyện</SelectItem>
                    <SelectItem value="Yêu cầu">Yêu cầu</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cung cấp thông tin y tế hoặc ghi chú bổ sung"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => form.reset()}
            className="hover:bg-red-50 hover:text-red-600"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Đặt lịch hiến máu
          </Button>
        </div>
      </form>
    </Form>
  )
}