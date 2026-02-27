import { prisma } from "../lib/prisma.js";

async function getOrCreateDepartmentId(departmentName) {
  const normalized = String(departmentName || "").trim();

  if (!normalized) {
    throw new Error("Department name is required");
  }

  const existing = await prisma.department.findUnique({
    where: { name: normalized },
    select: { id: true },
  });

  if (existing) {
    return existing.id;
  }

  const created = await prisma.department.create({
    data: { name: normalized },
    select: { id: true },
  });

  return created.id;
}

export const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const response = employees.map((employee) => ({
      id: employee.id,
      fullName: employee.fullName,
      gender: employee.gender,
      email: employee.email,
      phone: employee.phone,
      salary: employee.salary,
      hireDate: employee.hireDate,
      jobTitle: employee.jobTitle,
      employmentType: employee.employmentType,
      status: employee.status,
      departmentName: employee.department.name,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const {
      fullName,
      gender,
      email,
      phone,
      salary,
      hireDate,
      jobTitle,
      employmentType,
      status,
      departmentName,
    } = req.body;

    if (!fullName || !gender || !hireDate || !jobTitle || !employmentType || !departmentName) {
      return res.status(400).json({
        message:
          "fullName, gender, hireDate, jobTitle, employmentType and departmentName are required",
      });
    }

    const deptId = await getOrCreateDepartmentId(departmentName);

    const employee = await prisma.employee.create({
      data: {
        fullName,
        gender,
        email: email || null,
        phone: phone || null,
        salary: salary !== undefined && salary !== "" ? Number(salary) : null,
        hireDate: new Date(hireDate),
        jobTitle,
        employmentType,
        status: status || "ACTIVE",
        deptId,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    res.status(201).json({
      id: employee.id,
      fullName: employee.fullName,
      gender: employee.gender,
      email: employee.email,
      phone: employee.phone,
      salary: employee.salary,
      hireDate: employee.hireDate,
      jobTitle: employee.jobTitle,
      employmentType: employee.employmentType,
      status: employee.status,
      departmentName: employee.department.name,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Employee unique field already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      gender,
      email,
      phone,
      salary,
      hireDate,
      jobTitle,
      employmentType,
      status,
      departmentName,
    } = req.body;

    const data = {
      ...(fullName !== undefined ? { fullName } : {}),
      ...(gender !== undefined ? { gender } : {}),
      ...(email !== undefined ? { email: email || null } : {}),
      ...(phone !== undefined ? { phone: phone || null } : {}),
      ...(salary !== undefined ? { salary: salary === "" ? null : Number(salary) } : {}),
      ...(hireDate !== undefined ? { hireDate: new Date(hireDate) } : {}),
      ...(jobTitle !== undefined ? { jobTitle } : {}),
      ...(employmentType !== undefined ? { employmentType } : {}),
      ...(status !== undefined ? { status } : {}),
    };

    if (departmentName !== undefined) {
      data.deptId = await getOrCreateDepartmentId(departmentName);
    }

    const employee = await prisma.employee.update({
      where: { id },
      data,
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    res.json({
      id: employee.id,
      fullName: employee.fullName,
      gender: employee.gender,
      email: employee.email,
      phone: employee.phone,
      salary: employee.salary,
      hireDate: employee.hireDate,
      jobTitle: employee.jobTitle,
      employmentType: employee.employmentType,
      status: employee.status,
      departmentName: employee.department.name,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Employee not found" });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Employee unique field already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.employee.delete({ where: { id } });
    res.json({ message: "Employee deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(500).json({ message: error.message });
  }
};
