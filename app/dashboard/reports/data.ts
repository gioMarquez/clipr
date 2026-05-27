import { prisma } from "@/lib/prisma";

export async function getReportsData() {
	const now = new Date();
	const yearStart = new Date(now.getFullYear(), 0, 1);

	const appointments = await prisma.appointment.findMany({
		where: { date: { gte: yearStart } },
		include: {
			client: {
				select: {
					name: true,
					createdAt: true,
				},
			},
			barber: {
				select: {
					name: true,
				},
			},
		},
		orderBy: { date: "asc" },
	});

	// — Ingresos por mes —
	const incomeByMonth = Array.from({ length: 12 }, (_, i) => {
		const month = new Date(now.getFullYear(), i, 1).toLocaleString(
			"es-MX",
			{ month: "short" },
		);

		const total = appointments
			.filter(
				(a) =>
					a.status === "COMPLETED" &&
					new Date(a.date).getMonth() === i,
			)
			.reduce((sum, a) => sum + a.price, 0);

		return { month, total };
	});

	// — Citas por estado —
	const statusCount = {
		COMPLETED: appointments.filter((a) => a.status === "COMPLETED").length,

		CONFIRMED: appointments.filter((a) => a.status === "CONFIRMED").length,

		PENDING: appointments.filter((a) => a.status === "PENDING").length,

		CANCELLED: appointments.filter((a) => a.status === "CANCELLED").length,
	};

	const citasPorEstado = [
		{
			name: "Completadas",
			value: statusCount.COMPLETED,
			color: "#22c55e",
		},
		{
			name: "Confirmadas",
			value: statusCount.CONFIRMED,
			color: "#3b82f6",
		},
		{
			name: "Pendientes",
			value: statusCount.PENDING,
			color: "#f59e0b",
		},
		{
			name: "Canceladas",
			value: statusCount.CANCELLED,
			color: "#ef4444",
		},
	];

	// — Rendimiento por barbero —
	const barberMap = new Map<
		string,
		{
			name: string;
			citas: number;
			ingresos: number;
		}
	>();

	appointments.forEach((a) => {
		const prev = barberMap.get(a.barberId) ?? {
			name: a.barber.name,
			citas: 0,
			ingresos: 0,
		};

		barberMap.set(a.barberId, {
			name: a.barber.name,
			citas: prev.citas + 1,
			ingresos: prev.ingresos + (a.status === "COMPLETED" ? a.price : 0),
		});
	});

	const rendimientoBarberos = Array.from(barberMap.values());

	// — Servicios más solicitados —
	const serviceMap = new Map<string, number>();

	appointments.forEach((a) => {
		serviceMap.set(a.service, (serviceMap.get(a.service) ?? 0) + 1);
	});

	const serviciosMasSolicitados = Array.from(serviceMap.entries())
		.map(([name, value]) => ({ name, value }))
		.sort((a, b) => b.value - a.value)
		.slice(0, 6);

	// — Clientes nuevos por mes —
	const clientesNuevosPorMes = Array.from({ length: 12 }, (_, i) => {
		const month = new Date(now.getFullYear(), i, 1).toLocaleString(
			"es-MX",
			{
				month: "short",
			},
		);

		const total = appointments
			.filter((a) => new Date(a.client.createdAt).getMonth() === i)
			.map((a) => a.clientId)
			.filter((id, idx, arr) => arr.indexOf(id) === idx).length;

		return { month, total };
	});

	// — Clientes frecuentes —
	const clientMap = new Map<
		string,
		{
			name: string;
			citas: number;
			gasto: number;
		}
	>();

	appointments.forEach((a) => {
		const prev = clientMap.get(a.clientId) ?? {
			name: a.client.name,
			citas: 0,
			gasto: 0,
		};

		clientMap.set(a.clientId, {
			name: a.client.name,
			citas: prev.citas + 1,
			gasto: prev.gasto + (a.status === "COMPLETED" ? a.price : 0),
		});
	});

	const clientesFrecuentes = Array.from(clientMap.values())
		.sort((a, b) => b.citas - a.citas)
		.slice(0, 5);

	return {
		incomeByMonth,
		citasPorEstado,
		rendimientoBarberos,
		serviciosMasSolicitados,
		clientesNuevosPorMes,
		clientesFrecuentes,
	};
}
