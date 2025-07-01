'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function Leason({lessonProp,isEnroll}) {
    console.log("lessonProp",lessonProp)
  const [lesson, setLesson] = useState(lessonProp);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(
          `http://localhost:1337/api/lessons?filters[id][$eq]=${lessonProp.id}&populate=Lesson_Video`
        );
        const data = await res.json();
        console.log("data=>",data)
        if (data.data.length > 0) {
            setLesson(data.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        // setLoading(false);
      }
    };

      fetchCourse();

  }, []);



  const videoUrl =
  lesson?.Lesson_Video?.[0]?.url || "null"

  return (
  <div> {isEnroll ? <Link href={`/courses/lesson/${lesson?.id}`}><h3 className="text-xl font-bold text-blue-600">{lesson?.Lesson_Title}</h3></Link>:<h3 className="text-xl font-bold text-blue-600">{lesson?.Lesson_Title}</h3>}
  <p className="text-gray-700 mt-2 text-sm whitespace-pre-line">
    {lesson?.Lesson_Content}
  </p>
  </div>
  );
}
