// /app/api/courses/route.js

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search'); // Get ?search=... from the URL

  let strapiUrl = "http://localhost:1337/api/courses?populate=Course_Cover_Image";

  // If search is provided, add a filter
  if (search) {
    strapiUrl += `&filters[Course_Title][$containsi]=${encodeURIComponent(search)}`;
  }

  try {
    const response = await fetch(strapiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
