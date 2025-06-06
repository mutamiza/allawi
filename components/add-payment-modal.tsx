"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle } from "lucide-react"
import type { Contract } from "./contracts-table"

interface AddPaymentModalProps {
  contracts: Contract[]
  onAddPayment: (payment: any) => void
}

export function AddPaymentModal({ contracts, onAddPayment }: AddPaymentModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    contractId: "",
    type: "rent",
    amount: "",
    paymentDate: "",
    dueDate: "",
    status: "pending",
    paymentMethod: "",
    receiptNumber: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // تحويل القيم المالية إلى أرقام
    const numericFormData = {
      ...formData,
      amount: Number.parseFloat(formData.amount) || 0,
    }

    // إضافة اسم العقد للعرض في الجدول
    const selectedContract = contracts.find((c) => c.id === formData.contractId)
    const paymentWithContractName = {
      ...numericFormData,
      contractName: selectedContract?.contractName || "غير معروف",
    }

    onAddPayment(paymentWithContractName)
    setOpen(false)

    // إعادة تعيين النموذج
    setFormData({
      contractId: "",
      type: "rent",
      amount: "",
      paymentDate: "",
      dueDate: "",
      status: "pending",
      paymentMethod: "",
      receiptNumber: "",
      notes: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          إضافة دفعة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إضافة دفعة جديدة</DialogTitle>
          <DialogDescription>أدخل بيانات الدفعة الجديدة. اضغط حفظ عند الانتهاء.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contractId">العقد</Label>
              <Select
                value={formData.contractId}
                onValueChange={(value) => handleSelectChange("contractId", value)}
                required
              >
                <SelectTrigger id="contractId">
                  <SelectValue placeholder="اختر العقد" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id}>
                      {contract.contractName} ({contract.contractNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">نوع الدفعة</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="اختر نوع الدفعة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">إيجار</SelectItem>
                    <SelectItem value="facilities">مرافق</SelectItem>
                    <SelectItem value="signage">لافتات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">المبلغ</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentDate">تاريخ الدفع (اختياري)</Label>
                <Input
                  id="paymentDate"
                  name="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">حالة الدفعة</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="اختر حالة الدفعة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">مدفوع</SelectItem>
                    <SelectItem value="pending">معلق</SelectItem>
                    <SelectItem value="overdue">متأخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">طريقة الدفع (اختياري)</Label>
                <Input id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiptNumber">رقم الإيصال (اختياري)</Label>
              <Input id="receiptNumber" name="receiptNumber" value={formData.receiptNumber} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات (اختياري)</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={2} />
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
