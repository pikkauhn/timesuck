import type { Metadata } from "next";
import 'primereact/resources/themes/lara-dark-blue/theme.css'
import '/node_modules/primeflex/primeflex.css'
import 'primeicons/primeicons.css';

import './globals.css'
import Navbar from './components/Navbar'
import Providers from "./components/system/Providers";
import ToastProvider from "./components/system/Toast";

export const metadata: Metadata = {
  title: "Timesuck Catalog",
  description: "Author: Zachary Burns",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='className'>
        <ToastProvider>
        <Providers>
          <Navbar />
          {children}
        </Providers>
        </ToastProvider>
      </body>
    </html>
  )
}
