import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://dashplanner.onrender.com';

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