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

interface AddContractModalProps {
  onAddContract: (contract: any) => void
}

export function AddContractModal({ onAddContract }: AddContractModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    contractName: "",
    contractNumber: "",
    startDate: "",
    endDate: "",
    totalRentValue: "",
    facilitiesServiceFees: "",
    signageFees: "",
    rentPaymentPeriod: "شهري",
    contractStatus: "نشط",
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
      totalRentValue: Number.parseFloat(formData.totalRentValue) || 0,
      facilitiesServiceFees: Number.parseFloat(formData.facilitiesServiceFees) || 0,
      signageFees: Number.parseFloat(formData.signageFees) || 0,
    }

    onAddContract(numericFormData)
    setOpen(false)

    // إعادة تعيين النموذج
    setFormData({
      contractName: "",
      contractNumber: "",
      startDate: "",
      endDate: "",
      totalRentValue: "",
      facilitiesServiceFees: "",
      signageFees: "",
      rentPaymentPeriod: "شهري",
      contractStatus: "نشط",
      notes: "",
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إضافة عقد جديد</DialogTitle>
          <DialogDescription>أدخل بيانات العقد الجديد. اضغط حفظ عند الانتهاء.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractName">اسم العقد</Label>
                <Input
                  id="contractName"
                  name="contractName"
                  value={formData.contractName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractNumber">رقم العقد</Label>
                <Input
                  id="contractNumber"
                  name="contractNumber"
                  value={formData.contractNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">تاريخ البداية</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">تاريخ النهاية</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalRentValue">قيمة الإيجار الكلية</Label>
                <Input
                  id="totalRentValue"
                  name="totalRentValue"
                  type="number"
                  value={formData.totalRentValue}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilitiesServiceFees">رسوم الخدمات</Label>
                <Input
                  id="facilitiesServiceFees"
                  name="facilitiesServiceFees"
                  type="number"
                  value={formData.facilitiesServiceFees}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signageFees">رسوم اللافتات</Label>
                <Input
                  id="signageFees"
                  name="signageFees"
                  type="number"
                  value={formData.signageFees}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentPaymentPeriod">فترة الدفع</Label>
                <Select
                  value={formData.rentPaymentPeriod}
                  onValueChange={(value) => handleSelectChange("rentPaymentPeriod", value)}
                >
                  <SelectTrigger id="rentPaymentPeriod">
                    <SelectValue placeholder="اختر فترة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="شهري">شهري</SelectItem>
                    <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                    <SelectItem value="نصف سنوي">نصف سنوي</SelectItem>
                    <SelectItem value="سنوي">سنوي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractStatus">حالة العقد</Label>
                <Select
                  value={formData.contractStatus}
                  onValueChange={(value) => handleSelectChange("contractStatus", value)}
                >
                  <SelectTrigger id="contractStatus">
                    <SelectValue placeholder="اختر حالة العقد" />
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

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
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
