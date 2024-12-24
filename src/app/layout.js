import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Lastron",
  description: "Lastron find your dream job",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <NavBar />
        <div className="px-16">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
