"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Building,
  CreditCard,
  AlertTriangle,
  Calendar,
  TrendingUp,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Bell,
  Home,
  FileText,
  Users,
  Settings,
  BarChart3,
  HelpCircle,
  Menu,
  X,
} from "lucide-react"

// أنواع البيانات
interface Contract {
  id: string
  contractNumber: string
  contractName: string
  startDate: string
  endDate: string
  totalRentValue: number
  contractStatus: string
  createdAt: string
}

interface Payment {
  id: string
  contractId: string
  contractName: string
  type: string
  amount: number
  paymentDate: string | null
  dueDate: string
  status: string
  paymentMethod?: string
  receiptNumber?: string
  notes?: string
  createdAt: string
}

// بيانات تجريبية
const initialContracts: Contract[] = [
  {
    id: "C001",
    contractNumber: "CONT-2024-001",
    contractName: "عقد إيجار مبنى تجاري - الرياض",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    totalRentValue: 500000,
    contractStatus: "نشط",
    createdAt: "2024-01-01",
  },
  {
    id: "C002",
    contractNumber: "CONT-2024-002",
    contractName: "عقد إيجار مكاتب إدارية - جدة",
    startDate: "2024-02-01",
    endDate: "2026-01-31",
    totalRentValue: 300000,
    contractStatus: "نشط",
    createdAt: "2024-02-01",
  },
  {
    id: "C003",
    contractNumber: "CONT-2024-003",
    contractName: "عقد إيجار محلات تجارية - الدمام",
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    totalRentValue: 120000,
    contractStatus: "منتهي قريباً",
    createdAt: "2024-03-01",
  },
]

const initialPayments: Payment[] = [
  {
    id: "P001",
    contractId: "C001",
    contractName: "عقد إيجار مبنى تجاري - الرياض",
    type: "إيجار",
    amount: 125000,
    paymentDate: "2024-01-15",
    dueDate: "2024-01-15",
    status: "مدفوع",
    paymentMethod: "تحويل بنكي",
    receiptNumber: "REC-2024-001",
    notes: "دفعة الربع الأول",
    createdAt: "2024-01-15",
  },
  {
    id: "P002",
    contractId: "C001",
    contractName: "عقد إيجار مبنى تجاري - الرياض",
    type: "مرافق",
    amount: 25000,
    paymentDate: null,
    dueDate: "2024-04-15",
    status: "معلق",
    createdAt: "2024-01-15",
  },
  {
    id: "P003",
    contractId: "C002",
    contractName: "عقد إيجار مكاتب إدارية - جدة",
    type: "إيجار",
    amount: 75000,
    paymentDate: "2024-02-10",
    dueDate: "2024-02-15",
    status: "مدفوع",
    paymentMethod: "شيك",
    receiptNumber: "REC-2024-002",
    createdAt: "2024-02-10",
  },
  {
    id: "P004",
    contractId: "C003",
    contractName: "عقد إيجار محلات تجارية - الدمام",
    type: "إيجار",
    amount: 20000,
    paymentDate: null,
    dueDate: "2024-03-10",
    status: "متأخر",
    createdAt: "2024-03-01",
  },
]

// مكون بطاقة الإحصائيات
function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
}: {
  title: string
  value: string | number
  icon: any
  color?: string
}) {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-50",
    green: "text-green-500 bg-green-50",
    red: "text-red-500 bg-red-50",
    yellow: "text-yellow-500 bg-yellow-50",
    purple: "text-purple-500 bg-purple-50",
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// مكون الشريط الجانبي
function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigation = [
    { name: "لوحة التحكم", icon: Home },
    { name: "العقود", icon: FileText },
    { name: "الدفعات", icon: CreditCard },
    { name: "المستخدمين", icon: Users },
    { name: "التقارير", icon: BarChart3 },
    { name: "التنبيهات", icon: Bell },
    { name: "الإعدادات", icon: Settings },
    { name: "المساعدة", icon: HelpCircle },
  ]

  return (
    <>
      {/* Overlay للشاشات الصغيرة */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />}

      {/* الشريط الجانبي */}
      <div
        className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        md:translate-x-0 md:static md:inset-0
      `}
      >
        <div className="flex flex-col h-full">
          {/* رأس الشريط الجانبي */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">نظام إدارة العقود</h2>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* قائمة التنقل */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item, index) => (
              <button
                key={item.name}
                className={`
                  flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors
                  ${index === 0 ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}
                `}
              >
                <item.icon className={`ml-3 h-5 w-5 ${index === 0 ? "text-blue-700" : "text-gray-500"}`} />
                {item.name}
              </button>
            ))}
          </nav>

          {/* تذييل الشريط الجانبي */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <span className="text-sm font-medium">أ</span>
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-900">أحمد محمد</p>
                <p className="text-xs text-gray-500">مدير النظام</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// مكون الرأس
function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden ml-2" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">نظام إدارة عقود الاستثمار</h1>
      </div>

      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="relative hidden md:block w-64">
          <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="بحث..." className="pr-8" />
        </div>

        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-xs">
              3
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  )
}

// مكون نموذج إضافة عقد
function AddContractModal({ onAddContract }: { onAddContract: (contract: any) => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    contractName: "",
    contractNumber: "",
    startDate: "",
    endDate: "",
    totalRentValue: "",
    contractStatus: "نشط",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newContract = {
      id: `C${Date.now()}`,
      ...formData,
      totalRentValue: Number(formData.totalRentValue),
      createdAt: new Date().toISOString().split("T")[0],
    }

    onAddContract(newContract)
    setOpen(false)
    setFormData({
      contractName: "",
      contractNumber: "",
      startDate: "",
      endDate: "",
      totalRentValue: "",
      contractStatus: "نشط",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          إضافة عقد جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>إضافة عقد جديد</DialogTitle>
          <DialogDescription>أدخل بيانات العقد الجديد</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contractName">اسم العقد</Label>
              <Input
                id="contractName"
                value={formData.contractName}
                onChange={(e) => setFormData({ ...formData, contractName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractNumber">رقم العقد</Label>
              <Input
                id="contractNumber"
                value={formData.contractNumber}
                onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">تاريخ البداية</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">تاريخ النهاية</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalRentValue">قيمة الإيجار الكلية</Label>
              <Input
                id="totalRentValue"
                type="number"
                value={formData.totalRentValue}
                onChange={(e) => setFormData({ ...formData, totalRentValue: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractStatus">حالة العقد</Label>
              <Select
                value={formData.contractStatus}
                onValueChange={(value) => setFormData({ ...formData, contractStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نشط">نشط</SelectItem>
                  <SelectItem value="معلق">معلق</SelectItem>
                  <SelectItem value="منتهي">منتهي</SelectItem>
                  <SelectItem value="منتهي قريباً">منتهي قريباً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit">حفظ العقد</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// مكون نموذج إضافة دفعة
function AddPaymentModal({
  contracts,
  onAddPayment,
}: {
  contracts: Contract[]
  onAddPayment: (payment: any) => void
}) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    contractId: "",
    type: "إيجار",
    amount: "",
    dueDate: "",
    paymentDate: "",
    status: "معلق",
    paymentMethod: "",
    receiptNumber: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedContract = contracts.find((c) => c.id === formData.contractId)
    const newPayment = {
      id: `P${Date.now()}`,
      ...formData,
      contractName: selectedContract?.contractName || "",
      amount: Number(formData.amount),
      paymentDate: formData.paymentDate || null,
      createdAt: new Date().toISOString().split("T")[0],
    }

    onAddPayment(newPayment)
    setOpen(false)
    setFormData({
      contractId: "",
      type: "إيجار",
      amount: "",
      dueDate: "",
      paymentDate: "",
      status: "معلق",
      paymentMethod: "",
      receiptNumber: "",
      notes: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          إضافة دفعة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>إضافة دفعة جديدة</DialogTitle>
          <DialogDescription>أدخل بيانات الدفعة الجديدة</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contractId">العقد</Label>
              <Select
                value={formData.contractId}
                onValueChange={(value) => setFormData({ ...formData, contractId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر العقد" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id}>
                      {contract.contractName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">نوع الدفعة</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="إيجار">إيجار</SelectItem>
                    <SelectItem value="مرافق">مرافق</SelectItem>
                    <SelectItem value="لافتات">لافتات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">المبلغ</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentDate">تاريخ الدفع</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">حالة الدفعة</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مدفوع">مدفوع</SelectItem>
                  <SelectItem value="معلق">معلق</SelectItem>
                  <SelectItem value="متأخر">متأخر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit">حفظ الدفعة</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// المكون الرئيسي
export default function InvestmentContractsSystem() {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts)
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    totalContracts: 0,
    activeContracts: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0,
  })

  // حساب الإحصائيات
  useEffect(() => {
    const activeContracts = contracts.filter((c) => c.contractStatus === "نشط").length
    const totalRevenue = payments.filter((p) => p.status === "مدفوع").reduce((sum, payment) => sum + payment.amount, 0)
    const pendingPayments = payments.filter((p) => p.status === "معلق").length
    const overduePayments = payments.filter((p) => p.status === "متأخر").length

    setStats({
      totalContracts: contracts.length,
      activeContracts,
      totalRevenue,
      pendingPayments,
      overduePayments,
    })
  }, [contracts, payments])

  // إضافة عقد جديد
  const handleAddContract = (contractData: any) => {
    setContracts([...contracts, contractData])
  }

  // إضافة دفعة جديدة
  const handleAddPayment = (paymentData: any) => {
    setPayments([...payments, paymentData])
  }

  // حذف عقد
  const handleDeleteContract = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العقد؟")) {
      setContracts(contracts.filter((c) => c.id !== id))
      setPayments(payments.filter((p) => p.contractId !== id))
    }
  }

  // حذف دفعة
  const handleDeletePayment = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الدفعة؟")) {
      setPayments(payments.filter((p) => p.id !== id))
    }
  }

  // تصفية العقود والدفعات
  const filteredContracts = contracts.filter(
    (contract) => contract.contractName.includes(searchTerm) || contract.contractNumber.includes(searchTerm),
  )

  const filteredPayments = payments.filter(
    (payment) => payment.contractName.includes(searchTerm) || payment.type.includes(searchTerm),
  )

  // دالة تنسيق العملة
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // دالة الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
      case "مدفوع":
        return "bg-green-100 text-green-800"
      case "معلق":
        return "bg-yellow-100 text-yellow-800"
      case "متأخر":
        return "bg-red-100 text-red-800"
      case "منتهي":
        return "bg-gray-100 text-gray-800"
      case "منتهي قريباً":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="space-y-6">
              {/* رأس الصفحة */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
                  <p className="text-gray-500">مرحباً بك في نظام إدارة عقود الاستثمار</p>
                </div>
                <div className="flex gap-3">
                  <AddContractModal onAddContract={handleAddContract} />
                  <AddPaymentModal contracts={contracts} onAddPayment={handleAddPayment} />
                </div>
              </div>

              {/* تنبيه النسخة التجريبية */}
              <Alert className="bg-blue-50 border-blue-200">
                <Calendar className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">نسخة تجريبية</AlertTitle>
                <AlertDescription className="text-blue-700">
                  هذه نسخة تجريبية من النظام تعمل مباشرة في v0. جميع البيانات محلية ولن يتم حفظها.
                </AlertDescription>
              </Alert>

              {/* بطاقات الإحصائيات */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="إجمالي العقود" value={stats.totalContracts} icon={Building} color="blue" />
                <StatCard title="العقود النشطة" value={stats.activeContracts} icon={TrendingUp} color="green" />
                <StatCard
                  title="الإيرادات المحصلة"
                  value={formatCurrency(stats.totalRevenue)}
                  icon={CreditCard}
                  color="purple"
                />
                <StatCard title="الدفعات المتأخرة" value={stats.overduePayments} icon={AlertTriangle} color="red" />
              </div>

              {/* شريط البحث */}
              <div className="relative w-full max-w-md">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="بحث في العقود والدفعات..."
                  className="pr-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* التبويبات */}
              <Tabs defaultValue="contracts" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="contracts">العقود ({filteredContracts.length})</TabsTrigger>
                  <TabsTrigger value="payments">الدفعات ({filteredPayments.length})</TabsTrigger>
                </TabsList>

                {/* تبويب العقود */}
                <TabsContent value="contracts">
                  <Card>
                    <CardHeader>
                      <CardTitle>قائمة العقود</CardTitle>
                      <CardDescription>عرض وإدارة جميع العقود في النظام</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>رقم العقد</TableHead>
                              <TableHead>اسم العقد</TableHead>
                              <TableHead className="hidden md:table-cell">تاريخ البداية</TableHead>
                              <TableHead className="hidden md:table-cell">تاريخ النهاية</TableHead>
                              <TableHead>قيمة الإيجار</TableHead>
                              <TableHead>الحالة</TableHead>
                              <TableHead>الإجراءات</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredContracts.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                  لا توجد عقود لعرضها
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredContracts.map((contract) => (
                                <TableRow key={contract.id}>
                                  <TableCell className="font-medium">{contract.contractNumber}</TableCell>
                                  <TableCell>{contract.contractName}</TableCell>
                                  <TableCell className="hidden md:table-cell">{contract.startDate}</TableCell>
                                  <TableCell className="hidden md:table-cell">{contract.endDate}</TableCell>
                                  <TableCell>{formatCurrency(contract.totalRentValue)}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(contract.contractStatus)}>
                                      {contract.contractStatus}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteContract(contract.id)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* تبويب الدفعات */}
                <TabsContent value="payments">
                  <Card>
                    <CardHeader>
                      <CardTitle>قائمة الدفعات</CardTitle>
                      <CardDescription>عرض وإدارة جميع الدفعات في النظام</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>العقد</TableHead>
                              <TableHead>النوع</TableHead>
                              <TableHead>المبلغ</TableHead>
                              <TableHead className="hidden md:table-cell">تاريخ الاستحقاق</TableHead>
                              <TableHead className="hidden md:table-cell">تاريخ الدفع</TableHead>
                              <TableHead>الحالة</TableHead>
                              <TableHead>الإجراءات</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredPayments.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                  لا توجد دفعات لعرضها
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                  <TableCell className="max-w-[200px] truncate">{payment.contractName}</TableCell>
                                  <TableCell>{payment.type}</TableCell>
                                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                  <TableCell className="hidden md:table-cell">{payment.dueDate}</TableCell>
                                  <TableCell className="hidden md:table-cell">{payment.paymentDate || "-"}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeletePayment(payment.id)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
