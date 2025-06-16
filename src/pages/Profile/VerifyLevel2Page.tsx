import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { userAPI } from "@/utils/axiosInstance";
import { BloodGroup, getBloodGroups } from "@/services/bloodGroup/blood-group";

interface VerifyLevel2Form {
  idCard: string;
  fullName: string;
  yob: string;
  sex: string;
  address: string;
  phone: string;
  bloodId: string;
}

interface VerifyLevel2PageProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<VerifyLevel2Form>;
  fetchProfile: () => void;
}

const initialForm: VerifyLevel2Form = {
  idCard: "",
  fullName: "",
  yob: "",
  sex: "",
  address: "",
  phone: "",
  bloodId: "",
};

const VerifyLevel2Page: React.FC<VerifyLevel2PageProps> = ({
  open,
  onClose,
  initialData,
  fetchProfile,
}) => {
  const [form, setForm] = React.useState<VerifyLevel2Form>({
    ...initialForm,
    ...initialData,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([]);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [touched, setTouched] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
        yob: initialData.yob ? formatYobToDateInput(initialData.yob) : "",
      }));
    }
  }, [initialData, open]);

  useEffect(() => {
    const fetchBloodGroups = async () => {
      const res = await getBloodGroups();
      setBloodGroups(res);
    };
    fetchBloodGroups();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setTouched(true);
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDialogInteractOutside = (e: Event) => {
    if (touched) {
      e.preventDefault();
      setShowConfirmClose(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.phone) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!form.bloodId) {
      setError('Vui lòng chọn nhóm máu');
      return;
    }
    setSubmitting(true);
    try {
      const submitData = {
        ...form,
        yob: form.yob ? new Date(form.yob).toISOString() : "",
      };
      await userAPI.post("/verify-level2", submitData);
      setSuccess("Xác thực thành công!");
      setTimeout(() => {
        setSuccess(null);
        onClose();
        fetchProfile();
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Có lỗi xảy ra khi xác thực");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open && touched) {
          setShowConfirmClose(true);
        } else if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-lg border-t-8"
        style={{ borderTopColor: "#d40c3b" }}
        onInteractOutside={handleDialogInteractOutside}
        onEscapeKeyDown={handleDialogInteractOutside}
      >
        <DialogHeader>
          <DialogTitle className="text-[#d40c3b] text-2xl font-bold">
            Xác thực mức 2
          </DialogTitle>
          <DialogDescription className="text-[#d40c3b] font-medium">
            Vui lòng kiểm tra và bổ sung thông tin còn thiếu.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="idCard"
            placeholder="Số CCCD"
            value={form.idCard}
            onChange={handleChange}
            required
            disabled={!!initialData?.idCard}
          />
          <Input
            name="fullName"
            placeholder="Họ và tên"
            value={form.fullName}
            onChange={handleChange}
            required
            disabled={!!initialData?.fullName}
          />
          <div>
            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
            <input
              name="yob"
              type="date"
              placeholder="Năm sinh"
              value={form.yob}
              onChange={handleChange}
              required
              disabled={!!initialData?.yob}
              className="w-full border rounded-md px-3 py-2 outline-none transition"
            />
          </div>
          <select
            name="sex"
            value={form.sex}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 outline-none transition"
            required
            disabled={!!initialData?.sex}
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          <Input
            name="address"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={handleChange}
            required
            disabled={!!initialData?.address}
          />
          <Input
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <select
            name="bloodId"
            value={form.bloodId}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 outline-none transition"
            required
          >
            <option value="">Chọn nhóm máu</option>
            {bloodGroups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (touched) {
                  setShowConfirmClose(true);
                } else {
                  onClose();
                }
              }}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="hover:bg-[#b20a32]"
            >
              {submitting ? "Đang gửi..." : "Xác thực"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <Dialog open={showConfirmClose} onOpenChange={setShowConfirmClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bạn có chắc muốn ngừng xác thực?</DialogTitle>
            <DialogDescription>
              Việc này có thể khiến bạn phải xác thực lại và tốn phí thêm. Bạn
              có chắc chắn muốn đóng?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmClose(false)}
            >
              Không, quay lại
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowConfirmClose(false);
                onClose();
                setTouched(false);
              }}
            >
              Đúng, đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

// Helper: convert dd/mm/yyyy or yyyy-mm-dd to yyyy-mm-dd
function formatYobToDateInput(yob: string | undefined): string {
  if (!yob) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(yob)) return yob; // yyyy-mm-dd
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(yob)) {
    const [day, month, year] = yob.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return yob;
}

export default VerifyLevel2Page;
