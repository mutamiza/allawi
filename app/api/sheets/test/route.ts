import { NextResponse } from "next/server"

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID

export async function GET() {
  try {
    if (!GOOGLE_API_KEY || !SPREADSHEET_ID) {
      return NextResponse.json({
        success: false,
        message: "Google Sheets غير مكون - متغيرات البيئة مفقودة",
        mode: "simulation",
      })
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${GOOGLE_API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      let errorDetails = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorData = await response.json()
        if (errorData?.error?.message) {
          errorDetails = errorData.error.message
        }
      } catch (e) {
        // تجاهل خطأ parsing JSON
      }
      throw new Error(errorDetails)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: "تم الاتصال بنجاح بـ Google Sheets",
      mode: "connected",
      data: {
        title: data.properties?.title,
        sheets: data.sheets?.map((sheet: any) => sheet.properties?.title) || [],
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "فشل في الاتصال بـ Google Sheets",
      mode: "fallback",
    })
  }
}
