// /app/category/[slug]/page.js
'use client';

import Link from 'next/link';

const allCourses = [
  {
    title: 'Mastering React & Next.js',
    category: 'web-dev',
    image: 'https://images.unsplash.com/photo-1581091012184-7e0cdfbb6796',
    slug: 'react-nextjs-masterclass',
    instructor: 'Ali Khan',
  },
  // ... other courses
];

export default function CategoryPage({ params }) {
  const categorySlug = params.slug;
  const filteredCourses = allCourses.filter(course => course.category === categorySlug);

  return (
    <main className="bg-white text-gray-800 min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 capitalize">
          {categorySlug.replace('-', ' ')} Courses
        </h1>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredCourses.map((course, i) => (
              <div
                key={i}
                className="bg-gray-50 shadow hover:shadow-md transition rounded-lg overflow-hidden"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1">{course.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">by {course.instructor}</p>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-blue-600 text-sm hover:underline font-medium"
                  >
                    View Course →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No courses found for this category.</p>
        )}
      </div>
    </main>
  );
}
