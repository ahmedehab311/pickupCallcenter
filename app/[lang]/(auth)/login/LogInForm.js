/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import crypto from "crypto";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
// import { fetchSettings } from "@/store/slices/systemSlice";
import { FaSpinner } from "react-icons/fa";
import { getDictionary } from "@/app/dictionaries.js";
import { useLanguage } from "@/provider/LanguageContext";
import img from "/public/logo.png";
import Image from "next/image";
import { useSubdomin } from "@/provider/SubdomainContext";

const schema = z.object({
  email: z.string().email({ message: "Your email is invalid." }),
  password: z.string().min(6),
});

const LogInForm = ({ children }) => {
  const { apiBaseUrl, subdomain } = useSubdomin();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentLang } = useLanguage();
  const [trans, setTrans] = useState(null);
  const [isPending, startTransition] = React.useTransition();
  const [passwordType, setPasswordType] = React.useState("password");
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoadings, setIsLoadings] = useState(false);
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");

  const language =
    typeof window !== "undefined" ? localStorage.getItem("language") : null;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(currentLang);
      setTrans(dictionary);
    };
    loadDictionary();
  }, [currentLang]);

  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };


  const onSubmit = async (data) => {
    setIsLoadings(true);

    const requestData = {
      email: data.email,
      password: data.password,
    };

    // console.log("🔹 Submitting login form with:", requestData);

    try {
      const resultAction = await dispatch(
        loginUser({ credentials: requestData, apiBaseUrl, subdomain })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        console.log("Login successful:", resultAction.payload);
        const payload = resultAction.payload;
        if (payload?.token) {
          localStorage.setItem("language", "en");
          const language =
            typeof window !== "undefined" ? localStorage.getItem("language") : null;
          toast.success("Login successful");
          router.push(`/${language}/dashboard/create-order`);
        } else {
          const massegeError = payload?.messages || ["Login failed"];
          toast.error(massegeError);
        }

        const messages = resultAction.payload?.messages || [];
        // messages.forEach((message) => toast.success(message));
      } else {
        console.error("Login failed:", resultAction);

        const messages = resultAction.payload?.messages ||
          resultAction.error?.messages || ["An unexpected error occurred"];
        // .forEach((message) => toast.error(message));
      }
    } catch (error) {
      console.error(" Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }

    setIsLoadings(false);
    reset();
  };

  return (
    <>
      <div className="w-full py-5 lg:py-8">
        <Link href="/dashboard" className="inline-block">
          {/* <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" /> */}
        </Link>
        <Image src={img} width={100} height={100} alt="logo" />
        <div className="2xl:mt-5 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
          Hey, Hello {subdomain ? subdomain : ""} 👋
        </div>
        <div className="2xl:text-lg text-base text-default-600 mt-2 leading-6">
          Enter the information you entered while registering.
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 xl:mt-7">
          <div className="relative">
            <Label
              htmlFor="email"
              className="mb-2 font-medium text-default-600"
            >
              Email
            </Label>

            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              type="email"
              id="email"
              className={cn("peer", {
                "border-destructive": errors.email,
              })}
              size={!isDesktop2xl ? "xl" : "lg"}
              placeholder=""
            />
          </div>
          {errors.email && (
            <div className=" text-destructive mt-2">{errors.email.message}</div>
          )}

          <div className="mt-3.5">
            <Label
              htmlFor="password"
              className="mb-2 font-medium text-default-600"
            >
              Password{" "}
            </Label>
            <div className="relative">
              {/* <Input
              // disabled={isPending}
              // {...register("password")}
              type={passwordType}
              id="password"
              className="peer "
              size={!isDesktop2xl ? "xl" : "lg"}
              placeholder=" "
            /> */}
              <Input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type={passwordType}
                id="password"
                className="peer "
                size={!isDesktop2xl ? "xl" : "lg"}
                placeholder=" "
              />

              <div
                className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
                onClick={togglePasswordType}
              >
                {passwordType === "password" ? (
                  <Icon
                    icon="heroicons:eye"
                    className="w-5 h-5 text-default-400"
                  />
                ) : (
                  <Icon
                    icon="heroicons:eye-slash"
                    className="w-5 h-5 text-default-400"
                  />
                )}
              </div>
            </div>
          </div>
          {errors.password && (
            <div className=" text-destructive mt-2">
              {errors.password.message}
            </div>
          )}

          <div className="mt-5  mb-8 flex flex-wrap gap-2">
            {/* <div className="flex-1 flex  items-center gap-1.5 ">
              <Checkbox
                size="sm"
                className="border-default-300 mt-[1px]"
                id="isRemebered"
              />
              <Label
                htmlFor="isRemebered"
                className="text-sm text-default-600 cursor-pointer whitespace-nowrap"
              >
                Remember me
              </Label>
            </div> */}
            <Link
              href={`/${language}/forget`}
              className="flex-none text-sm text-primary"
            >
              Forget Password?
            </Link>
          </div>
          <Button
            className="w-full"
            disabled={isLoadings}
            size={!isDesktop2xl ? "lg" : "md"}
          >
            {isLoadings ? (
              <FaSpinner className="animate-spin" />
            ) : (
              `${trans?.SignIn}`
            )}
          </Button>
        </form>
      </div>
    </>
  );
};

export default LogInForm;
