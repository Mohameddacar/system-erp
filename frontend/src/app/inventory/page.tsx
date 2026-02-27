import { ModuleTable, type ModuleField } from "@/components/module-table"

type InventoryItem = {
  id: string
  sku: string
  name: string
  category: string
  stock: number
  status: string
}

const fields: ModuleField<InventoryItem>[] = [
  { key: "sku", label: "SKU", type: "text" },
  { key: "name", label: "Item", type: "text" },
  {
    key: "category",
    label: "Category",
    type: "status",
    options: [
      { label: "Electronics", value: "Electronics" },
      { label: "Consumables", value: "Consumables" },
      { label: "Spare Parts", value: "Spare Parts" },
      { label: "Packaging", value: "Packaging" },
    ],
  },
  { key: "stock", label: "Stock", type: "number" },
  {
    key: "status",
    label: "Status",
    type: "status",
    options: [
      { label: "In Stock", value: "In Stock" },
      { label: "Low Stock", value: "Low Stock" },
      { label: "Out of Stock", value: "Out of Stock" },
    ],
  },
]

const data: InventoryItem[] = [
  {
    id: "i-3001",
    sku: "SKU-AX12",
    name: "Wireless Scanner",
    category: "Electronics",
    stock: 27,
    status: "In Stock",
  },
  {
    id: "i-3002",
    sku: "SKU-PK01",
    name: "Shipping Boxes (L)",
    category: "Packaging",
    stock: 8,
    status: "Low Stock",
  },
  {
    id: "i-3003",
    sku: "SKU-SP77",
    name: "Conveyor Belt Roller",
    category: "Spare Parts",
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "i-3004",
    sku: "SKU-CN09",
    name: "Cleaning Wipes",
    category: "Consumables",
    stock: 120,
    status: "In Stock",
  },
]

export default function Page() {
  return (
    <ModuleTable
      title="Inventory"
      description="Manage SKUs, categories, and stock levels."
      fields={fields}
      initialData={data}
      searchKeys={["sku", "name"]}
    />
  )
}
