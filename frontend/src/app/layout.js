import "./globals.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReduxProvider from "./redux/ReduxProvider";
import AppLayout from "./AppLayout";
export const metadata = {
  title: "DELHI BOOK STORE",
  description: "Create by Vishnu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
       <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
