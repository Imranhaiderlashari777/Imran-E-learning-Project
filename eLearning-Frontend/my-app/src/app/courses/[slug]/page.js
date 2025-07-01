'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Leason from './Leason';
import Link from 'next/link';

export default function CoursePage() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [userId, setUserId] = useState(null);

  // Set user ID from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.id) setUserId(user.id);
  }, []);

  // Fetch course image and lessons separately
  useEffect(() => {
    const fetchImageAndLessons = async () => {
      try {
        const token = localStorage.getItem('jwt');

        const res = await fetch(
          `http://localhost:1337/api/courses?filters[slug][$eq]=${slug}&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        const courseData = data?.data?.[0];

        if (courseData) {
          setImage(courseData.Course_Cover_Image);
          setLessons(courseData.lessons || []);
        }
      } catch (err) {
        console.error('Failed to fetch image and lessons:', err);
      }
    };

    if (slug) fetchImageAndLessons();
  }, [slug]);

  // Fetch course and user-course relationship
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('jwt');

        const res = await fetch(
          `http://localhost:1337/api/courses?filters[slug][$eq]=${slug}&populate[user_courses][populate]=user&populate=Course_Cover_Image&populate=lessons`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        const courseData = data?.data?.[0];

        if (courseData) {
          setCourse(courseData);

          const isUserEnrolled = courseData.user_courses?.some(
            (uc) => uc?.user?.id === userId
          );

          if (isUserEnrolled) setEnrolled(true);
        }
      } catch (err) {
        console.error('Failed to fetch course:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug && userId) fetchCourse();
  }, [slug, userId]);

  const handleEnroll = async () => {
    const token = localStorage.getItem('jwt');
    if (!userId || !course?.id) return;

    setEnrolling(true);

    try {
      const res = await fetch('http://localhost:1337/api/user-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            user: userId,
            courses: course.id,
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setEnrolled(true);
      } else {
        alert(data?.error?.message || 'Enrollment failed');
      }
    } catch (err) {
      alert('Something went wrong');
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  // if (loading) {
  //   return <p className="p-16 text-center text-gray-500 text-lg">Loading course...</p>;
  // }

  if (!course) {
    return (
      <main className="min-h-screen px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Sign in to access course!</h1>
        <p className="text-gray-500 mt-2">
          Click here to <u><Link href="/signin">sign in</Link></u>
        </p>
      </main>
    );
  }

  const {
    Course_Title,
    Course_Description,
    Course_Rating,
    Course_Difficulty,
    Course_Published_at,
  } = course;

  const imageUrl =
    image?.formats?.medium?.url ||
    image?.formats?.small?.url ||
    image?.url;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-14 text-gray-800">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Course Image */}
          <div className="h-80 md:h-auto">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={Course_Title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Course Info */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">{Course_Title}</h1>
              <p className="text-gray-600 mb-4">{Course_Description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-700 mt-6">
                <div className="bg-gray-100 px-3 py-1 rounded-full">
                  Difficulty: <span className="font-medium">{Course_Difficulty}</span>
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-full">
                  Rating: <span className="text-yellow-500">{Course_Rating} ★</span>
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-full">
                  Published: {new Date(Course_Published_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="mt-10">
              {enrolled ? (
                <div className="text-green-600 font-semibold">You are enrolled</div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-blue-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-blue-400 transition w-full"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
            </div>
          </div>

          {/* Course Lessons */}
          <div className="col-span-2 px-8 pb-8">
            <h2 className="text-2xl font-semibold mb-4">Course Lessons</h2>

            <div className="space-y-4">
              {lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
                  >
                    <Leason lessonProp={lesson} isEnroll={enrolled} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No lessons found for this course.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
