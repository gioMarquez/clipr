import { prisma } from "@/lib/prisma";
import Calendar from "./Calendar";

export default async function CalendarioPage() {
	const appointments = await prisma.appointment.findMany({
		orderBy: { date: "asc" },
		include: {
			client: { select: { name: true, phone: true } },
			barber: { select: { name: true } },
		},
	});

	return <Calendar appointments={appointments} />;
}
