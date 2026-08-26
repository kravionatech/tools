import "./globals.css";

export const metadata = { title: "Kraviona Admin" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
