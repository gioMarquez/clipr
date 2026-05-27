import { prisma } from "@/lib/prisma";
import ClientList from "./ClientList";

export default async function ClientsPage() {
	const clients = await prisma.client.findMany({
		orderBy: { createdAt: "desc" },
		include: { _count: { select: { appointments: true } } },
	});

	return <ClientList clients={clients} />;
}
