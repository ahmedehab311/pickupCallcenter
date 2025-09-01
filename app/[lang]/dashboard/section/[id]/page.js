"use client";
import "@/app/[lang]/dashboard/menus/index.css";
import "@/app/[lang]/dashboard/items/main.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSections } from "../../sections/apisSection";
import { useSubdomin } from "@/provider/SubdomainContext";
import { useToken } from "@/provider/TokenContext";
import ItemsList from "@/app/[lang]/components/ItemsList";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import toast from "react-hot-toast";
const ItemsForSection = ({ params: { lang } }) => {
  const token = localStorage.getItem("token")
  const { apiBaseUrl, subdomain } = useSubdomin();
  const { id } = useParams();
  const isOnline = useOnlineStatus();
  const {
    data: Sections,
    isLoading,
    error,
    refetch,
  } = useSections(token && apiBaseUrl ? token : null, apiBaseUrl, "items", id);
  
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (isOnline && wasOffline) {
      toast.success("Online now!");
      refetch();
      setWasOffline(false);
    }
  }, [isOnline, wasOffline]);
  return (
    <>
      <ItemsList
        lang={lang}
        Sections={Sections}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
        subdomain={subdomain}
        token={token}
        apiBaseUrl={apiBaseUrl}
        subSections={true}
        navigate="item"
        pageType="items"
      />
    </>
  );
};

export default ItemsForSection;
