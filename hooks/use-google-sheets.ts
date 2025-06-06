"use client"

import { useState, useEffect } from "react"
import { db, type Contract, type Payment, type User } from "@/lib/google-sheets"

// Hook لإدارة العقود
export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContracts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await db.getContracts()
      setContracts(data)
    } catch (err) {
      setError("خطأ في جلب العقود")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addContract = async (contract: Omit<Contract, "id" | "createdAt" | "updatedAt">) => {
    try {
      const id = await db.addContract(contract)
      await fetchContracts() // إعادة تحميل البيانات
      return id
    } catch (err) {
      setError("خطأ في إضافة العقد")
      throw err
    }
  }

  const updateContract = async (id: string, updates: Partial<Contract>) => {
    try {
      await db.updateContract(id, updates)
      await fetchContracts() // إعادة تحميل البيانات
    } catch (err) {
      setError("خطأ في تحديث العقد")
      throw err
    }
  }

  const deleteContract = async (id: string) => {
    try {
      await db.deleteContract(id)
      await fetchContracts() // إعادة تحميل البيانات
    } catch (err) {
      setError("خطأ في حذف العقد")
      throw err
    }
  }

  useEffect(() => {
    fetchContracts()
  }, [])

  return {
    contracts,
    loading,
    error,
    fetchContracts,
    addContract,
    updateContract,
    deleteContract,
  }
}

// Hook لإدارة الدفعات
export function usePayments(contractId?: string) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = contractId ? await db.getPaymentsByContract(contractId) : await db.getPayments()
      setPayments(data)
    } catch (err) {
      setError("خطأ في جلب الدفعات")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addPayment = async (payment: Omit<Payment, "id" | "createdAt" | "updatedAt">) => {
    try {
      const id = await db.addPayment(payment)
      await fetchPayments() // إعادة تحميل البيانات
      return id
    } catch (err) {
      setError("خطأ في إضافة الدفعة")
      throw err
    }
  }

  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    try {
      await db.updatePayment(id, updates)
      await fetchPayments() // إعادة تحميل البيانات
    } catch (err) {
      setError("خطأ في تحديث الدفعة")
      throw err
    }
  }

  const deletePayment = async (id: string) => {
    try {
      await db.deletePayment(id)
      await fetchPayments() // إعادة تحميل البيانات
    } catch (err) {
      setError("خطأ في حذف الدفعة")
      throw err
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [contractId])

  return {
    payments,
    loading,
    error,
    fetchPayments,
    addPayment,
    updatePayment,
    deletePayment,
  }
}

// Hook لإدارة المستخدمين
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await db.getUsers()
      setUsers(data)
    } catch (err) {
      setError("خطأ في جلب المستخدمين")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    fetchUsers,
  }
}

// Hook لإدارة التنبيهات
export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await db.getActiveNotifications()
      setNotifications(data)
    } catch (err) {
      setError("خطأ في جلب التنبيهات")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // تحديث التنبيهات كل 5 دقائق
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
  }
}

// Hook لإدارة إحصائيات لوحة التحكم
export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalContracts: 0,
    activeContracts: 0,
    totalUsers: 0,
    pendingPayments: 0,
    totalRevenue: 0,
    expiringContracts: 0,
    overduePayments: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await db.getDashboardStats()
      setStats(data)
    } catch (err) {
      setError("خطأ في جلب الإحصائيات")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    fetchStats,
  }
}

// Hook للحصول على الإحصائيات المالية لعقد معين
export function useContractFinancials(contractId: string) {
  const [financials, setFinancials] = useState({
    totalRentPaid: 0,
    totalFacilitiesPaid: 0,
    totalSignagePaid: 0,
    rentProgress: 0,
    rentRemaining: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFinancials = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await db.getContractFinancials(contractId)
      setFinancials(data)
    } catch (err) {
      setError("خطأ في جلب الإحصائيات المالية")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (contractId) {
      fetchFinancials()
    }
  }, [contractId])

  return {
    financials,
    loading,
    error,
    fetchFinancials,
  }
}
