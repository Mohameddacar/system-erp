import { prisma } from "../lib/prisma.js";

export const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, type, contactPerson, city, status } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        type,
        contactPerson: contactPerson || null,
        city: city || null,
        status: status || "ACTIVE",
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Customer with this unique value already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, type, contactPerson, city, status } = req.body;

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone: phone || null } : {}),
        ...(email !== undefined ? { email: email || null } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(contactPerson !== undefined ? { contactPerson: contactPerson || null } : {}),
        ...(city !== undefined ? { city: city || null } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });

    res.json(customer);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.customer.delete({ where: { id } });
    res.json({ message: "Customer deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(500).json({ message: error.message });
  }
};
