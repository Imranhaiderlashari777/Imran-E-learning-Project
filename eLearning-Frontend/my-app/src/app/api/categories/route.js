export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  let url = 'http://localhost:1337/api/course-categories?populate=*';

  // If search term is provided, add filter to URL
  if (search) {
    url += `&filters[Category_Name][$containsi]=${encodeURIComponent(search)}`;
  }

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
