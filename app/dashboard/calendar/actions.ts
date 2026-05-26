"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAppointmentStatus(
	id: string,
	status: "CONFIRMED" | "CANCELLED",
) {
	await prisma.appointment.update({
		where: { id },
		data: { status },
	});
	revalidatePath("/dashboard/calendar");
}
