import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://teste.agenciaplanner.dev/';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, ...data } = body;
    
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const apiUrl = `${BACKEND_URL}${path}`;
    console.log('POST to:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(responseData, { status: response.status });
    }

    // Handle login response with token
    if (path === '/login' && responseData.token) {
      const res = NextResponse.json({ success: true, message: responseData.message });
      
      res.cookies.set('token', responseData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return res;
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API Proxy POST Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }

    const url = new URL(request.url);
    const apiPath = url.searchParams.get('path') || '';
    const query = url.searchParams.get('query') || '';
    
    const apiUrl = `${BACKEND_URL}${apiPath}${query ? `?${query}` : ''}`;
    console.log('GET to:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}