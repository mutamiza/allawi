import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    const [rows] = await connection.execute("SELECT * FROM contracts ORDER BY createdAt DESC")
    await connection.end()

    return NextResponse.json({
      success: true,
      data: rows,
    })
  } catch (error: any) {
    console.error("خطأ في جلب العقود:", error)
    return NextResponse.json(
      {
        success: false,
        message: `خطأ في جلب العقود: ${error.message}`,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const contract = await request.json()

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    })

    const id = `C${Date.now()}`
    const now = new Date().toISOString().slice(0, 19).replace("T", " ")

    await connection.execute(
      `
      INSERT INTO contracts (
        id, contractName, contractNumber, startDate, endDate, 
        totalRentValue, facilitiesServiceFees, signageFees, 
        rentPaymentPeriod, contractStatus, notes, 
        createdAt, updatedAt, createdBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        id,
        contract.contractName,
        contract.contractNumber,
        contract.startDate,
        contract.endDate,
        contract.totalRentValue,
        contract.facilitiesServiceFees,
        contract.signageFees,
        contract.rentPaymentPeriod,
        contract.contractStatus,
        contract.notes || "",
        now,
        now,
        contract.createdBy || "admin",
      ],
    )

    await connection.end()

    return NextResponse.json({
      success: true,
      data: { id },
    })
  } catch (error: any) {
    console.error("خطأ في إضافة العقد:", error)
    return NextResponse.json(
      {
        success: false,
        message: `خطأ في إضافة العقد: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
