"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save, Loader2 } from "lucide-react"
import { useDatabase } from "@/hooks/use-database"

interface EditContractFormProps {
  contract: any
  onClose: () => void
}

export function EditContractForm({ contract, onClose }: EditContractFormProps) {
  const { updateContract } = useDatabase()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    contractName: contract.contractName || "",
    contractNumber: contract.contractNumber || "",
    startDate: contract.startDate || "",
    endDate: contract.endDate || "",
    totalRentValue: contract.totalRentValue || 0,
    facilitiesServiceFees: contract.facilitiesServiceFees || 0,
    signageFees: contract.signageFees || 0,
    rentPaymentPeriod: contract.rentPaymentPeriod || "شهري",
    contractStatus: contract.contractStatus || "نشط",
    notes: contract.notes || "",
  })

  const contractStatuses = ["نشط", "منتهي", "قيد التجديد", "معلق", "ملغي", "قيد المراجعة"]
  const paymentPeriods = ["شهري", "ربع سنوي", "نصف سنوي", "سنوي", "مقدماً"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateContract(contract.id, formData)
      console.log("تم تحديث العقد بنجاح")
      alert("تم تحديث العقد بنجاح!")
      onClose()
    } catch (error) {
      console.error("خطأ في تحديث العقد:", error)
      alert("حدث خطأ أثناء تحديث العقد")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>تعديل العقد</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* اسم العقد */}
            <div className="space-y-2">
              <Label htmlFor="contractName">اسم العقد</Label>
              <Input
                id="contractName"
                value={formData.contractName}
                onChange={(e) => handleInputChange("contractName", e.target.value)}
                placeholder="أدخل اسم العقد"
                required
              />
            </div>

            {/* رقم العقد */}
            <div className="space-y-2">
              <Label htmlFor="contractNumber">رقم العقد</Label>
              <Input
                id="contractNumber"
                value={formData.contractNumber}
                onChange={(e) => handleInputChange("contractNumber", e.target.value)}
                placeholder="أدخل رقم العقد"
                required
              />
            </div>

            {/* التواريخ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">تاريخ بداية السريان</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">تاريخ نهاية العقد</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* القيم المالية */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalRentValue">القيمة الإجمالية للإيجار</Label>
                <Input
                  id="totalRentValue"
                  type="number"
                  value={formData.totalRentValue}
                  onChange={(e) => handleInputChange("totalRentValue", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilitiesServiceFees">رسوم الخدمات</Label>
                <Input
                  id="facilitiesServiceFees"
                  type="number"
                  value={formData.facilitiesServiceFees}
                  onChange={(e) => handleInputChange("facilitiesServiceFees", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signageFees">رسوم اللوحات</Label>
                <Input
                  id="signageFees"
                  type="number"
                  value={formData.signageFees}
                  onChange={(e) => handleInputChange("signageFees", Number.parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* فترة السداد وحالة العقد */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentPaymentPeriod">فترة سداد الإيجار</Label>
                <Select
                  value={formData.rentPaymentPeriod}
                  onValueChange={(value) => handleInputChange("rentPaymentPeriod", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر فترة السداد" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentPeriods.map((period) => (
                      <SelectItem key={period} value={period}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractStatus">حالة العقد</Label>
                <Select
                  value={formData.contractStatus}
                  onValueChange={(value) => handleInputChange("contractStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حالة العقد" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* الملاحظات */}
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="أدخل أي ملاحظات إضافية..."
                rows={3}
              />
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
