import type { Metadata } from "next";
import '@/scss/index.scss'
import { ThemeProvider } from "@/context/Theme";
import { SocketProvider } from "@/context/Socket";
import { UserProvider } from "@/context/User";
import { NotificationProvider } from "@/context/Notification";

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
        <SocketProvider>
          <UserProvider>
            <ThemeProvider>
              <NotificationProvider>
                {children}
              </NotificationProvider>
            </ThemeProvider>
          </UserProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
