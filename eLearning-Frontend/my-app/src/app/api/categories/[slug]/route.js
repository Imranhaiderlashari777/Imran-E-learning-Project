// /app/api/categories/[slug]/route.js

export async function GET(req, context) {
  const { slug } = await context.params; // ✅ Await context.params

  const url = `http://localhost:1337/api/courses?filters[course_category][slug][$eq]=${slug}&populate=Course_Cover_Image`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch courses' }), { status: 500 });
  }
}
