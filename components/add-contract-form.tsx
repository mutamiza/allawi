"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Save, FileText, X, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { useDatabase } from "@/hooks/use-database"

export function AddContractForm({ onClose }: { onClose: () => void }) {
  const { addContract } = useDatabase()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    contractName: "",
    contractNumber: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    totalRentValue: "",
    facilitiesServiceFees: "",
    signageFees: "",
    rentPaymentPeriod: "",
    contractStatus: "",
    notes: "",
  })

  const contractStatuses = ["نشط", "منتهي", "قيد التجديد", "معلق", "ملغي", "قيد المراجعة"]
  const paymentPeriods = ["شهري", "ربع سنوي", "نصف سنوي", "سنوي", "مقدماً"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.contractName || !formData.contractNumber || !formData.startDate || !formData.endDate) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    setLoading(true)

    try {
      const result = await addContract({
        contractName: formData.contractName,
        contractNumber: formData.contractNumber,
        startDate: format(formData.startDate, "yyyy-MM-dd"),
        endDate: format(formData.endDate, "yyyy-MM-dd"),
        totalRentValue: Number.parseFloat(formData.totalRentValue) || 0,
        facilitiesServiceFees: Number.parseFloat(formData.facilitiesServiceFees) || 0,
        signageFees: Number.parseFloat(formData.signageFees) || 0,
        rentPaymentPeriod: formData.rentPaymentPeriod,
        contractStatus: formData.contractStatus,
        notes: formData.notes,
        createdBy: "المستخدم الحالي",
      })

      console.log("تم إضافة العقد بنجاح:", result)
      alert("تم حفظ العقد بنجاح!")
      onClose()
    } catch (error) {
      console.error("خطأ في إضافة العقد:", error)
      alert("حدث خطأ أثناء حفظ العقد")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">إضافة عقد جديد</CardTitle>
                  <p className="text-sm text-gray-600">املأ جميع البيانات المطلوبة لإنشاء العقد</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* بيانات العقد الأساسية */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">بيانات العقد الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractName">اسم العقد *</Label>
                    <Input
                      id="contractName"
                      value={formData.contractName}
                      onChange={(e) => setFormData({ ...formData, contractName: e.target.value })}
                      placeholder="أدخل اسم العقد"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractNumber">رقم العقد *</Label>
                    <Input
                      id="contractNumber"
                      value={formData.contractNumber}
                      onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                      placeholder="أدخل رقم العقد"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>بداية سريان العقد *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          type="button"
                          disabled={loading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate
                            ? format(formData.startDate, "PPP", { locale: ar })
                            : "اختر تاريخ البداية"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => setFormData({ ...formData, startDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>تاريخ نهاية العقد *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          type="button"
                          disabled={loading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "PPP", { locale: ar }) : "اختر تاريخ النهاية"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => setFormData({ ...formData, endDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* البيانات المالية */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">البيانات المالية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalRentValue">القيمة الإجمالية للإيجار (ر.س) *</Label>
                    <Input
                      id="totalRentValue"
                      type="number"
                      value={formData.totalRentValue}
                      onChange={(e) => setFormData({ ...formData, totalRentValue: e.target.value })}
                      placeholder="0"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilitiesServiceFees">رسوم الخدمات للمرافق (ر.س)</Label>
                    <Input
                      id="facilitiesServiceFees"
                      type="number"
                      value={formData.facilitiesServiceFees}
                      onChange={(e) => setFormData({ ...formData, facilitiesServiceFees: e.target.value })}
                      placeholder="0"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signageFees">رسوم اللوحات (ر.س)</Label>
                    <Input
                      id="signageFees"
                      type="number"
                      value={formData.signageFees}
                      onChange={(e) => setFormData({ ...formData, signageFees: e.target.value })}
                      placeholder="0"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rentPaymentPeriod">الفترة المستحقة لسداد الإيجار *</Label>
                    <Select
                      value={formData.rentPaymentPeriod}
                      onValueChange={(value) => setFormData({ ...formData, rentPaymentPeriod: value })}
                      disabled={loading}
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
                </div>
              </div>

              {/* حالة العقد */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">حالة العقد</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractStatus">حالة العقد *</Label>
                    <Select
                      value={formData.contractStatus}
                      onValueChange={(value) => setFormData({ ...formData, contractStatus: value })}
                      disabled={loading}
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
              </div>

              {/* ملاحظات */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">ملاحظات</h3>
                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات العقد</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="أدخل أي ملاحظات إضافية حول العقد..."
                    rows={4}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* أزرار الحفظ */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  إلغاء
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      حفظ العقد
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
