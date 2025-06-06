import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function GET() {
  // فحص البيئة
  const isProduction = process.env.NODE_ENV === "production"
  const hasDbConfig = !!(process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME)

  if (isProduction && !hasDbConfig) {
    // إرجاع مستخدمين محاكاة
    const { db } = await import("@/lib/database-mock")
    const users = await db.getUsers()

    return NextResponse.json({
      success: true,
      data: users,
      mode: "simulation",
    })
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    const [rows] = await connection.execute("SELECT * FROM users ORDER BY createdAt DESC")
    await connection.end()

    return NextResponse.json({
      success: true,
      data: rows,
    })
  } catch (error: any) {
    console.error("خطأ في جلب المستخدمين:", error)
    return NextResponse.json(
      {
        success: false,
        message: `خطأ في جلب المستخدمين: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
