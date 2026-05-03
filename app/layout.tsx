import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/language-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";

export const metadata: Metadata = {
  title: "MillFlow",
  description: "Web system for managing flour mill operations"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <LanguageProvider>
          <ToasterProvider>{children}</ToasterProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
