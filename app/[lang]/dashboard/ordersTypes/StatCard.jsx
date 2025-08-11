// components/StatCard.js
"use client";
import { useEffect, useState } from "react";

import CountUp from "react-countup";
export default function StatCard({
  icon: Icon,
  number,
  label,
  onClick,
  bg,
  isLoadingorders,
  selectedStatus,
  errororders,
}) {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [isReal, setIsReal] = useState(false);

  useEffect(() => {
    if (number !== "—" && number !== undefined) {
      setIsReal(true);
    }
  }, [number]);
  useEffect(() => {
    if (
      !isLoadingorders &&
      !errororders &&
      number !== undefined &&
      number !== null
    ) {
      setIsReal(true);
    } else {
      setIsReal(false);
    }
  }, [number, isLoadingorders, errororders]);
  useEffect(() => {
    if (!isReal && isLoadingorders) {
      const interval = setInterval(() => {
        const random = Math.floor(Math.random() * 500) + 1;
        setDisplayNumber(random);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isReal, isLoadingorders]);

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-2 rounded-xl shadow hover:opacity-90 transition  ${bg} cursor-pointer  ${
        selectedStatus === "Total" ? "w-full" : "w-[180px]"
      } `}
    >
      <div className="flex flex-col text-left">
        <span
          className={` ${
            selectedStatus === "Total" ? "text-xl" : "text-[13px]"
          }  ${
            selectedStatus === "Total" ? "font-bold" : "font-medium"
          }  text-[#000] flex items-center gap-2`}
        >
          {isLoadingorders ? (
            <>
              <svg
                className="w-5 h-5 animate-spin text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </>
          ) : (
            <CountUp end={number} duration={1.5} />
          )}
        </span>

        <span className="text-xs text-[#000]">{label}</span>
      </div>
      <div className="text-blue-500">
        <Icon size={selectedStatus === "Total" ? 32 : 16} />
      </div>
    </div>
  );
}
