import './globals.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Toaster } from 'sonner'; // ✅ NEW import

export const metadata = {
  title: 'Vue Academy',
  description: 'Learn with Next.js 15 and Strapi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <Toaster
  position="bottom-right" // ✅ move to bottom left
  toastOptions={{
    className: 'custom-toast', // ✅ custom class
  }}
/>

          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
