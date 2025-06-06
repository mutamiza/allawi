import { NextResponse } from "next/server"

// مفتاح API آمن على الخادم فقط
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY // بدون NEXT_PUBLIC_
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID // بدون NEXT_PUBLIC_

async function getGoogleSheetsData(sheetName: string, range?: string) {
  if (!GOOGLE_API_KEY || !SPREADSHEET_ID) {
    throw new Error("Google Sheets not configured")
  }

  const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`
  const fullRange = range ? `${sheetName}!${range}` : `${sheetName}!A:Z`
  const url = `${baseUrl}/values/${fullRange}?key=${GOOGLE_API_KEY}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  return data.values || []
}

export async function GET() {
  try {
    const rows = await getGoogleSheetsData("Contracts")

    if (rows.length <= 1) {
      return NextResponse.json({ contracts: [], mode: "fallback" })
    }

    const contracts = rows.slice(1).map((row: any[]) => ({
      id: row[0] || "",
      contractName: row[1] || "",
      contractNumber: row[2] || "",
      startDate: row[3] || "",
      endDate: row[4] || "",
      totalRentValue: Number.parseFloat(row[5]) || 0,
      facilitiesServiceFees: Number.parseFloat(row[6]) || 0,
      signageFees: Number.parseFloat(row[7]) || 0,
      rentPaymentPeriod: row[8] || "",
      contractStatus: row[9] || "",
      notes: row[10] || "",
      createdAt: row[11] || "",
      updatedAt: row[12] || "",
      createdBy: row[13] || "",
    }))

    return NextResponse.json({ contracts, mode: "connected" })
  } catch (error) {
    console.error("Error fetching contracts:", error)

    // إرجاع بيانات تجريبية في حالة الخطأ
    const fallbackContracts = [
      {
        id: "C001",
        contractName: "عقد إيجار مجمع الرياض التجاري",
        contractNumber: "RC-2024-001",
        startDate: "2024-01-15",
        endDate: "2025-01-15",
        totalRentValue: 500000,
        facilitiesServiceFees: 25000,
        signageFees: 15000,
        rentPaymentPeriod: "ربع سنوي",
        contractStatus: "نشط",
        notes: "هذا العقد يشمل إيجار المحلات التجارية في الطابق الأرضي والأول من المجمع التجاري الواقع في شمال الرياض.",
        createdAt: "2024-01-10",
        updatedAt: "2024-01-12",
        createdBy: "أحمد محمد",
      },
      {
        id: "C002",
        contractName: "عقد إيجار مكاتب جدة",
        contractNumber: "JD-2024-002",
        startDate: "2024-02-01",
        endDate: "2025-02-01",
        totalRentValue: 300000,
        facilitiesServiceFees: 15000,
        signageFees: 10000,
        rentPaymentPeriod: "شهري",
        contractStatus: "نشط",
        notes: "عقد إيجار مكاتب إدارية في برج جدة التجاري.",
        createdAt: "2024-01-20",
        updatedAt: "2024-01-20",
        createdBy: "فاطمة علي",
      },
    ]

    return NextResponse.json({ contracts: fallbackContracts, mode: "fallback" })
  }
}
