import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); 
    const result = await fetch(`${backendURL}/upload`, {
      method: "POST",
      body: formData,
    });

    const response = await result.json();
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" + error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response(JSON.stringify({ error: "Code is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const resolveRes = await fetch(`${backendURL}/resolve?code=${code}`);
    console.log("Resolving code:", code);
    const resolveData = await resolveRes.json();
    console.log(resolveData);

    return NextResponse.json(resolveData);
  } catch (error) {
    return NextResponse.json({ error: "Download failed" + error }, { status: 500 });
  }

}
