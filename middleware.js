// middleware.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Se não houver sessão e o usuário tentar acessar o perfil
  if (!session && req.nextUrl.pathname === '/perfil') {
    return NextResponse.redirect(new URL('/entrar', req.url));
  }

  // Se houver sessão e o usuário tentar acessar login ou cadastro
  if (session && (req.nextUrl.pathname === '/entrar' || req.nextUrl.pathname === '/cadastrar')) {
    return NextResponse.redirect(new URL('/perfil', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/perfil', '/entrar', '/cadastrar']
};