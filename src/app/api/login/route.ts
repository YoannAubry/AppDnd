import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const body = await request.json()
  
  if (body.password === process.env.APP_PASSWORD) {
    // Mot de passe correct ! On crée le cookie
    const cookieStore = await cookies()
    cookieStore.set("mj_auth", "true", {
      httpOnly: true, // Invisible pour le JS (sécurité)
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 jours
      path: "/",
    })
    
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 })
}