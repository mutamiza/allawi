import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function GET() {
  // فحص البيئة
  const isProduction = process.env.NODE_ENV === "production"
  const hasDbConfig = !!(process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME)

  if (isProduction && !hasDbConfig) {
    // إرجاع إحصائيات محاكاة
    const { db } = await import("@/lib/database-mock")
    const stats = await db.getDashboardStats()

    return NextResponse.json({
      success: true,
      data: stats,
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

    // جلب إحصائيات العقود
    const [contractStats] = await connection.execute(`
      SELECT 
        COUNT(*) as totalContracts,
        SUM(CASE WHEN contractStatus = 'نشط' THEN 1 ELSE 0 END) as activeContracts,
        SUM(CASE WHEN endDate <= DATE_ADD(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as expiringContracts
      FROM contracts
    `)

    // جلب إحصائيات الدفعات
    const [paymentStats] = await connection.execute(`
      SELECT 
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendingPayments,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overduePayments,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as totalRevenue
      FROM payments
    `)

    // جلب عدد المستخدمين
    const [userStats] = await connection.execute("SELECT COUNT(*) as totalUsers FROM users")

    await connection.end()

    const stats = {
      totalContracts: contractStats[0].totalContracts || 0,
      activeContracts: contractStats[0].activeContracts || 0,
      expiringContracts: contractStats[0].expiringContracts || 0,
      pendingPayments: paymentStats[0].pendingPayments || 0,
      overduePayments: paymentStats[0].overduePayments || 0,
      totalRevenue: paymentStats[0].totalRevenue || 0,
      totalUsers: userStats[0].totalUsers || 0,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error: any) {
    console.error("خطأ في جلب الإحصائيات:", error)
    return NextResponse.json(
      {
        success: false,
        message: `خطأ في جلب الإحصائيات: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
