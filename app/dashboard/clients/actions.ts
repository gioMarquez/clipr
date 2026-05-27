"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
	const name = formData.get("name") as string;
	const phone = formData.get("phone") as string;
	const email = formData.get("email") as string;

	await prisma.client.create({
		data: { name, phone, email },
	});

	revalidatePath("/dashboard/clients");
}

export async function updateClient(formData: FormData) {
	const id = formData.get("id") as string;
	const name = formData.get("name") as string;
	const phone = formData.get("phone") as string;
	const email = formData.get("email") as string;

	await prisma.client.update({
		where: { id },
		data: { name, phone, email },
	});

	revalidatePath("/dashboard/clients");
}

export async function deleteClient(formData: FormData) {
	const id = formData.get("id") as string;

	await prisma.client.delete({
		where: { id },
	});

	revalidatePath("/dashboard/clients");
}
