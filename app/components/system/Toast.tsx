'use client'
import { Toast } from "primereact/toast";

interface ToastProviderProps {
    children: React.ReactNode;
}

export default function ToastProvider({children}: ToastProviderProps) {
    return (
        <>
        {children}
        <Toast />
        </>
    )
}