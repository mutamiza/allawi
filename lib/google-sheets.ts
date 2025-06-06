"use client"

// تكوين Google Sheets API
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || ""
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""

// وضع المحاكاة - سيتم استخدامه إذا كان مفتاح API غير صالح
const SIMULATION_MODE = true

// أسماء الأوراق في Google Sheets (استخدام الإنجليزية لتجنب مشاكل encoding)
const SHEETS = {
  CONTRACTS: "Contracts", // بدلاً من "العقود"
  PAYMENTS: "Payments", // بدلاً من "الدفعات"
  USERS: "Users", // بدلاً من "المستخدمين"
  NOTIFICATIONS: "Notifications", // بدلاً من "التنبيهات"
  SETTINGS: "Settings", // بدلاً من "الإعدادات"
}

// واجهات البيانات
export interface Contract {
  id: string
  contractName: string
  contractNumber: string
  startDate: string
  endDate: string
  totalRentValue: number
  facilitiesServiceFees: number
  signageFees: number
  rentPaymentPeriod: string
  contractStatus: string
  notes: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface Payment {
  id: string
  contractId: string
  type: "rent" | "facilities" | "signage"
  amount: number
  paymentDate: string
  dueDate: string
  status: "paid" | "pending" | "overdue"
  paymentMethod: string
  receiptNumber: string
  notes: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  username: string
  fullName: string
  email: string
  role: string
  permissions: string[]
  status: string
  lastLogin: string
  createdAt: string
}

// فئة إدارة Google Sheets
export class GoogleSheetsDB {
  private baseUrl: string
  private simulationMode: boolean = SIMULATION_MODE

  constructor() {
    this.baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`

    // تحقق من وجود مفتاح API
    if (!API_KEY || API_KEY.trim() === "") {
      console.warn("مفتاح API غير موجود. تم تفعيل وضع المحاكاة.")
      this.simulationMode = true
    }
  }

  // التحقق من صحة الإعدادات
  private validateConfig(): void {
    if (!SPREADSHEET_ID) {
      throw new Error("NEXT_PUBLIC_GOOGLE_SHEETS_ID غير موجود في متغيرات البيئة")
    }
    if (!API_KEY) {
      throw new Error("NEXT_PUBLIC_GOOGLE_API_KEY غير موجود في متغيرات البيئة")
    }
  }

  // دالة عامة لقراءة البيانات من ورقة
  private async readSheet(sheetName: string, range?: string): Promise<any[][]> {
    // إذا كان وضع المحاكاة مفعل، ارجع مصفوفة فارغة
    if (this.simulationMode) {
      console.log(`وضع المحاكاة: محاكاة قراءة البيانات من ${sheetName}`)
      return []
    }

    try {
      this.validateConfig()

      // تنظيف اسم الورقة وإضافة encoding إذا لزم الأمر
      const cleanSheetName = encodeURIComponent(sheetName)
      const fullRange = range ? `${cleanSheetName}!${range}` : `${cleanSheetName}!A:Z`

      const url = `${this.baseUrl}/values/${fullRange}?key=${API_KEY}`

      console.log("محاولة الوصول إلى:", url)

      const response = await fetch(url)

      if (!response.ok) {
        // محاولة الحصول على تفاصيل الخطأ
        let errorDetails = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorDetails += ` - ${JSON.stringify(errorData)}`

          // إذا كان الخطأ متعلق بمفتاح API، فعّل وضع المحاكاة
          if (errorData?.error?.message?.includes("API key not valid")) {
            console.warn("مفتاح API غير صالح. تم تفعيل وضع المحاكاة.")
            this.simulationMode = true
            return []
          }
        } catch (e) {
          // تجاهل خطأ parsing JSON
        }
        throw new Error(errorDetails)
      }

      const data = await response.json()
      console.log("البيانات المستلمة:", data)

      return data.values || []
    } catch (error) {
      console.error("خطأ في قراءة البيانات من Google Sheets:", error)

      // تفعيل وضع المحاكاة في حالة الخطأ
      this.simulationMode = true
      return []
    }
  }

  // دالة عامة لكتابة البيانات إلى ورقة (محاكاة)
  private async writeSheet(sheetName: string, range: string, values: any[][]): Promise<void> {
    console.log(`محاكاة كتابة البيانات إلى ${sheetName}:`, values)
    // محاكاة تأخير الشبكة
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  // دالة لإضافة صف جديد (محاكاة)
  private async appendRow(sheetName: string, values: any[]): Promise<void> {
    console.log(`محاكاة إضافة صف جديد إلى ${sheetName}:`, values)
    // محاكاة تأخير الشبكة
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  // تحويل صف إلى كائن عقد
  private rowToContract(row: any[]): Contract {
    return {
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
    }
  }

  // تحويل كائن عقد إلى صف
  private contractToRow(contract: Contract): any[] {
    return [
      contract.id,
      contract.contractName,
      contract.contractNumber,
      contract.startDate,
      contract.endDate,
      contract.totalRentValue,
      contract.facilitiesServiceFees,
      contract.signageFees,
      contract.rentPaymentPeriod,
      contract.contractStatus,
      contract.notes,
      contract.createdAt,
      contract.updatedAt,
      contract.createdBy,
    ]
  }

  // تحويل صف إلى كائن دفعة
  private rowToPayment(row: any[]): Payment {
    return {
      id: row[0] || "",
      contractId: row[1] || "",
      type: (row[2] as "rent" | "facilities" | "signage") || "rent",
      amount: Number.parseFloat(row[3]) || 0,
      paymentDate: row[4] || "",
      dueDate: row[5] || "",
      status: (row[6] as "paid" | "pending" | "overdue") || "pending",
      paymentMethod: row[7] || "",
      receiptNumber: row[8] || "",
      notes: row[9] || "",
      createdBy: row[10] || "",
      createdAt: row[11] || "",
      updatedAt: row[12] || "",
    }
  }

  // تحويل كائن دفعة إلى صف
  private paymentToRow(payment: Payment): any[] {
    return [
      payment.id,
      payment.contractId,
      payment.type,
      payment.amount,
      payment.paymentDate,
      payment.dueDate,
      payment.status,
      payment.paymentMethod,
      payment.receiptNumber,
      payment.notes,
      payment.createdBy,
      payment.createdAt,
      payment.updatedAt,
    ]
  }

  // === وظائف العقود ===

  // جلب جميع العقود
  async getContracts(): Promise<Contract[]> {
    try {
      console.log("محاولة جلب العقود من الورقة:", SHEETS.CONTRACTS)

      // إذا كان وضع المحاكاة مفعل، ارجع البيانات التجريبية مباشرة
      if (this.simulationMode) {
        console.log("استخدام البيانات التجريبية للعقود...")
        return this.getFallbackContracts()
      }

      const rows = await this.readSheet(SHEETS.CONTRACTS)
      console.log("الصفوف المستلمة:", rows)

      // تخطي الصف الأول (العناوين) إذا كان موجوداً
      if (rows.length <= 1) {
        console.log("لا توجد بيانات في ورقة العقود")
        return this.getFallbackContracts()
      }

      const contracts = rows.slice(1).map((row) => this.rowToContract(row))
      console.log("العقود المحولة:", contracts)

      return contracts
    } catch (error) {
      console.error("خطأ في جلب العقود:", error)

      // إرجاع بيانات تجريبية في حالة الخطأ
      console.log("استخدام البيانات التجريبية...")
      return this.getFallbackContracts()
    }
  }

  // بيانات تجريبية للعقود (في حالة فشل الاتصال)
  private getFallbackContracts(): Contract[] {
    return [
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
      {
        id: "C003",
        contractName: "عقد إيجار مصنع الدمام",
        contractNumber: "DM-2024-003",
        startDate: "2024-03-01",
        endDate: "2026-03-01",
        totalRentValue: 1200000,
        facilitiesServiceFees: 60000,
        signageFees: 20000,
        rentPaymentPeriod: "نصف سنوي",
        contractStatus: "نشط",
        notes: "عقد إيجار مصنع في المدينة الصناعية بالدمام.",
        createdAt: "2024-02-15",
        updatedAt: "2024-02-15",
        createdBy: "محمد عبدالله",
      },
    ]
  }

  // جلب عقد بالمعرف
  async getContract(id: string): Promise<Contract | null> {
    try {
      const contracts = await this.getContracts()
      return contracts.find((contract) => contract.id === id) || null
    } catch (error) {
      console.error("خطأ في جلب العقد:", error)
      return null
    }
  }

  // إضافة عقد جديد (محاكاة)
  async addContract(contract: Omit<Contract, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const id = `C${Date.now()}`
      const now = new Date().toISOString()

      const newContract: Contract = {
        ...contract,
        id,
        createdAt: now,
        updatedAt: now,
      }

      console.log("إضافة عقد جديد:", newContract)

      // محاكاة إضافة العقد
      await this.appendRow(SHEETS.CONTRACTS, this.contractToRow(newContract))

      return id
    } catch (error) {
      console.error("خطأ في إضافة العقد:", error)
      throw error
    }
  }

  // تحديث عقد (محاكاة)
  async updateContract(id: string, updates: Partial<Contract>): Promise<void> {
    try {
      console.log(`تحديث العقد ${id}:`, updates)

      // محاكاة التحديث
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("خطأ في تحديث العقد:", error)
      throw error
    }
  }

  // حذف عقد (محاكاة)
  async deleteContract(id: string): Promise<void> {
    try {
      console.log(`حذف العقد: ${id}`)

      // محاكاة الحذف
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("خطأ في حذف العقد:", error)
      throw error
    }
  }

  // === وظائف الدفعات ===

  // جلب جميع الدفعات
  async getPayments(): Promise<Payment[]> {
    try {
      // إذا كان وضع المحاكاة مفعل، ارجع البيانات التجريبية مباشرة
      if (this.simulationMode) {
        console.log("استخدام البيانات التجريبية للدفعات...")
        return this.getFallbackPayments()
      }

      const rows = await this.readSheet(SHEETS.PAYMENTS)

      if (rows.length <= 1) {
        return this.getFallbackPayments()
      }

      return rows.slice(1).map((row) => this.rowToPayment(row))
    } catch (error) {
      console.error("خطأ في جلب الدفعات:", error)

      // إرجاع بيانات تجريبية
      return this.getFallbackPayments()
    }
  }

  // بيانات تجريبية للدفعات
  private getFallbackPayments(): Payment[] {
    return [
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
      {
        id: "PAY003",
        contractId: "C001",
        type: "signage",
        amount: 7500,
        paymentDate: "2024-02-01",
        dueDate: "2024-02-01",
        status: "paid",
        paymentMethod: "نقد",
        receiptNumber: "REC-2024-003",
        notes: "رسوم لوحة إعلانية",
        createdBy: "محمد عبدالله",
        createdAt: "2024-02-01",
        updatedAt: "2024-02-01",
      },
      {
        id: "PAY004",
        contractId: "C001",
        type: "rent",
        amount: 125000,
        paymentDate: "",
        dueDate: "2024-04-15",
        status: "pending",
        paymentMethod: "",
        receiptNumber: "",
        notes: "دفعة الربع الثاني",
        createdBy: "النظام",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
      },
      {
        id: "PAY005",
        contractId: "C002",
        type: "rent",
        amount: 25000,
        paymentDate: "2024-02-01",
        dueDate: "2024-02-01",
        status: "paid",
        paymentMethod: "تحويل بنكي",
        receiptNumber: "REC-2024-004",
        notes: "دفعة شهر فبراير",
        createdBy: "فاطمة علي",
        createdAt: "2024-02-01",
        updatedAt: "2024-02-01",
      },
      {
        id: "PAY006",
        contractId: "C002",
        type: "rent",
        amount: 25000,
        paymentDate: "",
        dueDate: "2024-03-01",
        status: "overdue",
        paymentMethod: "",
        receiptNumber: "",
        notes: "دفعة شهر مارس",
        createdBy: "النظام",
        createdAt: "2024-02-01",
        updatedAt: "2024-02-01",
      },
    ]
  }

  // جلب دفعات عقد معين
  async getPaymentsByContract(contractId: string): Promise<Payment[]> {
    try {
      const payments = await this.getPayments()
      return payments.filter((payment) => payment.contractId === contractId)
    } catch (error) {
      console.error("خطأ في جلب دفعات العقد:", error)
      return []
    }
  }

  // إضافة دفعة جديدة (محاكاة)
  async addPayment(payment: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const id = `PAY${Date.now()}`
      const now = new Date().toISOString()

      const newPayment: Payment = {
        ...payment,
        id,
        createdAt: now,
        updatedAt: now,
      }

      console.log("إضافة دفعة جديدة:", newPayment)

      await this.appendRow(SHEETS.PAYMENTS, this.paymentToRow(newPayment))

      return id
    } catch (error) {
      console.error("خطأ في إضافة الدفعة:", error)
      throw error
    }
  }

  // تحديث دفعة (محاكاة)
  async updatePayment(id: string, updates: Partial<Payment>): Promise<void> {
    try {
      console.log(`تحديث الدفعة ${id}:`, updates)
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("خطأ في تحديث الدفعة:", error)
      throw error
    }
  }

  // حذف دفعة (محاكاة)
  async deletePayment(id: string): Promise<void> {
    try {
      console.log(`حذف الدفعة: ${id}`)
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error("خطأ في حذف الدفعة:", error)
      throw error
    }
  }

  // حساب الإحصائيات المالية لعقد
  async getContractFinancials(contractId: string): Promise<{
    totalRentPaid: number
    totalFacilitiesPaid: number
    totalSignagePaid: number
    rentProgress: number
    rentRemaining: number
  }> {
    try {
      const contract = await this.getContract(contractId)
      const payments = await this.getPaymentsByContract(contractId)

      if (!contract) {
        throw new Error("العقد غير موجود")
      }

      const paidPayments = payments.filter((p) => p.status === "paid")

      const totalRentPaid = paidPayments.filter((p) => p.type === "rent").reduce((sum, p) => sum + p.amount, 0)

      const totalFacilitiesPaid = paidPayments
        .filter((p) => p.type === "facilities")
        .reduce((sum, p) => sum + p.amount, 0)

      const totalSignagePaid = paidPayments.filter((p) => p.type === "signage").reduce((sum, p) => sum + p.amount, 0)

      const rentProgress = (totalRentPaid / contract.totalRentValue) * 100
      const rentRemaining = contract.totalRentValue - totalRentPaid

      return {
        totalRentPaid,
        totalFacilitiesPaid,
        totalSignagePaid,
        rentProgress,
        rentRemaining,
      }
    } catch (error) {
      console.error("خطأ في حساب الإحصائيات المالية:", error)
      throw error
    }
  }

  // === وظائف المستخدمين ===

  // جلب جميع المستخدمين
  async getUsers(): Promise<User[]> {
    try {
      // إذا كان وضع المحاكاة مفعل، ارجع البيانات التجريبية مباشرة
      if (this.simulationMode) {
        return this.getFallbackUsers()
      }

      const rows = await this.readSheet(SHEETS.USERS)

      if (rows.length <= 1) {
        return this.getFallbackUsers()
      }

      return rows.slice(1).map((row) => ({
        id: row[0] || "",
        username: row[1] || "",
        fullName: row[2] || "",
        email: row[3] || "",
        role: row[4] || "",
        permissions: row[5] ? row[5].split(",") : [],
        status: row[6] || "",
        lastLogin: row[7] || "",
        createdAt: row[8] || "",
      }))
    } catch (error) {
      console.error("خطأ في جلب المستخدمين:", error)

      // إرجاع بيانات تجريبية
      return this.getFallbackUsers()
    }
  }

  // بيانات تجريبية للمستخدمين
  private getFallbackUsers(): User[] {
    return [
      {
        id: "U001",
        username: "admin",
        fullName: "أحمد محمد السعيد",
        email: "admin@company.com",
        role: "مدير النظام",
        permissions: ["قراءة", "كتابة", "حذف", "إدارة"],
        status: "نشط",
        lastLogin: "2024-01-15 10:30",
        createdAt: "2024-01-01",
      },
      {
        id: "U002",
        username: "manager1",
        fullName: "فاطمة علي أحمد",
        email: "manager@company.com",
        role: "مدير العقود",
        permissions: ["قراءة", "كتابة", "تعديل"],
        status: "نشط",
        lastLogin: "2024-01-14 14:20",
        createdAt: "2024-01-05",
      },
      {
        id: "U003",
        username: "accountant",
        fullName: "محمد عبدالله الزهراني",
        email: "accountant@company.com",
        role: "محاسب",
        permissions: ["قراءة", "إدارة الدفعات"],
        status: "نشط",
        lastLogin: "2024-01-13 09:15",
        createdAt: "2024-01-10",
      },
      {
        id: "U004",
        username: "viewer1",
        fullName: "سارة خالد المطيري",
        email: "viewer@company.com",
        role: "مراقب",
        permissions: ["قراءة"],
        status: "غير نشط",
        lastLogin: "2024-01-10 16:45",
        createdAt: "2024-01-15",
      },
    ]
  }

  // === وظائف التنبيهات ===

  // جلب التنبيهات النشطة
  async getActiveNotifications(): Promise<any[]> {
    try {
      const contracts = await this.getContracts()
      const payments = await this.getPayments()
      const notifications = []

      // فحص العقود المنتهية قريباً
      for (const contract of contracts) {
        const endDate = new Date(contract.endDate)
        const today = new Date()
        const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (daysRemaining <= 30 && daysRemaining > 0) {
          notifications.push({
            id: `exp_${contract.id}`,
            type: "contract_expiry",
            title: "عقد ينتهي قريباً",
            message: `عقد ${contract.contractName} ينتهي خلال ${daysRemaining} يوم`,
            contractId: contract.id,
            contractName: contract.contractName,
            priority: daysRemaining <= 7 ? "high" : "medium",
            dueDate: contract.endDate,
            daysRemaining,
            isRead: false,
            createdAt: new Date().toISOString(),
          })
        }
      }

      // فحص الدفعات المتأخرة والمستحقة
      for (const payment of payments) {
        if (payment.status === "pending" || payment.status === "overdue") {
          const dueDate = new Date(payment.dueDate)
          const today = new Date()
          const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

          if (daysRemaining <= 7) {
            const contract = await this.getContract(payment.contractId)
            notifications.push({
              id: `pay_${payment.id}`,
              type: daysRemaining < 0 ? "overdue_payment" : "payment_due",
              title: daysRemaining < 0 ? "دفعة متأخرة" : "دفعة مستحقة",
              message: `دفعة ${this.getPaymentTypeLabel(payment.type)} ${daysRemaining < 0 ? `متأخرة بـ ${Math.abs(daysRemaining)} يوم` : `مستحقة خلال ${daysRemaining} يوم`}`,
              contractId: payment.contractId,
              contractName: contract?.contractName || "",
              priority: "high",
              dueDate: payment.dueDate,
              daysRemaining,
              isRead: false,
              createdAt: new Date().toISOString(),
            })
          }
        }
      }

      return notifications
    } catch (error) {
      console.error("خطأ في جلب التنبيهات:", error)
      return []
    }
  }

  private getPaymentTypeLabel(type: string): string {
    switch (type) {
      case "rent":
        return "إيجار"
      case "facilities":
        return "خدمات المرافق"
      case "signage":
        return "لوحات"
      default:
        return type
    }
  }

  // === وظائف الإحصائيات العامة ===

  // جلب إحصائيات لوحة التحكم
  async getDashboardStats(): Promise<{
    totalContracts: number
    activeContracts: number
    totalUsers: number
    pendingPayments: number
    totalRevenue: number
    expiringContracts: number
    overduePayments: number
  }> {
    try {
      const contracts = await this.getContracts()
      const payments = await this.getPayments()
      const users = await this.getUsers()

      const activeContracts = contracts.filter((c) => c.contractStatus === "نشط").length
      const pendingPayments = payments.filter((p) => p.status === "pending").length
      const overduePayments = payments.filter((p) => p.status === "overdue").length

      const totalRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)

      const today = new Date()
      const expiringContracts = contracts.filter((contract) => {
        const endDate = new Date(contract.endDate)
        const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return daysRemaining <= 30 && daysRemaining > 0
      }).length

      return {
        totalContracts: contracts.length,
        activeContracts,
        totalUsers: users.length,
        pendingPayments,
        totalRevenue,
        expiringContracts,
        overduePayments,
      }
    } catch (error) {
      console.error("خطأ في جلب إحصائيات لوحة التحكم:", error)
      return {
        totalContracts: 0,
        activeContracts: 0,
        totalUsers: 0,
        pendingPayments: 0,
        totalRevenue: 0,
        expiringContracts: 0,
        overduePayments: 0,
      }
    }
  }

  // اختبار الاتصال
  async testConnection(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      // إذا كان وضع المحاكاة مفعل، ارجع رسالة خطأ
      if (this.simulationMode) {
        return {
          success: false,
          message: "وضع المحاكاة مفعل. لا يمكن الاتصال بـ Google Sheets.",
        }
      }

      this.validateConfig()

      // محاولة جلب معلومات الجدول
      const url = `${this.baseUrl}?key=${API_KEY}`
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

      return {
        success: true,
        message: "تم الاتصال بنجاح بـ Google Sheets",
        data: {
          title: data.properties?.title,
          sheets: data.sheets?.map((sheet: any) => sheet.properties?.title) || [],
        },
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "فشل في الاتصال بـ Google Sheets",
      }
    }
  }

  // التحقق من حالة وضع المحاكاة
  isSimulationMode(): boolean {
    return this.simulationMode
  }

  // تعيين وضع المحاكاة
  setSimulationMode(mode: boolean): void {
    this.simulationMode = mode
    console.log(`تم تعيين وضع المحاكاة إلى: ${mode ? "مفعل" : "معطل"}`)
  }

  // الحصول على حالة النظام
  getSystemStatus(): { mode: string; configured: boolean; message: string } {
    const hasConfig = !!(SPREADSHEET_ID && API_KEY)

    if (this.simulationMode) {
      return {
        mode: "simulation",
        configured: hasConfig,
        message: hasConfig
          ? "النظام يعمل في وضع المحاكاة بسبب مشكلة في الاتصال أو مفتاح API غير صالح"
          : "النظام يعمل في وضع المحاكاة - لم يتم تكوين Google Sheets API",
      }
    }

    return {
      mode: "connected",
      configured: true,
      message: "النظام متصل بـ Google Sheets",
    }
  }
}

// إنشاء مثيل واحد للاستخدام في التطبيق
export const db = new GoogleSheetsDB()
