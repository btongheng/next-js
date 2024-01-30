import React from "react";
import LoginForm from "@/components/LoginForm";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {


  return (
    <div className="flex flex-col m-auto justify-center items-center w-80 h-screen p-4">
      <LoginForm searchParams={searchParams} />
    </div>
  );
}
