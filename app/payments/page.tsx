const payments = [
  {
    id: "C001",
    contractNumber: "CONT-2024-001",
    contractName: "عقد إيجار مبنى تجاري",
  }
];

export default function PaymentsPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">الدفعات</h1>
      <pre>{JSON.stringify(payments, null, 2)}</pre>
    </div>
  );
}
