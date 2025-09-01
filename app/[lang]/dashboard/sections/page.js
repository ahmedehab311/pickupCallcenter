"use client";
import "@/app/[lang]/dashboard/items/main.css";
import useTranslate from "@/hooks/useTranslate";
import { useSubdomin } from "@/provider/SubdomainContext";
import { useToken } from "@/provider/TokenContext";
import { saveArrangement, useSections } from "./apisSection";
import SectionList from "../../components/SectionList";
import { useNetworkWatcher } from "@/hooks/useNetworkWatcher";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const Sections = ({ params: { lang } }) => {
  const token = localStorage.getItem("token")
  const { apiBaseUrl, subdomain } = useSubdomin();
  const { trans } = useTranslate(lang);

  const {
    data: sections,
    isLoading,
    error,
    refetch,
  } = useSections(token, apiBaseUrl, "sections");
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
      isOnline={isOnline}
      pageType="sections"
    />
  );
};

export default Sections;
