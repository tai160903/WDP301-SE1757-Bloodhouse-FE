import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Select from "react-select";
import { getAllStaffsNotAssignedToFacility } from "@/services/facilityStaff";
import axios from "axios";

interface StaffOption {
  value: string;
  label: string;
}

interface Facility {
  name: string;
  code?: string;
  address?: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  contactPhone?: string;
  contactEmail?: string;
  isActive: boolean;
  managerId?: string;
  doctorIds?: string[] | null;
  nurseIds?: string[] | null;
  imageUrl?: string;
  _id?: string;
}

interface CreateFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Facility | null;
}

const CreateFacilityModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: CreateFacilityModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [managerOptions, setManagerOptions] = useState<StaffOption[]>([]);
  const [doctorOptions, setDoctorOptions] = useState<StaffOption[]>([]);
  const [nurseOptions, setNurseOptions] = useState<StaffOption[]>([]);

  console.log("Initial Data:", initialData);

  interface FacilityFormValues {
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    contactPhone: string;
    contactEmail: string;
    managerId: StaffOption | null;
    doctorIds: StaffOption[];
    nurseIds: StaffOption[];
    image: FileList | null;
  }

  const defaultValues: FacilityFormValues = {
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    contactPhone: "",
    contactEmail: "",
    managerId: null,
    doctorIds: [],
    nurseIds: [],
    image: null,
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FacilityFormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) {
      reset(defaultValues);
      setImagePreview(null);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (isOpen) {
      fetchStaffOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData && isOpen) {
      setValue("name", initialData.name || "");
      setValue("address", initialData.address || "");
      if (initialData.location && initialData.location.coordinates) {
        setValue(
          "latitude",
          initialData.location.coordinates[1]?.toString() || ""
        );
        setValue(
          "longitude",
          initialData.location.coordinates[0]?.toString() || ""
        );
      }

      setValue("contactPhone", initialData.contactPhone || "");
      setValue("contactEmail", initialData.contactEmail || "");

      if (managerOptions.length > 0 && initialData.managerId) {
        const managerOption = managerOptions.find(
          (opt) => opt.value === initialData.managerId
        );

        if (managerOption) {
          setValue("managerId", managerOption);
        } else {
          setValue("managerId", {
            value: initialData.managerId,
            label: "Current Manager",
          });
        }
      }

      if (
        Array.isArray(initialData?.doctorIds) &&
        initialData?.doctorIds?.length > 0
      ) {
        if (doctorOptions.length > 0) {
          const doctorValues = initialData?.doctorIds.map((id) => ({
            value: id,
            label:
              doctorOptions.find((opt) => opt.value === id)?.label || "Doctor",
          }));
          setValue("doctorIds", doctorValues);
        }
      }

      if (
        Array.isArray(initialData?.nurseIds) &&
        initialData.nurseIds?.length > 0
      ) {
        if (nurseOptions.length > 0) {
          const nurseValues = initialData.nurseIds.map((id) => ({
            value: id,
            label:
              nurseOptions.find((opt) => opt.value === id)?.label || "Nurse",
          }));
          setValue("nurseIds", nurseValues);
        }
      }

      // Image preview
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [
    initialData,
    isOpen,
    setValue,
    managerOptions,
    doctorOptions,
    nurseOptions,
  ]);

  const fetchStaffOptions = async () => {
    try {
      const [managerResponse, doctorResponse, nurseResponse] =
        await Promise.all([
          getAllStaffsNotAssignedToFacility("MANAGER"),
          getAllStaffsNotAssignedToFacility("DOCTOR"),
          getAllStaffsNotAssignedToFacility("NURSE"),
        ]);

      setManagerOptions(
        managerResponse?.data?.map((staff: any) => ({
          value: staff.userId._id,
          label: `${staff?.userId?.fullName}`,
        })) || []
      );

      setDoctorOptions(
        doctorResponse?.data?.map((staff: any) => ({
          value: staff.userId._id,
          label: `${staff?.userId?.fullName}`,
        })) || []
      );

      setNurseOptions(
        nurseResponse?.data?.map((staff: any) => ({
          value: staff.userId._id,
          label: `${staff?.userId?.fullName}`,
        })) || []
      );
    } catch (error) {
      console.error("Error fetching staff options:", error);
      toast.error("Failed to load staff data");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Custom reset function to handle modal close
  const handleCloseModal = () => {
    reset(defaultValues);
    setImagePreview(null);
    onClose();
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Add basic form fields
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("latitude", data.latitude);
      formData.append("longitude", data.longitude);
      formData.append("contactPhone", data.contactPhone);
      formData.append("contactEmail", data.contactEmail);

      // Add manager ID
      if (data.managerId?.value) {
        formData.append("managerId", data.managerId.value);
      }

      // Handle doctor IDs with proper JSON stringification
      if (data.doctorIds?.length > 0) {
        const doctorIdArray = data.doctorIds.map(
          (doctor: StaffOption) => doctor.value
        );
        formData.append("doctorIds", JSON.stringify(doctorIdArray));
      } else {
        formData.append("doctorIds", JSON.stringify([]));
      }

      // Handle nurse IDs with proper JSON stringification
      if (data.nurseIds?.length > 0) {
        const nurseIdArray = data.nurseIds.map(
          (nurse: StaffOption) => nurse.value
        );
        formData.append("nurseIds", JSON.stringify(nurseIdArray));
      } else {
        formData.append("nurseIds", JSON.stringify([]));
      }

      // Add image if available
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      // Submit - different endpoints for create vs update
      if (initialData?._id) {
        await axios.put(`/api/facilities/${initialData._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Facility updated successfully!");
      } else {
        await axios.post("/api/facilities", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Facility created successfully!");
      }

      // Success handling
      onSuccess();
      handleCloseModal();
    } catch (error) {
      console.error(
        initialData ? "Error updating facility:" : "Error creating facility:",
        error
      );
      toast.error(
        initialData ? "Failed to update facility" : "Failed to create facility"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalTitle = initialData ? "Edit Facility" : "Create New Facility";
  const submitButtonText = initialData ? "Update Facility" : "Create Facility";
  const loadingText = initialData ? "Updating..." : "Creating...";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{modalTitle}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseModal}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="overflow-y-auto p-6 max-h-[calc(90vh-132px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="block mb-1">
                    Facility Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name", {
                      required: "Facility name is required",
                    })}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address" className="block mb-1">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    {...register("address", {
                      required: "Address is required",
                    })}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message?.toString()}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="latitude" className="block mb-1">
                      Latitude <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      {...register("latitude", {
                        required: "Latitude is required",
                        valueAsNumber: true,
                      })}
                      className={errors.latitude ? "border-red-500" : ""}
                    />
                    {errors.latitude && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.latitude.message?.toString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="longitude" className="block mb-1">
                      Longitude <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      {...register("longitude", {
                        required: "Longitude is required",
                        valueAsNumber: true,
                      })}
                      className={errors.longitude ? "border-red-500" : ""}
                    />
                    {errors.longitude && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.longitude.message?.toString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contactPhone" className="block mb-1">
                    Contact Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactPhone"
                    {...register("contactPhone", {
                      required: "Contact phone is required",
                    })}
                    className={errors.contactPhone ? "border-red-500" : ""}
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactPhone.message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactEmail" className="block mb-1">
                    Contact Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    {...register("contactEmail", {
                      required: "Contact email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={errors.contactEmail ? "border-red-500" : ""}
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactEmail.message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="image" className="block mb-1">
                    Facility Image
                  </Label>
                  <div className="mt-1 flex items-center">
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
                    >
                      <Upload className="mr-2 h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {imagePreview ? "Change image" : "Upload image"}
                      </span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        {...register("image")}
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-3 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-auto rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black/70"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Staff Selection */}
            <div className="space-y-4 pt-2 border-t border-gray-200">
              <div>
                <Label htmlFor="managerId" className="block mb-1">
                  Facility Manager <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="managerId"
                  control={control}
                  rules={{ required: "Facility manager is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={managerOptions}
                      className={errors.managerId ? "react-select-error" : ""}
                      placeholder="Select a manager"
                      isSearchable
                      classNamePrefix="react-select"
                    />
                  )}
                />
                {errors.managerId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.managerId.message?.toString()}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="doctorIds" className="block mb-1">
                    Doctors
                  </Label>
                  <Controller
                    name="doctorIds"
                    control={control}
                    render={({ field }) => (
                      <Select<StaffOption, true>
                        {...field}
                        options={doctorOptions}
                        isMulti
                        placeholder="Select doctors"
                        isSearchable
                        classNamePrefix="react-select"
                      />
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="nurseIds" className="block mb-1">
                    Nurses
                  </Label>
                  <Controller
                    name="nurseIds"
                    control={control}
                    render={({ field }) => (
                      <Select<StaffOption, true>
                        {...field}
                        options={nurseOptions}
                        isMulti
                        placeholder="Select nurses"
                        isSearchable
                        classNamePrefix="react-select"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText}
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFacilityModal;
