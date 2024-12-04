import type { Metadata } from "next";
import '@/scss/index.scss'

export const metadata: Metadata = {
  title: "Typing Race",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
