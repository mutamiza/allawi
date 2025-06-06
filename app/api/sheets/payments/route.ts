import { NextResponse } from "next/server"

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID

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
    const rows = await getGoogleSheetsData("Payments")

    if (rows.length <= 1) {
      return NextResponse.json({ payments: [], mode: "fallback" })
    }

    const payments = rows.slice(1).map((row: any[]) => ({
      id: row[0] || "",
      contractId: row[1] || "",
      type: row[2] || "rent",
      amount: Number.parseFloat(row[3]) || 0,
      paymentDate: row[4] || "",
      dueDate: row[5] || "",
      status: row[6] || "pending",
      paymentMethod: row[7] || "",
      receiptNumber: row[8] || "",
      notes: row[9] || "",
      createdBy: row[10] || "",
      createdAt: row[11] || "",
      updatedAt: row[12] || "",
    }))

    return NextResponse.json({ payments, mode: "connected" })
  } catch (error) {
    console.error("Error fetching payments:", error)

    const fallbackPayments = [
      {
        id: "PAY001",
        contractId: "C001",
        type: "rent",
        amount: 125000,
        paymentDate: "2024-01-15",
        dueDate: "2024-01-15",
        status: "paid",
        paymentMethod: "تحويل بنكي",
        receiptNumber: "REC-2024-001",
        notes: "دفعة الربع الأول",
        createdBy: "أحمد محمد",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
      },
      {
        id: "PAY002",
        contractId: "C001",
        type: "facilities",
        amount: 12500,
        paymentDate: "2024-01-20",
        dueDate: "2024-01-20",
        status: "paid",
        paymentMethod: "شيك",
        receiptNumber: "REC-2024-002",
        notes: "رسوم خدمات يناير",
        createdBy: "فاطمة علي",
        createdAt: "2024-01-20",
        updatedAt: "2024-01-20",
      },
    ]

    return NextResponse.json({ payments: fallbackPayments, mode: "fallback" })
  }
}
