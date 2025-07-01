'use client';

import { useEffect, useState } from 'react';
import CourseCard from '@/components/CourseCard';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses'); // now this works from app/api
        const json = await res.json();

        if (json.data) {
          setCourses(json.data);
        } else {
          setError('No course data found.');
        }
      } catch (err) {
        setError('Failed to fetch courses.');
      }
    };

    fetchCourses();
  }, []);

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container p-10">
      <h1 className="text-3xl font-bold mb-6">Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
