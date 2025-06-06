import { type NextRequest, NextResponse } from "next/server"

// استخدام localStorage في المتصفح أو cookies لتخزين معلومات الاتصال
// في بيئة الإنتاج، يجب استخدام طريقة أكثر أماناً مثل قاعدة بيانات آمنة أو خدمة إدارة الأسرار

// متغير عام لتخزين معلومات الاتصال مؤقتاً (سيتم فقدها عند إعادة تشغيل الخادم)
let dbConfig: any = null

export async function GET() {
  try {
    // إذا لم يتم تعيين معلومات الاتصال، حاول استخدام متغيرات البيئة
    if (!dbConfig) {
      dbConfig = {
        host: process.env.DB_HOST || "",
        port: process.env.DB_PORT || "3306",
        user: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "",
      }
    }

    return NextResponse.json({
      success: true,
      config: dbConfig,
    })
  } catch (error: any) {
    console.error("خطأ في استرجاع معلومات الاتصال:", error)
    return NextResponse.json(
      {
        success: false,
        message: `خطأ في استرجاع معلومات الاتصال: ${error.message}`,
      },
      { status: 500 },
    )
  }
}

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

    // تخزين معلومات الاتصال
    dbConfig = config

    // في بيئة الإنتاج، يمكن تخزين هذه المعلومات في قاعدة بيانات آمنة أو خدمة إدارة الأسرار

    return NextResponse.json({
      success: true,
      message: "تم حفظ معلومات الاتصال بنجاح",
    })
  } catch (error: any) {
    console.error("خطأ في حفظ معلومات الاتصال:", error)
    return NextResponse.json(
      {
        success: false,
        message: `خطأ في حفظ معلومات الاتصال: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
