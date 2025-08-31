"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { selectStyles } from "@/lib/utils";
import { useSubdomin } from "@/provider/SubdomainContext";
import { updateUserAddress } from "../apICallCenter/apisUser";
import { FaSpinner } from "react-icons/fa";
import { editUserAddressSchema } from "./shcemas/editUserAddressSchema";
function EditAddressDiaolg({
  color,
  theme,
  areasOptions,
  handleChangeArea,
  token,
  phone,
  queryClient,
  setCustomAddressName,
  seEditAddressType,
  selectedEditAddress,
  editAddressType,
  customAddressName,
  apiBaseUrl,
  openEditAddressDialog, setOpenEditAddressDialog, refetch
}) {
  const {
    control: controlEditAddress,
    register: registerEditAddressUser,
    handleSubmit: handleEditAddressUser,
    setValue: setValueEditAddressUser,
    formState: { errors: errorsEditAddressUser },
  } = useForm({
    resolver: zodResolver(editUserAddressSchema),
    mode: "onSubmit",
  });
  const [lodaingEditAddressData, setLodaingEditAddressData] = useState(false);

  useEffect(() => {
    if (selectedEditAddress) {
      // تأكد من أن القيمة موجودة أولاً قبل تعيينها
      const selectedAreaOption = areasOptions?.find(
        (option) => option.value === selectedEditAddress.area
      );

      if (selectedAreaOption) {
        setValueEditAddressUser("area", selectedAreaOption);
      }

      // تحقق من وجود القيم قبل تعيينها
      if (["home", "work"].includes(selectedEditAddress.address_name)) {
        seEditAddressType(selectedEditAddress.address_name);
        setCustomAddressName("");
      } else {
        seEditAddressType("other");
        setCustomAddressName(selectedEditAddress.address_name || "");
      }

      setValueEditAddressUser("street", selectedEditAddress.street || "");
      setValueEditAddressUser("building", selectedEditAddress.building || "");
      setValueEditAddressUser("floor", selectedEditAddress.floor || "");
      setValueEditAddressUser("apt", selectedEditAddress.apartment || "");
      setValueEditAddressUser(
        "additionalInfo",
        selectedEditAddress.additional || ""
      );
    }
  }, [selectedEditAddress, setValueEditAddressUser]);

  const handleEditAddressTypeChange = (type) => {
    seEditAddressType(type);

    if (type === "other") {
      setCustomAddressName("");
      setValueEditAddressUser("name", "");
    } else {
      setCustomAddressName("");
      setValueEditAddressUser("name", type);
    }
  };
  const onSubmitEditUserAddress = async (data) => {
    // console.log("apiBaseUrl onSubmitEditUserAddress", data);
    setLodaingEditAddressData(true);
    const nameValue =
      typeof data.name === "string" && data.name.trim() !== ""
        ? data.name
        : "home";
    try {
      // console.log("token onSubmitEditUserAddress:", token);
      // const response = await updateUserAddress(formattedData);
      const response = await updateUserAddress({
        id: selectedEditAddress.id,
        area: data.area.value,
        street: data.street || "",
        building: data.building || "",
        floor: data.floor || "",
        apt: data.apt || "",
        additional: data.additionalInfo || "",
        address_name: nameValue,
        token,
        apiBaseUrl,
      });

      if (response) {
        setOpenEditAddressDialog(false);
        toast.success("Address updated successfully");
        await queryClient.invalidateQueries(["userSearch"]);
        refetch();
      } else {
        toast.error("Something went wrong");
      }

      // console.log("Response onSubmit:", response);
    } catch (error) {
      console.error("Error updating user address:", error);
      toast.error("Failed to update address. Please try again.");
    } finally {
      setLodaingEditAddressData(false);

    }
  };
  return (
    <Dialog
      open={openEditAddressDialog}
      onOpenChange={setOpenEditAddressDialog}
    >
      <DialogContent size="3xl">
        <DialogHeader>
          <DialogTitle>Edit User Address</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleEditAddressUser(onSubmitEditUserAddress)}
          className="space-y-4"
        >
          {/* Select Field */}
          <div>
            <label className="block mb-1">Area</label>
            <Controller
              name="area"
              control={controlEditAddress}
              rules={{ required: "Area is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={areasOptions || []}
                  placeholder="Area"
                  className="react-select w-full"
                  classNamePrefix="select"
                  value={
                    areasOptions?.find(
                      (option) => option.value === field.value?.value
                    ) || null
                  }
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption);
                    handleChangeArea(selectedOption);
                  }}
                  styles={selectStyles(theme, color)}
                />
              )}
            />
          </div>
          {errorsEditAddressUser.area && (
            <p className="text-red-500 text-sm">
              {errorsEditAddressUser.area.message}
            </p>
          )}

          {/* Input Fields */}
          <div className="flex gap-2 items-center my-3">
            <div className="flex-1">
              <label className="block mb-1">Street</label>
              <Input
                type="text"
                {...registerEditAddressUser("street")}
                className="w-full text-important"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Building</label>
              <Input
                type="text"
                {...registerEditAddressUser("building")}
                className="w-full text-important"
              />
            </div>
          </div>

          <div className="flex gap-2 items-center my-3">
            <div className="flex-1">
              <label className="block mb-1">Floor</label>
              <Input
                type="text"
                {...registerEditAddressUser("floor")}
                className="w-full text-important"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Apt</label>
              <Input
                type="text"
                {...registerEditAddressUser("apt")}
                className="w-full text-important"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Landmark</label>
            <Input
              type="text"
              {...registerEditAddressUser("additionalInfo")}
              className="w-full text-important"
            />
          </div>

          <div className="space-y-1">
            <div className="flex gap-4 items-center">
              {["home", "work", "other"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <Input
                    type="checkbox"
                    name="addressType"
                    className="mt-1"
                    value={type}
                    checked={editAddressType === type}
                    onChange={() => handleEditAddressTypeChange(type)}
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>

            {editAddressType === "other" && (
              <Input
                type="text"
                placeholder="Enter address name"
                value={customAddressName}
                onChange={(e) => {
                  setCustomAddressName(e.target.value);
                  setValueEditAddressUser("name", e.target.value);
                }}
                className="text-important"
              />
            )}
          </div>

          <DialogFooter className="flex justify-end gap-4">
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => setOpenEditAddressDialog(false)}
              >
                Close
              </Button>
            </DialogClose>
            {lodaingEditAddressData ? (
              <Button
                type="submit"
                disabled
                className="w-[150px] flex items-center justify-center"
              >
                <FaSpinner className="animate-spin mr-2" />

              </Button>
            ) : (
              <Button type="submit">Save Changes</Button>
            )}

          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditAddressDiaolg;
