import type { Metadata } from "next";
import '@/scss/index.scss'
import { ThemeProvider } from "@/context/Theme";
import { SocketProvider } from "@/context/Socket";
import { UserProvider } from "@/context/User";
import { NotificationProvider } from "@/context/Notification";
import { RoomProvider } from "@/context/Room";

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
        <NotificationProvider>
          <SocketProvider>
            <UserProvider>
              <RoomProvider>
                <ThemeProvider>
                  {children}
                </ThemeProvider>
              </RoomProvider>
            </UserProvider>
          </SocketProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
