"use client";
import { useParams } from "next/navigation";
import "@/app/[lang]/dashboard/items/main.css";
import useTranslate from "@/hooks/useTranslate";
import { useSubdomin } from "@/provider/SubdomainContext";
import SectionList from "@/app/[lang]/components/SectionList";
import { useSections } from "../../../sections/apisSection";
export default function CondimentsView({ params: { lang } }) {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const { apiBaseUrl, subdomain } = useSubdomin();
  const { trans } = useTranslate(lang);
  // const {
  //   data: Condiments,
  //   isLoading,
  //   error,
  //   refetch,
  // } = useSections(token, apiBaseUrl, "condiments", id);
  const Condiments = [
    { name: "con1", id: 1 },
    { name: "con2", id: 2 },
  ];
  return (
    <SectionList
      lang={lang}
      sections={Condiments}
      // isLoading={isLoading}
      // error={error}
      // refetch={refetch}
      trans={trans}
      subdomain={subdomain}
      token={token}
      apiBaseUrl={apiBaseUrl}
      navigate="condiment"
      pageType="Condiments"
    />
  );
}
