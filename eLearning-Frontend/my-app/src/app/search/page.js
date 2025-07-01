'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query')?.toLowerCase() || '';

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [coursesRes, categoriesRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/categories'),
        ]);

        const coursesData = await coursesRes.json();
        const categoriesData = await categoriesRes.json();

        const matchedCourses = coursesData.data.filter((course) =>
          course.Course_Title.toLowerCase().includes(query)
        );

        const matchedCategories = categoriesData.data.filter((category) =>
          category.Category_Name.toLowerCase().includes(query)
        );

        setCourses(matchedCourses);
        setCategories(matchedCategories);
      } catch (error) {
        console.error('Search fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <main className="px-6 py-12 min-h-screen bg-white text-gray-800">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center">
          Results for <span className="text-blue-600">"{query}"</span>
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            {/* Category Results */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Matching Categories</h2>
              {categories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="bg-white shadow-md hover:shadow-xl rounded-lg p-5 transition-all"
                    >
                      <h3 className="text-lg font-bold mb-2">{cat.Category_Name}</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {cat.Description?.slice(0, 100) || 'No description available.'}
                      </p>
                      <Link
                        href={`/courses/categories/${cat.slug}`}
                        className="inline-block text-sm px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-400 transition"
                      >
                        View Courses →
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No categories found.</p>
              )}
            </section>

            {/* Course Results */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Matching Courses</h2>
              {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white shadow-md hover:shadow-xl rounded-lg p-5 transition-all"
                    >
                      <h3 className="text-lg font-bold mb-2">{course.Course_Title}</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {course.Course_Description?.slice(0, 100)}...
                      </p>
                      <Link
                        href={`/courses/${course.slug}`}
                        className="inline-block text-sm px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-400 transition"
                      >
                        View Course →
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No courses found.</p>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
