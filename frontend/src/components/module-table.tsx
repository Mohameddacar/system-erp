"use client"

import * as React from "react"
import {
  flexRender,
  getSortedRowModel,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type FilterFn,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table"
import { IconDotsVertical, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type FieldType = "text" | "email" | "number" | "status" | "date"

export type ModuleField<T> = {
  key: keyof T
  label: string
  type?: FieldType
  options?: { label: string; value: string }[]
  table?: boolean
  create?: boolean
  edit?: boolean
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function includesStringOr<T extends { id: string | number }>(
  keys: (keyof T)[]
): FilterFn<T> {
  return (row, _columnId, filterValue) => {
    const q = String(filterValue ?? "").trim().toLowerCase()
    if (!q) return true

    return keys.some((k) => {
      const v = row.original[k]
      return String(v ?? "").toLowerCase().includes(q)
    })
  }
}

export function ModuleTable<T extends { id: string | number }>({
  title,
  description,
  fields,
  initialData,
  searchKeys,
  filters,
  onCreate,
  onUpdate,
  onDelete,
}: {
  title: string
  description?: string
  fields: ModuleField<T>[]
  initialData: T[]
  searchKeys?: (keyof T)[]
  filters?: React.ReactNode
  onCreate?: (draft: T) => Promise<T>
  onUpdate?: (draft: T) => Promise<T>
  onDelete?: (row: T) => Promise<void>
}) {
  const [data, setData] = React.useState<T[]>(() => initialData)
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "id", desc: true },
  ])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [createOpen, setCreateOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [activeRow, setActiveRow] = React.useState<T | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const tableFields = React.useMemo(
    () => fields.filter((f) => f.table !== false),
    [fields]
  )

  const createFields = React.useMemo(
    () => fields.filter((f) => f.key !== "id" && f.create !== false),
    [fields]
  )

  const editFields = React.useMemo(
    () => fields.filter((f) => f.key !== "id" && f.edit !== false),
    [fields]
  )

  const columns = React.useMemo<ColumnDef<T>[]>(() => {
    const statusKeys = new Set(
      tableFields.filter((f) => f.type === "status").map((f) => String(f.key))
    )

    const base: ColumnDef<T>[] = tableFields.map((f) => ({
      accessorKey: String(f.key),
      header: f.label,
      cell: ({ row }) => {
        const v = row.original[f.key]

        if (statusKeys.has(String(f.key))) {
          return (
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 text-primary dark:text-primary"
            >
              {String(v ?? "")}
            </Badge>
          )
        }

        const isPrimary = tableFields[0]?.key === f.key
        const isSecondary = f.type === "email"

        return (
          <span
            className={
              isPrimary
                ? "font-semibold"
                : isSecondary
                  ? "text-muted-foreground"
                  : ""
            }
          >
            {String(v ?? "")}
          </span>
        )
      },
    }))

    base.push({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                setActiveRow(row.original)
                setEditOpen(true)
              }}
            >
              <IconPencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => {
                e.preventDefault()
                setActiveRow(row.original)
                setDeleteOpen(true)
              }}
            >
              <IconTrash />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    })

    return base
  }, [tableFields])

  const globalFilterKeys = React.useMemo<(keyof T)[]>(() => {
    const fromProp = searchKeys?.filter((k) => k !== "id")
    if (fromProp && fromProp.length) return fromProp

    const fallback = fields
      .filter((f) => f.table !== false)
      .map((f) => f.key)
      .filter((k) => k !== "id")
      .slice(0, 2)
    return fallback
  }, [fields, searchKeys])

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    globalFilterFn: includesStringOr<T>(globalFilterKeys),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const emptyDraft = React.useMemo(() => {
    const draft: Record<string, unknown> = { id: "" }
    for (const f of fields) {
      if (f.key === "id") continue
      draft[String(f.key)] = ""
    }
    return draft as T
  }, [fields])

  const [createDraft, setCreateDraft] = React.useState<T>(() => emptyDraft)
  const [editDraft, setEditDraft] = React.useState<T>(() => emptyDraft)

  React.useEffect(() => {
    if (createOpen) {
      setCreateDraft({ ...emptyDraft, id: createId() })
    }
  }, [createOpen, emptyDraft])

  React.useEffect(() => {
    if (editOpen && activeRow) {
      setEditDraft(activeRow)
    }
  }, [editOpen, activeRow])

  function renderFieldInput(
    draft: T,
    setDraft: React.Dispatch<React.SetStateAction<T>>,
    field: ModuleField<T>
  ) {
    const key = field.key
    if (key === "id") return null

    const labelId = `field-${String(key)}`
    const value = (draft[key] ?? "") as unknown as string

    if (field.type === "status" && field.options?.length) {
      return (
        <div className="grid gap-2" key={String(key)}>
          <Label htmlFor={labelId}>{field.label}</Label>
          <Select
            value={value}
            onValueChange={(v) =>
              setDraft((prev) => ({ ...prev, [key]: v } as T))
            }
          >
            <SelectTrigger id={labelId}>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }

    const inputType =
      field.type === "email"
        ? "email"
        : field.type === "number"
          ? "number"
          : field.type === "date"
            ? "date"
            : "text"

    return (
      <div className="grid gap-2" key={String(key)}>
        <Label htmlFor={labelId}>{field.label}</Label>
        <Input
          id={labelId}
          type={inputType}
          value={value}
          onChange={(e) => {
            const next: unknown =
              field.type === "number" ? Number(e.target.value) : e.target.value
            setDraft((prev) => ({ ...prev, [key]: next } as T))
          }}
        />
      </div>
    )
  }

  return (
    <div className="px-4 py-6 lg:px-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-muted-foreground text-sm">{description}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-md">
            <Input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="rounded-full"
            />
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end md:w-auto">
            {filters}
            <Button onClick={() => setCreateOpen(true)}>
              <IconPlus />
              Create
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    className={h.column.getCanSort() ? "cursor-pointer" : ""}
                    onClick={
                      h.column.getCanSort()
                        ? h.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    {h.isPlaceholder
                      ? null
                      : flexRender(
                          h.column.columnDef.header,
                          h.getContext()
                        ) as React.ReactNode}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      ) as React.ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-muted-foreground text-sm">
          Showing {(table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + 1}-{Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )} of {table.getFilteredRowModel().rows.length}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
          <div className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {title}</DialogTitle>
            <DialogDescription>Fill in the details and save.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {createFields.map((f) => renderFieldInput(createDraft, setCreateDraft, f))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              type="button"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSaving}
              onClick={async () => {
                try {
                  setIsSaving(true)
                  if (onCreate) {
                    const created = await onCreate(createDraft)
                    setData((prev) => [created, ...prev])
                  } else {
                    setData((prev) => [createDraft, ...prev])
                  }
                  setCreateOpen(false)
                  toast.success("Created")
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Failed to create")
                } finally {
                  setIsSaving(false)
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit</DialogTitle>
            <DialogDescription>Update the record and save.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {editFields.map((f) => renderFieldInput(editDraft, setEditDraft, f))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              type="button"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSaving}
              onClick={async () => {
                try {
                  setIsSaving(true)
                  if (onUpdate) {
                    const updated = await onUpdate(editDraft)
                    setData((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
                  } else {
                    setData((prev) => prev.map((r) => (r.id === editDraft.id ? editDraft : r)))
                  }
                  setEditOpen(false)
                  toast.success("Updated")
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Failed to update")
                } finally {
                  setIsSaving(false)
                }
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete this record?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              type="button"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              type="button"
              disabled={isSaving}
              onClick={async () => {
                try {
                  setIsSaving(true)
                  if (activeRow) {
                    if (onDelete) {
                      await onDelete(activeRow)
                    }
                    setData((prev) => prev.filter((r) => r.id !== activeRow.id))
                  }
                  setDeleteOpen(false)
                  toast.success("Deleted")
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Failed to delete")
                } finally {
                  setIsSaving(false)
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
