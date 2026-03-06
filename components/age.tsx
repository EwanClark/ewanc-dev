"use client";

import { calculateAge } from "@/lib/age";

export default function Age() {
  return <>{calculateAge()}</>;
}
