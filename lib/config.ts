export const config = {
  mode: "auto", // "simulation", "production", "auto"
  database: {
    host: process.env.DB_HOST || "localhost",
    name: process.env.DB_NAME || "investment_db",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    port: Number(process.env.DB_PORT || 3306),
  },
  googleSheets: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "",
    sheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || "",
  },
  statusMessage: "النظام يعمل في وضع المحاكاة الآمن",
}

// استرجاع معلومات الاتصال المحفوظة
export async function getDatabaseConfig() {
  try {
    const response = await fetch("/api/database/config")
    if (response.ok) {
      const data = await response.json()
      if (data.config && data.config.host) {
        return {
          host: data.config.host,
          name: data.config.database,
          user: data.config.user,
          password: data.config.password,
          port: Number(data.config.port || 3306),
        }
      }
    }
    return config.database
  } catch (error) {
    console.error("فشل استرجاع معلومات الاتصال المحفوظة:", error)
    return config.database
  }
}

export function getSystemMode() {
  return "auto" // سيتم تحديد الوضع تلقائياً بناءً على توفر الاتصال بقاعدة البيانات
}

export function isConfigured() {
  return true
}
