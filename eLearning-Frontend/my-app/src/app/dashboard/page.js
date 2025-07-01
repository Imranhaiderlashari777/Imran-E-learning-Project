'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const upcomingAssignments = [
    { id: 1, title: 'Project Proposal', dueDate: '2025-05-10' },
    { id: 2, title: 'UI Mockup', dueDate: '2025-05-15' },
  ];

  useEffect(() => {
    const fetchUserCourses = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('jwt');

      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        try {
          const res = await fetch(
            `http://localhost:1337/api/user-courses?filters[user][id][$eq]=${parsedUser.id}&populate[courses][fields][0]=Course_Title&populate[courses][fields][1]=slug`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await res.json();

          const courses = data.data.map((entry) => ({
            id: entry.id,
            title: entry.courses?.Course_Title,
            slug: entry.courses?.slug,
            progress: entry.completion || 0,
          }));

          setEnrolledCourses(courses);
        } catch (error) {
          console.error('Failed to fetch enrolled courses:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserCourses();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Vue Academy</h2>
        </div>
        <nav className="px-6">
          <ul className="space-y-4">
            <li>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
            </li>
            <li>
              <Link href="/courses" className="text-gray-700 hover:text-blue-600">Courses</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {user ? `Welcome back, ${user.username}!` : 'Welcome back!'}
        </h1>

        {/* Enrolled Courses */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Enrolled Courses</h2>

          {loading ? (
            <p className="text-gray-600">Loading enrolled courses...</p>
          ) : enrolledCourses.length === 0 ? (
            <p className="text-gray-500">You haven’t enrolled in any courses yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                  <p className="text-gray-600 mt-2">Progress: {course.progress}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <Link href={`/courses/${course.slug}`} className="inline-block mt-4 text-blue-600 hover:underline">
                    Go to Course →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming Assignments (Static) */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upcoming Assignments</h2>
          <ul className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <li key={assignment.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <span className="text-gray-800">{assignment.title}</span>
                <span className="text-gray-500">Due: {assignment.dueDate}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
