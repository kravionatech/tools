import Header from "../components/Header/Header";
import "./globals.css";

export const metadata = {
  title: "Kraviona Tools",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>{/* Here insert Code HTML from Direct Backend */}</head>
      <body>
        {/* Header */}
        <Header />
        {children}
        {/* Footer */}
      </body>
    </html>
  );
}
