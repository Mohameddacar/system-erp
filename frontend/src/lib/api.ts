import { getToken } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:5001";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
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
  return apiRequest<
    Array<{ id: number; username: string; role: string; createdAt: string }>
  >("/api/users");
}

export async function createUser(payload: {
  username: string;
  password: string;
  role: string;
}) {
  return apiRequest<{ id: number; username: string; role: string; createdAt: string }>(
    "/api/users",
    { method: "POST", body: payload }
  );
}

export async function updateUser(
  id: number,
  payload: Partial<{ username: string; password: string; role: string }>
) {
  return apiRequest<{ id: number; username: string; role: string; createdAt: string }>(
    `/api/users/${id}`,
    { method: "PUT", body: payload }
  );
}

export async function deleteUser(id: number) {
  return apiRequest<{ message: string }>(`/api/users/${id}`, { method: "DELETE" });
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
