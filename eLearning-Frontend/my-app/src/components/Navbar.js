'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '../app/context/AuthContext';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const json = await res.json();
        if (res.ok && json.data) {
          setCategories(json.data);
        }
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('You are logged out');
    router.push('/');
  };

  const handleSearchKey = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search.trim())}`);
      setSearch(''); // ✅ Clear input after search
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 z-50 relative">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/new-site-logo.png"
            alt="Vue Academy Logo"
            width={220}
            height={50}
            priority
          />
        </Link>

        {/* Search */}
        <div className="flex-1 mx-4 max-w-md hidden sm:block">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKey}
            className="w-full px-5 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-[15px] text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-6 relative">
          {/* Categories Hover Dropdown */}
          <div className="group relative">
            <span className="cursor-pointer text-[15px] text-gray-700 font-medium hover:text-blue-600 transition">
              Categories
            </span>

            <div className="absolute left-0 top-full mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="py-3 px-4">
                <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">
                  Browse Categories
                </p>
                <div className="flex flex-col space-y-2">
                  {categories.map((cat) => {
                    const catData = cat?.attributes || cat;
                    return (
                      <Link
                        key={cat.id}
                        href={`/courses/categories/${catData.slug}`}
                        className="text-sm text-gray-700 hover:text-blue-600 hover:pl-2 transition-all duration-200"
                      >
                        {catData.Category_Name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/courses"
            className="text-[15px] text-gray-700 hover:underline font-medium"
          >
            Courses
          </Link>

          {!user ? (
            <>
              <Link
                href="/signin"
                className="text-[15px] text-gray-700 hover:underline font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-blue-500 text-white rounded-full text-[15px] font-semibold hover:bg-blue-600 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-[15px] text-gray-700 hover:underline font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-blue-500 text-white rounded-full text-[15px] font-semibold hover:bg-blue-400 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-gray-700"
        >
          {menuOpen ? <span>X</span> : <span>☰</span>}
        </button>
      </div>
    </nav>
  );
}
