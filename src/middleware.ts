import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Si l'utilisateur est déjà sur la page login, on laisse passer
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  // On vérifie le cookie
  const authCookie = request.cookies.get('mj_auth')

  // Si pas de cookie, on redirige vers login
  if (!authCookie || authCookie.value !== 'true') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// On protège tout SAUF les fichiers statiques (images, etc.)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}