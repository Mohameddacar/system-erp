import { ModuleTable, type ModuleField } from "@/components/module-table"

type OperationTask = {
  id: string
  task: string
  owner: string
  priority: string
  status: string
  due: string
}

const fields: ModuleField<OperationTask>[] = [
  { key: "task", label: "Task", type: "text" },
  { key: "owner", label: "Owner", type: "text" },
  {
    key: "priority",
    label: "Priority",
    type: "status",
    options: [
      { label: "Low", value: "Low" },
      { label: "Medium", value: "Medium" },
      { label: "High", value: "High" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "status",
    options: [
      { label: "Planned", value: "Planned" },
      { label: "In Progress", value: "In Progress" },
      { label: "Done", value: "Done" },
    ],
  },
  { key: "due", label: "Due", type: "date" },
]

const data: OperationTask[] = [
  {
    id: "o-5001",
    task: "Cycle count - Zone A",
    owner: "Fatima Saleh",
    priority: "High",
    status: "In Progress",
    due: "2026-02-26",
  },
  {
    id: "o-5002",
    task: "Reorder packaging supplies",
    owner: "Kareem Nasser",
    priority: "Medium",
    status: "Planned",
    due: "2026-02-28",
  },
  {
    id: "o-5003",
    task: "Dispatch batch #128",
    owner: "Mahmoud Ali",
    priority: "High",
    status: "Done",
    due: "2026-02-20",
  },
  {
    id: "o-5004",
    task: "Maintenance check - conveyor",
    owner: "Operations Team",
    priority: "Low",
    status: "Planned",
    due: "2026-03-05",
  },
]

export default function Page() {
  return (
    <ModuleTable
      title="Operations"
      description="Operational tasks, priorities, and delivery planning."
      fields={fields}
      initialData={data}
      searchKeys={["task", "owner"]}
    />
  )
}
