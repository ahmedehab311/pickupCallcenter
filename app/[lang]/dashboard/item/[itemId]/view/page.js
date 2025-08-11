"use client";
"use client";
import { useEffect, useRef, useState } from "react";
import { useSubdomin } from "@/provider/SubdomainContext";
import Card from "@/components/ui/card-snippet";
import { selectStyles } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  NameFields,
  DescriptionFields,
  StatusFields,
  ImageUploadField,
  SubmitButton,
  EditAndViewButton,
  MenuField,
  ParentSectionSelect,
} from "@/app/[lang]/components/FormFields";
import { useParams } from "next/navigation";
import { BASE_URL } from "@/api/BaseUrl";
import {
  AssignItemToSection,
  useSections,
} from "../../../sections/apisSection";
import { itemSchema } from "../../../create-item/itemSchema";
import toast from "react-hot-toast";
function ViewAndEditItem() {
  const { itemId } = useParams();
  const { apiBaseUrl, subdomain } = useSubdomin();
  // const { token } = useToken();
  const token = localStorage.getItem("token");

  const {
    data: AllSections,
    isLoadingAllSections,
    errorAllSections,
    refetchAllSections,
  } = useSections(token, apiBaseUrl, "sections");
  const {
    data: Item,
    isLoading,
    error,
    refetch,
  } = useSections(token, apiBaseUrl, "item", itemId);

  const {
    data: Menus,
    isLoadingMenus,
    errorMenus,
    refetchMenus,
  } = useSections(token && apiBaseUrl ? token : null, apiBaseUrl, "menus");
  const menuOptions =
    Array.isArray(Menus) && Menus.length > 0
      ? Menus.map((menu) => ({
          value: menu.id,
          label: menu.name_en,
        }))
      : [];

  const sectionsOptions =
    Array.isArray(AllSections) && AllSections.length > 0
      ? AllSections.map((section) => ({
          value: section.id,
          label: section.name_en,
        }))
      : [];
  const { theme, color } = useThemeColor();
  const [formInitialized, setFormInitialized] = useState(false);
  const selectedMenu = menuOptions?.find(
    (menu) => menu.value === Item?.menu_id
  );
  console.log("menuOptions", menuOptions);

  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(true);
  const [trans, setTrans] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
    ...rest
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(itemSchema),
    defaultValues: {
      ...Item,
      // menu: selectedMenu || null,
    },
  });
  //   const {
  //   register,
  //   handleSubmit,
  //   control,
  //   formState: { errors },
  //   setValue,
  //   watch,
  //   reset,
  //   ...rest
  // } = useForm({
  //   mode: "onSubmit",
  //   resolver: zodResolver(itemSchema),
  // });

  useEffect(() => {
    if (Item) {
      setValue("enName", Item.name_en);
      setValue("arName", Item.name_ar);
      setValue("enDesc", Item.description_en);
      setValue("arDesc", Item.description_ar);
      setValue("status", Item.status ? 1 : 2);
      setValue("offer", Item.offer ? 1 : 2);
      if (Item.section) {
        setValue("section", {
          value: Item.section.id,
          label: Item.section.name_en,
        });
      }
      if (Item.section.menu) {
        setValue("menu", {
          value: Item.section.menu.id,
          label: Item.section.menu.name_en,
        });
      }
      if (Item.image) {
        setImagePreview(`${BASE_URL()}/${subdomain}/${Item.image}`);
      }
    }
  }, [setValue, Item, subdomain]);
  // console.log("Item", Item);

  //   useEffect(() => {
  //   if (Item) {
  //     reset({
  //       enName: Item.name_en,
  //       arName: Item.name_ar,
  //       enDesc: Item.description_en,
  //       arDesc: Item.description_ar,
  //       status: Item.status ? 1 : 2,
  //       offer: Item.offer ? 1 : 2,
  //       section: Item.section
  //         ? {
  //             value: Item.section.id,
  //             label: Item.section.name_en,
  //           }
  //         : null,
  //       Menu: selectedMenu || null,
  //     });

  //     if (Item.image) {
  //       setImagePreview(`${BASE_URL()}/${subdomain}/${Item.image}`);
  //     }
  //   }
  // }, [Item, selectedMenu, subdomain, reset]);

  const handleSectionChange = async (selctedOption, fieldOnchange) => {
    const newSectionId = selctedOption.value;
    const currentSectionId = Item.section.id;
    fieldOnchange(selctedOption);

    if (newSectionId !== currentSectionId) {
      try {
        const res = await AssignItemToSection(token, apiBaseUrl, itemId, {
          sectionId: newSectionId,
        });
        if (
          res?.responseStatus &&
          Array.isArray(res.messages) &&
          res.messages.length > 0
        ) {
          refetch();
          toast.success(res.messages[0]);
        }
      } catch (error) {
        toast.error("Failed to assign item to section");
        console.error(error);
      }
    }
  };
  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data) => {
    console.log(data);
  };
  const onEditChange = () => {
    setIsEditing((prev) => !prev);
  };
  return (
    <>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <EditAndViewButton
            label="edit"
            isEditing={isEditing}
            onEditChange={onEditChange}
          />
          <div className="flex items-center gap-2 w-full">
            <NameFields
              register={register}
              errors={errors}
              labelEn="Name En"
              labelAr="Name AR"
              maxLength={20}
              isEditing={isEditing}
            />
          </div>
          <DescriptionFields
            register={register}
            errors={errors}
            labelEn="description En"
            labelAr="description AR"
            // maxLength={20} isEditing={isEditing}
          />

          <MenuField
            menuOptions={menuOptions}
            selectStyles={selectStyles(theme, color)}
            control={control}
            errors={errors}
            selectedMenu={selectedMenu}
            isEditing={isEditing}
          />

          <ParentSectionSelect
            sectionsOptions={sectionsOptions}
            selectStyles={selectStyles(theme, color)}
            control={control}
            errors={errors}
            onChangeSection={handleSectionChange}
            isEditing={isEditing}
          />

          <div className="flex items-center gap-2">
            <StatusFields
              control={control}
              register={register}
              isEditing={isEditing}
              name="status"
            />
            <StatusFields
              control={control}
              register={register}
              isEditing={isEditing}
              name="offer"
            />
          </div>

          <ImageUploadField
            errors={errors}
            control={control}
            fileInputRef={fileInputRef}
            handleRemoveImage={handleRemoveImage}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            isEditing={isEditing}
          />
          {!isEditing && (
            <SubmitButton label="Add section" isEditing={isEditing} />
          )}
        </form>
      </Card>
    </>
  );
}

export default ViewAndEditItem;
