"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function registerUser(formData: FormData) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const name = formData.get("name") as string;
	const username = formData.get("username") as string;
	const phone = formData.get("phone") as string;

	const hashedPassword = await bcrypt.hash(password, 12);

	await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name,
			username,
			phone,
		},
	});

	redirect("/login");
}
