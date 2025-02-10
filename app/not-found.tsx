"use client";

import { TbArrowRampRight } from "react-icons/tb";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center text-center px-8">
      <div>
        <TbArrowRampRight className="w-20 h-20 mx-auto text-blue-500" />
        <h1 className="mt-10 text-3xl font-bold leading-snug md:text-4xl text-gray-900">
          Error 404 <br /> It looks like something went wrong.
        </h1>
        <p className="mt-8 mb-14 text-lg font-normal text-gray-500 mx-auto md:max-w-sm">
          Don&apos;t worry, our team is already on it. Please try refreshing the
          page or come back later.
        </p>
        <button
          className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
          onClick={() => router.push("/")}
        >
          Back Home
        </button>
      </div>
    </div>
  );
}
