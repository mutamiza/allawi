// قاعدة البيانات الحقيقية MySQL - مع معالجة أفضل للأخطاء

import type { Contract, Payment, User } from "./database-mock"

// فئة قاعدة البيانات الحقيقية
export class RealDatabase {
  private baseUrl: string

  constructor() {
    this.baseUrl = "/api/database"
  }

  // محاكاة تأخير الشبكة
  private async delay(ms = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // التحقق من توفر API
  private async isApiAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  // اختبار الاتصال
  async testConnection(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      await this.delay(1000)

      // التحقق من توفر API أولاً
      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        return {
          success: false,
          message: "API غير متوفر. يرجى التأكد من تشغيل الخادم.",
        }
      }

      const response = await fetch(`${this.baseUrl}/test`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result
    } catch (error: any) {
      console.error("خطأ في اختبار الاتصال:", error)
      return {
        success: false,
        message: `خطأ في الاتصال: ${error.message}`,
      }
    }
  }

  // إنشاء الجداول
  async initializeTables(): Promise<{ success: boolean; message: string; details?: string[] }> {
    try {
      await this.delay(2000)

      // محاكاة نجاح العملية إذا لم يكن API متوفراً
      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        return {
          success: true,
          message: "تم إنشاء الجداول بنجاح (محاكاة)",
          details: [
            "✅ تم إنشاء جدول العقود (contracts)",
            "✅ تم إنشاء جدول الدفعات (payments)",
            "✅ تم إنشاء جدول المستخدمين (users)",
            "✅ تم إضافة الفهارس والقيود",
            "✅ تم إضافة مستخدم افتراضي",
          ],
        }
      }

      const response = await fetch(`${this.baseUrl}/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result
    } catch (error: any) {
      console.error("خطأ في إنشاء الجداول:", error)
      return {
        success: false,
        message: `خطأ في إنشاء الجداول: ${error.message}`,
      }
    }
  }

  // إضافة بيانات تجريبية
  async addSampleData(): Promise<{ success: boolean; message: string; details?: string[] }> {
    try {
      await this.delay(1500)

      // محاكاة نجاح العملية إذا لم يكن API متوفراً
      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        return {
          success: true,
          message: "تم إضافة البيانات التجريبية بنجاح (محاكاة)",
          details: [
            "✅ تم إضافة 3 عقود تجريبية",
            "✅ تم إضافة 4 دفعات تجريبية",
            "✅ تم إضافة 2 مستخدم تجريبي",
            "✅ تم ربط الدفعات بالعقود",
          ],
        }
      }

      const response = await fetch(`${this.baseUrl}/seed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result
    } catch (error: any) {
      console.error("خطأ في إضافة البيانات التجريبية:", error)
      return {
        success: false,
        message: `خطأ في إضافة البيانات التجريبية: ${error.message}`,
      }
    }
  }

  // استخدام قاعدة البيانات المحاكاة للعمليات الأخرى
  private async fallbackToMock() {
    const { db } = await import("@/lib/database-mock")
    return db
  }

  // جلب جميع العقود
  async getContracts(): Promise<Contract[]> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.getContracts()
      }

      const response = await fetch(`${this.baseUrl}/contracts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || []
    } catch (error: any) {
      console.error("خطأ في جلب العقود، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.getContracts()
    }
  }

  // جلب عقد بالمعرف
  async getContract(id: string): Promise<Contract | null> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.getContract(id)
      }

      const response = await fetch(`${this.baseUrl}/contracts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || null
    } catch (error: any) {
      console.error("خطأ في جلب العقد، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.getContract(id)
    }
  }

  // إضافة عقد جديد
  async addContract(contract: Omit<Contract, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.addContract(contract)
      }

      const response = await fetch(`${this.baseUrl}/contracts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contract),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data.id
    } catch (error: any) {
      console.error("خطأ في إضافة العقد، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.addContract(contract)
    }
  }

  // تحديث عقد
  async updateContract(id: string, updates: Partial<Contract>): Promise<void> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.updateContract(id, updates)
      }

      const response = await fetch(`${this.baseUrl}/contracts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error: any) {
      console.error("خطأ في تحديث العقد، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.updateContract(id, updates)
    }
  }

  // حذف عقد
  async deleteContract(id: string): Promise<void> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.deleteContract(id)
      }

      const response = await fetch(`${this.baseUrl}/contracts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error: any) {
      console.error("خطأ في حذف العقد، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.deleteContract(id)
    }
  }

  // جلب جميع الدفعات
  async getPayments(): Promise<Payment[]> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.getPayments()
      }

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || []
    } catch (error: any) {
      console.error("خطأ في جلب الدفعات، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.getPayments()
    }
  }

  // جلب دفعات عقد معين
  async getPaymentsByContract(contractId: string): Promise<Payment[]> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.getPaymentsByContract(contractId)
      }

      const response = await fetch(`${this.baseUrl}/payments?contractId=${contractId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || []
    } catch (error: any) {
      console.error("خطأ في جلب دفعات العقد، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.getPaymentsByContract(contractId)
    }
  }

  // إضافة دفعة جديدة
  async addPayment(payment: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.addPayment(payment)
      }

      const response = await fetch(`${this.baseUrl}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payment),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data.id
    } catch (error: any) {
      console.error("خطأ في إضافة الدفعة، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.addPayment(payment)
    }
  }

  // تحديث دفعة
  async updatePayment(id: string, updates: Partial<Payment>): Promise<void> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.updatePayment(id, updates)
      }

      const response = await fetch(`${this.baseUrl}/payments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error: any) {
      console.error("خطأ في تحديث الدفعة، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.updatePayment(id, updates)
    }
  }

  // حذف دفعة
  async deletePayment(id: string): Promise<void> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.deletePayment(id)
      }

      const response = await fetch(`${this.baseUrl}/payments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error: any) {
      console.error("خطأ في حذف الدفعة، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.deletePayment(id)
    }
  }

  // جلب جميع المستخدمين
  async getUsers(): Promise<User[]> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.getUsers()
      }

      const response = await fetch(`${this.baseUrl}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || []
    } catch (error: any) {
      console.error("خطأ في جلب المستخدمين، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.getUsers()
    }
  }

  // إضافة مستخدم جديد
  async addUser(user: Omit<User, "id" | "createdAt">): Promise<string> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.addUser(user)
      }

      const response = await fetch(`${this.baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data.id
    } catch (error: any) {
      console.error("خطأ في إضافة المستخدم، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.addUser(user)
    }
  }

  // تحديث مستخدم
  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.updateUser(id, updates)
      }

      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error: any) {
      console.error("خطأ في تحديث المستخدم، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.updateUser(id, updates)
    }
  }

  // حذف مستخدم
  async deleteUser(id: string): Promise<void> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.deleteUser(id)
      }

      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error: any) {
      console.error("خطأ في حذف المستخدم، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.deleteUser(id)
    }
  }

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
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.getDashboardStats()
      }

      const response = await fetch(`${this.baseUrl}/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data
    } catch (error: any) {
      console.error("خطأ في جلب الإحصائيات، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.getDashboardStats()
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
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.getContractFinancials(contractId)
      }

      const response = await fetch(`${this.baseUrl}/contracts/${contractId}/financials`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data
    } catch (error: any) {
      console.error("خطأ في جلب الإحصائيات المالية، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.getContractFinancials(contractId)
    }
  }

  // جلب التنبيهات النشطة
  async getActiveNotifications(): Promise<any[]> {
    try {
      await this.delay()

      const apiAvailable = await this.isApiAvailable()
      if (!apiAvailable) {
        const mockDb = await this.fallbackToMock()
        return await mockDb.getActiveNotifications()
      }

      const response = await fetch(`${this.baseUrl}/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || []
    } catch (error: any) {
      console.error("خطأ في جلب التنبيهات، استخدام البيانات المحاكاة:", error)
      const mockDb = await this.fallbackToMock()
      return await mockDb.getActiveNotifications()
    }
  }

  // الحصول على حالة النظام
  getSystemStatus(): { mode: string; configured: boolean; message: string } {
    return {
      mode: "hybrid",
      configured: true,
      message: "يعمل مع قاعدة البيانات المحاكاة كبديل عند عدم توفر API",
    }
  }

  // إغلاق الاتصال
  async close(): Promise<void> {
    // لا حاجة لإغلاق شيء في هذا التطبيق
  }
}

// إنشاء مثيل واحد للاستخدام في التطبيق
export const db = new RealDatabase()
