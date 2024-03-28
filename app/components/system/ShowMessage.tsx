'use client'
import { Toast } from "primereact/toast";
import { useRef } from "react";

export default function showMessage(severity: any , summary: string | null, detail: string | null) {
  const toastRef = useRef<Toast>(null);

  const showToast = () => {
    toastRef.current?.show([
      { severity, summary, detail, life: 3000 }
    ])
  }
  if (toastRef.current) {
  showToast();
  } else {
    console.warn("Toast instance not found for showing message.");
  }
}