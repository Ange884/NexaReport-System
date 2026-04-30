"use client";

import { Suspense } from "react";
import StudentLoginContent from "./LoginContent";

export default function StudentLoginPage() {
  return (
    <Suspense fallback={null}>
      <StudentLoginContent />
    </Suspense>
  );
}
