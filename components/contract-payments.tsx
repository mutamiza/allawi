"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  CalendarIcon,
  CreditCard,
  Building,
  FileText,
  DollarSign,
  X,
  Save,
} from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

interface Payment {
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

interface ContractFinancials {
  totalRentValue: number
  facilitiesServiceFees: number
  signageFees: number
  rentPaid: number
  facilitiesPaid: number
  signagePaid: number
}

interface ContractPaymentsProps {
  contractId: string
  contractFinancials: ContractFinancials
}

export function ContractPayments({ contractId, contractFinancials }: ContractPaymentsProps) {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "PAY001",
      contractId: contractId,
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
      contractId: contractId,
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
      contractId: contractId,
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
      contractId: contractId,
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
  ])

  const [showAddPayment, setShowAddPayment] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // حساب الإحصائيات
  const paidPayments = payments.filter((p) => p.status === "paid")
  const rentPayments = paidPayments.filter((p) => p.type === "rent")
  const facilitiesPayments = paidPayments.filter((p) => p.type === "facilities")
  const signagePayments = paidPayments.filter((p) => p.type === "signage")

  const totalRentPaid = rentPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalFacilitiesPaid = facilitiesPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalSignagePaid = signagePayments.reduce((sum, p) => sum + p.amount, 0)

  const rentProgress = (totalRentPaid / contractFinancials.totalRentValue) * 100
  const rentRemaining = contractFinancials.totalRentValue - totalRentPaid

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case "rent":
        return "دفعة إيجار"
      case "facilities":
        return "رسوم خدمات المرافق"
      case "signage":
        return "رسوم لوحات"
      default:
        return type
    }
  }

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case "rent":
        return <Building className="w-4 h-4 text-blue-600" />
      case "facilities":
        return <CreditCard className="w-4 h-4 text-green-600" />
      case "signage":
        return <FileText className="w-4 h-4 text-orange-600" />
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">مدفوع</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">معلق</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">متأخر</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const typeMatch = filterType === "all" || payment.type === filterType
    const statusMatch = filterStatus === "all" || payment.status === filterStatus
    return typeMatch && statusMatch
  })

  const deletePayment = (paymentId: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الدفعة؟")) {
      setPayments(payments.filter((p) => p.id !== paymentId))
    }
  }

  return (
    <div className="space-y-6">
      {/* ملخص الدفعات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              دفعات الإيجار
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">المدفوع</span>
                <span className="font-bold text-blue-600">{totalRentPaid.toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">المتبقي</span>
                <span className="font-bold text-gray-900">{rentRemaining.toLocaleString()} ر.س</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>نسبة السداد</span>
                  <span>{rentProgress.toFixed(1)}%</span>
                </div>
                <Progress value={rentProgress} className="h-2" />
              </div>
              <div className="text-xs text-gray-500">
                من إجمالي {contractFinancials.totalRentValue.toLocaleString()} ر.س
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              رسوم خدمات المرافق
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalFacilitiesPaid.toLocaleString()} ر.س</div>
                <div className="text-sm text-gray-600">إجمالي المدفوع</div>
              </div>
              <div className="text-xs text-gray-500 text-center">{facilitiesPayments.length} دفعة مسجلة</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              رسوم اللوحات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totalSignagePaid.toLocaleString()} ر.س</div>
                <div className="text-sm text-gray-600">إجمالي المدفوع</div>
              </div>
              <div className="text-xs text-gray-500 text-center">{signagePayments.length} دفعة مسجلة</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول الدفعات */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>سجل الدفعات</CardTitle>
            <Button onClick={() => setShowAddPayment(true)}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة دفعة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* فلاتر */}
          <div className="flex gap-4 mb-6">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="نوع الدفعة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="rent">دفعة إيجار</SelectItem>
                <SelectItem value="facilities">رسوم خدمات المرافق</SelectItem>
                <SelectItem value="signage">رسوم لوحات</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="حالة الدفعة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="paid">مدفوع</SelectItem>
                <SelectItem value="pending">معلق</SelectItem>
                <SelectItem value="overdue">متأخر</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* الجدول */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نوع الدفعة</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">تاريخ الدفع</TableHead>
                  <TableHead className="text-right">تاريخ الاستحقاق</TableHead>
                  <TableHead className="text-right">طريقة الدفع</TableHead>
                  <TableHead className="text-right">رقم الإيصال</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentTypeIcon(payment.type)}
                        <span>{getPaymentTypeLabel(payment.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{payment.amount.toLocaleString()} ر.س</TableCell>
                    <TableCell>{payment.paymentDate || "غير محدد"}</TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell>{payment.paymentMethod || "غير محدد"}</TableCell>
                    <TableCell className="font-mono">{payment.receiptNumber || "غير محدد"}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingPayment(payment)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePayment(payment.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* نموذج إضافة/تعديل دفعة */}
      {(showAddPayment || editingPayment) && (
        <PaymentForm
          payment={editingPayment}
          contractId={contractId}
          onSave={(payment) => {
            if (editingPayment) {
              setPayments(payments.map((p) => (p.id === payment.id ? payment : p)))
            } else {
              setPayments([...payments, { ...payment, id: `PAY${Date.now()}` }])
            }
            setShowAddPayment(false)
            setEditingPayment(null)
          }}
          onCancel={() => {
            setShowAddPayment(false)
            setEditingPayment(null)
          }}
        />
      )}
    </div>
  )
}

interface PaymentFormProps {
  payment?: Payment | null
  contractId: string
  onSave: (payment: Payment) => void
  onCancel: () => void
}

function PaymentForm({ payment, contractId, onSave, onCancel }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    type: payment?.type || "rent",
    amount: payment?.amount || 0,
    paymentDate: payment?.paymentDate ? new Date(payment.paymentDate) : new Date(),
    dueDate: payment?.dueDate ? new Date(payment.dueDate) : new Date(),
    status: payment?.status || "pending",
    paymentMethod: payment?.paymentMethod || "",
    receiptNumber: payment?.receiptNumber || "",
    notes: payment?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const paymentData: Payment = {
      id: payment?.id || "",
      contractId,
      type: formData.type as "rent" | "facilities" | "signage",
      amount: formData.amount,
      paymentDate: formData.status === "paid" ? format(formData.paymentDate, "yyyy-MM-dd") : "",
      dueDate: format(formData.dueDate, "yyyy-MM-dd"),
      status: formData.status as "paid" | "pending" | "overdue",
      paymentMethod: formData.paymentMethod,
      receiptNumber: formData.receiptNumber,
      notes: formData.notes,
      createdBy: payment?.createdBy || "المستخدم الحالي",
      createdAt: payment?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSave(paymentData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>{payment ? "تعديل الدفعة" : "إضافة دفعة جديدة"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* نوع الدفعة */}
              <div className="space-y-2">
                <Label>نوع الدفعة *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">دفعة إيجار</SelectItem>
                    <SelectItem value="facilities">رسوم خدمات المرافق</SelectItem>
                    <SelectItem value="signage">رسوم لوحات</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* المبلغ */}
              <div className="space-y-2">
                <Label>المبلغ (ر.س) *</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  required
                />
              </div>

              {/* التواريخ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>تاريخ الاستحقاق *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.dueDate, "PPP", { locale: ar })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dueDate}
                        onSelect={(date) => date && setFormData({ ...formData, dueDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {formData.status === "paid" && (
                  <div className="space-y-2">
                    <Label>تاريخ الدفع</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.paymentDate, "PPP", { locale: ar })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.paymentDate}
                          onSelect={(date) => date && setFormData({ ...formData, paymentDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              {/* حالة الدفعة */}
              <div className="space-y-2">
                <Label>حالة الدفعة *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">مدفوع</SelectItem>
                    <SelectItem value="pending">معلق</SelectItem>
                    <SelectItem value="overdue">متأخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* تفاصيل الدفع (للدفعات المدفوعة) */}
              {formData.status === "paid" && (
                <>
                  <div className="space-y-2">
                    <Label>طريقة الدفع</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر طريقة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                        <SelectItem value="شيك">شيك</SelectItem>
                        <SelectItem value="نقد">نقد</SelectItem>
                        <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>رقم الإيصال</Label>
                    <Input
                      value={formData.receiptNumber}
                      onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                      placeholder="REC-2024-001"
                    />
                  </div>
                </>
              )}

              {/* ملاحظات */}
              <div className="space-y-2">
                <Label>ملاحظات</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="أدخل أي ملاحظات إضافية..."
                  rows={3}
                />
              </div>

              {/* أزرار الحفظ */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                  إلغاء
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {payment ? "تحديث الدفعة" : "حفظ الدفعة"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
