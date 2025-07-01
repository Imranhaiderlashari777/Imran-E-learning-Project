'use client';
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-400 px-6 py-12 mt-16 text-m">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 place-items-start gap-12 text-left">
        
        {/* Column 1: Logo + About */}
        <div className="flex flex-col space-y-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image
              src="/new-site-logo.png"
              alt="Vue Academy Logo"
              width={220}
              height={40}
              priority
            />
          </Link>
          <p className="leading-relaxed max-w-sm text-[17px]">
            eLearning Academy is your trusted source for modern, practical web development, UI design, and machine learning training courses.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col space-y-2 pt-1 pl-0 md:pl-0 lg:pl-[200px]">
          <h4 className="font-semibold text-white mb-2">Quick Links</h4>
          <Link href="/courses" className="hover:underline">Courses</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>

        {/* Column 3: Account */}
        <div className="flex flex-col space-y-2 pt-1 pl-0 md:pl-0 lg:pl-[180px]">
          <h4 className="font-semibold text-white mb-2">Account</h4>
          <Link href="/signin" className="hover:underline">Sign In</Link>
          <Link href="/signup" className="hover:underline">Sign Up</Link>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto mt-10 border-t border-gray-700 pt-6 text-left text-s text-gray-500">
        © {new Date().getFullYear()} Vue Academy. All rights reserved.
      </div>
    </footer>
  );
}
