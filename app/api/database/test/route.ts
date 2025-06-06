import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()

    // التحقق من وجود جميع المعلومات المطلوبة
    if (!config.host || !config.user || !config.database) {
      return NextResponse.json(
        {
          success: false,
          message: "يجب توفير جميع معلومات الاتصال المطلوبة",
        },
        { status: 400 },
      )
    }

    // محاولة الاتصال بقاعدة البيانات
    const connection = await mysql.createConnection({
      host: config.host,
      port: Number(config.port || 3306),
      user: config.user,
      password: config.password,
      database: config.database,
    })

    // التحقق من الاتصال عن طريق استعلام بسيط
    await connection.query("SELECT 1")

    // إغلاق الاتصال
    await connection.end()

    return NextResponse.json({
      success: true,
      message: "تم الاتصال بقاعدة البيانات بنجاح",
      data: {
        host: config.host,
        database: config.database,
        mode: "production",
      },
    })
  } catch (error: any) {
    console.error("خطأ في اختبار الاتصال:", error)
    return NextResponse.json(
      {
        success: false,
        message: `فشل الاتصال بقاعدة البيانات: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
