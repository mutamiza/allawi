// بيانات تجريبية للمحاكاة
export const mockDatabase = {
  contracts: [
    {
      id: "C001",
      contractNumber: "CONT-2023-001",
      contractName: "عقد إيجار مبنى تجاري",
      contractType: "إيجار",
      contractStatus: "نشط",
      startDate: "2023-01-01",
      endDate: "2025-12-31",
      totalRentValue: 500000,
      facilitiesServiceFees: 50000,
      signageFees: 15000,
      rentPaymentPeriod: "ربع سنوي",
      createdAt: "2022-12-15",
      updatedAt: "2022-12-15",
    },
    {
      id: "C002",
      contractNumber: "CONT-2023-002",
      contractName: "عقد إيجار مكتب إداري",
      contractType: "إيجار",
      contractStatus: "نشط",
      startDate: "2023-02-01",
      endDate: "2024-01-31",
      totalRentValue: 120000,
      facilitiesServiceFees: 12000,
      signageFees: 5000,
      rentPaymentPeriod: "سنوي",
      createdAt: "2023-01-15",
      updatedAt: "2023-01-15",
    },
    {
      id: "C003",
      contractNumber: "CONT-2023-003",
      contractName: "عقد إيجار مستودع",
      contractType: "إيجار",
      contractStatus: "منتهي",
      startDate: "2022-06-01",
      endDate: "2023-05-31",
      totalRentValue: 80000,
      facilitiesServiceFees: 8000,
      signageFees: 0,
      rentPaymentPeriod: "سنوي",
      createdAt: "2022-05-20",
      updatedAt: "2023-06-01",
    },
  ],
  users: [
    {
      id: "U001",
      name: "أحمد محمد",
      email: "ahmed@example.com",
      role: "مدير",
      department: "إدارة العقود",
      status: "نشط",
      createdAt: "2022-01-01",
      updatedAt: "2022-01-01",
    },
    {
      id: "U002",
      name: "فاطمة علي",
      email: "fatima@example.com",
      role: "محاسب",
      department: "المالية",
      status: "نشط",
      createdAt: "2022-02-15",
      updatedAt: "2022-02-15",
    },
    {
      id: "U003",
      name: "محمد عبدالله",
      email: "mohammed@example.com",
      role: "مسؤول عقود",
      department: "إدارة العقود",
      status: "نشط",
      createdAt: "2022-03-10",
      updatedAt: "2022-03-10",
    },
  ],
  payments: [
    {
      id: "P001",
      contractId: "C001",
      type: "rent",
      amount: 125000,
      paymentDate: "2023-01-15",
      dueDate: "2023-01-15",
      status: "paid",
      paymentMethod: "تحويل بنكي",
      receiptNumber: "REC-2023-001",
      notes: "دفعة الربع الأول",
      createdAt: "2023-01-15",
      updatedAt: "2023-01-15",
    },
    {
      id: "P002",
      contractId: "C001",
      type: "facilities",
      amount: 12500,
      paymentDate: "2023-01-20",
      dueDate: "2023-01-20",
      status: "paid",
      paymentMethod: "شيك",
      receiptNumber: "REC-2023-002",
      notes: "رسوم خدمات الربع الأول",
      createdAt: "2023-01-20",
      updatedAt: "2023-01-20",
    },
    {
      id: "P003",
      contractId: "C001",
      type: "rent",
      amount: 125000,
      paymentDate: "2023-04-15",
      dueDate: "2023-04-15",
      status: "paid",
      paymentMethod: "تحويل بنكي",
      receiptNumber: "REC-2023-003",
      notes: "دفعة الربع الثاني",
      createdAt: "2023-04-15",
      updatedAt: "2023-04-15",
    },
    {
      id: "P004",
      contractId: "C001",
      type: "facilities",
      amount: 12500,
      paymentDate: "2023-04-20",
      dueDate: "2023-04-20",
      status: "paid",
      paymentMethod: "شيك",
      receiptNumber: "REC-2023-004",
      notes: "رسوم خدمات الربع الثاني",
      createdAt: "2023-04-20",
      updatedAt: "2023-04-20",
    },
    {
      id: "P005",
      contractId: "C001",
      type: "rent",
      amount: 125000,
      paymentDate: "2023-07-15",
      dueDate: "2023-07-15",
      status: "paid",
      paymentMethod: "تحويل بنكي",
      receiptNumber: "REC-2023-005",
      notes: "دفعة الربع الثالث",
      createdAt: "2023-07-15",
      updatedAt: "2023-07-15",
    },
    {
      id: "P006",
      contractId: "C001",
      type: "facilities",
      amount: 12500,
      paymentDate: "2023-07-20",
      dueDate: "2023-07-20",
      status: "paid",
      paymentMethod: "شيك",
      receiptNumber: "REC-2023-006",
      notes: "رسوم خدمات الربع الثالث",
      createdAt: "2023-07-20",
      updatedAt: "2023-07-20",
    },
    {
      id: "P007",
      contractId: "C001",
      type: "rent",
      amount: 125000,
      paymentDate: "",
      dueDate: "2023-10-15",
      status: "pending",
      paymentMethod: "",
      receiptNumber: "",
      notes: "دفعة الربع الرابع",
      createdAt: "2023-07-15",
      updatedAt: "2023-07-15",
    },
    {
      id: "P008",
      contractId: "C001",
      type: "facilities",
      amount: 12500,
      paymentDate: "",
      dueDate: "2023-10-20",
      status: "pending",
      paymentMethod: "",
      receiptNumber: "",
      notes: "رسوم خدمات الربع الرابع",
      createdAt: "2023-07-20",
      updatedAt: "2023-07-20",
    },
    {
      id: "P009",
      contractId: "C002",
      type: "rent",
      amount: 120000,
      paymentDate: "2023-02-15",
      dueDate: "2023-02-15",
      status: "paid",
      paymentMethod: "تحويل بنكي",
      receiptNumber: "REC-2023-007",
      notes: "دفعة سنوية",
      createdAt: "2023-02-15",
      updatedAt: "2023-02-15",
    },
    {
      id: "P010",
      contractId: "C002",
      type: "facilities",
      amount: 12000,
      paymentDate: "2023-02-20",
      dueDate: "2023-02-20",
      status: "paid",
      paymentMethod: "شيك",
      receiptNumber: "REC-2023-008",
      notes: "رسوم خدمات سنوية",
      createdAt: "2023-02-20",
      updatedAt: "2023-02-20",
    },
    {
      id: "P011",
      contractId: "C003",
      type: "rent",
      amount: 80000,
      paymentDate: "2022-06-15",
      dueDate: "2022-06-15",
      status: "paid",
      paymentMethod: "تحويل بنكي",
      receiptNumber: "REC-2022-009",
      notes: "دفعة سنوية",
      createdAt: "2022-06-15",
      updatedAt: "2022-06-15",
    },
    {
      id: "P012",
      contractId: "C003",
      type: "facilities",
      amount: 8000,
      paymentDate: "2022-06-20",
      dueDate: "2022-06-20",
      status: "paid",
      paymentMethod: "شيك",
      receiptNumber: "REC-2022-010",
      notes: "رسوم خدمات سنوية",
      createdAt: "2022-06-20",
      updatedAt: "2022-06-20",
    },
  ],

  // وظائف المحاكاة
  getContracts() {
    return [...this.contracts]
  },

  getContract(id) {
    return this.contracts.find((c) => c.id === id) || null
  },

  addContract(contract) {
    const now = new Date().toISOString()
    const newContract = {
      ...contract,
      id: `C${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    this.contracts.push(newContract)
    return newContract
  },

  updateContract(id, contract) {
    const index = this.contracts.findIndex((c) => c.id === id)
    if (index === -1) {
      throw new Error("العقد غير موجود")
    }
    const updatedContract = {
      ...this.contracts[index],
      ...contract,
      updatedAt: new Date().toISOString(),
    }
    this.contracts[index] = updatedContract
    return updatedContract
  },

  deleteContract(id) {
    const index = this.contracts.findIndex((c) => c.id === id)
    if (index === -1) {
      throw new Error("العقد غير موجود")
    }
    this.contracts.splice(index, 1)
    return true
  },

  getUsers() {
    return [...this.users]
  },

  getUser(id) {
    return this.users.find((u) => u.id === id) || null
  },

  addUser(user) {
    const now = new Date().toISOString()
    const newUser = {
      ...user,
      id: `U${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    this.users.push(newUser)
    return newUser
  },

  updateUser(id, user) {
    const index = this.users.findIndex((u) => u.id === id)
    if (index === -1) {
      throw new Error("المستخدم غير موجود")
    }
    const updatedUser = {
      ...this.users[index],
      ...user,
      updatedAt: new Date().toISOString(),
    }
    this.users[index] = updatedUser
    return updatedUser
  },

  deleteUser(id) {
    const index = this.users.findIndex((u) => u.id === id)
    if (index === -1) {
      throw new Error("المستخدم غير موجود")
    }
    this.users.splice(index, 1)
    return true
  },

  getPayments() {
    return [...this.payments]
  },

  getPaymentsByContract(contractId) {
    return this.payments.filter((p) => p.contractId === contractId)
  },

  addPayment(payment) {
    const now = new Date().toISOString()
    const newPayment = {
      ...payment,
      id: `P${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    }
    this.payments.push(newPayment)
    return newPayment
  },

  updatePayment(id, payment) {
    const index = this.payments.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error("الدفعة غير موجودة")
    }
    const updatedPayment = {
      ...this.payments[index],
      ...payment,
      updatedAt: new Date().toISOString(),
    }
    this.payments[index] = updatedPayment
    return updatedPayment
  },

  deletePayment(id) {
    const index = this.payments.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error("الدفعة غير موجودة")
    }
    this.payments.splice(index, 1)
    return true
  },

  getDashboardStats() {
    return {
      totalContracts: this.contracts.length,
      activeContracts: this.contracts.filter((c) => c.contractStatus === "نشط").length,
      totalUsers: this.users.length,
      pendingPayments: this.payments.filter((p) => p.status === "pending").length,
      overduePayments: this.payments.filter((p) => p.status === "overdue").length,
      expiringContracts: this.contracts.filter((c) => {
        const endDate = new Date(c.endDate)
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
        return endDate <= thirtyDaysFromNow && c.contractStatus === "نشط"
      }).length,
      totalRevenue: this.payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0),
    }
  },

  getContractFinancials(contractId) {
    const contract = this.getContract(contractId)
    if (!contract) {
      throw new Error("العقد غير موجود")
    }

    const contractPayments = this.getPaymentsByContract(contractId)
    const rentPayments = contractPayments.filter((p) => p.type === "rent" && p.status === "paid")
    const facilitiesPayments = contractPayments.filter((p) => p.type === "facilities" && p.status === "paid")
    const signagePayments = contractPayments.filter((p) => p.type === "signage" && p.status === "paid")

    const rentPaid = rentPayments.reduce((sum, p) => sum + p.amount, 0)
    const facilitiesPaid = facilitiesPayments.reduce((sum, p) => sum + p.amount, 0)
    const signagePaid = signagePayments.reduce((sum, p) => sum + p.amount, 0)

    return {
      totalRentValue: contract.totalRentValue,
      facilitiesServiceFees: contract.facilitiesServiceFees,
      signageFees: contract.signageFees,
      rentPaid,
      facilitiesPaid,
      signagePaid,
    }
  },

  getActiveNotifications() {
    return [
      {
        id: "1",
        type: "warning",
        title: "دفعة متأخرة",
        message: "يوجد دفعة متأخرة للعقد رقم C001",
        date: new Date().toISOString(),
        read: false,
      },
      {
        id: "2",
        type: "info",
        title: "عقد ينتهي قريباً",
        message: "العقد رقم C002 ينتهي خلال 15 يوم",
        date: new Date().toISOString(),
        read: false,
      },
    ]
  },

  testConnection() {
    return {
      success: true,
      message: "تم الاتصال بنجاح (محاكاة)",
    }
  },

  initializeTables() {
    return {
      success: true,
      message: "تم إنشاء الجداول بنجاح (محاكاة)",
    }
  },

  addSampleData() {
    return {
      success: true,
      message: "تم إضافة البيانات التجريبية بنجاح (محاكاة)",
    }
  },
}

// صادرات إضافية للتوافق
export const db = mockDatabase
