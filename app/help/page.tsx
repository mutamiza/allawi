"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  Book,
  MessageCircle,
  Phone,
  Mail,
  Search,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  Users,
} from "lucide-react"

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium",
  })

  const faqs = [
    {
      id: 1,
      question: "كيف أضيف عقد جديد؟",
      answer:
        "لإضافة عقد جديد، اذهب إلى صفحة العقود واضغط على زر 'إضافة عقد جديد'. املأ جميع البيانات المطلوبة مثل اسم العقد، رقم العقد، تاريخ البداية والنهاية، والقيمة الإجمالية.",
      category: "العقود",
    },
    {
      id: 2,
      question: "كيف أتتبع الدفعات المستحقة؟",
      answer:
        "يمكنك تتبع الدفعات من خلال صفحة الدفعات أو لوحة التحكم. ستظهر لك التنبيهات للدفعات المستحقة والمتأخرة. يمكنك أيضاً تصفية الدفعات حسب الحالة والتاريخ.",
      category: "الدفعات",
    },
    {
      id: 3,
      question: "كيف أصدر تقرير مالي؟",
      answer:
        "اذهب إلى صفحة التقارير واختر 'التقرير المالي'. يمكنك تحديد الفترة الزمنية والفلاتر المطلوبة، ثم تصدير التقرير بصيغة PDF أو Excel.",
      category: "التقارير",
    },
    {
      id: 4,
      question: "كيف أغير كلمة المرور؟",
      answer:
        "اذهب إلى الإعدادات > الأمان، ثم اضغط على 'تغيير كلمة المرور'. أدخل كلمة المرور الحالية والجديدة، ثم احفظ التغييرات.",
      category: "الحساب",
    },
    {
      id: 5,
      question: "كيف أربط النظام بقاعدة بيانات خارجية؟",
      answer:
        "في صفحة الإعدادات > قاعدة البيانات، أدخل بيانات الاتصال (الخادم، اسم قاعدة البيانات، اسم المستخدم، كلمة المرور). اضغط على 'اختبار الاتصال' للتأكد من صحة البيانات.",
      category: "الإعدادات",
    },
  ]

  const tutorials = [
    {
      title: "البدء السريع",
      description: "تعلم أساسيات استخدام النظام في 5 دقائق",
      duration: "5 دقائق",
      type: "video",
      icon: Video,
    },
    {
      title: "إدارة العقود",
      description: "دليل شامل لإدارة العقود وتتبعها",
      duration: "10 دقائق",
      type: "guide",
      icon: FileText,
    },
    {
      title: "نظام الدفعات",
      description: "كيفية إدارة وتتبع الدفعات والمستحقات",
      duration: "8 دقائق",
      type: "guide",
      icon: FileText,
    },
    {
      title: "التقارير والإحصائيات",
      description: "إنشاء وتصدير التقارير المالية والإدارية",
      duration: "12 دقائق",
      type: "video",
      icon: Video,
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSupportSubmit = (e) => {
    e.preventDefault()
    alert("تم إرسال طلب الدعم بنجاح! سنتواصل معك قريباً.")
    setSupportForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      priority: "medium",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">المساعدة والدعم</h1>
          <p className="text-gray-600">احصل على المساعدة والإجابات التي تحتاجها</p>
        </div>
      </div>

      {/* شريط البحث */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-md mx-auto">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="ابحث في المساعدة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">الأسئلة الشائعة</TabsTrigger>
          <TabsTrigger value="tutorials">الدروس التعليمية</TabsTrigger>
          <TabsTrigger value="support">طلب الدعم</TabsTrigger>
          <TabsTrigger value="contact">التواصل</TabsTrigger>
        </TabsList>

        {/* الأسئلة الشائعة */}
        <TabsContent value="faq">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">الأسئلة الشائعة</h2>

            {filteredFaqs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-0">
                  <button
                    className="w-full p-4 text-right flex items-center justify-between hover:bg-gray-50"
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{faq.category}</Badge>
                      <span className="font-medium">{faq.question}</span>
                    </div>
                    {expandedFaq === faq.id ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  {expandedFaq === faq.id && (
                    <div className="p-4 pt-0 border-t bg-gray-50">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* الدروس التعليمية */}
        <TabsContent value="tutorials">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">الدروس التعليمية</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <tutorial.icon className="w-6 h-6 text-blue-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold">{tutorial.title}</h3>
                          <Badge variant={tutorial.type === "video" ? "default" : "secondary"}>
                            {tutorial.type === "video" ? "فيديو" : "دليل"}
                          </Badge>
                        </div>

                        <p className="text-gray-600 mb-3">{tutorial.description}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{tutorial.duration}</span>
                          <Button size="sm">{tutorial.type === "video" ? "مشاهدة" : "قراءة"}</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* طلب الدعم */}
        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                طلب الدعم الفني
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSupportSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="support-name">الاسم الكامل</Label>
                    <Input
                      id="support-name"
                      value={supportForm.name}
                      onChange={(e) => setSupportForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="support-email">البريد الإلكتروني</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={supportForm.email}
                      onChange={(e) => setSupportForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="support-subject">موضوع الطلب</Label>
                  <Input
                    id="support-subject"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm((prev) => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="support-priority">أولوية الطلب</Label>
                  <select
                    id="support-priority"
                    className="w-full p-2 border rounded-md"
                    value={supportForm.priority}
                    onChange={(e) => setSupportForm((prev) => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                    <option value="urgent">عاجلة</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="support-message">تفاصيل المشكلة</Label>
                  <Textarea
                    id="support-message"
                    rows={6}
                    placeholder="اشرح المشكلة بالتفصيل..."
                    value={supportForm.message}
                    onChange={(e) => setSupportForm((prev) => ({ ...prev, message: e.target.value }))}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <MessageCircle className="w-4 h-4 ml-2" />
                  إرسال طلب الدعم
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* معلومات التواصل */}
        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات التواصل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">الهاتف</h3>
                    <p className="text-gray-600">+966 11 123 4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">البريد الإلكتروني</h3>
                    <p className="text-gray-600">support@investment-contracts.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">الدردشة المباشرة</h3>
                    <p className="text-gray-600">متاح من 8 صباحاً إلى 6 مساءً</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ساعات العمل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>الأحد - الخميس</span>
                  <span className="font-medium">8:00 ص - 6:00 م</span>
                </div>

                <div className="flex justify-between">
                  <span>الجمعة</span>
                  <span className="font-medium">مغلق</span>
                </div>

                <div className="flex justify-between">
                  <span>السبت</span>
                  <span className="font-medium">10:00 ص - 2:00 م</span>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">الدعم الطارئ</h4>
                  <p className="text-sm text-blue-700">
                    للمشاكل العاجلة خارج ساعات العمل، يرجى إرسال بريد إلكتروني مع تحديد "عاجل" في الموضوع
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* روابط سريعة */}
      <Card>
        <CardHeader>
          <CardTitle>روابط مفيدة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Book className="w-6 h-6" />
              <span>دليل المستخدم</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Video className="w-6 h-6" />
              <span>فيديوهات تعليمية</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="w-6 h-6" />
              <span>منتدى المجتمع</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="w-6 h-6" />
              <span>ملاحظات الإصدار</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
