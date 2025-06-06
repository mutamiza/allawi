import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function GET() {
  // فحص البيئة
  const isProduction = process.env.NODE_ENV === "production"
  const hasDbConfig = !!(process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME)

  if (isProduction && !hasDbConfig) {
    // إرجاع بيانات محاكاة
    const { db } = await import("@/lib/database-mock")
    const payments = await db.getPayments()

    return NextResponse.json({
      success: true,
      data: payments,
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

    const [rows] = await connection.execute(`
      SELECT p.*, c.contractName, c.contractNumber 
      FROM payments p 
      LEFT JOIN contracts c ON p.contractId = c.id 
      ORDER BY p.dueDate DESC
    `)
    await connection.end()

    return NextResponse.json({
      success: true,
      data: rows,
    })
  } catch (error: any) {
    console.error("خطأ في جلب الدفعات:", error)
    return NextResponse.json(
      {
        success: false,
        message: `خطأ في جلب الدفعات: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
