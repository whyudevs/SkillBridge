import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ videoId: null });
  }

  try {
    // Fetch YouTube search results directly without needing a Google API key
    const response = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " lecture tutorial")}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    );

    const html = await response.text();
    // Regex matching actual video IDs inside YouTube watch links
    const matches = html.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/g);

    if (matches && matches.length > 0) {
      // Pick the first clean valid video ID
      const firstId = matches[0].replace("/watch?v=", "");
      return NextResponse.json({ videoId: firstId });
    }
  } catch (err) {
    console.error("YouTube search error:", err);
  }

  return NextResponse.json({ videoId: null });
}