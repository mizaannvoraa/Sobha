"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { FaUser, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import Image from "next/image";

export default function Modal({ onClose }) {
  const [urlParams, setUrlParams] = useState({
    utm_ad: "",
    utm_placement: "",
    gclid: "",
    fbclid: "",
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const query = new URLSearchParams(window.location.search);
      const params = {
        utm_ad: query.get("utm_ad") || "",
        utm_placement: query.get("utm_placement") || "",
        gclid: query.get("gclid") || "",
        fbclid: query.get("fbclid") || "",
      };
      setUrlParams(params);
      Object.entries(params).forEach(([key, value]) => {
        if (value) localStorage.setItem(key, value);
      });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "+971",
      email: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(/^\+\d{10,15}$/, "Phone Number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      setStatus("Submitting...");

      const formData = {
        ...values,
        utm_ad: urlParams.utm_ad || localStorage.getItem("utm_ad") || "",
        utm_placement:
          urlParams.utm_placement || localStorage.getItem("utm_placement") || "",
        gclid: urlParams.gclid || localStorage.getItem("gclid") || "",
        fbclid: urlParams.fbclid || localStorage.getItem("fbclid") || "",
      };

      const body = new URLSearchParams();
      Object.entries(formData).forEach(([key, val]) => {
        body.append(key, val);
      });

      try {
        await fetch("", {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        });

        setStatus("Form submitted successfully!");
        resetForm();
        setTimeout(onClose, 2000);
      } catch (error) {
        console.error("Error submitting form", error);
        setStatus("Something went wrong. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/assets/modal-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}  
    >
      <div className="absolute inset-0 bg-black opacity-80 z-0" />

      <div className="relative z-10 bg-[#353535] text-white rounded-lg w-full max-w-[600px] px-6 py-7 shadow-xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-4xl font- cursor-pointer hover:text-red-600"
        >
          &times;
        </button>

        {/* Top Logo */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
          <Image src="/assets/Kub_logo.png" alt="Logo" width={40} height={40} />
        </div>

        <div className="mt-5 text-center">
          <h2 className="text-white uppercase text-xl font-extralight tracking-[3px]">
            Express Your Interest
          </h2>
          <p className="text-sm mt-1 font-sans font-light">
            Please Enter Your Details To Know More About Sobha
          </p>
        </div>

        {status && (
          <div
            className={`text-center font-medium my-4 text-sm ${
              status.includes("success") ? "text-green-500" : "text-red-500"
            }`}
          >
            {status}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 mt-4">
          {/* Name + Phone */}
          <div className="flex items-center gap-4 md:flex-row flex-col justify-between">
            <div className="flex flex-col w-full">
              <div className="flex items-center bg-white rounded-md overflow-hidden">
                <div className="bg-white p-3 rounded">
                  <FaUser className="text-[#D2A23A]" />
                </div>
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className="w-full px-3 py-2 text-[#222222] text-base font-extralight placeholder:text-[#222222] placeholder:font-extralight focus:outline-none"
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 mt-[2px] text-sm ml-2">
                  {formik.errors.name}
                </div>
              )}
            </div>

            <div className="flex flex-col w-full">
              <div className="flex items-center bg-white rounded-md border overflow-visible">
                <div className="bg-white p-3 rounded">
                  <FaPhoneAlt className="text-[#D2A23A]" />
                </div>
                <div className="flex-1 border-0">
                  <PhoneInput
                    value={formik.values.phone}
                    onChange={(phone) => formik.setFieldValue("phone", phone)}
                    onBlur={() => formik.setFieldTouched("phone", true)}
                    className="!w-full !border-0 !text-gray-600"
                    buttonClass="!border-0 !bg-transparent"
                    inputClassName="!w-full !text-base !rounded-md !px-2 !border-0 focus:outline-none"
                  />
                </div>
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-500 mt-[2px] text-sm ml-2">
                  {formik.errors.phone}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex-col flex">
            <div className="flex items-center bg-white rounded-md overflow-hidden">
              <div className="bg-white p-3 rounded">
                <FaEnvelope className="text-[#D2A23A]" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full px-3 py-2 text-[#222222] placeholder:text-[#222222] focus:outline-none"
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 mt-[2px] text-sm ml-2">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full max-w-[125px] py-[6px] cursor-pointer font-semibold rounded-md text-white tracking-widest text-lg transition duration-200 ${
                isSubmitting ? "bg-gray-400" : "bg-[#D2A23A] hover:bg-yellow-600"
              }`}
            >
              {isSubmitting ? "Submitting..." : "SUBMIT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
