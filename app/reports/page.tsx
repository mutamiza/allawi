"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, TrendingUp, DollarSign, Building, Clock, Filter, Search } from "lucide-react"
import { useDatabase } from "@/hooks/use-database"

export default function ReportsPage() {
  const { contracts, payments, users, dashboardStats, loading } = useDatabase()

  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  })

  const [filters, setFilters] = useState({
    contractStatus: "all",
    paymentStatus: "all",
    searchTerm: "",
  })

  // حساب الإحصائيات المتقدمة
  const calculateAdvancedStats = () => {
    const filteredContracts = contracts.filter((contract) => {
      const matchesStatus = filters.contractStatus === "all" || contract.contractStatus === filters.contractStatus
      const matchesSearch =
        !filters.searchTerm ||
        contract.contractName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        contract.contractNumber.toLowerCase().includes(filters.searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })

    const filteredPayments = payments.filter((payment) => {
      const matchesStatus = filters.paymentStatus === "all" || payment.status === filters.paymentStatus
      const paymentDate = new Date(payment.dueDate)
      const fromDate = new Date(dateRange.from)
      const toDate = new Date(dateRange.to)
      const inDateRange = paymentDate >= fromDate && paymentDate <= toDate
      return matchesStatus && inDateRange
    })

    return {
      totalRevenue: filteredPayments.filter((p) => p.status === "paid").reduce((sum, p) => sum + (p.amount || 0), 0),
      pendingRevenue: filteredPayments
        .filter((p) => p.status === "pending")
        .reduce((sum, p) => sum + (p.amount || 0), 0),
      overdueRevenue: filteredPayments
        .filter((p) => p.status === "overdue")
        .reduce((sum, p) => sum + (p.amount || 0), 0),
      contractsCount: filteredContracts.length,
      paymentsCount: filteredPayments.length,
      averageContractValue:
        filteredContracts.length > 0
          ? filteredContracts.reduce((sum, c) => sum + (c.totalRentValue || 0), 0) / filteredContracts.length
          : 0,
    }
  }

  const stats = calculateAdvancedStats()

  const generatePDFReport = () => {
    // هنا يمكن إضافة مكتبة PDF لإنشاء التقرير
    alert("سيتم إضافة ميزة تصدير PDF قريباً")
  }

  const generateExcelReport = () => {
    // تصدير البيانات كـ CSV
    const csvData = [
      ["اسم العقد", "رقم العقد", "تاريخ البداية", "تاريخ النهاية", "القيمة الإجمالية", "الحالة"],
      ...contracts.map((contract) => [
        contract.contractName,
        contract.contractNumber,
        contract.startDate,
        contract.endDate,
        contract.totalRentValue,
        contract.contractStatus,
      ]),
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `contracts-report-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">التقارير والإحصائيات</h1>
            <p className="text-gray-600">تقارير مفصلة وإحصائيات شاملة</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={generatePDFReport} variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير PDF
          </Button>
          <Button onClick={generateExcelReport}>
            <Download className="w-4 h-4 ml-2" />
            تصدير Excel
          </Button>
        </div>
      </div>

      {/* فلاتر التقرير */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            فلاتر التقرير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="date-from">من تاريخ</Label>
              <Input
                id="date-from"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="date-to">إلى تاريخ</Label>
              <Input
                id="date-to"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="contract-status">حالة العقد</Label>
              <select
                id="contract-status"
                className="w-full p-2 border rounded-md"
                value={filters.contractStatus}
                onChange={(e) => setFilters((prev) => ({ ...prev, contractStatus: e.target.value }))}
              >
                <option value="all">جميع الحالات</option>
                <option value="نشط">نشط</option>
                <option value="منتهي">منتهي</option>
                <option value="معلق">معلق</option>
              </select>
            </div>

            <div>
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="ابحث في العقود..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} ر.س</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الإيرادات المعلقة</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingRevenue.toLocaleString()} ر.س</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">عدد العقود</p>
                <p className="text-2xl font-bold text-blue-600">{stats.contractsCount}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط قيمة العقد</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageContractValue.toLocaleString()} ر.س</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">التقرير المالي</TabsTrigger>
          <TabsTrigger value="contracts">تقرير العقود</TabsTrigger>
          <TabsTrigger value="payments">تقرير الدفعات</TabsTrigger>
          <TabsTrigger value="performance">تقرير الأداء</TabsTrigger>
        </TabsList>

        {/* التقرير المالي */}
        <TabsContent value="financial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع الإيرادات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>الإيرادات المحصلة</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="font-medium">{stats.totalRevenue.toLocaleString()} ر.س</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>الإيرادات المعلقة</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="font-medium">{stats.pendingRevenue.toLocaleString()} ر.س</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>الإيرادات المتأخرة</span>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="font-medium">{stats.overdueRevenue.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الأداء الشهري</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">سيتم إضافة الرسوم البيانية قريباً</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* تقرير العقود */}
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل العقود</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">اسم العقد</th>
                      <th className="text-right p-2">رقم العقد</th>
                      <th className="text-right p-2">تاريخ البداية</th>
                      <th className="text-right p-2">تاريخ النهاية</th>
                      <th className="text-right p-2">القيمة</th>
                      <th className="text-right p-2">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.slice(0, 10).map((contract) => (
                      <tr key={contract.id} className="border-b">
                        <td className="p-2">{contract.contractName}</td>
                        <td className="p-2">{contract.contractNumber}</td>
                        <td className="p-2">{contract.startDate}</td>
                        <td className="p-2">{contract.endDate}</td>
                        <td className="p-2">{contract.totalRentValue?.toLocaleString()} ر.س</td>
                        <td className="p-2">
                          <Badge variant={contract.contractStatus === "نشط" ? "default" : "secondary"}>
                            {contract.contractStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تقرير الدفعات */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل الدفعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-2">العقد</th>
                      <th className="text-right p-2">المبلغ</th>
                      <th className="text-right p-2">تاريخ الاستحقاق</th>
                      <th className="text-right p-2">الحالة</th>
                      <th className="text-right p-2">النوع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(0, 10).map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="p-2">{payment.contractName || "غير محدد"}</td>
                        <td className="p-2">{payment.amount?.toLocaleString()} ر.س</td>
                        <td className="p-2">{payment.dueDate}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              payment.status === "paid"
                                ? "default"
                                : payment.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {payment.status === "paid" ? "مدفوع" : payment.status === "pending" ? "معلق" : "متأخر"}
                          </Badge>
                        </td>
                        <td className="p-2">{payment.type || "إيجار"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تقرير الأداء */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>مؤشرات الأداء الرئيسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>معدل التحصيل</span>
                  <span className="font-bold text-green-600">
                    {payments.length > 0
                      ? Math.round((payments.filter((p) => p.status === "paid").length / payments.length) * 100)
                      : 0}
                    %
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>معدل التأخير</span>
                  <span className="font-bold text-red-600">
                    {payments.length > 0
                      ? Math.round((payments.filter((p) => p.status === "overdue").length / payments.length) * 100)
                      : 0}
                    %
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>متوسط مدة العقد</span>
                  <span className="font-bold text-blue-600">12 شهر</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>التوقعات المستقبلية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">سيتم إضافة التوقعات قريباً</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
