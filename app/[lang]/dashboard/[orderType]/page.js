"use client";
import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useTheme } from "next-themes";
import Select from "react-select";
import { Label } from "@radix-ui/react-label";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Search } from "lucide-react";
import { selectStyles } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import {
  fetchRestaurantsList,
  fetchBranches,
  fetchMenu,
  fetchViewItem,
  fetchTax,
  fetchorderSource,
} from "./apICallCenter/ApisCallCenter";
import { toast, ToastBar } from "react-hot-toast";
import {
  updateUserData,
  fetchAreas,
  createUser,
  createAddress,
  updateUserAddress,
  updateUserAddress2,
  deleteAddress,
  createOrder,
  fetchUserByPhone,
} from "./apICallCenter/apisUser";
// import { BASE_URL_iamge } from "@/api/BaseUrl";
import { BASE_URL } from "@/api/BaseUrl";
import { z } from "zod";
import { useForm, Controller, set } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaChevronDown, FaChevronUp, FaSpinner } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { Admin } from "@/components/icons/index";
import { Textarea } from "@/components/ui/textarea";
import { useSidebar } from "@/store/index";
import { useSubdomin } from "@/provider/SubdomainContext";
import Link from "next/link";
import DialogItemForMenu from "./components/DialogItemForMenu";
import NewAddressDialog from "./components/NewAddressDialog";
// import NewUserDialog from "./components/NewUserDialog";
import EditAddressDiaolg from "./components/EditAddressDiaolg";
// import DeleteAddressFotUser from "./components/DeleteAddressFotUser";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useThemeColor } from "@/hooks/useThemeColor";
import placeholderImg from "./fsr-placeholder.webp"
import InfiniteScroll from "react-infinite-scroll-component";
import { CardItem } from "./CardItem";
import RestaurantChangeAlert from "../../components/aletrs/RestaurantChangeAlert";
import DeleteAddressAlert from "../../components/aletrs/address/DeleteAddressAlert";
import ShowAlertBranchAlert from "../../components/aletrs/ShowAlertBranchAlert";
import DeleteItemFromCartAlert from "../../components/aletrs/DeleteItemFromCartAlert";
import CancelOrderAlert from "../../components/aletrs/CancelOrderAlert";
import NewUserDialog from "./components/NewUserDialog";
import { useSession } from "@/provider/SessionContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import StatusHandler from "@/lib/StatusHandler";
const editUserDataSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  phone: z.string().regex(/^\d{3,15}$/, "Invalid phone number"),
  phone2: z
    .string()
    .optional()
    .refine((val) => val === "" || /^\d{3,15}$/.test(val), {
      message: "Invalid phone number",
    }),

  email: z
    .string()
    .optional()
    .refine((val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email address",
    }),
});


const createOrderSchema = z.object({
  ordertype: z.number({ required_error: "Order type is required" }),
  ordersource: z.string().optional(),
  orderpayment: z.number().optional(),
  orderstatus: z.number({ required_error: "Order Status is required" }),
  branches: z.number().optional(),
  startDate: z.string().optional(),
  startTime: z.string().optional(),
  insertcoupon: z.string().optional(),
  insertpoints: z.number().optional(),
  discountValue: z.number().optional(),
  discountPercentage: z.number().optional(),
  notes: z.string().optional(),
});


function CreateOrder({ params }) {
  const { orderType } = params;


  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit },
  } = useForm({ resolver: zodResolver(editUserDataSchema), mode: "onSubmit" });
  const {
    control: controlCreateOrder,
    register: registerCreateOrder,
    handleSubmit: handleCreateOrder,
    setValue: setValueCreateOrder,
    getValues: getValueCreateOrder,
    reset: resetCreateOrder,
    formState: { errors: errorsCreateOrder },
  } = useForm({
    resolver: zodResolver(createOrderSchema),
    mode: "onSubmit",
    defaultValues: {
      orderpayment: 1,
      ordersource: "",
      notes: "",
    },
  });
  const language = localStorage.getItem("language") || "en";
  // console.log("language order", language);
  const { apiBaseUrl, subdomain } = useSubdomin();
  // if (process.env.NODE_ENV === "development") {
  //   console.log("apiBaseUrl from create order", apiBaseUrl);
  //   console.log("subdomain from create order", subdomain);
  // }
  const router = useRouter();

  const searchParams = useSearchParams();
  const { theme, color, setColor } = useThemeColor();
  const { handleInvalidToken } = useSession();
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const setCollapsed = useSidebar((state) => state.setCollapsed);
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(1);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedBranchIdCreateOrder, setSelectedBranchIdCreateOrder] =
    useState(null);
  // console.log("selectedBranchId",selectedBranchId);

  const [SelectedBranchPriceist, setSelectedBranchPriceList] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [token, setToken] = useState(null);
  // console.log("selectedRestaurantId",selectedRestaurantId);
  // console.log("area :", selectedAddress?.area);

  // apis
  // api restaurants select
  const {
    data: dataRestaurants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["RestaurantsList"],
    // queryFn: fetchRestaurantsList(token),
    queryFn: () => fetchRestaurantsList(token, apiBaseUrl),
    enabled: !!token,
  });
  const {
    data: branches,
    isLoadingBranchs,
    errorBranchs,
    refetch: refetchBranches,
  } = useQuery({
    queryKey: ["BranchesList", selectedRestaurantId, selectedAddress?.area],
    queryFn: () =>
      fetchBranches(
        selectedRestaurantId,
        selectedAddress?.area,
        token,
        apiBaseUrl
      ),
    enabled: !!selectedRestaurantId && !!token,
  });
  // if (process.env.NODE_ENV === "development") {
  //   console.log("branches", branches);
  //   console.log("selectedRestaurantId", selectedRestaurantId);
  //   console.log("selectedAddress?.area", selectedAddress);
  //   console.log("selectedAddress?.area", selectedAddress?.area);
  //   // console.log("apiBaseUrl from create order", apiBaseUrl);
  //   // console.log("subdomain from create order", subdomain);
  // }
  const {
    data: areas,
    isLoadingAreas,
    errorAreas,
  } = useQuery({
    queryKey: ["AreasList"],
    queryFn: () => fetchAreas(apiBaseUrl),
  });

  const {
    data: orderSource,
    isLoadingorderSource,
    errororderSource,
  } = useQuery({
    queryKey: ["OrderSourceeList", selectedRestaurantId],
    queryFn: () => fetchorderSource(selectedRestaurantId, token, apiBaseUrl),
    enabled: !!token,
  });
  const {
    data: Tax,
    isLoadingTax,
    errosTax,
  } = useQuery({
    queryKey: ["TaxList"],
    queryFn: () => fetchTax(apiBaseUrl),
  });
  // console.log("Tax in basic", Tax);
  // console.log("orderType in basic", orderType);

  const {
    data: menu,
    isLoading: isLoadingMenu,
    error: errorMenu,
    refetch: refetchMenu,
  } = useQuery({
    queryKey: ["menuList", selectedRestaurantId, SelectedBranchPriceist],
    queryFn: () =>
      fetchMenu(
        selectedRestaurantId,
        SelectedBranchPriceist,
        token,
        apiBaseUrl
      ),
    enabled: !!selectedRestaurantId && !!SelectedBranchPriceist && !!token,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const sections = menu?.sections.length > 0
    ? [{ id: "all", name_en: "All", name_ar: "الكل" }, ...menu.sections]
    : [];

  const items =
    menu?.sections?.flatMap((section) =>
      section.items_and_offer.map((item) => ({
        id: item.id,
        name_en: item.name_en,
        name_ar: item.name_ar,
        price: item.sizes?.[0]?.prices?.[0]?.price,
        section: section.id,
        image: item.image?.startsWith("http")
          ? item.image
          : `${BASE_URL()}/${subdomain}/${item.image}`,
      }))
    ) || [];


  const [errorSearchUser, setErrorSearchUser] = useState("");
  const [staticMassageError, setStaticMassageError] = useState("No data for this number");

  const {
    data: selectedUser,
    isLoading: isLoadingUserDataForSerach,
    error: errorUserDataForSearch,
    refetch,
  } = useQuery({
    queryKey: ["userSearch"],
    queryFn: () => fetchUserByPhone(search.trim(), token, apiBaseUrl),
    enabled: false,
    onSuccess: (data) => {
      // if (data) {
      setAllUserData(data);
      // if (data?.address?.length > 0) {
      //   setDeliveryMethod("Delivery");
      //   if (!selectedAddress) {
      //     setSelectedAddress(data.address[0]);
      //   }
      // }
      // } else {
      //   setAllUserData(null);
      //   setDeliveryMethod("pickup");
      //   setSelectedAddress(null);
      // }
      // console.log("data:",data);

    },
    onError: (error) => {
      setErrorSearchUser("Error fetching user data");
      console.error("Error fetching user:", error);
    },
  });
  // api branches

  // if (process.env.NODE_ENV === "development") {
  //   // console.log("branches", branches);
  //   console.log("selectedUser", selectedUser);
  // }

  const [activeSection, setActiveSection] = useState("all");
  const [counter, setCounter] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openEditAddressDialog, setOpenEditAddressDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [restaurantsSelect, setRestaurantsSelect] = useState([]);

  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [isNewAddressDialogOpen, setIsNewAddressDialogOpen] = useState(false);
  const [createOrderDialogOpen, setCreateOrderDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isOpenMainExtra, setIsOpenMainExtra] = useState(true);
  const [massegeNotSerachPhone, setMassegeNotSerachPhone] = useState(null);
  const [isOpenMainOption, setIsOpenMainOption] = useState(true);
  const [massegeNotSelectedBranch, setMassegeNotSelectedBranch] =
    useState(null);
  const [massegeInvaildToken, setMassegeInvaildToken] = useState(null);
  const [isBranchManuallySelected, setIsBranchManuallySelected] =
    useState(false);

  useEffect(() => {
    const tokenStorage =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const newToken = tokenStorage || Cookies.get("token");

    if (newToken) {
      setToken(newToken);
      // console.log(" Token loaded:", newToken); // مراقبة وجود التوك
    } else {
      console.error("No token found, redirecting to login...");
      router.push(`/${language}/login`);
    }
  }, []);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [showUserWarningDialog, setShowUserWarningDialog] = useState(false);
  const [showBranchWarningDialog, setShowBranchWarningDialog] = useState(false);
  const [sessionExpiredDialog, setSessionExpiredDialog] = useState(false);

  const [totalOptionPrices, setTotalOptionPrices] = useState(0);
  const [totalExtrasPrices, setTotalExtrasPrices] = useState(0);
  const [totalMainExtrasPrices, setTotalMainExtrasPrices] = useState(0);

  useEffect(() => {
    const extrasTotal =
      selectedItem?.selectedExtras?.reduce((sum, ex) => {
        return sum + (ex.price || 0) * (ex.quantity || 1);
      }, 0) || 0;
    const mainExtrasTotal =
      selectedItem?.selectedMainExtras?.reduce((sum, ex) => {
        return sum + (ex.price || 0) * (ex.quantity || 1);
      }, 0) || 0;

    const optionTotal = selectedItem?.selectedOption?.[0].price || 0;
    setTotalOptionPrices(optionTotal);
    setTotalExtrasPrices(extrasTotal);
    setTotalMainExtrasPrices(mainExtrasTotal);
  }, [selectedItem]);

  const handleItemClick = async (item) => {
    if (!selectedUser) {
      setShowUserWarningDialog(true);
      return;
    }
    if (
      (deliveryMethod === "pickup" && !isBranchManuallySelected) ||
      savedBranch?.value === null
    ) {
      setShowBranchWarningDialog(true);
      // setMassegeNotSelectedBranch("Select branch first");
      return;
    }
    //  if (massegeInvaildToken) {
    //   setSessionExpiredDialog(true); // افتح ديالوج السيشن
    //   return;
    // }
    setSelectedItem(item);
    setIsItemDialogOpen(true);
    // setIsOpen(!isOpen);
    setNote("");
    setCounter(1);
    setTotalExtrasPrice(0);
    setIsOpenMainOption(true); // يفتح تبويب optionSize
    setIsOpen(true); // يفتح تبويب extras
    setIsOpenMainExtra(true); // يفتح تبويب mainExtras
    setInitialized(false);


    if (
      (deliveryMethod === "pickup" && !isBranchManuallySelected) ||
      savedBranch?.value === null
    ) {
      setMassegeNotSelectedBranch("Select branch first");
      return;
    }

    try {
      const response = await fetchViewItem(
        savedBranch?.value || selectedBranchInSelected?.value || selectedUser?.address[0].branch[0].id,
        item.id,
        token,
        apiBaseUrl
      );

      if (response?.response === false) {
        setMassegeInvaildToken(response.message);
        setSessionExpiredDialog(true); //  افتح ديالوج السيشن
        return; //  مهم جدًا تمنع تكملة الكود
      }
      setMassegeInvaildToken(null);
      if (response) {
        const firstInfo = response?.sizes?.[0] || null;
        const sizeCondiments = firstInfo?.size_condiments || [];
        const itemCondiments = response?.item_condiments || [];

        const extraMainGroup = itemCondiments.find(
          (group) => group?.type === "extra"
        );
        const extraGroup = sizeCondiments.find(
          (group) => group?.type === "extra"
        );
        const optionGroup = sizeCondiments.find(
          (group) => group?.type === "option"
        );
        setSelectedItem({
          id: response?.id,
          name: response?.name_en,
          description_en: response?.description_en,
          description_ar: response?.description_ar,
          image: response?.image,
          price: firstInfo?.price?.price,
          availability: firstInfo?.availability?.availability,
          info: response?.sizes || [],
          selectedInfo: firstInfo?.size_en || "",
          selectedIdSize: firstInfo?.id || "",
          selectedMainExtras: [],
          selectedMainExtrasIds: [],
          mainExtras: extraMainGroup?.condiments || [], // الاكسترات الاساسية للايتم
          groupNameMainExtras: extraMainGroup?.group_name || [], // group_name للاكسترات الاساسية للايتم
          itemExtras: firstInfo?.size_condiments || [],
          extrasData: extraGroup?.condiments || [], // الاكسترات الموجودة للسايز
          groupExtrasRules: {
            max: extraGroup?.max,
            min: extraGroup?.min,
          },
          groupExtrasMainRule: {
            max: extraMainGroup?.max,
            min: extraMainGroup?.min,
          },

          groupNameExtrasData: extraGroup?.group_name || [], // group_name للاكسترات الاساسية للايتم
          optionSize: optionGroup?.condiments || [], //
          groupNameSizes: optionGroup?.group_name || [], // group_name للاكسترات الخاص بالسايزات

          selectedExtras: [],
          selectedoption: [],
          // selectedoptionId: [],
          // selectedExtrasIds: [],
          selectedoption:
            optionGroup?.condiments?.length > 0
              ? [optionGroup.condiments[0]]
              : [],
          selectedoptionId:
            optionGroup?.condiments?.length > 0
              ? [optionGroup.condiments[0].id]
              : [],
        });
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current && selectedItem?.extrasData?.length > 0) {
      if (isOpen) {
        const scrollHeight = contentRef.current.scrollHeight;
        setHeight(`${scrollHeight}px`);

        const timeout = setTimeout(() => {
          setHeight("auto");
        }, 300);
        return () => clearTimeout(timeout);
      } else {
        setHeight(`${contentRef.current.scrollHeight}px`);
        requestAnimationFrame(() => {
          setHeight("0px");
        });
      }
    }
  }, [isOpen, selectedItem?.extrasData]);

  const handleEditItem = async (item) => {
    setNote(item.note || "");
    setCounter(item.quantity);
    setTotalExtrasPrice(0);
    setIsItemDialogOpen(true);

    const cartItem = cartItems.find((c) => c.cartId === item.cartId);
    if (!cartItem) return;

    try {
      const response = await fetchViewItem(
        savedBranch?.value || selectedBranchInSelected?.value,
        item.id,
        token,
        apiBaseUrl
      );

      if (response?.response === false) {
        setMassegeInvaildToken(response.message);
        return;
      }

      setMassegeInvaildToken(null);

      if (response) {
        const selectedSizeInfo =
          response?.sizes?.find((s) => s.id === cartItem.selectedIdSize) ||
          response?.sizes?.[0];

        const sizeCondiments = selectedSizeInfo?.size_condiments || [];
        const itemCondiments = response?.item_condiments || [];

        const extraMainGroup = itemCondiments.find((g) => g.type === "extra");
        const extraGroup = sizeCondiments.find((g) => g.type === "extra");
        const optionGroup = sizeCondiments.find((g) => g.type === "option");

        const fullCondiments = cartItem.size_condiments?.length
          ? cartItem.size_condiments
          : [
            ...(cartItem.selectedExtras || []).map((e) => ({
              condiment_id: e.id,
              count: e.quantity || 1,
              price: e.price,
              condiment_info: { name_en: e.name },
            })),
            ...(cartItem.selectedMainExtras || []).map((e) => ({
              condiment_id: e.id,
              count: e.quantity || 1,
              price: e.price,
              condiment_info: { name_en: e.name },
            })),
            ...(cartItem.selectedoption || []).map((e) => ({
              condiment_id: e.id,
              count: 1,
              price: e.price,
              condiment_info: { name_en: e.name },
            })),
          ];

        // 🟢 حساب الإضافات مرة واحدة
        const filledExtras = fullCondiments
          .filter((cond) =>
            (extraGroup?.condiments || []).some(
              (e) => e.id === cond.condiment_id
            )
          )
          .map((cond) => {
            const matched = extraGroup.condiments.find(
              (e) => e.id === cond.condiment_id
            );
            return {
              id: cond.condiment_id,
              name: matched?.name || cond.condiment_info?.name_en,
              price: parseFloat(cond.price),
              quantity: cond.count,
            };
          });

        const filledMainExtras = fullCondiments
          .filter((cond) =>
            (extraMainGroup?.condiments || []).some(
              (e) => e.id === cond.condiment_id
            )
          )
          .map((cond) => {
            const matched = extraMainGroup.condiments.find(
              (e) => e.id === cond.condiment_id
            );
            return {
              id: cond.condiment_id,
              name: matched?.name || cond.condiment_info?.name_en,
              price: parseFloat(cond.price),
              quantity: cond.count,
            };
          });

        const filledOptions = fullCondiments
          .filter((cond) =>
            (optionGroup?.condiments || []).some(
              (e) => e.id === cond.condiment_id
            )
          )
          .map((cond) => {
            const matched = optionGroup.condiments.find(
              (e) => e.id === cond.condiment_id
            );
            return {
              id: cond.condiment_id,
              name: matched?.name || cond.condiment_info?.name_en,
              price: parseFloat(cond.price),
              quantity: cond.count,
            };
          });

        // 🟢 حساب التوتال للمخزن
        const total =
          (Number(selectedSizeInfo?.price?.price || 0) +
            filledExtras.reduce(
              (sum, e) => sum + (Number(e.price) || 0) * (e.quantity || 1),
              0
            ) +
            filledMainExtras.reduce(
              (sum, e) => sum + (Number(e.price) || 0) * (e.quantity || 1),
              0
            ) +
            filledOptions.reduce(
              (sum, e) => sum + (Number(e.price) || 0) * (e.quantity || 1),
              0
            )) *
          (cartItem.quantity || 1);
        console.log("total", total);


        setSelectedItem({
          id: response?.id,
          name: response?.name_en,
          description_en: response?.description_en,
          description_ar: response?.description_ar,
          image: response?.image,
          price: selectedSizeInfo?.price?.price,
          availability: selectedSizeInfo?.availability?.availability,
          info: response?.sizes || [],
          selectedInfo:
            cartItem?.selectedInfo || selectedSizeInfo?.size_en || "",
          selectedIdSize: selectedSizeInfo?.id || "",
          mainExtras: extraMainGroup?.condiments || [],
          groupNameMainExtras: extraMainGroup?.group_name || [],
          groupExtrasMainRule: {
            max: extraMainGroup?.max,
            min: extraMainGroup?.min,
          },
          itemExtras: selectedSizeInfo?.size_condiments || [],
          extrasData: extraGroup?.condiments || [],
          groupNameExtrasData: extraGroup?.group_name || [],
          groupExtrasRules: {
            max: extraGroup?.max,
            min: extraGroup?.min,
          },
          groupExtrasMainRule: {
            max: extraMainGroup?.max,
            min: extraMainGroup?.min,
          },
          optionSize: optionGroup?.condiments || [],
          groupNameSizes: optionGroup?.group_name || [],
          cartId: cartItem.cartId,

          // 🟡 ملئ الإضافات المختارة
          selectedMainExtras: filledMainExtras,
          selectedMainExtrasIds: filledMainExtras.map((e) => e.id),
          selectedExtras: filledExtras,
          selectedExtrasIds: filledExtras.map((e) => e.id),
          selectedoption: filledOptions,
          selectedoptionId: filledOptions.map((e) => e.id),
          quantity: cartItem.quantity,
          total, // حفظ التوتال الحالي فقط هنا
          sub_total: total, // حفظ التوتال الحالي فقط هنا
        });

        // 🟢 تحديث الكارت بالتوتال الصحيح (مرة واحدة فقط)
        setCartItems((prevItems) =>
          prevItems.map((i) =>
            i.cartId === cartItem.cartId ? { ...i, total } : i
          )
        );
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    setCollapsed(true);
  }, []);

  useEffect(() => {
    if (!selectedItem || initialized) return;

    setIsOpen(true); // extras
    setIsOpenMainExtra(true); // mainExtras
    setIsOpenMainOption(true); // optionSize

    setInitialized(true);
  }, [selectedItem, initialized]);

  useEffect(() => {
    if (errorMenu?.message === "Invalid token") {
      handleInvalidToken();
    }
  }, [errorMenu, handleInvalidToken]);
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (isOnline && wasOffline) {
      toast.success("Online now!");
      refetchMenu();
      setWasOffline(false);
    }
  }, [isOnline, wasOffline]);
  const [extrasError, setExtrasError] = useState("");
  const selectedExtras = selectedItem?.selectedExtras;
  const groupMainExtraMax = selectedItem?.groupExtrasMainRule?.max;
  const groupMax = selectedItem?.groupExtrasRules?.max;
  // const groupMax = selectedItem?.groupExtrasRules?.max;
  const groupMin = selectedItem?.groupExtrasRules?.min;
  const extrasCount = selectedItem?.extrasData?.length || 0;
  const extrasmainExtrasCount = selectedItem?.mainExtras?.length || 0;
  const selectedCount = selectedExtras?.length;
  // console.log("groupMainExtraMax",groupMainExtraMax);

  useEffect(() => {
    if (!selectedItem) return;

    const totalSelected = selectedItem?.selectedExtras?.reduce(
      (sum, ex) => sum + (ex.quantity || 0),
      0
    );
    const totalMainSelected = selectedItem?.selectedMainExtras?.length;

    if (
      (groupMax > 0 && totalSelected === groupMax) ||
      (groupMax === 0 && totalSelected === extrasCount)
    ) {
      setIsOpen(false);
    }
    if (
      (groupMainExtraMax > 0 && totalMainSelected === groupMainExtraMax) ||
      (groupMainExtraMax === 0 && totalMainSelected === extrasmainExtrasCount)
    ) {
      setIsOpenMainExtra(false);
    }
  }, [
    selectedItem?.selectedExtras,
    selectedItem?.selectedIdSize,
    selectedItem?.selectedMainExtras,
  ]);
  // console.log("selectedItem?.selectedIdSize", selectedItem?.selectedIdSize);

  // console.log("selectedItem?.selectedExtras", selectedItem?.selectedExtras);

  const toggleOption = () => {
    setIsOpenMainOption(!isOpenMainOption);
  };
  const toggleExtras = () => {
    setIsOpen(!isOpen);
  };
  const toggleExtrasMainExtra = () => {
    setIsOpenMainExtra(!isOpenMainExtra);
  };

  const handleNewUserClick = () => {
    setSelectedItem(null);
    setIsNewUserDialogOpen(true);
    setOpenDialog(true);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const handleClearSearch = () => setSearchQuery("");

  const displayedItems = useMemo(() => {
    return items.filter((item) => {
      const itemName = language === "en" ? item.name_en : item.name_ar;

      if (!itemName) return false; // تأكد من وجود الاسم

      const matchesSearch = itemName
        .toLowerCase()
        .includes(searchQuery?.toLowerCase());

      const matchesSection =
        activeSection === "all" || item.section === activeSection;

      return matchesSearch && matchesSection;
    });
  }, [items, searchQuery, activeSection, language]);

  // console.log("displayedItems", selectedItem);
  // console.log("items",items);

  const filteredSections = useMemo(() => {
    if (!searchQuery) {
      return sections; // إذا لم يكن هناك بحث، عرض كل الأقسام
    }

    return sections.filter(
      (section) =>
        section.id === "all" ||
        displayedItems.some((item) => item.section === section.id)
    );
  }, [searchQuery, displayedItems]);

  const [search, setSearch] = useState("");
  const [allUserData, setAllUserData] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [selectedAddressArray, setSelectedAddressArray] = useState([]);
  // console.log("selectedAddressArray", selectedAddressArray);
  const [selectedBranchName, setSelectedBranchName] = useState("");
  const [selectedBranchInSelected, setSelectedBranchInSelected] =
    useState(null);
  // console.log("selectedBranchInSelected", selectedBranchInSelected);

  const [branchId, setBranchId] = useState(null);
  const [selectedBranchNew, setSelectedBranchNew] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");

  const [branchOptions, setBranchOptions] = useState([]);
  const [savedBranch, setSavedBranch] = useState(null);
  // console.log("savedBranch", savedBranch);
  // console.log("selectedBranchInSelected", selectedBranchInSelected);

  const [orderNote, setOrderNote] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  const [deliveryTypeFromOrder, setDeliveryTypeFromOrder] = useState(null);
  const [deliveryMethodHasBeenSet, setDeliveryMethodHasBeenSet] =
    useState(false);
  const [addressWasManuallySelected, setAddressWasManuallySelected] =
    useState(false);

  useEffect(() => {
    const orderData = localStorage.getItem("order");

    if (orderType === "edit-order") {
      setIsEditMode(true);
    } else if (orderType === "create-order") {
      setIsEditMode(false);
    }

    // حماية إضافية: لو في order في localStorage وبالرغم من كدة الباث create => عدله
    if (orderData && orderType === "create-order") {
      router.replace("/edit-order");
    }
  }, [orderType]);


  const [orderData, setOrderData] = useState(null);
  useEffect(() => {
    const orderData = localStorage.getItem("order");
    // setOrderData(orderData)
    //  console.log("Order Data userdata:", orderData);
    if (orderData) {
      setIsEditMode(true);
      const parsedOrder = JSON.parse(orderData);
      const phoneFromOrder = parsedOrder?.details?.user_data?.phone;
      setOrderData(parsedOrder);
      setIsEditMode(true);
      if (phoneFromOrder) {
        setSearch(phoneFromOrder);
        setPhone(phoneFromOrder);

        setTimeout(() => {
          handleSearch(phoneFromOrder);
        }, 0);
      }
    } else {
      setAllUserData(null);
      setSelectedAddress(null);
      setPhone("");
      // setAllUserData(null);
    }
  }, []);
  // console.log("selected user ", selectedUser)

  useEffect(() => {
    if (isEditMode && orderData) {
      // Set the parsed data into state
      setIsEditMode(true);
      const orderNote = orderData?.details?.notes || "";
      const orderId = orderData?.details?.order_id;
      const ordercheck = orderData?.details?.check_id || "";
      const restaurantidCheck = orderData?.details?.restaurant_id || "";
      const deliveryType = Number(orderData?.details?.delivery_type);
      const branchId = Number(orderData?.details?.branch_id) || "";
      const AdderssOrder = orderData?.details?.address_info;
      setDeliveryTypeFromOrder(deliveryType);
      setAddressId(addressId);

      if (restaurantidCheck) {
        setIsEditMode(true);
        setInitialRestaurantIdFromOrder(Number(restaurantidCheck));
      }
      if (branchId && branchOptions.length > 0) {
        const matchedBranch = branchOptions.find(
          (branch) => branch.value === Number(branchId)
        );
        // console.log("deliveryType", deliveryType);
        // console.log("branchId", branchId);
        // console.log("branchOptions", branchOptions);
        // console.log("matchedBranch", matchedBranch);

        if (
          AdderssOrder &&
          Array.isArray(selectedAddressArray) &&
          !addressWasManuallySelected
        ) {
          const matchedAddress = selectedUser?.address?.find(
            (add) => add.id === AdderssOrder.id
          );

          if (matchedAddress) {
            setSelectedAddress(matchedAddress);
          }
        }

        if (matchedBranch) {
          setSelectedBranchInSelected(matchedBranch);
          setSelectedBranchId(matchedBranch.value);
          setSelectedBranchName(matchedBranch.label);
          setSavedBranch(matchedBranch);
          setSelectedBranchPriceList(matchedBranch.priceList);
          setIsBranchManuallySelected(true);
          setMassegeNotSelectedBranch("");
        }
      }

      // console.log("restaurantidCheck", restaurantidCheck);
      const visaFromNote = orderNote.toLowerCase().includes("visa");
      setOrderId(orderId);
      setOrderCheck(ordercheck);
      if (!isNoteModified) {
        setNotesOrderNotes(orderNote);
        setValueCreateOrder("notes", orderNote);
      }
      if (visaFromNote) {
        const visaOption = orderPaymenyOptions.find(
          (options) => options.value === 2
        );
        if (visaOption) {
          setSelectedOrderPaymeny(visaOption);
          setValueCreateOrder("orderpayment", visaOption.value);
        }
      }
      // setNotesOrderNotes(orderNote);
      const items = orderData?.items;
      console.log("orderData", orderData);


      if (Array.isArray(items)) {
        const transformedItems = items.map((item) => {
          const id = item?.info?.item_code;
          const quantity = item?.count || 1;
          const basePrice = parseFloat(item?.info?.price?.price || 0);

          // 🧮 حساب الإضافات size_condiments
          const condimentsTotal = (item?.size_condiments || []).reduce(
            (sum, cond) =>
              sum + (parseFloat(cond.price) || 0) * (cond.count || 1),
            0
          );

          const total = (basePrice + condimentsTotal) * quantity;

          return {
            id: id ? `${id}` : undefined,
            quantity,
            price: basePrice,
            selectedInfo:
              item?.info?.price?.size_en || item?.info?.size_en || "",
            selectedExtras: item?.extras || [],
            selectedIdSize: item?.info?.id,
            selectedMainExtras: [],
            size_condiments: item?.size_condiments,
            note: item?.special || "",
            total, // السعر النهائي المحسوب
            sub_total: total, // لو حبيت تستخدمه برضو
            cartId: uuidv4(),
          };
        });

        console.log("loaded cart items:", transformedItems);
        setCartItems(transformedItems);
      } else {
        console.log("No valid items array found in parsedOrder.");
      }
    }
  }, [selectedUser, branchOptions]);
  useEffect(() => {
    if (isEditMode && deliveryTypeFromOrder && !deliveryMethodHasBeenSet) {
      const deliveryTypeFromOrder =
        Number(orderData?.details?.delivery_type) || "";
      const type = deliveryTypeFromOrder === 2 ? "pickup" : "delivery";
      setDeliveryMethod(type);
      setDeliveryMethodHasBeenSet(true);
    }
  }, [isEditMode, deliveryTypeFromOrder, deliveryMethodHasBeenSet]);

  useEffect(() => {
    if (branches?.length) {
      setBranchOptions(
        branches.map((branch) => ({
          value: branch.id,
          label: branch.name_en,
          priceList: branch.price_list,
          deliveryFees: branch.delivery_fees,
        }))
      );
    }

    if (branches?.length > 0 && !isEditMode) {
      const firstBranch = branches[0];
      // تخزين أول فرع تلقائيًا
      setSelectedBranchId(firstBranch.id);
      // setSelectedBranchName(firstBranch.name_en);
      setSavedBranch({
        value: firstBranch.id,
        label: firstBranch.name_en,
        priceList: firstBranch.price_list,
        deliveryFees: firstBranch.delivery_fees,
      });

      setSelectedBranchPriceList(firstBranch.price_list);
    }
  }, [branches, isEditMode]);
  const [addressId, setAddressId] = useState(null);

  useEffect(() => {
    if (!selectedUser) return;

    const addresses = selectedUser.address || [];
    setSelectedAddressArray(addresses);
    // console.log("addresses", addresses);

    if (addresses.length > 0) {
      if (!selectedAddress) {
        const firstAddress = addresses[0];
        setSelectedAddress(firstAddress);
        setSelectedBranch(firstAddress.branch?.[0]);
      }
    } else {
      // if (deliveryMethod !== "pickup") {
      //   setDeliveryMethod("pickup");
      // }

      setSelectedAddress(null);
      setSelectedBranch(null);
      setBranchId(null);

      // ✅ تعيين فرع لو موجود فرع واحد فقط
      if (branchOptions?.length === 1) {
        const onlyBranch = branchOptions[0];
        setSelectedBranchInSelected(onlyBranch);
        setBranchId(onlyBranch.value);
      }
    }
  }, [selectedUser, branchOptions]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (search) {
        // إذا كان هناك شيء مكتوب في حقل البحث
        const message =
          "Are you sure you want to leave? Your search data will be lost.";
        event.returnValue = message; // هذا سيعرض رسالة التحذير في بعض المتصفحات
        return message; // بعض المتصفحات الأخرى تتطلب هذه السطر لعرض الرسالة
      }
    };

    // إضافة مستمع لحدث beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // تنظيف المستمع عند الخروج من الصفحة أو عند تغيير الكومبوننت
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [search]);
  useEffect(() => {
    setAllUserData(null); // لو دي الحالة اللي بتتحكم في selectedUser
    setPhone("");
    setSelectedAddress(null);
    // setErrorSearchUser("");
    // setStaticMassageError("");
    return () => {
      queryClient.removeQueries(["userSearch"]);
    };
  }, []);
  const [showManualLoading, setShowManualLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setHasSearched(true);
    if (search) {
      setShowManualLoading(true);
      setPhone(search);
      refetch().finally(() => setShowManualLoading(false));
      if (selectedBranch) {
        setSelectedBranchPriceList(selectedBranch.price_list);
      }
    } else {
      setErrorSearchUser("Please enter a valid search.");
    }
  };

  useEffect(() => {
    if (!selectedUser) return;

    if (selectedUser?.address?.length > 0) {
      setDeliveryMethod("Delivery");

      if (!selectedAddress) {
        setSelectedAddress(selectedUser.address[0]);
      }
    } else {
      setDeliveryMethod("pickup");
      setSelectedAddress(null);
      setSelectedBranch(null);
      // setBranchId(null);
    }
  }, [selectedUser]);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearch("");
    setPhone("");
    setStaticMassageError("");
    setHasSearched(false);
    setShowManualLoading(false);
    setAllUserData(null);
    setSelectedAddress(null);
    setSelectedAddressArray(null);
    setCartItems([]);
    setIsEditMode(false);
    queryClient.removeQueries(["userSearch"], { exact: false });
  };

  const [selectedEditAddress, setSelectedEditAddress] = useState(null);

  const handleIncreaseTable = (cartId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartId === cartId
          ? {
            ...item,
            quantity: item.quantity + 1,
            total: (item.quantity + 1) * item.price,
          }
          : item
      )
    );
  };

  const handleDecreaseTable = (cartId) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) => {
            if (item.cartId === cartId) {
              if (item.quantity > 1) {
                return {
                  ...item,
                  quantity: item.quantity - 1,
                  total: (item.quantity - 1) * item.price,
                };
              } else {
                // لما الكمية تكون 1 ونضغط "-" يتم الحذف فورًا
                handleRemoveItem(cartId);

                return null; // إزالة العنصر
              }
            }
            return item;
          })
          .filter(Boolean) // إزالة العناصر المحذوفة
    );
  };

  const handleRemoveItem = (cartId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartId !== cartId)
    );
  };

  const [note, setNote] = useState("");
  const [cartItems, setCartItems] = useState([]);

  // console.log("cartItems ", cartItems);

  // console.log("selectedItem", selectedItem);
  const handleAddToCart = () => {
    console.log("NOTE عند الإضافة:", note);
    if (groupMin === 1 && selectedExtras.length === 0) {
      setExtrasError("Please select at least one from this group.");
      setIsOpen(true);
      return; // وقف الإضافة
    }

    setExtrasError("");
    const calculateTotal = () => {
      const basePrice =
        Number(
          selectedItem.info?.find((s) => s?.id === selectedItem.selectedIdSize)
            ?.price?.price
        ) || 0;

      const extrasTotal = (selectedItem.selectedExtras || []).reduce(
        (sum, e) => sum + (Number(e.price) || 0) * (Number(e.quantity) || 1),
        0
      );
      const mainExtrasTotal = (selectedItem.selectedMainExtras || []).reduce(
        (sum, e) => sum + (Number(e.price) || 0) * (Number(e.quantity) || 1),
        0
      );
      const optionsTotal = (selectedItem.selectedoption || []).reduce(
        (sum, o) => sum + (Number(o.price) || 0) * (Number(o.quantity) || 1),
        0
      );

      return (
        (basePrice * counter) + (extrasTotal + mainExtrasTotal + optionsTotal)
      );
    };

    setCartItems((prevItems) => {
      const isEditing = !!selectedItem.cartId; // لو جاي من Edit هيكون عنده cartId

      if (isEditing) {
        // تعديل عنصر موجود
        const existingItemIndex = prevItems.findIndex(
          (item) => item.cartId === selectedItem.cartId
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...selectedItem,
            quantity: counter,
            total: calculateTotal(),
            note: note,
            cartId: selectedItem.cartId, // مهم
            mainExtras: [...(selectedItem.mainExtras || [])],
            selectedMainExtras: [...(selectedItem.selectedMainExtras || [])],
            selectedExtras: [...(selectedItem.selectedExtras || [])],
            selectedIdSize: selectedItem.selectedIdSize,
            selectedInfo: selectedItem.selectedInfo,
            groupExtrasRules: selectedItem.groupExtrasRules,
            groupExtrasMainRule: selectedItem.groupExtrasMainRule,
          };
          return updatedItems;
        }
      }

      // عنصر جديد (مش جاي من Edit أو مالوش cartId)
      return [
        ...prevItems,
        {
          ...selectedItem,
          id: selectedItem.id,
          quantity: counter,
          total: calculateTotal(),
          sub_total: calculateTotal(),
          note: note,
          cartId: uuidv4(),
          mainExtras: [...(selectedItem.mainExtras || [])],
          selectedMainExtras: [...(selectedItem.selectedMainExtras || [])],
          selectedExtras: [...(selectedItem.selectedExtras || [])],
          selectedIdSize: selectedItem.selectedIdSize,
          selectedInfo: selectedItem.selectedInfo,
        },
      ];
    });

    // reset
    // setNote("");
    setEditingItemIndex(null);
    setIsItemDialogOpen(false);
  };



  useEffect(() => {
    if (!selectedItem || isItemDialogOpen) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartId === selectedItem.cartId
          ? {
            ...item,
            quantity: counter,
            total: counter * item.price,
            note: note,
          }
          : item
      )
    );
  }, [counter, note, isItemDialogOpen]);
  const handleNoteChange = (e, cartId) => {
    const newNote = e.target.value;

    setCartItems((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.cartId === cartId ? { ...cartItem, note: newNote } : cartItem
      )
    );
  };

  const [initialRestaurantIdFromOrder, setInitialRestaurantIdFromOrder] =
    useState(null);
  // console.log("restaurantsSelect",restaurantsSelect)
  useEffect(() => {
    if (dataRestaurants) {
      const formattedRestaurants = dataRestaurants.map((restaurant) => ({
        value: restaurant.id,
        label: restaurant.res_name_en,
      }));

      setRestaurantsSelect(formattedRestaurants);

      if (isEditMode && initialRestaurantIdFromOrder) {
        setSelectedRestaurantId(Number(initialRestaurantIdFromOrder));
      } else if (!isEditMode && formattedRestaurants.length > 0) {
        setSelectedRestaurantId(formattedRestaurants[0].value);
      }
      // if (isEditMode && initialRestaurantIdFromOrder) {
      //   setSelectedRestaurantId(Number(initialRestaurantIdFromOrder));
      // } else if (!isEditMode && formattedRestaurants.length > 0) {
      //   setSelectedRestaurantId(formattedRestaurants[0].value);
      // }
    }
  }, [dataRestaurants, isEditMode, initialRestaurantIdFromOrder]);

  useEffect(() => {
    if (selectedRestaurantId && SelectedBranchPriceist) {
      queryClient.prefetchQuery(
        ["menuList", selectedRestaurantId, SelectedBranchPriceist],
        () => fetchMenu(selectedRestaurantId, SelectedBranchPriceist)
      );
    }
  }, [selectedRestaurantId, SelectedBranchPriceist]);

  const [showRestaurantChangeAlert, setShowRestaurantChangeAlert] =
    useState(false);
  const [pendingRestaurant, setPendingRestaurant] = useState(null);

  const handleRestaurantChange = (selectedOption) => {
    if (cartItems.length > 0) {
      setPendingRestaurant(selectedOption);
      setShowRestaurantChangeAlert(true);
    } else {
      setSelectedRestaurantId(selectedOption.value);
      setSelectedBranchId(null);
      // refetchBranches();
      setCartItems([]);
      setActiveSection("all");
      setIsBranchManuallySelected(!!selectedBranchId);
      setSelectedBranchName("");
    }
  };

  const confirmRestaurantChange = () => {
    if (pendingRestaurant) {
      setSelectedRestaurantId(pendingRestaurant.value);
      setSelectedBranchId(null);
      // refetchBranches();
      setCartItems([]);
      setActiveSection("all");
      setShowRestaurantChangeAlert(false);
      setPendingRestaurant(null);
      setIsBranchManuallySelected(!!selectedBranchId);
      setSelectedBranchName("");
    }
  };

  // banches

  const [pendingBranch, setPendingBranch] = useState(null);
  const [showAlertBranch, setShowAlertBranch] = useState(false);

  const handleSelectChangeBranches = (selectedOption) => {
    // console.log("selectedOption",selectedOption);

    if (!selectedOption && !isEditMode) {
      setSelectedBranchInSelected(null);
      setSelectedBranchId(null);
      setSavedBranch(null);
      setSelectedBranchPriceList(null);
      setIsBranchManuallySelected(false);
      setMassegeNotSelectedBranch("Please select branch first");
      return;
    }

    const isFirstSelection = !selectedBranchInSelected;
    if (isFirstSelection && selectedOption?.priceList === 1) {
      updateBranch(selectedOption);
      setSelectedBranchName(selectedOption.label);
      return;
    }

    if (
      cartItems.length > 0 &&
      pendingBranch?.value !== selectedOption?.value &&
      selectedBranchInSelected?.value !== selectedOption.value
    ) {
      setPendingBranch(selectedOption);
      setShowAlertBranch(true);
      setCreateOrderDialogOpen(false);
    } else {
      updateBranch(selectedOption);
      setSelectedBranchName(selectedOption.label);
    }
  };

  const updateBranch = (selectedOption) => {
    setSelectedBranchInSelected(selectedOption);
    setSavedBranch(null);
    setSelectedBranchId(selectedOption.value);
    setSelectedBranchPriceList(selectedOption.priceList);
    setIsBranchManuallySelected(true);
    setMassegeNotSelectedBranch(null);
    setSavedBranch(selectedOption);
    refetchMenu();
  };


  useEffect(() => {
    if (
      deliveryMethod === "pickup" &&
      !isEditMode &&
      branchOptions.length > 0
    ) {

      const firstBranch = branchOptions[0];
      setSelectedBranchId(firstBranch.value);
      setSelectedBranchName(firstBranch.label);
      setSavedBranch(firstBranch);
      setSelectedBranchInSelected(firstBranch);
      setMassegeNotSelectedBranch(null);
    }
  }, [deliveryMethod, branchOptions]);

  const handleConfirmChange = () => {
    // console.log("pendingBranch",pendingBranch);
    updateBranch(pendingBranch);
    setSelectedBranchName(pendingBranch.label);
    setShowAlertBranch(false);
    setCartItems([]);
  };

  const handleCancelChange = () => {
    setPendingBranch(null);
    setShowAlertBranch(false);
  };

  useEffect(() => {
    if (deliveryMethod !== "pickup") {
      setSelectedBranch(null);
      setSelectedBranchName("");
      setSelectedBranchInSelected(null);
      setSelectedBranchId(null);
    }
  }, [deliveryMethod]);
  const prevUserRef = useRef(null);
  const previousBranchId = useRef(null);
  useEffect(() => {
    if (
      selectedBranchNew?.id &&
      selectedBranchNew.id !== previousBranchId.current
    ) {
      refetchMenu();
      previousBranchId.current = selectedBranchNew.id; // تحديث القيمة القديمة
    }
  }, [selectedBranchNew?.id]);

  // useEffect(() => {
  //   if (
  //     prevUserRef?.current !== null &&
  //     prevUserRef?.current?.id !== selectedUser?.id
  //   ) {
  //     // setDeliveryMethod("delivery");
  //     // setDeliveryMethod(
  //     //   selectedUser?.address?.length > 0 ? "delivery" : "pickup"
  //     // );
  //     prevUserRef.current = selectedUser;
  //     if (!isEditMode) {
  //       setSelectedBranch(null);
  //       setSelectedBranchName("");
  //       setSelectedBranchInSelected(null);
  //       setSelectedBranchId(null);
  //     }
  //   }

  //   prevUserRef.current = selectedUser;
  // }, [selectedUser]);
  useEffect(() => {
    if (
      selectedUser &&
      prevUserRef?.current !== null &&
      prevUserRef?.current?.id !== selectedUser?.id
    ) {
      if (Array.isArray(selectedUser.address)) {
        setDeliveryMethod(
          selectedUser.address.length > 0 ? "delivery" : "pickup"
        );
      }
      prevUserRef.current = selectedUser;

      if (!isEditMode) {
        setSelectedBranch(null);
        setSelectedBranchName("");
        setSelectedBranchInSelected(null);
        setSelectedBranchId(null);
      }
    }

    prevUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    setIsBranchManuallySelected(!!selectedBranchId);
  }, [selectedBranchId]);
  // console.log("setSelectedBranchInSelected",selectedBranchInSelected);
  // console.log("setSelectedBranchId",selectedBranchId);

  const [showDateTime, setShowDateTime] = useState(false);

  // console.log("isBranchManuallySelected", isBranchManuallySelected);

  // order source
  const orderSourceOptions = orderSource?.map((val) => ({
    value: val.id,
    label: val.source_name,
  }));

  const [orderSourceSelected, setOrderSourceSelected] = useState(null);

  useEffect(() => {
    if (orderSourceOptions?.length > 0 && !orderSourceSelected) {
      const firstOption = orderSourceOptions[0];

      // ✅ تأكد من عدم التحديث إذا كانت القيمة نفسها
      if (orderSourceSelected?.label !== firstOption.label) {
        setOrderSourceSelected(firstOption);
        setValueCreateOrder("ordersource", firstOption.label);
      }
    }
  }, [orderSourceOptions]);
  // console.log("orderSourceSelected", orderSourceSelected);
  // order type

  const orderTypeOptions = [
    { value: 1, label: "Delivery" },
    { value: 2, label: "Pickup" },
  ];

  const [selectedOrderType, setSelectedOrderType] = useState(null);

  useEffect(() => {
    if (orderTypeOptions.length > 0) {
      const defaultValue =
        deliveryMethod === "pickup" ? orderTypeOptions[1] : orderTypeOptions[0];

      setSelectedOrderType(defaultValue);
      setValueCreateOrder("ordertype", defaultValue.value);

      // console.log("🚀 selectedOrderType Updated:", defaultValue);
    }
  }, [deliveryMethod]);

  useEffect(() => {
    const currentSelectedBranchId = getValueCreateOrder("branches");
    const deliveryBranch = selectedAddress?.branch?.[0]?.id || null;
    // console.log("selectedAddress",selectedAddress);

    if (deliveryMethod === "pickup") {
      if (selectedBranchId && selectedBranchId !== currentSelectedBranchId) {
        setValueCreateOrder("branches", selectedBranchId, {
          shouldValidate: true,
        });
      }
    }

    if (deliveryMethod === "delivery") {
      if (deliveryBranch && deliveryBranch !== currentSelectedBranchId) {
        setValueCreateOrder("branches", deliveryBranch, {
          shouldValidate: true,
        });
        setSelectedBranchId(deliveryBranch);
        setSelectedBranch(null);
        setSelectedBranchName("");
        setSelectedBranchInSelected(null);
        setSelectedBranchId(null);
      }
    }
  }, [selectedBranchId, deliveryMethod, selectedAddress, setValueCreateOrder]);
  useEffect(() => {
    // if (deliveryMethod === "delivery" && selectedUser?.address?.length > 0) {
    //   setSelectedAddress(selectedUser.address[0]);
    // }
    if (
      deliveryMethod === "delivery" &&
      selectedUser?.address?.length > 0 &&
      !selectedAddress
    ) {
      setSelectedAddress(selectedUser.address[0]);
    }
  }, [deliveryMethod, selectedUser]);
  useEffect(() => {
    if (selectedOrderType?.value === 2) {
      // console.log("selectedOrderType?.value",selectedOrderType?.value);
      setDeliveryMethod("pickup");
    } else {
      setDeliveryMethod("delivery");
    }
  }, [selectedOrderType]);

  useEffect(() => {
    if (selectedOrderType?.value === 2) {
      const selectedBranch = getValueCreateOrder("branches"); // احصل على الفرع المختار داخل الكنترول

      if (selectedBranch) {
        const matchedBranch = branchOptions?.find(
          (option) => option.value === selectedBranch
        );

        if (
          matchedBranch &&
          matchedBranch.value !== selectedBranchInSelected?.value
        ) {
          // تحديث القيم وكأن المستخدم اختار الفرع يدوياً
          handleSelectChangeBranches(matchedBranch);
        }
      }
    }
  }, [createOrderDialogOpen]);

  // console.log("setSelectedBranchInSelected",selectedBranchInSelected);

  const [selectedOrderPaymeny, setSelectedOrderPaymeny] = useState(null);
  const [notesOrderNotes, setNotesOrderNotes] = useState("");
  const [isNoteModified, setIsNoteModified] = useState(false);
  const orderPaymenyOptions = [
    { value: 1, label: "Cash" },
    { value: 2, label: "Visa" },
  ];

  useEffect(() => {
    const defaultValue = orderPaymenyOptions[0];
    setSelectedOrderPaymeny(defaultValue);
    setValueCreateOrder("orderpayment", orderPaymenyOptions[0].value);
  }, [setValueCreateOrder]);

  useEffect(() => {
    if (!isNoteModified) {
      if (selectedOrderPaymeny?.value === 2) {
        setNotesOrderNotes("الدفع فيزا");
        setValueCreateOrder("notes", "الدفع فيزا");
      } else {
        setNotesOrderNotes("");
        setValueCreateOrder("notes", "");
      }
    }
  }, [selectedOrderPaymeny, setValueCreateOrder, isNoteModified]);

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setIsNoteModified(true); // المستخدم عدل على الحقل
    setNotesOrderNotes(value);
    setValueCreateOrder("notes", value);
  };
  // console.log("selectedOrderPaymeny", selectedOrderPaymeny);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
  const orderStatusOptions = [
    { value: 1, label: "Pending" },
    { value: 2, label: "New" },
  ];

  useEffect(() => {
    if (orderStatusOptions.length > 0) {
      const defaultValue = orderStatusOptions[0];
      setSelectedOrderStatus(defaultValue);
      setValueCreateOrder("orderstatus", orderStatusOptions[0].value);
    }
  }, [setValueCreateOrder]);

  // console.log("selectedOrderStatus", selectedOrderStatus);
  // areas
  const [areaIdSelect, setAreaIdSelect] = useState(null);
  const areasOptions = areas?.map((area) => ({
    value: area?.id,
    label: area?.area_name_en,
  }));
  // console.log("areaIdSelect", areaIdSelect);

  const handleChangeArea = (selectValue) => {
    setAreaIdSelect(selectValue.value);
    // console.log("selected area", selectedArea);
  };
  useEffect(() => {
    if (selectedUser) {
      setValueEdit("username", selectedUser.user_name);
      setValueEdit("phone", selectedUser.phone);
      setValueEdit("phone2", selectedUser.phone2 || "");
      setValueEdit("email", selectedUser.email || "");
    }
  }, [selectedUser, selectedAddress, setValueEdit]);

  const [totalExtrasPrice, setTotalExtrasPrice] = useState(0);
  // console.log("selectedEditAddress", selectedEditAddress);
  const [lodaingCreateOrder, setLodaingCreateOrder] = useState(false);
  const [lodaingCreateUserData, setLodaingCreateUserData] = useState(false);
  const [lodaingEditUserData, setLodaingEditUserData] = useState(false);
  const [lodaingEditDeletedAddress, setLodaingDeletedAddress] = useState(false);
  const onSubmitEditUserData = async (data) => {
    setLodaingEditUserData(true);
    const formattedData = Object.entries({
      username: data.username,
      email: data.email,
      phone: data.phone,
      phone2: data.phone2,
      userId: selectedUser?.id,
      token: token,
      apiBaseUrl,
    }).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {});

    // console.log("Formatted Data to Send:", formattedData);

    try {
      const response = await updateUserData(formattedData);
      // console.log("response onsubmit", response);
      if (response?.response) {
        toast.success(response.message);
        queryClient.setQueryData(["userSearch"], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            user_name: data.username || oldData.user_name,
            email: data.email || oldData.email,
            phone: data.phone || oldData.phone,
            phone2: data.phone2 || oldData.phone2,
          };
        });
        setSelectedAddress((prevSelectedAddress) => ({
          ...prevSelectedAddress,
          address_name: data.address_name || prevSelectedAddress.address_name,
        }));
        setOpenEditDialog(false);
      } else {
        toast.error("something error");
      }
    } catch {
      console.error("Error updating user data:", error);
    } finally {
      setLodaingEditUserData(false);
    }
  };
  // console.log("set slected ", selectedAddress);
  const [loading, setLoading] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState("home");
  const [addAddressType, setaddAddressType] = useState("home");
  const [editAddressType, seEditAddressType] = useState("home");
  const [customAddressName, setCustomAddressName] = useState("");
  const [isOpenAddress, setIsOpenAddress] = useState(false);
  const [isOpenUserData, setIsOpenUserData] = useState(true);
  // console.log("apiBaseUrl create order", apiBaseUrl);
  const [visibleItems, setVisibleItems] = useState(20);

  const fetchMoreData = () => {
    setVisibleItems((prev) => prev + 12); // كل مرة يزود 12
  };

  const [orderId, setOrderId] = useState(null);
  const [orderCheck, setOrderCheck] = useState(null);
  // console.log("savedBranch", savedBranch);
  const onSubmithandleCreateOrder = async (data) => {
    // console.log(" بيانات الطلب:", data);
    setLodaingCreateOrder(true);

    try {
      await createOrder({
        lookupId: selectedUser?.id,
        address: selectedAddress?.id,
        area: selectedAddress?.area,
        notes: data.notes || "",
        source: data.ordersource,
        status: data.orderstatus === 1 ? "pending" : "New",
        insertcoupon: data.insertcoupon,
        insertpoints: data.insertpoints,
        time: data?.startTime,
        payment: 1,
        delivery_type: data.ordertype,
        items: cartItems,
        lat: 0,
        lng: 0,
        branch: savedBranch?.value,
        restaurant: selectedRestaurantId,
        token,
        apiBaseUrl,
        isEditMode,
        orderId,
        orderCheck,
      });
      // console.log("cartItems createOrder",cartItems);
      // console.log("orderId", orderId);
      // console.log("orderCheck", orderCheck);

      toast.success(`Order ${isEditMode ? "updated" : "created"} successfully`);
      setCreateOrderDialogOpen(false);
      setStaticMassageError("")
      if (isEditMode) {
        router.push(`/${language}/dashboard`);
      }
      if (!isEditMode) {
        resetCreateOrder({
          ordertype:
            orderTypeOptions.length > 0 ? orderTypeOptions[0].value : "",
          ordersource:
            orderSourceOptions.length > 0 ? orderSourceOptions[0].label : "",
          orderstatus:
            orderStatusOptions.length > 0 ? orderStatusOptions[0].value : "",
          orderpayment:
            orderPaymenyOptions.length > 0 ? orderPaymenyOptions[0].value : "",
        });

        setShowDateTime(false);

        if (orderSourceOptions.length > 0) {
          setOrderSourceSelected(orderSourceOptions[0]);
        }
        if (orderStatusOptions.length > 0) {
          setSelectedOrderStatus(orderStatusOptions[0]);
        }
        setDiscountValue("");
        setDiscountPercentage("");
        setSearch("");
        setPhone("");
        setAllUserData(null);
        setSelectedAddress(null);
        setSelectedAddressArray(null);
        setCartItems([]);
        setIsOpenUserData(true);
        setSelectedBranchPriceList(1);
        queryClient.removeQueries(["userSearch"], { exact: false });
      }
    } catch (error) {
      console.error(" خطأ في إنشاء الطلب:", error);
      toast.error(error.message || "حدث خطأ غير متوقع!");
    } finally {
      setLodaingCreateOrder(false);
      localStorage.removeItem("order");
    }
  };
  // console.log("isEditMode", isEditMode);

  const grandTotal = cartItems.reduce((sum, item) => {
    const basePrice = parseFloat(item.price) || 0;
    const quantity = parseFloat(item.quantity) || 1;

    let extrasTotal = 0;
    let optionTotal = 0;
    let mainExtrasTotal = 0;

    // 🟡 الحالة الأولى: size_condiments موجودة
    if (Array.isArray(item.size_condiments) && item.size_condiments.length > 0) {
      const sizeCondimentsTotal = item.size_condiments.reduce(
        (acc, cond) =>
          acc + (parseFloat(cond.price) || 0) * (cond.count || 1),
        0
      );
      const itemTotal = (basePrice + sizeCondimentsTotal) * quantity;
      return sum + itemTotal;
    }

    // 🟢 الحالة الثانية: نحسب من selectedExtras و options
    extrasTotal =
      item.selectedExtras?.reduce(
        (acc, extra) =>
          acc + (parseFloat(extra.price) || 0) * (extra.quantity || 1),
        0
      ) || 0;

    optionTotal =
      item.selectedoption?.reduce(
        (acc, option) => acc + (parseFloat(option.price) || 0),
        0
      ) || 0;

    mainExtrasTotal =
      item.selectedMainExtras?.reduce(
        (acc, extra) => acc + (parseFloat(extra.price) || 0),
        0
      ) || 0;

    const itemTotal =
      (basePrice + extrasTotal + optionTotal + mainExtrasTotal) * quantity;

    return sum + itemTotal;
  }, 0);

  // const formattedGrandTotal = parseFloat(grandTotal).toFixed(2);

  const [discountValue, setDiscountValue] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [order, setOrder] = useState(null);
  const [loaded, setLoaded] = useState(false);
  // const vatAmount = parseFloat(grandTotal * (parseFloat(Tax) / 100)); // .14

  const discount = 0;

  const Delivery =
    selectedOrderType?.value === 2
      ? 0
      : parseFloat(savedBranch?.deliveryFees) || 0;

  const vatAmount = (grandTotal - discount + Delivery) * 0.14;
  const totalAmount = grandTotal - discount + vatAmount + Delivery;

  const finalTotal = useMemo(() => {
    let total =
      selectedOrderType?.value === 2 ? totalAmount - Delivery : totalAmount;
    return total - discountValue;
  }, [totalAmount, selectedOrderType, Delivery, discountValue]);

  const handleDiscountValueChange = (e) => {
    let value = parseFloat(e.target.value);

    if (!isNaN(value)) {
      if (value > totalAmount) {
        value = totalAmount;
      }
      setDiscountValue(value);

      setDiscountPercentage(Number(((value / totalAmount) * 100).toFixed(3)));
    } else {
      setDiscountValue("");
      setDiscountPercentage("");
    }
  };

  const handleDiscountPercentageChange = (e) => {
    let value = parseFloat(e.target.value);

    if (!isNaN(value)) {
      if (value > 100) {
        value = 100;
      }
      setDiscountPercentage(value);

      setDiscountValue(Number(((value / 100) * totalAmount).toFixed(3)));
    } else {
      setDiscountPercentage("");
      setDiscountValue("");
    }
  };

  const handleCacelOrder = () => {
    setSearch("");
    setPhone("");
    setAllUserData(null);
    setSelectedAddress(null);
    setSelectedAddressArray(null);
    setCartItems([]);
    setIsOpenUserData(true);
    setSelectedBranchPriceList(1);
    setStaticMassageError("")
    queryClient.removeQueries(["userSearch"], { exact: false });
  };
  const handleEditAddress = (address) => {
    setSelectedEditAddress(address);
    setOpenEditAddressDialog(true);
  };

  const handleDeleteAddress = async (id) => {
    // console.log("id remove", id);
    setLodaingDeletedAddress(true);
    try {
      const response = await deleteAddress(id, token, apiBaseUrl);

      toast.success("Address deleted successfully");
      await queryClient.invalidateQueries(["userSearch", phone]);
      await refetch();
      // console.log("Response onSubmit delete:", response);
    } catch (error) {
      console.error("Error updating user address:", error);
      toast.error("Failed to update address. Please try again.");
    } finally {
      setLodaingDeletedAddress(false);
    }
    const updatedAddresses = selectedAddressArray.filter(
      (addr) => addr.id !== id
    );
    setSelectedAddressArray(updatedAddresses);

    if (selectedAddress?.id === id) {
      setSelectedAddress(
        updatedAddresses.length > 0 ? updatedAddresses[0] : null
      );
    }


  };

  useEffect(() => {
    if (isEditMode && search) {
      refetch();
    }
  }, [isEditMode, search]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      const navType = performance.getEntriesByType("navigation")[0]?.type;

      // لو مش reload نمسح البيانات
      if (navType !== "reload") {
        localStorage.removeItem("order");
        queryClient.removeQueries(["userSearch"], { exact: false });
      }
    };

    router.events?.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events?.off("routeChangeStart", handleRouteChange);
    };
  }, [queryClient]);
  // if (isLoadingMenu) {
  //   return <div>Loading...</div>;
  // }

  // if (errorMenu) {
  //   return <div>Error: fetch data</div>;
  // }

  // if (!menu || !menu.sections || menu.sections.length === 0) {
  //   return <div>No results.</div>;
  // }
  // if (isLoadingBranchs) return <p>Loading branches...</p>;
  // if (errorBranchs) return <p>Error loading branches: {error.message}</p>;
  return (
    <div className="flex flex-col gap-4">

      <RestaurantChangeAlert
        showRestaurantChangeAlert={showRestaurantChangeAlert}
        setShowRestaurantChangeAlert={setShowRestaurantChangeAlert}
        confirmRestaurantChange={confirmRestaurantChange}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4 mt-2">
        <div className=" order-2 lg:order-1 lg:col-span lg:-4 shadow- rounded-lg m  ">
          {/*  مربع البحث */}
          <Card className="p-4 shadow-md rounded-lg  -ml-[]  ">
            <div className="relative min-w-[240px] mb-2">
              <span className="absolute top-1/2 -translate-y-1/2 left-2">
                <Search className="w-4 h-4 text-gray-500" />
              </span>
              <Input
                type="text"
                placeholder="Search"
                className="pl-7 w-full text-important "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={errorMenu || isLoadingMenu || !isOnline}
              />


              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-important text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/*  التابات */}
            <div>
              {/* Sections */}
              <div className={`flex gap-4 flex-wrap
               ${isOnline && !isLoadingMenu && !errorMenu && filteredSections.length === 0 ? "border-b" : ""}
               ${!isLoadingMenu && !errorMenu && filteredSections.length === 0 ? "" : "mt-3"}`} >

                <StatusHandler
                  isOnline={isOnline}
                  isLoading={isLoadingMenu}
                  error={errorMenu}
                  isEmpty={filteredSections.length === 0}
                  emptyMessage="No menu found"
                  loadingMessage="Loading menu ..."
                  errorMessage="Error loading menu "
                >
                  {filteredSections.map((section) => (
                    <button
                      key={section.id}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300
              ${activeSection === section.id
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-600"
                        }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      {language === "en" ? section.name_en : section.name_ar}
                    </button>
                  )
                  )}
                </StatusHandler>

              </div>
            </div>

            {/* Items */}
            {isOnline && (
              <InfiniteScroll
                dataLength={visibleItems}
                next={fetchMoreData}
                hasMore={visibleItems < displayedItems.length}
                loader={<h4 className="text-center p-4">Loading...</h4>}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                  {displayedItems.slice(0, visibleItems).map((item) => (
                    <CardItem
                      key={item.id}
                      item={item}
                      language={language}
                      handleItemClick={handleItemClick}
                      placeholderImg={placeholderImg}
                      items={items}
                      errorMenu={errorMenu}
                    />
                  ))}
                </div>
              </InfiniteScroll>
            )}
            {/* <DialogItemForMenu
                    isItemDialogOpen={isItemDialogOpen}
                    setIsItemDialogOpen={setIsItemDialogOpen}
                    selectedItem={selectedItem}
                    counter={counter}
                    setCounter={setCounter}
                    toggleExtrasMainExtra={toggleExtrasMainExtra}
                    toggleExtras={toggleExtras}
                    language={language}
                    note={note}
                    setNote={setNote}
                    totalExtrasPrice={totalExtrasPrice}
                    setTotalExtrasPrice={setTotalExtrasPrice}
                    isBranchManuallySelected={isBranchManuallySelected}
                    massegeNotSelectedBranch={massegeNotSelectedBranch}
                    deliveryMethod={deliveryMethod}
                    selectedUser={selectedUser}
                    massegeNotSerachPhone={massegeNotSerachPhone}
                    handleAddToCart={handleAddToCart}
                    massegeInvaildToken={massegeInvaildToken}
                  /> */}
            {isItemDialogOpen && (
              <Dialog
                open={isItemDialogOpen}
                onOpenChange={setIsItemDialogOpen}
              >
                <DialogContent size="3xl" hiddenCloseIcon={true}>
                  <div className=" flex justify-between items-center space-y-4">
                    <p className="text-xl">{selectedItem?.name}</p>

                    <div className="flex items-center space-">
                      {/* السعر الإجمالي */}
                      <p className="text-sm font-semibold text-gray-">
                        {(selectedItem?.price * counter).toFixed(2)} EGP
                      </p>

                      <button
                        onClick={() =>
                          setCounter((prev) => (prev > 1 ? prev - 1 : 1))
                        }
                        className="px-2 py-1 bg-red-500 text-white rounded-[6px] hover:bg-red-600 transition-colors mr-1 ml-4"
                      >
                        <FaMinus />
                      </button>

                      <input
                        type="number"
                        step="0.001"
                        value={counter}
                        onInput={(e) => {
                          if (e.target.value.length > 4) {
                            e.target.value = e.target.value.slice(0, 4); // اقتصاص القيمة إلى 4 أرق
                          }
                        }}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value) && value >= 0.1) {
                            // السماح بالأرقام العشرية وعدم السماح بالقيم السالبة
                            setCounter(value);
                          }
                        }}
                        className="w-12 text-center border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:-blue-500 focus:border-transparent "
                      />
                      <button
                        onClick={() => setCounter((prev) => prev + 1)}
                        className="px-2 py-1 bg-green-500 text-white rounded-[6px] hover:bg-green-600 transition-colors ml5 mr-2 ml-1"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="items-center">
                    <h3 className="font-medium ">
                      {selectedItem?.description}
                      {language === "en"
                        ? selectedItem?.description_en
                        : selectedItem?.description_ar}
                    </h3>
                  </div>
                  <hr className="my-2" />
                  <div className="mt-4">
                    <div className="flex flex-c gap-5">
                      {selectedItem?.info?.map((size, index) => (
                        <label
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name="size"
                            value={size?.size_en}
                            checked={
                              selectedItem?.selectedInfo === size?.size_en
                            }
                            onChange={() => {
                              setIsOpenMainOption(true);
                              setIsOpen(true);
                              setIsOpenMainExtra(true);
                              const newItemExtras =
                                size?.size_condiments || [];

                              const newExtraGroup = newItemExtras.find(
                                (g) => g?.type === "extra"
                              );
                              const newOptionGroup = newItemExtras.find(
                                (g) => g?.type === "option"
                              );
                              const newGroupRules = newExtraGroup
                                ? {
                                  min: newExtraGroup?.min ?? 0,
                                  max: newExtraGroup?.max ?? 0,
                                }
                                : { min: 0, max: 0 };
                              return setSelectedItem((prev) => ({
                                ...prev,
                                selectedInfo: size?.size_en,
                                selectedIdSize: size?.id,
                                price: size?.price?.price,
                                availability:
                                  size?.availability?.availability,
                                itemExtras: newItemExtras,
                                extrasData: newExtraGroup?.condiments || [],
                                optionSize:
                                  newOptionGroup?.condiments || [],
                                groupNameSizes:
                                  newOptionGroup?.group_name || "",

                                groupNameExtrasData:
                                  newExtraGroup?.group_name || "",
                                // selectedoption:newOptionGroup?.condiments?.length > 0 ? [newOptionGroup[0]] : [],
                                // selectedoptionId:newOptionGroup?.condiments?.length > 0 ? [newOptionGroup[0]?.id] : [],

                                selectedoption:
                                  newOptionGroup?.condiments?.length > 0
                                    ? [newOptionGroup.condiments[0]]
                                    : [],
                                selectedoptionId:
                                  newOptionGroup?.condiments?.length > 0
                                    ? [newOptionGroup.condiments[0].id]
                                    : [],

                                selectedItemExtras: [],
                                selectedExtras: [],
                                selectedExtrasIds: [],
                                groupExtrasRules: newGroupRules,
                              }));
                            }}
                          />
                          <span>
                            {size?.size_en} ({selectedItem?.availability})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {selectedItem?.optionSize?.length > 0 && (
                    <div className="border rounded-lg overflow-hidden shadow-md">
                      <div
                        className="p-3 bg-gray- cursor-pointer flex gap-4 items-center"
                        onClick={toggleOption}
                      >
                        <h3 className="font-bold text-[16px]">
                          {selectedItem?.groupNameSizes}
                        </h3>
                        <h3 className=" text-[16px]">
                          (Choose up to 1 Items)
                        </h3>

                        <span className="text-gray-600">
                          {isOpenMainOption ? "▲" : "▼"}
                        </span>
                      </div>

                      {/* العناصر المختارة */}
                      {selectedItem?.selectedoption?.length > 0 && (
                        <div className="p-3 bg-gray- border-t">
                          <span className="text-gray-500 font-medium">
                            {selectedItem.selectedoption
                              .map((extra) => extra.name)
                              .join(", ")}
                          </span>
                        </div>
                      )}

                      {/* الاختيارات */}
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpenMainOption ? "max-h-96" : "max-h-0"
                          }`}
                      >
                        <div className="p-3 flex flex- flex-wrap gap-2">
                          {selectedItem?.optionSize?.map((extra, index) => (
                            <label
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="radio"
                                value={extra.name_en}
                                checked={selectedItem.selectedoption.some(
                                  (ex) => ex.id === extra.id
                                )}
                                onChange={() => {
                                  setIsOpenMainOption(false);
                                  setSelectedItem((prev) => ({
                                    ...prev,
                                    selectedoption: [extra], // اختيار واحد فقط
                                    selectedoptionId: [extra.id],
                                  }));
                                }}
                              />
                              <span className="text-important">
                                {extra.name}
                              </span>
                              <span className="text-important">
                                {Number(extra.price) > 0 &&
                                  `(${Number(extra.price).toFixed(
                                    2
                                  )} EGP)`}{" "}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedItem?.extrasData?.length > 0 && (
                    <div className="border rounded-lg overflow-hidden shadow-md">
                      <div className="flex  items-center justify-between">
                        <div
                          className="p-3 bg-gray- cursor-pointer flex gap-4 items-center"
                          onClick={toggleExtras}
                        >
                          <h3
                            className={`font-bold text-[16px] ${extrasError
                              ? "text-red-500"
                              : "text-black dark:text-white"
                              }`}
                          >
                            {selectedItem?.groupNameExtrasData}
                          </h3>
                          <h3 className="text-[16px]">
                            (Choose up to{" "}
                            {selectedItem?.groupExtrasRules?.max === 0
                              ? selectedItem?.mainExtras?.length
                              : selectedItem?.groupExtrasRules?.max}{" "}
                            Items)
                          </h3>

                          <span className="text-gray-600">
                            {isOpen ? "▲" : "▼"}
                          </span>
                        </div>
                        {extrasError && (
                          <p className="text-red-500 text-sm px-3 py-1">
                            {extrasError}
                          </p>
                        )}
                      </div>
                      {/* العناصر المختارة */}
                      {selectedItem?.selectedExtras?.length > 0 && (
                        <div className="p-3 bg-gray- border-t">
                          <span className="text-gray-500 font-medium">
                            {selectedItem.selectedExtras
                              .map(
                                (extra) =>
                                  `${extra.name} x${extra.quantity || 1}`
                              )
                              .join(", ")}
                          </span>
                        </div>
                      )}

                      {/* الاختيارات */}
                      <div
                        className="transition-all duration-300 ease-in-out overflow-hidden"
                        style={{ height }}
                      >
                        <div
                          ref={contentRef}
                          className="p-3 flex flex-wrap gap-2"
                        >
                          {selectedItem?.extrasData?.map((extra, index) => {
                            const selected =
                              selectedItem.selectedExtras.find(
                                (ex) => ex.id === extra.id
                              );
                            const quantity = selected?.quantity || 0;
                            const totalSelectedCount =
                              selectedItem.selectedExtras.reduce(
                                (sum, ex) => sum + (ex.quantity || 0),
                                0
                              );

                            return (
                              <div
                                key={index}
                                onClick={() => {
                                  if (selected) {
                                    // لو العنصر متعلم، إحذفه
                                    setSelectedItem((prev) => {
                                      const updatedExtras =
                                        prev.selectedExtras.filter(
                                          (ex) => ex.id !== extra.id
                                        );
                                      return {
                                        ...prev,
                                        selectedExtras: updatedExtras,
                                        selectedExtrasIds:
                                          updatedExtras.map((ex) => ex.id),
                                      };
                                    });
                                  } else {
                                    // لو مش متعلم، ضيفه لكن بعد التأكد إنه مش مكرر
                                    setSelectedItem((prev) => {
                                      const totalSelectedCount =
                                        prev.selectedExtras.reduce(
                                          (sum, ex) =>
                                            sum + (ex.quantity || 0),
                                          0
                                        );

                                      if (
                                        groupMax > 0 &&
                                        totalSelectedCount >= groupMax
                                      ) {
                                        return prev;
                                      }

                                      const alreadyExists =
                                        prev.selectedExtras.some(
                                          (ex) => ex.id === extra.id
                                        );
                                      if (alreadyExists) return prev;

                                      const updatedExtras = [
                                        ...prev.selectedExtras,
                                        {
                                          id: extra.id,
                                          name: extra.name,
                                          price: extra.price,
                                          quantity: 1,
                                        },
                                      ];

                                      return {
                                        ...prev,
                                        selectedExtras: updatedExtras,
                                        selectedExtrasIds:
                                          updatedExtras.map((ex) => ex.id),
                                      };
                                    });
                                  }
                                }}
                                className="flex items-center gap-2 border p-2 rounded cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={!!selected}
                                  readOnly
                                />
                                <span className="text-important">
                                  {extra.name}
                                </span>
                                <span className="text-important">
                                  {Number(extra.price) > 0 &&
                                    `(${Number(extra.price).toFixed(
                                      2
                                    )} EGP)`}{" "}
                                </span>

                                {extra.max !== 1 && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!selected) return;

                                        setSelectedItem((prev) => {
                                          const existing =
                                            prev.selectedExtras.find(
                                              (ex) => ex.id === extra.id
                                            );
                                          let updatedExtras;

                                          if (existing.quantity === 1) {
                                            // احذف العنصر لو الكمية = 1
                                            updatedExtras =
                                              prev.selectedExtras.filter(
                                                (ex) => ex.id !== extra.id
                                              );
                                          } else {
                                            // قلل الكمية
                                            updatedExtras =
                                              prev.selectedExtras.map(
                                                (ex) =>
                                                  ex.id === extra.id
                                                    ? {
                                                      ...ex,
                                                      quantity:
                                                        ex.quantity - 1,
                                                    }
                                                    : ex
                                              );
                                          }

                                          return {
                                            ...prev,
                                            selectedExtras: updatedExtras,
                                            selectedExtrasIds:
                                              updatedExtras.map(
                                                (ex) => ex.id
                                              ),
                                          };
                                        });
                                      }}
                                      className={`px-2 text-sm border rounded ${!selected
                                        ? "opacity-50 pointer-events-none"
                                        : ""
                                        }`}
                                    >
                                      -
                                    </button>

                                    <span className="w-4 text-center">
                                      {quantity}
                                    </span>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (
                                          !selected ||
                                          (extra.max > 0 &&
                                            quantity >= extra.max)
                                        )
                                          return;

                                        setSelectedItem((prev) => {
                                          const updatedExtras =
                                            prev.selectedExtras.map((ex) =>
                                              ex.id === extra.id
                                                ? {
                                                  ...ex,
                                                  quantity:
                                                    ex.quantity + 1,
                                                }
                                                : ex
                                            );

                                          return {
                                            ...prev,
                                            selectedExtras: updatedExtras,
                                          };
                                        });
                                      }}
                                      disabled={
                                        !selected ||
                                        (groupMax > 0 &&
                                          totalSelectedCount >= groupMax)
                                      }
                                      className={`px-2 text-sm border rounded ${!selected ||
                                        (extra.max > 0 &&
                                          quantity >= extra.max)
                                        ? "opacity-50 pointer-events-none"
                                        : ""
                                        }`}
                                    >
                                      +
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedItem?.mainExtras?.length > 0 && (
                    <div className="border rounded-lg overflow-hidden shadow-md">
                      <div
                        className="p-3 bg-gray- cursor-pointer flex gap-4 items-center"
                        onClick={toggleExtrasMainExtra}
                      >
                        <h3 className="font-bold text-[16px] ">
                          {selectedItem?.groupNameMainExtras}
                        </h3>
                        <h3 className=" text-[16px] ">
                          {selectedItem?.mainExtras?.category_ar} (Choose up
                          to {selectedItem?.mainExtras?.length} Items)
                        </h3>

                        <span className="text-gray-600">
                          {isOpenMainExtra ? "▲" : "▼"}
                        </span>
                      </div>

                      {/* العناصر المختارة */}
                      {selectedItem?.selectedMainExtras?.length > 0 && (
                        <div className="p-3 bg-gray- border-t">
                          <span className="text-gray-500 font-medium">
                            {selectedItem.selectedMainExtras
                              .map((extra) => extra.name)
                              .join(", ")}
                          </span>
                        </div>
                      )}

                      {/* الاختيارات */}
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpenMainExtra ? "max-h-96" : "max-h-0"
                          }`}
                      >
                        <div className="p-3 flex flex- flex-wrap gap-2">
                          {selectedItem?.mainExtras?.map((extra, index) => (
                            <label
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                value={extra.name_en}
                                checked={selectedItem.selectedMainExtras.some(
                                  (ex) => ex.id === extra.id
                                )}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setSelectedItem((prev) => {
                                    let updatedExtras = checked
                                      ? [...prev.selectedMainExtras, extra]
                                      : prev.selectedMainExtras.filter(
                                        (ex) => ex.id !== extra.id
                                      );

                                    let updatedExtrasIds =
                                      updatedExtras.map((ex) => ex.id); // تخزين الـ ID فقط

                                    // حساب السعر الإجمالي الجديد
                                    const newTotalPrice =
                                      updatedExtras.reduce(
                                        (acc, curr) =>
                                          acc +
                                          parseFloat(curr.price || "0"), // تحويل السعر إلى رقم مع معالجة القيم الفارغة
                                        0
                                      );

                                    // console.log(
                                    //   "Selected Extras:",
                                    //   updatedExtras
                                    // );
                                    // console.log(
                                    //   "Total Price:",
                                    //   newTotalPrice
                                    // );
                                    setTotalExtrasPrice(newTotalPrice);
                                    return {
                                      ...prev,
                                      selectedMainExtras: updatedExtras,
                                      selectedMainExtrasIds:
                                        updatedExtrasIds, // تحديث قائمة الـ IDs
                                    };
                                  });
                                }}
                              />
                              <span className="text-important">
                                {extra.name}
                              </span>
                              <span className="text-important">
                                {Number(extra.price) > 0 &&
                                  `(${Number(extra.price).toFixed(
                                    2
                                  )} EGP)`}{" "}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="sticky  flex flex-col lg:flex-row lg:items-center gap-2 my-4">
                    <Label className="lg:min-w-[100px]">Note:</Label>
                    <Input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      type="text"
                      placeholder="Note"
                      className="w-full text-important"
                    />
                  </div>
                  <div className="sticky bottom-[-23px] bg-white dark:bg-black p-4 border-t border-gray-300 dark:border-gray-700 shadow-md z-50 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        {selectedItem?.selectedInfo && (
                          <p className="font-semibold">
                            {counter > 1 ? `${counter}x` : ""}{" "}
                            {selectedItem?.selectedInfo || ""}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <p className="text-sm font-semibold mr-1">
                          Subtoal:{" "}
                        </p>
                        <p className="text-sm font-semibold mr-1">
                          {(
                            (selectedItem?.price + totalExtrasPrices +
                              totalOptionPrices +
                              totalMainExtrasPrices) * counter

                          ).toFixed(2)}
                        </p>
                        <p className="text-sm font-semibold ">EGP</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-semibold flex flex-wrap max-w-[500px]">
                        <p className="text-gray-500 ml-3">
                          {(selectedItem?.selectedoption || [])
                            .map((option) => option.name)
                            .join(", ")}

                          {/* فاصل لو في option و extras */}
                          {selectedItem?.selectedoption?.length > 0 &&
                            selectedItem?.selectedExtras?.length > 0 &&
                            ", "}

                          {/* الإكسترا مع الكمية */}
                          {(selectedItem?.selectedExtras || [])
                            .map((extra) =>
                              extra.quantity > 1
                                ? `${extra.name} x${extra.quantity}`
                                : `${extra.name}`
                            )
                            .join(", ")}

                          {/* فاصل لو في main extras */}
                          {selectedItem?.selectedMainExtras?.length > 0 &&
                            (selectedItem?.selectedoption?.length > 0 ||
                              selectedItem?.selectedExtras?.length > 0) &&
                            ", "}

                          {/* main extras */}
                          {(selectedItem?.selectedMainExtras || [])
                            .map((extra) =>
                              extra.quantity > 1
                                ? `${extra.name} x${extra.quantity}`
                                : `${extra.name}`
                            )
                            .join(", ")}
                        </p>
                      </div>

                      <DialogFooter className="mt-4">
                        <div className="flex items-center gap-4">
                          {/* <p className="text-sm font-semibold mr-1 ">
                                                {selectedUser ? massegeNotSerachPhone : ""} 
                                                </p> */}
                          {!selectedUser && massegeNotSerachPhone && (
                            <p className="text-sm font-semibold mr-1">
                              {massegeNotSerachPhone}
                            </p>
                          )}

                          <p className="text-sm font-semibold mr-1 ">
                            {deliveryMethod === "pickup" &&
                              !isBranchManuallySelected
                              ? massegeNotSelectedBranch
                              : ""}
                          </p>
                          {massegeInvaildToken && (
                            <p className="text-sm font-semibold text-red-500 mr-1">
                              {massegeInvaildToken}{" "}
                              <Link
                                href={`/${language}/login`}
                                className="text-blue-500 underline ml-1"
                              >
                                Login here
                              </Link>
                            </p>
                          )}

                          <Button
                            type="submit"
                            color="success"
                            onClick={handleAddToCart}
                            disabled={
                              !selectedUser ||
                              (deliveryMethod === "pickup" &&
                                !isBranchManuallySelected) ||
                              !selectedItem?.selectedInfo
                            }
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </DialogFooter>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <>
              <NewUserDialog
                isNewUserDialogOpen={isNewUserDialogOpen}
                setIsNewUserDialogOpen={setIsNewUserDialogOpen}
                selectedAddressType={selectedAddressType}
                areasOptions={areasOptions}
                handleChangeArea={handleChangeArea}
                theme={theme}
                color={color}
                setLoading={setLoading}
                token={token}
                apiBaseUrl={apiBaseUrl}
                editAddressType={editAddressType}
                setCustomAddressName={setCustomAddressName}
              />

              <NewAddressDialog
                isNewAddressDialogOpen={isNewAddressDialogOpen}
                setIsNewAddressDialogOpen={setIsNewAddressDialogOpen}
                setIsNewUserDialogOpen={setIsNewUserDialogOpen}
                addAddressType={addAddressType}
                areasOptions={areasOptions}
                handleChangeArea={handleChangeArea}
                theme={theme}
                color={color}
                setLoading={setLoading}
                selectedUser={selectedUser}
                token={token}
                phone={phone}
                setaddAddressType={setaddAddressType}
                QueryClient={queryClient}
                selectedAddressType={selectedAddressType}
                apiBaseUrl={apiBaseUrl}
                refetch={refetch}
              />


            </>
            {/* </div> */}
          </Card>
        </div>

        <div className="flex flex-col gap-4 order-1 lg:order-2  ">
          {restaurantsSelect?.length > 1 && (
            <Select
              placeholder="Select Restaurant"
              className="react-select  mb-0"
              classNamePrefix="select"
              options={restaurantsSelect}
              value={restaurantsSelect.find(
                (option) => option.value === selectedRestaurantId
              )}
              onChange={handleRestaurantChange}
              styles={selectStyles(theme, color)}
            />
          )}
          <Card className="p-4 shadow-m rounded-lg w-full mt0 ">
            <div className="flex gap-1 items-center justify-between mb-3">
              <div className="relative flex-grow">
                <span className="absolute top-1/2 left-2 -translate-y-1/2">
                  <Search className="w-4 h-4 text-gray-500" disabled={!isOnline} />
                </span>

                <Input
                  type="text"
                  placeholder="Enter phone number"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="pl-7 pr-8 w-full text-important"
                  disabled={isEditMode || !isOnline}
                />
                {search && (
                  <button
                    onClick={handleClear}
                    disabled={isEditMode}
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-important text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0056b3")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#007bff")
                  }
                  disabled={isEditMode || !isOnline}
                >
                  <FiSearch className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleNewUserClick}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0056b3")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#007bff")
                  }
                  disabled={isEditMode || !isOnline}
                >
                  <Admin />
                </Button>
              </div>
            </div>
            {showUserWarningDialog && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                onClick={() => setShowUserWarningDialog(false)} //  يقفل المودال لو ضغط برا
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center"
                  onClick={(e) => e.stopPropagation()} // يمنع إغلاق المودال لو ضغط جوه
                >
                  <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
                  <p className="mb-4 text-gray-700">
                    Please select a user before choosing an item.
                  </p>
                  <Button
                    onClick={() => setShowUserWarningDialog(false)}
                    className=" px-4 py-2 rounded text-important"
                  >
                    OK
                  </Button>
                </div>
              </div>
            )}
            {showBranchWarningDialog && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
                onClick={() => setShowBranchWarningDialog(false)} //  يقفل المودال لو ضغط برا
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm text-center"
                  onClick={(e) => e.stopPropagation()} //  يمنع إغلاق المودال لو ضغط جوه
                >
                  <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
                  <p className="mb-4 text-gray-700">
                    Please select a branch before choosing an item.
                  </p>
                  <Button
                    onClick={() => setShowBranchWarningDialog(false)}
                    className=" px-4 py-2 rounded text-important"
                  >
                    OK
                  </Button>
                </div>
              </div>
            )}

            {/* {sessionExpiredDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
      <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
      <h2 className="text-lg font-semibold mb-2 text-red-600">
        Session Expired
      </h2>
  
      <button
        onClick={() => {
          localStorage.clear();
          Cookies.remove("token");
          window.location.replace(`/${language}/login`);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Go to Login
      </button>
    </div>
  </div>
)} */}

            {/* {selectedUser && isOpenUserData && (
              <div className="mt-2 p-2  rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {selectedUser.user_name}
                  </h3>
                  <Button
                    disabled={isEditMode}
                    className="my3"
                    onClick={() => setOpenEditDialog(true)}
                  >
                    <FiEdit />
                  </Button>
                </div>

                <div className="mt-2">
                  <p className="mb-2 flex">Phone: {selectedUser.phone}</p>

                  {selectedUser?.phone2 && (
                    <p>Phone2: {selectedUser?.phone2 || ""} </p>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <p>Orders Count: {selectedUser?.orders_count}</p>
                  <p>Points: {selectedUser?.user?.points}</p>
                </div>
              </div>
            )} */}
            {isOpenUserData && hasSearched ? (
              isLoadingUserDataForSerach || showManualLoading ? (
                <div className="mt-2 p-2 rounded-md">
                  <p className=" text-center">loading...</p>
                </div>
              ) : selectedUser ? (
                <div className="mt-2 p-2 rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">
                      {selectedUser.user_name}
                    </h3>
                    <Button
                      disabled={isEditMode}
                      className="my3"
                      onClick={() => setOpenEditDialog(true)}
                    >
                      <FiEdit />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <p className="mb-2 flex">Phone: {selectedUser.phone}</p>
                    {selectedUser?.phone2 && (
                      <p>Phone2: {selectedUser?.phone2 || ""} </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <p>Orders Count: {selectedUser?.orders_count}</p>
                    <p>Points: {selectedUser?.user?.points}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-2 p-2 rounded-md">
                  <p className="text-red-500 text-center">
                    {staticMassageError}
                  </p>
                </div>
              )
            ) : null}
            <h3 className="text-lg font-semibold "></h3>
            {/* {isOpenUserData && (
  <div className="mt-2 p-2 rounded-md">
    {selectedUser ? (
      <>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {selectedUser.user_name}
          </h3>
          <Button className="my3" onClick={() => setOpenEditDialog(true)}>
            <FiEdit />
          </Button>
        </div>

        <div className="mt-2">
          <p className="mb-2 flex">Phone: {selectedUser.phone}</p>
          {selectedUser?.phone2 && <p>Phone2: {selectedUser?.phone2}</p>}
        </div>

        <div className="flex items-center gap-4 mt-2">
          <p>Orders Count: {selectedUser.orders_count}</p>
          <p>Points: {selectedUser.user.points}</p>
        </div>
      </>
    ) : (
      hasSearched && !isLoadingUserDataForSerach && (
        <p className="text-red-500 flex justify-between items-center">
          {errorSearchUser ? errorSearchUser : "No user found"}
        </p>
      )
    )}
  </div>
)} */}
          </Card>

          {selectedUser && !(isLoadingUserDataForSerach || showManualLoading) && (
            <>
              <Card className="p-4 s w-full mt-0">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setIsOpenAddress(!isOpenAddress)}
                >
                  {deliveryMethod === "delivery" && selectedAddress && (
                    <div className="mt- ">
                      <p className="text-sm">{selectedAddress?.address1}</p>
                    </div>
                  )}
                  {deliveryMethod === "pickup" && (
                    <div>
                      <p className="text-sm">
                        Pickup
                        {selectedBranchName ? `- ${selectedBranchName}` : ""}
                      </p>
                    </div>
                  )}
                  <span className="ml-auto">
                    {isOpenAddress ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </div>

                {isOpenAddress && selectedUser && (
                  <div className="mt-2 p-2  rounded-md">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="radio"
                            id="delivery"
                            checked={deliveryMethod === "delivery"}
                            onChange={() => setDeliveryMethod("delivery")}
                          />
                          <label htmlFor="delivery">Delivery</label>
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="radio"
                            id="pickup"
                            checked={deliveryMethod === "pickup"}
                            onChange={() => setDeliveryMethod("pickup")}
                          />
                          <label htmlFor="pickup">Pickup</label>
                        </div>
                      </div>

                      <Button
                        className="my3"
                        onClick={() => setIsNewAddressDialogOpen(true)}
                      >
                        <FaPlus className="m text-xs" />
                      </Button>
                    </div>

                    {deliveryMethod === "delivery" && (
                      <div className="my-3">
                        {selectedAddressArray?.length > 0 && (
                          <h4 className="font-medium my-3">Address:</h4>
                        )}
                        {selectedAddressArray.map((address) => (
                          <div
                            key={address.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <input
                                type="radio"
                                id={address.id}
                                checked={selectedAddress?.id === address.id}
                                onChange={() => {
                                  setSelectedAddress(address);
                                  setAddressWasManuallySelected(true);
                                }}
                              />
                              <label htmlFor={address.id}>
                                {address.address_name}
                              </label>
                            </div>

                            <div className="flex gap-3 ml-auto mb-3">
                              <button
                                size="icon"
                                onClick={() => handleEditAddress(address)}
                              >
                                <FiEdit className="mr-1 text-xs" />
                              </button>
                              <DeleteAddressAlert handleDeleteAddress={handleDeleteAddress}
                                lodaingEditDeletedAddress={lodaingEditDeletedAddress} address={address} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {deliveryMethod === "pickup" && (
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                        <Select
                          className="react-select w-full"
                          classNamePrefix="select"
                          options={branchOptions}
                          onChange={handleSelectChangeBranches}
                          placeholder="Branches"
                          styles={selectStyles(theme, color)}
                          value={selectedBranchInSelected}
                        />
                        {showAlertBranch && (
                          <ShowAlertBranchAlert
                            showAlertBranch={showAlertBranch}
                            setShowAlertBranch={setShowAlertBranch}
                            handleCancelChange={handleCancelChange}
                            handleConfirmChange={handleConfirmChange} />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </>
          )}

          {cartItems.length > 0 && (
            <>
              <h3 className="text-lg font-semibold"></h3>
              <Card className="w-full mt-0 mb-3">
                {cartItems.length > 0 && (
                  <>
                    <Card className="w-full p-2  mt-0">
                      {cartItems.length > 0 && (
                        <>
                          <Card className="w-full p-2  mt-0">
                            {cartItems.map((item, index) => {
                              const extrasTotal =
                                item.selectedMainExtras?.reduce(
                                  (sum, extra) =>
                                    sum + parseFloat(extra?.price_en || 0),
                                  0
                                ) || 0;

                              const itemPrice = parseFloat(item?.price || 0);
                              const itemQuantity = parseFloat(
                                item?.quantity || 0
                              );
                              const total = itemPrice * itemQuantity;
                              const itemTotal = total + extrasTotal;

                              return (
                                <div key={item.id} className="p-2 mb-4">
                                  <div className="flex justify-between gap-2 pb-2 mb-1">
                                    <span className="text-center break-words whitespace-nowrap overflow-hidden text-[14px] font-semibold">
                                      {item.selectedInfo}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                      {item.price.toFixed(2)}
                                      <span>EGP</span>
                                    </span>
                                  </div>
                                  <div className="mt-1 flex flex-col gap-1 text-xs text-gray-700 dark:text-gray-300">
                                    {/* Option */}
                                    {item.selectedoption?.length > 0 && (
                                      <div>
                                        <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-[12px]">
                                          {item.selectedoption.map((opt, i) => (
                                            <React.Fragment key={i}>
                                              <span className="truncate">
                                                {opt.name}
                                              </span>
                                              <span className="text-center">
                                                ×1
                                              </span>
                                              <span className="text-end">
                                                {(
                                                  Number(opt?.price) || 0
                                                ).toFixed(2)}{" "}
                                                EGP
                                              </span>
                                            </React.Fragment>
                                          ))}
                                        </div>
                                        {/* <span className="text-end">{(extra.price * extra.quantity)?.toFixed(2)} EGP</span> */}
                                      </div>
                                    )}

                                    {/* Extras */}
                                    {item.selectedExtras?.length > 0 && (
                                      <div>
                                        <div className="grid grid-cols-3 gap-x-2 text-[12px] mt-2 mb-2">
                                          {item.selectedExtras.map(
                                            (extra, i) => (
                                              <React.Fragment key={i}>
                                                <span className="whitespace-normal break-words">
                                                  {extra.name}
                                                </span>
                                                <span className="text-center">
                                                  ×{extra.quantity}
                                                </span>
                                                <span className="text-end">
                                                  {(
                                                    extra.price * extra.quantity
                                                  )?.toFixed(2)}{" "}
                                                  EGP
                                                </span>
                                              </React.Fragment>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Main Extras */}
                                    {item.selectedMainExtras?.length > 0 && (
                                      <div>
                                        <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-[12px]">
                                          {item.selectedMainExtras.map(
                                            (main, i) => (
                                              <React.Fragment key={i}>
                                                <span className="whitespace-normal break-words">
                                                  {main.name}
                                                </span>
                                                <span className="text-center">
                                                  ×{main.quantity || 1}
                                                </span>
                                                <span className="text-end">
                                                  {(
                                                    (Number(main?.price) || 0) *
                                                    (Number(main?.quantity) ||
                                                      1)
                                                  ).toFixed(2)}{" "}
                                                  EGP
                                                </span>
                                              </React.Fragment>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* If selectedExtras exist, show them. Else, fallback to size_condiments */}
                                    {isEditMode &&
                                      item.selectedExtras?.length === 0 &&
                                      item.selectedMainExtras?.length === 0 &&
                                      item.size_condiments?.length > 0 && (
                                        <div>
                                          <div className="grid grid-cols-3 gap-x-2 text-[12px] mt-2 mb-2">
                                            {item.size_condiments.map(
                                              (extra, i) => (
                                                <React.Fragment key={i}>
                                                  <span className="whitespace-normal break-words">
                                                    {
                                                      extra?.condiment_info
                                                        ?.name_en
                                                    }
                                                  </span>
                                                  <span className="text-center">
                                                    ×{extra.count || 1}
                                                  </span>
                                                  <span className="text-end">
                                                    {(
                                                      Number(extra.price) *
                                                      (extra.count || 1)
                                                    ).toFixed(2)}{" "}
                                                    EGP
                                                  </span>
                                                </React.Fragment>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>

                                  <div className="flex items-center justify-between gap-2">
                                    <div className="my-3 w-full">
                                      <Input
                                        type="text"
                                        value={item.note || ""}
                                        onChange={(e) =>
                                          handleNoteChange(e, item.cartId)
                                        }
                                        placeholder="No note added"
                                        className="w-full px-3 py- border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
                                      //  className="w-16 text-center border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:-blue-500 focus:border-transparent "
                                      />
                                    </div>
                                    <div className="flex items-center">
                                      <button
                                        onClick={() =>
                                          handleDecreaseTable(item.cartId)
                                        }
                                        className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                                      >
                                        -
                                      </button>

                                      <input
                                        type="number"
                                        step="0.001"
                                        value={item.quantity}
                                        onChange={(e) => {
                                          const value = parseFloat(
                                            e.target.value
                                          );
                                          if (!isNaN(value) && value >= 0.1) {
                                            setCartItems((prevItems) =>
                                              prevItems.map((i) =>
                                                i.cartId === item.cartId
                                                  ? {
                                                    ...i,
                                                    quantity: value,
                                                    total: value * i.price,
                                                  }
                                                  : i
                                              )
                                            );
                                          }
                                        }}
                                        className="w-12 text-center border border-gray-300 rounded-[6px] mx-1"
                                      />

                                      <button
                                        onClick={() =>
                                          handleIncreaseTable(item.cartId)
                                        }
                                        className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <div className="flex ml-1  items-center">
                                      <button
                                        size="icon"
                                        onClick={() => handleEditItem(item)}
                                        className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
                                      >
                                        <FiEdit className="mr-3 text-l" />
                                      </button>
                                      <DeleteItemFromCartAlert handleRemoveItem={handleRemoveItem} item={item} />
                                    </div>

                                    {/* <span>
                                      {(() => {
                                        if (
                                          (item.selectedExtras?.length || 0) ===
                                            0 &&
                                          (item.selectedMainExtras?.length ||
                                            0) === 0 &&
                                          (item.selectedoption?.length || 0) ===
                                            0
                                        ) {
                                          return `${item.sub_total?.toFixed(
                                            2
                                          )} EGP`; // عرض التوتال القديم لو مفيش إضافات
                                        }

                                        const optionsTotal = (
                                          item.selectedoption || []
                                        ).reduce(
                                          (sum, o) =>
                                            sum +
                                            (Number(o.price) || 0) *
                                              (Number(o.quantity) || 1),
                                          0
                                        );
                                        const extrasTotal = (
                                          item.selectedExtras || []
                                        ).reduce(
                                          (sum, e) =>
                                            sum +
                                            (Number(e.price) || 0) *
                                              (Number(e.quantity) || 1),
                                          0
                                        );
                                        const mainExtrasTotal = (
                                          item.selectedMainExtras || []
                                        ).reduce(
                                          (sum, e) =>
                                            sum +
                                            (Number(e.price) || 0) *
                                              (Number(e.quantity) || 1),
                                          0
                                        );
                                        const basePrice =
                                          Number(item.price) || 0;
                                        const total =
                                          (basePrice *item.quantity) + (optionsTotal + extrasTotal +  mainExtrasTotal)

                                        return `${total.toFixed(2)} EGP`;
                                      })()}
                                    </span> */}
                                    {/* <span>
                                      {(() => {
                                        const isUnchangedItem =
                                          (item.selectedExtras?.length || 0) === 0 &&
                                          (item.selectedMainExtras?.length || 0) === 0 &&
                                          (item.selectedoption?.length || 0) === 0 &&
                                          item.sub_total;

                                        if (isUnchangedItem) {
                                          const baseSubTotal = Number(item.sub_total) || 0;
                                          return `${(baseSubTotal).toFixed(2)} EGP`;
                                        }

                                        const optionsTotal = (item.selectedoption || []).reduce(
                                          (sum, o) => sum + (Number(o.price) || 0) * (Number(o.quantity) || 1),
                                          0
                                        );

                                        const extrasTotal = (item.selectedExtras || []).reduce(
                                          (sum, e) => sum + (Number(e.price) || 0) * (Number(e.quantity) || 1),
                                          0
                                        );

                                        const mainExtrasTotal = (item.selectedMainExtras || []).reduce(
                                          (sum, e) => sum + (Number(e.price) || 0) * (Number(e.quantity) || 1),
                                          0
                                        );

                                        const basePrice = Number(item.price) || 0;
                                        const quantity = Number(item.quantity) || 1;

                                        const total =
                                          (basePrice + optionsTotal + extrasTotal + mainExtrasTotal) * quantity;

                                        return `${total.toFixed(2)} EGP`;
                                      })()}
                                    </span> */}
                                    <span>
                                      {(() => {
                                        const isUnchangedItem =
                                          (item.selectedExtras?.length || 0) === 0 &&
                                          (item.selectedMainExtras?.length || 0) === 0 &&
                                          (item.selectedoption?.length || 0) === 0 &&
                                          item.sub_total;

                                        if (isUnchangedItem) {
                                          const baseSubTotal = Number(item.sub_total) || 0;
                                          const quantity = Number(item.quantity) || 1;
                                          return `${(baseSubTotal * quantity).toFixed(2)} EGP`;
                                        }

                                        const optionsTotal = (item.selectedoption || []).reduce(
                                          (sum, o) => sum + (Number(o.price) || 0) * (Number(o.quantity) || 1),
                                          0
                                        );

                                        const extrasTotal = (item.selectedExtras || []).reduce(
                                          (sum, e) => sum + (Number(e.price) || 0) * (Number(e.quantity) || 1),
                                          0
                                        );

                                        const mainExtrasTotal = (item.selectedMainExtras || []).reduce(
                                          (sum, e) => sum + (Number(e.price) || 0) * (Number(e.quantity) || 1),
                                          0
                                        );

                                        const basePrice = Number(item.price) || 0;
                                        const quantity = Number(item.quantity) || 1;

                                        const total =
                                          (basePrice + optionsTotal + extrasTotal + mainExtrasTotal) * quantity;

                                        return `${total.toFixed(2)} EGP`;
                                      })()}
                                    </span>
                                  </div>
                                  {index !== cartItems.length - 1 && (
                                    <div className="border-b border-gray-500 -mx-4 mt-4"></div>
                                  )}
                                </div>
                              );
                            })}
                          </Card>
                        </>
                      )}
                    </Card>
                  </>
                )}
              </Card>
            </>
          )}
          {cartItems.length > 0 && (
            <>
              <h3 className="text-lg font-semibold"></h3>
              <Card className="w-full p-2 shadow-md rounded-lg mt-0">
                {cartItems.length > 0 && (
                  <>
                    <Card title="Bordered Tables">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-important">
                              Subtotal
                            </TableCell>
                            <TableCell className="text-important ml-">
                              {cartItems?.length}
                            </TableCell>
                            <TableCell className="text-important">
                              {grandTotal.toFixed(2)} EGP
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-important">
                              Discount
                            </TableCell>
                            <TableCell className="text-important">
                              0%
                            </TableCell>
                            <TableCell className="text-important">
                              0
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-important">
                              Delivery
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-important">
                              {Delivery || 0} EGP
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-important">
                              VAT
                            </TableCell>
                            <TableCell className="text-important">
                              {Tax}%
                            </TableCell>
                            <TableCell className="text-important">
                              {/* {(grandTotal + Delivery * (Tax / 100)).toFixed(2)} */}
                              {((grandTotal + Delivery) * (Tax / 100)).toFixed(
                                2
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                        <TableFooter className="bg-default-100 border-t border-default-300">
                          <TableRow>
                            <TableCell
                              colSpan="2"
                              className="text-sm  font-semibold text-important"
                            >
                              Total
                            </TableCell>
                            <TableCell className="text-sm  font-semibold text-right text-important">
                              {totalAmount.toFixed(2)} EGP
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </Card>

                    {createOrderDialogOpen && (
                      <Dialog
                        open={createOrderDialogOpen}
                        onOpenChange={setCreateOrderDialogOpen}
                      >
                        <DialogContent size="3xl">
                          <DialogHeader>
                            <DialogTitle className="text-base font-medium text-default-700">
                              Payment Process
                            </DialogTitle>
                          </DialogHeader>
                          <div className="text-sm text-default-500 space-y-4">
                            <form
                              onSubmit={handleCreateOrder(
                                onSubmithandleCreateOrder
                              )}
                            >
                              <div className="flex gap-4 my-3">
                                <div className="flex flex-col w-1/2">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Payment
                                  </label>

                                  <Controller
                                    name="orderpayment"
                                    control={controlCreateOrder}
                                    rules={{
                                      required: "Order payment is required",
                                    }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        options={orderPaymenyOptions}
                                        placeholder="Select Order Payment"
                                        className="react-select"
                                        classNamePrefix="select"
                                        value={
                                          orderPaymenyOptions.find(
                                            (option) =>
                                              option.value === field.value
                                          ) || null
                                        }
                                        onChange={(selectedOption) => {
                                          field.onChange(selectedOption.value);
                                          setSelectedOrderPaymeny(
                                            selectedOption
                                          );
                                        }}
                                        styles={selectStyles(theme, color)}
                                      />
                                    )}
                                  />
                                </div>
                                <div className="flex flex-col w-1/2">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Channal
                                  </label>

                                  <Controller
                                    name="ordersource"
                                    control={controlCreateOrder}
                                    rules={{
                                      required: "Order source is required",
                                    }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        options={orderSourceOptions}
                                        placeholder="Select Order Source"
                                        className="react-select"
                                        classNamePrefix="select"
                                        value={
                                          orderSourceOptions.find(
                                            (option) =>
                                              option.label === field.value
                                          ) || null
                                        }
                                        onChange={(selectedOption) => {
                                          field.onChange(selectedOption.label);
                                          setValueCreateOrder(
                                            "ordersource",
                                            selectedOption.label,
                                            { shouldValidate: true }
                                          );
                                          setOrderSourceSelected(
                                            selectedOption
                                          );
                                        }}
                                        styles={selectStyles(theme, color)}
                                      />
                                    )}
                                  />
                                </div>
                                <div className="flex flex-col w-1/2">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Order Type
                                  </label>

                                  <Controller
                                    name="ordertype"
                                    control={controlCreateOrder}
                                    rules={{
                                      required: "Order type is required",
                                    }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        options={orderTypeOptions}
                                        placeholder="Select Order Type"
                                        className="react-select"
                                        classNamePrefix="select"
                                        value={
                                          orderTypeOptions.find(
                                            (option) =>
                                              option.value === field.value
                                          ) || null
                                        }
                                        onChange={(selectedOption) => {
                                          field.onChange(selectedOption.value);
                                          setSelectedOrderType(selectedOption);
                                        }}
                                        styles={selectStyles(theme, color)}
                                      />
                                    )}
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                <div className="flex w-1/2 items-center">
                                  <label className="text-important font-medium text-[] mb-1  mr-2">
                                    Address:
                                  </label>
                                  {selectedOrderType?.value === 1 ? (
                                    <p className="w-full text-important">
                                      {selectedAddress?.address1}
                                    </p>
                                  ) : (
                                    <p className="w-full text-important">
                                      Pickup
                                    </p>
                                  )}
                                </div>

                                <div className="flex flex-col w-1/2">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Branch
                                  </label>

                                  <Controller
                                    name="branches"
                                    control={controlCreateOrder}
                                    defaultValue={
                                      selectedBranch?.id ||
                                      branchOptions?.[0]?.value ||
                                      ""
                                    }
                                    render={({ field }) => {
                                      return (
                                        <Select
                                          {...field}
                                          className="react-select w-full"
                                          classNamePrefix="select"
                                          options={branchOptions}
                                          onChange={(selectedOption) => {
                                            if (!selectedOption) return;

                                            const branchId = Number(
                                              selectedOption.value
                                            );

                                            field.onChange(branchId);
                                            setSelectedBranchIdCreateOrder(
                                              branchId
                                            );
                                            setSelectedBranchPriceList(
                                              selectedOption?.priceList
                                            );
                                            setSavedBranch(selectedOption);
                                            setSelectedBranchInSelected(
                                              selectedOption
                                            );
                                            setSelectedBranchName(
                                              selectedOption?.label
                                            );
                                            setValueCreateOrder(
                                              "branches",
                                              branchId,
                                              { shouldValidate: true }
                                            );
                                          }}
                                          value={
                                            branchOptions?.find(
                                              (option) =>
                                                option.value === field.value
                                            ) ||
                                            branchOptions?.[0] || // اختيار أول عنصر تلقائيًا
                                            null
                                          }
                                          placeholder="Branches"
                                          styles={selectStyles(theme, color)}
                                        />
                                      );
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col gap-4 my-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="toggleDateTime"
                                    checked={showDateTime}
                                    onChange={() =>
                                      setShowDateTime(!showDateTime)
                                    }
                                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                                  />
                                  <label
                                    htmlFor="toggleDateTime"
                                    className="text-gray-700 dark:text-gray-200 font-medium cursor-pointer"
                                  >
                                    Schedule
                                  </label>
                                </div>

                                {showDateTime && (
                                  <div className="flex gap-4">
                                    {/* Start Date */}

                                    <div className="flex flex-col  w-1/2">
                                      <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                        Start Date
                                      </label>
                                      <Controller
                                        name="startDate"
                                        control={controlCreateOrder}
                                        rules={{
                                          required: "Start date is required",
                                        }}
                                        render={({ field }) => (
                                          <Input
                                            {...field}
                                            type="date"
                                            className="border  rounded-md p-2 w-full"
                                            min="1900-01-01"
                                            max="2099-12-31"
                                          />
                                        )}
                                      />
                                    </div>
                                    {/* Start Time */}
                                    <div className="flex flex-col  w-1/2">
                                      <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                        Start Time
                                      </label>
                                      <Controller
                                        name="startTime"
                                        control={controlCreateOrder}
                                        rules={{
                                          required: "Start time is required",
                                        }}
                                        render={({ field }) => (
                                          <Input
                                            {...field}
                                            type="time"
                                            className="border -gray-300 rounded-md p-2 w-full"
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col lg:flex-row lg:items-center gap-2 mt-3">
                                <div className="flex flex-col w-1/2">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Insert coupon
                                  </label>

                                  <Input
                                    type="text"
                                    placeholder="insert Coupon"
                                    {...registerCreateOrder("insertcoupon")}
                                  // className="w-full"
                                  />
                                </div>
                                <div className="flex flex-col w-1/2 ">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Insert Points
                                  </label>
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      placeholder="Insert Points"
                                      className="border p-2 text-"
                                      {...registerCreateOrder("insertpoints", {
                                        setValueAs: (v) =>
                                          v === "" ? 0 : Number(v),
                                      })}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col lg:flex-row lg:items-center gap-2 mt-2">
                                <div className="flex flex-col w-1/2">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Discount
                                  </label>
                                  <div className="flex gap-2 items-center">
                                    <div className="flex items-center border rounded overflow-hidden">
                                      <Input
                                        type="number"
                                        value={discountValue}
                                        onChange={handleDiscountValueChange}
                                        className="border-0 p-2 w-20 text-center"
                                      />
                                      <span className="px-3 bg-gray- border-l h-[36px] flex items-center justify-center">
                                        L.E
                                      </span>
                                    </div>

                                    <div className="flex items-center border rounded overflow-hidden">
                                      <Input
                                        type="number"
                                        value={discountPercentage}
                                        onChange={
                                          handleDiscountPercentageChange
                                        }
                                        className="border-0 p-2 w-20 text-center"
                                      />
                                      <span className="px-3 bg-gray- border-l h-[36px] flex items-center justify-center">
                                        %
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col h-full flex-1">
                                  <label className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                    Order notes
                                  </label>
                                  <div className="flex-1 w-full">
                                    <Textarea
                                      type="text"
                                      placeholder="Order notes"
                                      // onChange={handleTextareaChange}
                                      onChange={(e) => {
                                        handleTextareaChange(e);
                                        setOrderNote(e.target.value);
                                      }}
                                      className="border p-2 h-full resize-none !w-full"
                                      {...registerCreateOrder("notes")}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-5">
                                <div className="text-sm font-medium text-[#]">
                                  <span className="text- text-important">
                                    Total Order : {finalTotal.toFixed(2)} EGP
                                  </span>
                                </div>

                                {/* Select في المنتصف */}
                                <div className="w-1/3 flex justify-center">
                                  <Controller
                                    name="orderstatus"
                                    control={controlCreateOrder}
                                    rules={{
                                      required: "Order status is required",
                                    }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        options={orderStatusOptions || []}
                                        placeholder="Select Order status"
                                        className="react-select w-full"
                                        classNamePrefix="select"
                                        value={
                                          orderStatusOptions.find(
                                            (option) =>
                                              option.value === field.value
                                          ) || null
                                        }
                                        onChange={(selectedOption) => {
                                          field.onChange(selectedOption.value);
                                          setValueCreateOrder(
                                            "orderstatus",
                                            selectedOption.value
                                          );
                                        }}
                                        styles={selectStyles(theme, color)}
                                      />
                                    )}
                                  />
                                </div>

                                <DialogFooter>
                                  <DialogClose asChild></DialogClose>

                                  {lodaingCreateOrder ? (
                                    <Button
                                      type="submit"
                                      disabled
                                      className="w-[150px] flex items-center justify-center"
                                    >
                                      <FaSpinner className="animate-spin mr-2" />

                                    </Button>
                                  ) : (
                                    <Button type="submit">Send order</Button>
                                  )}

                                  {/* <Button type="submit">
                                    {" "}
                                    {isEditMode ? "Edit order" : "Send order"}
                                  </Button> */}

                                </DialogFooter>
                              </div>
                            </form>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    <CancelOrderAlert
                      handleCacelOrder={handleCacelOrder}
                      setCreateOrderDialogOpen={setCreateOrderDialogOpen} />
                  </>
                )}
              </Card>
            </>
          )}
        </div>
        <>
          {openEditDialog && selectedUser && (
            <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
              <DialogContent size="3xl">
                <DialogHeader>
                  <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleSubmitEdit(onSubmitEditUserData)}
                  className="space-y-1"
                >
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-important"
                  >
                    Username
                    {/* <span className="text-red-500">*</span> */}
                  </label>

                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    {...registerEdit("username")}
                    className={`${errorsEdit.username ? "mb-1" : "mb-4"
                      } text-important`}
                  />
                  {errorsEdit.username && (
                    <p className="text-red-500 text-sm my-1">
                      {errorsEdit.username.message}
                    </p>
                  )}

                  {/* Phone */}
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-important"
                  >
                    Phone
                    {/* <span className="text-red-500">*</span>    */}
                  </label>
                  <Input
                    id="phone"
                    type="number"
                    placeholder="Phone"
                    {...registerEdit("phone")}
                    className={`${errorsEdit.phone ? "mb-1" : "mb-4"
                      } text-important`}
                  />
                  {errorsEdit.phone && (
                    <p className="text-red-500 text-sm">
                      {errorsEdit.phone.message}
                    </p>
                  )}

                  {/* Phone 2 */}
                  <label
                    htmlFor="phone2"
                    className="block text-sm font-medium text-important"
                  >
                    Phone 2
                  </label>
                  <Input
                    id="phone2"
                    type="number"
                    placeholder="Phone 2"
                    {...registerEdit("phone2", { required: false })}
                    className={`${errorsEdit.phone2 ? "mb-1" : "mb-4"
                      } text-important`}
                  />
                  {errorsEdit.phone2 && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorsEdit.phone2.message}
                    </p>
                  )}

                  {/* Email */}
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-important"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Email"
                    {...registerEdit("email", { required: false })}
                    className={`${errorsEdit.email ? "mb-1" : "mb-4"
                      } text-important`}
                  />
                  {errorsEdit.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorsEdit.email.message}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="mt-3">
                    <DialogFooter className="flex justify-between items-center mt-4">
                      <DialogClose asChild>


                      </DialogClose>

                      {lodaingEditUserData ? (
                        <Button
                          type="submit"
                          disabled
                          className="w-[150px] flex items-center justify-center"
                        >
                          <FaSpinner className="animate-spin mr-2" />

                        </Button>
                      ) : (
                        <Button type="submit" className="w-[150px]">
                          Save Changes
                        </Button>
                      )}
                      {/* <Button type="submit">Save Changes</Button> */}
                    </DialogFooter>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
          <EditAddressDiaolg
            openEditAddressDialog={openEditAddressDialog}
            setOpenEditAddressDialog={setOpenEditAddressDialog}
            color={color}
            theme={theme}
            areasOptions={areasOptions}
            handleChangeArea={handleChangeArea}
            token={token}
            phone={phone}
            queryClient={queryClient}
            setCustomAddressName={setCustomAddressName}
            seEditAddressType={seEditAddressType}
            selectedEditAddress={selectedEditAddress}
            editAddressType={editAddressType}
            customAddressName={customAddressName}
            apiBaseUrl={apiBaseUrl}
            refetch={refetch}
          />

        </>
      </div>
    </div>
  );
}

export default CreateOrder;
