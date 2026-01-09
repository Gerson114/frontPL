import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${process.env.BACKEND_URL}${process.env.REGISTER_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    return NextResponse.json({ 
      success: response.ok, 
      message: data.message || (response.ok ? 'Sucesso' : 'Erro') 
    }, { status: response.status });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 });
  }
}