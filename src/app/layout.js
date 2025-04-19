import { Geist, Geist_Mono, Sarabun } from "next/font/google";
import "./globals.css";


const sarabun = Sarabun({
  variable: "--font-thai",
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],// Optional: Specify weights
});

export const metadata = {
  title: "งานศพของสมชาย",
  description: "เว็บ 3D งานศพที่แฝงไปด้วยความทรงจำของสมชาย",
};


export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        className={`${sarabun.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
