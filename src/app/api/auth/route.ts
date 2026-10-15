import { NextRequest, NextResponse } from 'next/server';

const ADMIN_CREDENTIALS = {
  email: 'admin@rakshak.gov.in',
  password: 'RakshakAdmin@2026!',
  name: 'Rajesh Sharma (Nodal Officer)',
  role: 'superadmin'
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (
      email?.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const response = NextResponse.json({
        success: true,
        message: 'Authentication successful',
        user: {
          name: ADMIN_CREDENTIALS.name,
          email: ADMIN_CREDENTIALS.email,
          role: ADMIN_CREDENTIALS.role
        }
      });

      // Set auth cookie
      response.cookies.set({
        name: 'rakshak_admin_session',
        value: `session_${Date.now()}_auth_token`,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('API Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('rakshak_admin_session');
  if (cookie?.value) {
    return NextResponse.json({
      authenticated: true,
      user: {
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        role: ADMIN_CREDENTIALS.role
      }
    });
  }
  return NextResponse.json({ authenticated: false });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.delete('rakshak_admin_session');
  return response;
}
