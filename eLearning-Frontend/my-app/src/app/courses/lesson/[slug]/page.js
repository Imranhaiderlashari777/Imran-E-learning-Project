'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CoursePage() {
  const { slug } = useParams();
  const router = useRouter();

  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [docId, setDocId] = useState(null);

  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchLessonAndProgress = async () => {
      try {
        const token = localStorage.getItem('jwt');
        let user = null;
        if (localStorage.getItem('user')) {
          user = JSON.parse(localStorage.getItem('user'));
        }

        // Get current lesson by ID
        const lessonRes = await fetch(
          `http://localhost:1337/api/lessons?filters[id][$eq]=${slug}&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const lessonData = await lessonRes.json();
        const lessonItem = lessonData?.data?.[0];

        if (lessonItem) {
          setLesson(lessonItem);
          const courseId = lessonItem.course?.id;

          // ✅ Fetch all lessons in this course
          const allLessonsRes = await fetch(
            `http://localhost:1337/api/lessons?filters[course][id][$eq]=${courseId}&sort=id:asc&populate=*`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const allLessonsData = await allLessonsRes.json();
          setAllLessons(allLessonsData?.data || []);

          // ✅ Get user-course progress
          const userCourseRes = await fetch(
            `http://localhost:1337/api/user-courses?filters[user][id][$eq]=${user?.id}&filters[courses][id][$eq]=${courseId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const userCourseData = await userCourseRes.json();
          const userCourse = userCourseData?.data?.[0];

          if (userCourse) {
            setDocId(userCourse.documentId);
            setProgress(userCourse.completion || 0);
          }
        }
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonAndProgress();
  }, [slug]);

  const updateProgress = async () => {
    if (!docId) return;

    try {
      const token = localStorage.getItem('jwt');

      setProgress((prev) => {
        const newProgress = prev + 1;

        fetch(`http://localhost:1337/api/user-courses/${docId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              completion: newProgress,
            },
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log('✅ Progress updated:', data))
          .catch((err) => console.error('❌ Update failed:', err));

        return newProgress;
      });
    } catch (error) {
      console.error('❌ Failed to update progress:', error);
    }
  };

  const handlePlay = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(updateProgress, 2500);
    }
  };

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 🔍 Find index of current lesson
  const currentIndex = allLessons.findIndex((l) => l.id === lesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // if (loading) {
  //   return <p className="p-16 text-center text-gray-500 text-lg">Loading course...</p>;
  // }

  if (!lesson) {
    return (
      <main className="min-h-screen px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Lesson not found</h1>
        <p className="text-gray-500 mt-2">Try selecting a different course.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-14 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
            {lesson?.Lesson_Title}
          </h1>
          <div className="mb-4 w-[150px]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="aspect-w-16 aspect-h-9 mb-6 rounded-lg overflow-hidden">
          <video
            src={lesson?.Lesson_Video?.[0]?.url || ''}
            controls
            className="w-full h-auto rounded"
            onPlay={handlePlay}
            onPause={handlePause}
          />
        </div>

        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            {lesson?.Lesson_Content || 'No content available.'}
          </p>
        </div>

        {/* 🔽 Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {prevLesson ? (
            <button
              onClick={() => router.push(`/courses/lesson/${prevLesson.id}`)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
            >
              ← Previous: {prevLesson.attributes?.Lesson_Title}
            </button>
          ) : <div />}

          {nextLesson ? (
            <button
              onClick={() => router.push(`/courses/lesson/${nextLesson.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            >
              Next: {nextLesson.attributes?.Lesson_Title} →
            </button>
          ) : null}
        </div>
      </div>
    </main>
  );
}
