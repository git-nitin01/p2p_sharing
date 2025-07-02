import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('Missing code', { status: 400 });
  }

  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/download?code=${encodeURIComponent(code)}`;

  try {
    const backendRes = await fetch(backendUrl);

    if (!backendRes.ok || !backendRes.body) {
      return new Response('Failed to download file', { status: backendRes.status });
    }

    const headers = new Headers();
    backendRes.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'content-disposition' || key.toLowerCase().startsWith('content-')) {
        headers.set(key, value); // Pass through file download headers
      }
    });

    return new Response(backendRes.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Proxy download error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
