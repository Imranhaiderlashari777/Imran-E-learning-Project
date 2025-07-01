'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CourseCard from '../components/CourseCard';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const json = await res.json();
        setCategories(json.data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(data.data?.slice(0, 2) || []);
      } catch (err) {
        console.error('Failed to load featured courses', err);
      }
    };

    fetchCategories();
    fetchCourses();
  }, []);

  return (
    <main className="bg-white text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <section className="bg-cover bg-center text-white py-50 px-4 sm:px-6" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1080&auto=format&fit=crop')" }}>
        <div className="bg-blue-500/60 backdrop-blur-sm py-12 px-4 sm:px-8 md:px-16 rounded-lg max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">Learn from Industry Experts</h1>
          <p className="text-base sm:text-lg font-light mb-8">
            Join thousands of learners mastering web development, design, and AI — anytime, anywhere. Your career growth starts here.
          </p>
          <Link href="/signup" className="bg-white text-blue-500 px-6 py-3 font-medium text-base rounded-full hover:bg-gray-100 transition">
            Get Started
          </Link>
        </div>
      </section>

      {/* Dynamic Course Categories */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Browse Categories</h2>
          <p className="text-gray-600 text-sm sm:text-base">Choose a domain and start learning.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-lg bg-white p-5 shadow-md hover:shadow-lg transition text-center">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{cat.Category_Name}</h3>
              <Link
                href={`/courses/categories/${cat.slug}`}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Browse Courses →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="pt-10 pb-20 px-4 sm:px-6 bg-amber-200">
        <div className="max-w-6xl mx-auto text-center mb-12 bg-white/0 p-6 rounded">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Featured Courses</h2>
          <p className="text-gray-600 text-sm sm:text-base">Top-rated courses hand-picked for you.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">What Our Students Say</h2>
          <p className="text-base sm:text-lg text-gray-600 italic">
            "This platform helped me transition into a full-time developer role in just 3 months! Highly recommend to anyone serious about upskilling."
          </p>
          <p className="text-sm mt-2 text-gray-500">— Ayesha, Lahore</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cover bg-center text-white py-16 px-4 sm:px-6 text-center" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?community,teamwork')" }}>
        <div className="bg-black bg-opacity-50 lg:p-26 p-10 rounded-lg">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">Join Thousands of Learners</h2>
          <p className="text-base sm:text-xl mb-6">Upgrade your career with affordable, expert-led learning.</p>
          <Link href="/signup" className="bg-white text-blue-500 px-6 py-3 font-medium text-base rounded-full hover:bg-gray-100 transition">
            Enroll Now
          </Link>
        </div>
      </section>
    </main>
  );
}
