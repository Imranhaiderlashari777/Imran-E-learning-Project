'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CourseCard from '@/components/CourseCard';

export default function CoursesByCategory() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`/api/categories/${slug}`);
        const json = await res.json();
        setCourses(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCourses();
  }, [slug]);

  if (loading) return <div className="text-center py-10">Loading courses...</div>;

  return (
    <div className="container p-10">
      <h2 className="text-2xl font-semibold mb-6 capitalize">
        Courses in "{slug.replaceAll('-', ' ')}"
      </h2>

      {courses.length === 0 ? (
        <p>No courses found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
