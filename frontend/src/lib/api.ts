import { getToken } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:5001";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
};

type AdminUserApiRow = {
  id: string;
  email: string;
  username: string | null;
  fullName: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
};

type CustomerApiRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  type: string;
  contactPerson: string | null;
  city: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type EmployeeApiRow = {
  id: string;
  fullName: string;
  gender: string;
  email: string | null;
  phone: string | null;
  salary: number | null;
  hireDate: string;
  jobTitle: string;
  employmentType: string;
  status: string;
  departmentName: string;
  createdAt: string;
  updatedAt: string;
};

type WarehouseApiRow = {
  id: number;
  name: string;
  location: string | null;
  createdAt: string;
};

type ProductApiRow = {
  id: number;
  sku: string;
  name: string;
  price: string;
  createdAt: string;
};

type InventoryStockApiRow = {
  id: number;
  warehouseId: number;
  warehouseName: string;
  productId: number;
  productSku: string;
  productName: string;
  quantityOnHand: string;
};

type InventoryMovementApiRow = {
  id: number;
  productId: number;
  productSku: string;
  productName: string;
  warehouseId: number;
  warehouseName: string;
  movementType: string;
  quantity: string;
  unitPrice: string | null;
  createdAt: string;
};

type SalesOrderApiRow = {
  id: number;
  productId: number;
  productSku: string;
  productName: string;
  warehouseId: number;
  warehouseName: string;
  quantity: string;
  totalAmount: string;
  createdAt: string;
};

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data && typeof data.message === "string"
        ? data.message
        : "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export async function getUsers() {
  return apiRequest<Array<AdminUserApiRow>>("/api/admin/users");
}

export async function createUser(payload: {
  role: string;
  email: string;
  fullName?: string;
  username?: string;
}) {
  return apiRequest<AdminUserApiRow>("/api/admin/users", {
    method: "POST",
    body: payload,
  });
}

export async function updateUser(
  id: string,
  payload: Partial<{
    role: string;
    status: string;
    locked: boolean;
    fullName: string;
    username: string;
  }>
) {
  return apiRequest<AdminUserApiRow>(`/api/admin/users/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteUser(id: string) {
  return apiRequest<{ message: string }>(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
}

export async function verifyEmail(token: string) {
  return apiRequest<{ message: string }>("/api/auth/verify-email", {
    method: "POST",
    body: { token },
  });
}

export async function setPassword(token: string, newPassword: string) {
  return apiRequest<{ message: string }>("/api/auth/set-password", {
    method: "POST",
    body: { token, newPassword },
  });
}

export async function forgotPassword(identifier: string) {
  return apiRequest<{ message: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: { identifier },
  });
}

export async function getCustomers() {
  return apiRequest<Array<CustomerApiRow>>("/api/customers");
}

export async function createCustomer(payload: {
  name: string;
  phone?: string;
  email?: string;
  type: string;
  contactPerson?: string;
  city?: string;
  status?: string;
}) {
  return apiRequest<CustomerApiRow>("/api/customers", { method: "POST", body: payload });
}

export async function updateCustomer(
  id: string,
  payload: Partial<{
    name: string;
    phone: string;
    email: string;
    type: string;
    contactPerson: string;
    city: string;
    status: string;
  }>
) {
  return apiRequest<CustomerApiRow>(`/api/customers/${id}`, { method: "PUT", body: payload });
}

export async function deleteCustomer(id: string) {
  return apiRequest<{ message: string }>(`/api/customers/${id}`, { method: "DELETE" });
}

export async function getEmployees() {
  return apiRequest<Array<EmployeeApiRow>>("/api/employees");
}

export async function createEmployee(payload: {
  fullName: string;
  gender: string;
  email?: string;
  phone?: string;
  salary?: number | string;
  hireDate: string;
  jobTitle: string;
  employmentType: string;
  status?: string;
  departmentName: string;
}) {
  return apiRequest<EmployeeApiRow>("/api/employees", { method: "POST", body: payload });
}

export async function updateEmployee(
  id: string,
  payload: Partial<{
    fullName: string;
    gender: string;
    email: string;
    phone: string;
    salary: number | string;
    hireDate: string;
    jobTitle: string;
    employmentType: string;
    status: string;
    departmentName: string;
  }>
) {
  return apiRequest<EmployeeApiRow>(`/api/employees/${id}`, { method: "PUT", body: payload });
}

export async function deleteEmployee(id: string) {
  return apiRequest<{ message: string }>(`/api/employees/${id}`, { method: "DELETE" });
}

export async function getWarehouses() {
  return apiRequest<Array<WarehouseApiRow>>("/api/warehouses");
}

export async function createWarehouse(payload: {
  name: string;
  location?: string;
}) {
  return apiRequest<WarehouseApiRow>("/api/warehouses", {
    method: "POST",
    body: payload,
  });
}

export async function updateWarehouse(
  id: number,
  payload: Partial<{ name: string; location: string }>
) {
  return apiRequest<WarehouseApiRow>(`/api/warehouses/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteWarehouse(id: number) {
  return apiRequest<{ message: string }>(`/api/warehouses/${id}`, {
    method: "DELETE",
  });
}

export async function getProducts() {
  return apiRequest<Array<ProductApiRow>>("/api/products");
}

export async function createProduct(payload: {
  sku: string;
  name: string;
  price: string | number;
}) {
  return apiRequest<ProductApiRow>("/api/products", {
    method: "POST",
    body: payload,
  });
}

export async function updateProduct(
  id: number,
  payload: Partial<{ sku: string; name: string; price: string | number }>
) {
  return apiRequest<ProductApiRow>(`/api/products/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteProduct(id: number) {
  return apiRequest<{ message: string }>(`/api/products/${id}`, {
    method: "DELETE",
  });
}

export async function getInventoryStock() {
  return apiRequest<Array<InventoryStockApiRow>>("/api/inventory-stock");
}

export async function createInventoryStock(payload: {
  warehouseId: number | string;
  productId: number | string;
  quantityOnHand?: number | string;
}) {
  return apiRequest<InventoryStockApiRow>("/api/inventory-stock", {
    method: "POST",
    body: payload,
  });
}

export async function updateInventoryStock(
  id: number,
  payload: Partial<{
    warehouseId: number | string;
    productId: number | string;
    quantityOnHand: number | string;
  }>
) {
  return apiRequest<InventoryStockApiRow>(`/api/inventory-stock/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteInventoryStock(id: number) {
  return apiRequest<{ message: string }>(`/api/inventory-stock/${id}`, {
    method: "DELETE",
  });
}

export async function getInventoryMovements() {
  return apiRequest<Array<InventoryMovementApiRow>>("/api/inventory-movements");
}

export async function createInventoryMovement(payload: {
  productId: number | string;
  warehouseId: number | string;
  movementType: string;
  quantity: number | string;
  unitPrice?: number | string;
}) {
  return apiRequest<InventoryMovementApiRow>("/api/inventory-movements", {
    method: "POST",
    body: payload,
  });
}

export async function updateInventoryMovement(
  id: number,
  payload: Partial<{
    productId: number | string;
    warehouseId: number | string;
    movementType: string;
    quantity: number | string;
    unitPrice: number | string;
  }>
) {
  return apiRequest<InventoryMovementApiRow>(`/api/inventory-movements/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteInventoryMovement(id: number) {
  return apiRequest<{ message: string }>(`/api/inventory-movements/${id}`, {
    method: "DELETE",
  });
}

export async function getSalesOrders() {
  return apiRequest<Array<SalesOrderApiRow>>("/api/sales-orders");
}

export async function createSalesOrder(payload: {
  productId: number | string;
  warehouseId: number | string;
  quantity: number | string;
  totalAmount: number | string;
}) {
  return apiRequest<SalesOrderApiRow>("/api/sales-orders", {
    method: "POST",
    body: payload,
  });
}

export async function updateSalesOrder(
  id: number,
  payload: Partial<{
    productId: number | string;
    warehouseId: number | string;
    quantity: number | string;
    totalAmount: number | string;
  }>
) {
  return apiRequest<SalesOrderApiRow>(`/api/sales-orders/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteSalesOrder(id: number) {
  return apiRequest<{ message: string }>(`/api/sales-orders/${id}`, {
    method: "DELETE",
  });
}
