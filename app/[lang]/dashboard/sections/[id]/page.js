"use client";
import { useParams } from "next/navigation";
import "@/app/[lang]/dashboard/items/main.css";
import useTranslate from "@/hooks/useTranslate";
import { useSubdomin } from "@/provider/SubdomainContext";
import { useToken } from "@/provider/TokenContext";
import { useSections } from "../apisSection";
import SectionList from "@/app/[lang]/components/SectionList";
import { useEffect, useState } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
export default function SectionsForMenu({ params: { lang } }) {
  const { id } = useParams();
  // const { token } = useToken();
  const token = localStorage.getItem("token") 
  const { apiBaseUrl, subdomain } = useSubdomin();
  const { trans } = useTranslate(lang);
  const {
    data: sections,
    isLoading,
    error,
    refetch,
  } = useSections(token, apiBaseUrl, "sections", id);
    const isOnline = useOnlineStatus();
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
    <SectionList
      lang={lang}
      sections={sections}
      isLoading={isLoading}
      error={error}
      refetch={refetch}
      trans={trans}
      subdomain={subdomain}
      token={token}
      apiBaseUrl={apiBaseUrl}
      navigate="section"
      pageType="sections"
    />
  );
}
