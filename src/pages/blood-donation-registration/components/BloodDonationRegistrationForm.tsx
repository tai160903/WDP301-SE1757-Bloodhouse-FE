/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { instance } from "@/services/instance"

// Schema
const formSchema = z.object({
  facilityId: z.string().min(1, "Vui lòng chọn trung tâm hiến máu"),
  bloodGroupId: z.string().min(1, "Vui lòng chọn nhóm máu"),
  bloodComponentId: z.string().min(1, "Vui lòng chọn loại máu"),
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
  const [facilities, setFacilities] = useState<{ id: string; name: string }[]>([])
  const [bloodGroups, setBloodGroups] = useState<{ id: string; name: string }[]>([])
  const [bloodComponents, setBloodComponents] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState("")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilityId: "",
      bloodGroupId: "",
      bloodComponentId: "",
      source: "Tự nguyện",
      notes: "",
      date: undefined,
      time: "",
    },
  })

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [fRes, bgRes, bcRes] = await Promise.all([
          instance.get("/facility"),
          instance.get("/blood-group"),
          instance.get("/blood-component"),
        ])

        // Map API responses to { id, name } format
        setFacilities(
          fRes.data.data.result.map((f: any) => ({
            id: f._id,
            name: f.name,
          }))
        )
        setBloodGroups(
          bgRes.data.data.map((bg: any) => ({
            id: bg._id,
            name: bg.name,
          }))
        )
        setBloodComponents(
          bcRes.data.data.map((bc: any) => ({
            id: bc._id,
            name: bc.name,
          }))
        )
      } catch (err) {
        console.error("Lỗi fetch dropdown:", err)
        setErrorLoading("Không thể tải dữ liệu, thử tải lại trang.")
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  async function onSubmit(values: FormValues) {
    try {
      let preferredDate: string | undefined
      if (values.date && values.time) {
        preferredDate = format(
          new Date(
            values.date.getFullYear(),
            values.date.getMonth(),
            values.date.getDate(),
            +values.time.split(":")[0],
            +values.time.split(":")[1]
          ),
          "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        )
      }
      const payload = {
        facilityId: values.facilityId,
        bloodGroupId: values.bloodGroupId,
        bloodComponentId: values.bloodComponentId,
        preferredDate,
        source: values.source,
        notes: values.notes,
      }
      console.log("Submitting payload:", payload) // Debug payload
      const { data } = await instance.post("/blood-donation-registration", payload)
      setFormStatus({ type: "success", message: data.message || "Đăng ký hiến máu thành công!" })
      form.reset()
      onSuccess?.(data)
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus(null)
      }, 5000)
    } catch (error: any) {
      console.error("Submission error:", error.response?.data) // Debug error
      setFormStatus({
        type: "error",
        message: error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
      })
      onError?.(error)
      // Clear error message after 5 seconds
      setTimeout(() => {
        setFormStatus(null)
      }, 5000)
    }
  }

  if (loading) return <div className="text-center">Đang tải dữ liệu...</div>
  if (errorLoading) return <div className="text-red-600 text-center">{errorLoading}</div>

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {formStatus && (
          <Alert
            variant={formStatus.type === "success" ? "default" : "destructive"}
            className={cn(
              "border-2",
              formStatus.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
            )}
          >
            {formStatus.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <AlertTitle className={formStatus.type === "success" ? "text-green-600" : "text-red-600"}>
              {formStatus.type === "success" ? "Thành công" : "Lỗi"}
            </AlertTitle>
            <AlertDescription className={formStatus.type === "success" ? "text-green-600" : "text-red-600"}>
              {formStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trung tâm hiến máu */}
          <FormField
            control={form.control}
            name="facilityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trung tâm hiến máu</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Chọn trung tâm</option>
                    {facilities.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
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
                <FormLabel>Nhóm máu</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Chọn nhóm máu</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg.id} value={bg.id}>
                        {bg.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Loại máu */}
          <FormField
            control={form.control}
            name="bloodComponentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại máu</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Chọn loại máu</option>
                    {bloodComponents.map((bc) => (
                      <option key={bc.id} value={bc.id}>
                        {bc.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày */}
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
                        {field.value ? format(field.value, "PPP") : "Chọn ngày"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(d) => d < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nguồn */}
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nguồn</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Chọn nguồn</option>
                    <option value="Tự nguyện">Tự nguyện</option>
                    <option value="Yêu cầu">Yêu cầu</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Ghi chú */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder="Thông tin y tế hoặc ghi chú" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
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