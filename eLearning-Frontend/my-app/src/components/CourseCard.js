'use client';

import Link from 'next/link';

export default function CourseCard({ course }) {
  const {
    Course_Title,
    Course_Description,
    Course_Rating,
    slug,
    Course_Cover_Image,
  } = course;

  const imageUrl =
    Course_Cover_Image?.formats?.medium?.url ||
    Course_Cover_Image?.formats?.small?.url ||
    Course_Cover_Image?.url ||
    null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md duration-300">
      <div className="relative group h-48 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={Course_Title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {Course_Title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {Course_Description}
        </p>

        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < Course_Rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.122-6.545L.489 6.91l6.564-.954L10 0l2.947 5.956 6.564.954-4.755 4.635 1.122 6.545z" />
            </svg>
          ))}
        </div>

        <Link
          href={`/courses/${slug}`}
          className="inline-block text-sm text-white bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-full transition"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
