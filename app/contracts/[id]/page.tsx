"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Calendar,
  FileText,
  Printer,
  Edit,
  Trash2,
  Download,
  Eye,
  Clock,
  Building,
  CreditCard,
  AlertCircle,
  BarChart3,
} from "lucide-react"
import { ContractPayments } from "@/components/contract-payments"

// نموذج لبيانات العقد
interface ContractDetails {
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
  createdAt: string
  updatedAt: string
  notes: string
  documents: {
    id: string
    name: string
    size: number
    uploadDate: string
    type: string
  }[]
  history: {
    id: string
    action: string
    date: string
    user: string
    details: string
  }[]
}

export default function ContractDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("details")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // بيانات وهمية للعقد - في التطبيق الحقيقي ستأتي من قاعدة البيانات
  const contract: ContractDetails = {
    id: params.id,
    contractName: "عقد إيجار مجمع الرياض التجاري",
    contractNumber: "RC-2024-001",
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    totalRentValue: 500000,
    facilitiesServiceFees: 25000,
    signageFees: 15000,
    rentPaymentPeriod: "ربع سنوي",
    contractStatus: "نشط",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
    notes: "هذا العقد يشمل إيجار المحلات التجارية في الطابق الأرضي والأول من المجمع التجاري الواقع في شمال الرياض.",
    documents: [
      {
        id: "doc1",
        name: "العقد الأساسي.pdf",
        size: 2500000,
        uploadDate: "2024-01-10",
        type: "contract",
      },
      {
        id: "doc2",
        name: "ملحق الشروط والأحكام.pdf",
        size: 1200000,
        uploadDate: "2024-01-10",
        type: "attachment",
      },
      {
        id: "doc3",
        name: "إيصال الدفعة الأولى.pdf",
        size: 800000,
        uploadDate: "2024-01-15",
        type: "payment",
      },
    ],
    history: [
      {
        id: "h1",
        action: "إنشاء العقد",
        date: "2024-01-10",
        user: "أحمد محمد",
        details: "تم إنشاء العقد",
      },
      {
        id: "h2",
        action: "تعديل العقد",
        date: "2024-01-12",
        user: "فاطمة علي",
        details: "تم تعديل قيمة رسوم الخدمات",
      },
      {
        id: "h3",
        action: "إضافة مستند",
        date: "2024-01-15",
        user: "أحمد محمد",
        details: "تم إضافة إيصال الدفعة الأولى",
      },
    ],
  }

  // بيانات الدفعات المحسوبة (ستأتي من قاعدة البيانات)
  const contractFinancials = {
    totalRentValue: contract.totalRentValue,
    facilitiesServiceFees: contract.facilitiesServiceFees,
    signageFees: contract.signageFees,
    rentPaid: 125000, // سيتم حسابها من الدفعات الفعلية
    facilitiesPaid: 12500, // سيتم حسابها من الدفعات الفعلية
    signagePaid: 7500, // سيتم حسابها من الدفعات الفعلية
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "نشط":
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>
      case "قيد المراجعة":
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>
      case "منتهي":
        return <Badge className="bg-gray-100 text-gray-800">منتهي</Badge>
      case "معلق":
        return <Badge className="bg-orange-100 text-orange-800">معلق</Badge>
      case "ملغي":
        return <Badge className="bg-red-100 text-red-800">ملغي</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "contract":
        return <FileText className="w-5 h-5 text-blue-600" />
      case "payment":
        return <CreditCard className="w-5 h-5 text-green-600" />
      case "attachment":
        return <FileText className="w-5 h-5 text-orange-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case "contract":
        return "عقد"
      case "payment":
        return "دفعة"
      case "attachment":
        return "ملحق"
      default:
        return "مستند"
    }
  }

  const calculateDaysRemaining = () => {
    const endDate = new Date(contract.endDate)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = calculateDaysRemaining()

  // حساب نسب السداد
  const rentProgress = (contractFinancials.rentPaid / contractFinancials.totalRentValue) * 100
  const rentRemaining = contractFinancials.totalRentValue - contractFinancials.rentPaid

  return (
    <div className="container mx-auto p-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{contract.contractName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="font-mono">
                {contract.contractNumber}
              </Badge>
              {getStatusBadge(contract.contractStatus)}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 ml-2" />
            طباعة
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 ml-2" />
            تعديل
          </Button>
          <Button variant="outline" size="sm" className="text-red-600" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="w-4 h-4 ml-2" />
            حذف
          </Button>
        </div>
      </div>

      {/* التبويبات */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="details">تفاصيل العقد</TabsTrigger>
          <TabsTrigger value="financial">البيانات المالية</TabsTrigger>
          <TabsTrigger value="payments">الدفعات</TabsTrigger>
          <TabsTrigger value="documents">المستندات</TabsTrigger>
          <TabsTrigger value="history">سجل التعديلات</TabsTrigger>
          <TabsTrigger value="notes">ملاحظات</TabsTrigger>
        </TabsList>

        {/* تفاصيل العقد */}
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  معلومات العقد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">اسم العقد</span>
                    <span className="text-sm font-medium">{contract.contractName}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">رقم العقد</span>
                    <span className="text-sm font-medium font-mono">{contract.contractNumber}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">حالة العقد</span>
                    <span>{getStatusBadge(contract.contractStatus)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  المدة الزمنية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">بداية سريان العقد</span>
                    <span className="text-sm font-medium">{contract.startDate}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">تاريخ نهاية العقد</span>
                    <span className="text-sm font-medium">{contract.endDate}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">المدة المتبقية</span>
                    <Badge
                      className={`${
                        daysRemaining > 30
                          ? "bg-green-100 text-green-800"
                          : daysRemaining > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {daysRemaining > 0 ? `${daysRemaining} يوم` : "منتهي"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  معلومات السداد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">فترة السداد</span>
                    <span className="text-sm font-medium">{contract.rentPaymentPeriod}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">تاريخ الإنشاء</span>
                    <span className="text-sm font-medium">{contract.createdAt}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">آخر تحديث</span>
                    <span className="text-sm font-medium">{contract.updatedAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                ملخص العقد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{contract.notes}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* البيانات المالية */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  الإيجار
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">القيمة الإجمالية</span>
                  <span className="font-bold">{contractFinancials.totalRentValue.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">المدفوع</span>
                  <span className="font-bold text-green-600">{contractFinancials.rentPaid.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">المتبقي</span>
                  <span className="font-bold text-orange-600">{rentRemaining.toLocaleString()} ر.س</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>نسبة السداد</span>
                    <span>{rentProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={rentProgress} className="h-2" />
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
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {contractFinancials.facilitiesPaid.toLocaleString()} ر.س
                  </div>
                  <div className="text-sm text-gray-600">إجمالي المدفوع</div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  القيمة الأساسية: {contractFinancials.facilitiesServiceFees.toLocaleString()} ر.س
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
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {contractFinancials.signagePaid.toLocaleString()} ر.س
                  </div>
                  <div className="text-sm text-gray-600">إجمالي المدفوع</div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  القيمة الأساسية: {contractFinancials.signageFees.toLocaleString()} ر.س
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                ملخص مالي شامل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">القيم الأساسية</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">إجمالي الإيجار</span>
                        <span className="font-medium">{contractFinancials.totalRentValue.toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">رسوم الخدمات</span>
                        <span className="font-medium">
                          {contractFinancials.facilitiesServiceFees.toLocaleString()} ر.س
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">رسوم اللوحات</span>
                        <span className="font-medium">{contractFinancials.signageFees.toLocaleString()} ر.س</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">المدفوعات الفعلية</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">إيجار مدفوع</span>
                        <span className="font-medium text-green-600">
                          {contractFinancials.rentPaid.toLocaleString()} ر.س
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">خدمات مدفوعة</span>
                        <span className="font-medium text-green-600">
                          {contractFinancials.facilitiesPaid.toLocaleString()} ر.س
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">لوحات مدفوعة</span>
                        <span className="font-medium text-green-600">
                          {contractFinancials.signagePaid.toLocaleString()} ر.س
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    إجمالي المدفوع:{" "}
                    {(
                      contractFinancials.rentPaid +
                      contractFinancials.facilitiesPaid +
                      contractFinancials.signagePaid
                    ).toLocaleString()}{" "}
                    ر.س
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الدفعات */}
        <TabsContent value="payments" className="space-y-4">
          <ContractPayments contractId={contract.id} contractFinancials={contractFinancials} />
        </TabsContent>

        {/* المستندات */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  المستندات والملفات
                </CardTitle>
                <Button size="sm">
                  <FileText className="w-4 h-4 ml-2" />
                  إضافة مستند
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contract.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center">
                        {getDocumentIcon(doc.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatFileSize(doc.size)}</span>
                          <span>•</span>
                          <span>{doc.uploadDate}</span>
                          <Badge variant="outline" className="text-xs">
                            {getDocumentTypeName(doc.type)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {contract.documents.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">لا توجد مستندات مرفقة لهذا العقد</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      إضافة مستند
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* سجل التعديلات */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                سجل التعديلات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contract.history.map((item, index) => (
                  <div key={item.id} className="relative">
                    {index !== contract.history.length - 1 && (
                      <div className="absolute top-6 bottom-0 right-4 w-0.5 bg-gray-200"></div>
                    )}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center z-10">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{item.action}</p>
                          <Badge variant="outline" className="text-xs">
                            {item.date}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                        <p className="text-xs text-gray-500 mt-1">بواسطة: {item.user}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {contract.history.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">لا يوجد سجل تعديلات لهذا العقد</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ملاحظات */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                ملاحظات العقد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{contract.notes || "لا توجد ملاحظات لهذا العقد"}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4">
                <Edit className="w-4 h-4 ml-2" />
                تعديل الملاحظات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* مربع تأكيد الحذف */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                تأكيد حذف العقد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                هل أنت متأكد من رغبتك في حذف العقد <span className="font-bold">{contract.contractName}</span>؟ هذا
                الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  إلغاء
                </Button>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 ml-2" />
                  تأكيد الحذف
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
