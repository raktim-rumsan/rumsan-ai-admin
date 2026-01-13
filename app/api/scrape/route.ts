import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const scraperURL = process.env.NEXT_PUBLIC_SCRAPER_URL;
    if (!scraperURL) {
      return NextResponse.json(
        { error: "Scraper URL not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${scraperURL}/md`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ url, f: "fit", q: null, c: "0" }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            errorData.message ||
            errorData.error ||
            `HTTP ${response.status}: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Scrape API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to scrape website",
      },
      { status: 500 }
    );
  }
}
