import { ModuleTable, type ModuleField } from "@/components/module-table"

type FinanceRecord = {
  id: string
  reference: string
  type: string
  amount: number
  status: string
  date: string
}

const fields: ModuleField<FinanceRecord>[] = [
  { key: "reference", label: "Reference", type: "text" },
  {
    key: "type",
    label: "Type",
    type: "status",
    options: [
      { label: "Invoice", value: "Invoice" },
      { label: "Expense", value: "Expense" },
      { label: "Refund", value: "Refund" },
    ],
  },
  { key: "amount", label: "Amount", type: "number" },
  {
    key: "status",
    label: "Status",
    type: "status",
    options: [
      { label: "Paid", value: "Paid" },
      { label: "Pending", value: "Pending" },
      { label: "Overdue", value: "Overdue" },
    ],
  },
  { key: "date", label: "Date", type: "date" },
]

const data: FinanceRecord[] = [
  {
    id: "f-4001",
    reference: "INV-2026-001",
    type: "Invoice",
    amount: 1250,
    status: "Paid",
    date: "2026-01-05",
  },
  {
    id: "f-4002",
    reference: "EXP-2026-014",
    type: "Expense",
    amount: 320,
    status: "Paid",
    date: "2026-01-11",
  },
  {
    id: "f-4003",
    reference: "INV-2026-004",
    type: "Invoice",
    amount: 890,
    status: "Pending",
    date: "2026-01-20",
  },
  {
    id: "f-4004",
    reference: "INV-2026-006",
    type: "Invoice",
    amount: 540,
    status: "Overdue",
    date: "2026-01-23",
  },
]

export default function Page() {
  return (
    <ModuleTable
      title="Finance"
      description="Monitor invoices, expenses, and payment status."
      fields={fields}
      initialData={data}
      searchKeys={["reference", "status"]}
    />
  )
}
