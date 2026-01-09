import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://teste.agenciaplanner.dev/';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const response = await fetch(`${BACKEND_URL}${process.env.LOGIN_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (response.ok && data.token) {
      const res = NextResponse.json({ success: true, message: data.message });
      
      res.cookies.set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return res;
    }

    return NextResponse.json({ 
      success: false, 
      message: data.message || 'Erro de autenticação' 
    }, { status: response.status });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 });
  }
}