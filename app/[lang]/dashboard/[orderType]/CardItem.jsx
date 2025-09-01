"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import Image from "next/image";
export const CardItem = ({ item, language, handleItemClick, placeholderImg, items, errorMenu }) => {
  const [loaded, setLoaded] = useState(false);


  return (
    <Card
      onClick={() => handleItemClick(item)}
      key={item.id}
      className="p-0 shadow-md rounded-lg overflow-hidden mt-2 text-white cursor-pointer  border border-gray-200 hover:border-gray-400 transition-colors"
    >
      <div className="w-full h-40 relative">
        {/* Placeholder */}
        <Image
          src={placeholderImg}
          alt="placeholder"
          width={150}
          height={150}
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${loaded ? "opacity-0" : "opacity-100"
            }`}
        />

        {/* الصورة الأصلية */}
        <Image
          src={item?.image}
          alt={item?.name_en}
          width={150}
          height={150}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
            }`}
          onLoadingComplete={() => setLoaded(true)}
        />
      </div>
{/* object-fill */}
      <div className="flex justify-between items-center gap-3 p-3">
        <h3 className="text-sm text-muted-foreground mt-2">
          {language === "en" ? item.name_en : item.name_ar}
        </h3>
        <p className="text-sm text-important ">
          {item?.price?.toFixed(2)} EGP
        </p>
      </div>
    </Card>
  );
};
