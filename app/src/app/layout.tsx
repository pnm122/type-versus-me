import type { Metadata } from "next";
import '@/scss/index.scss'
import { ThemeProvider } from "@/context/Theme";
import { SocketProvider } from "@/context/Socket";
import { NotificationProvider } from "@/context/Notification";
import { GlobalStateProvider } from "@/context/GlobalState";
import LeaveRoomHandler from "@/components/LeaveRoomHandler/LeaveRoomHandler";

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
            <GlobalStateProvider>
              <ThemeProvider>
                <LeaveRoomHandler />
                {children}
              </ThemeProvider>
            </GlobalStateProvider>
          </SocketProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
