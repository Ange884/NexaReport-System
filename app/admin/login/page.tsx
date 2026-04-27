"use client";

import { Suspense } from "react";
import AdminLoginContent from "./LoginContent";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginContent />
    </Suspense>
  );
}
