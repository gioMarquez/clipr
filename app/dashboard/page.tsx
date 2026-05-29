import { prisma } from "@/lib/prisma";
import Link from "next/link";

const statusStyle: Record<string, string> = {
	COMPLETED: "bg-green-100 text-green-800",
	CONFIRMED: "bg-blue-100  text-blue-800",
	PENDING: "bg-amber-100 text-amber-800",
	CANCELLED: "bg-red-100   text-red-800",
};

const statusLabel: Record<string, string> = {
	COMPLETED: "Completada",
	CONFIRMED: "Confirmada",
	PENDING: "Pendiente",
	CANCELLED: "Cancelada",
};

export default async function DashboardPage() {
	const now = new Date();
	const start = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		0,
		0,
		0,
	);
	const end = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		23,
		59,
		59,
	);

	const yesterday = new Date(start.getTime() - 86400000);
	const yesterdayEnd = new Date(end.getTime() - 86400000);

	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

	// — Queries en paralelo —
	const [
		todayAppointments,
		yesterdayAppointments,
		pendingCount,
		monthClients,
		activeBarbers,
	] = await Promise.all([
		prisma.appointment.findMany({
			where: { date: { gte: start, lte: end } },
			include: {
				client: { select: { name: true } },
				barber: { select: { name: true } },
			},
			orderBy: { date: "asc" },
		}),
		prisma.appointment.findMany({
			where: {
				date: { gte: yesterday, lte: yesterdayEnd },
				status: "COMPLETED",
			},
		}),
		prisma.appointment.count({
			where: { date: { gte: start, lte: end }, status: "PENDING" },
		}),
		prisma.client.count({
			where: { createdAt: { gte: monthStart } },
		}),
		prisma.barber.findMany({
			include: {
				appointments: {
					where: { date: { gte: start, lte: end } },
					select: { status: true, price: true },
				},
			},
		}),
	]);

	// — Cálculos —
	const todayIncome = todayAppointments
		.filter((a) => a.status === "COMPLETED")
		.reduce((s, a) => s + a.price, 0);
	const yesterdayIncome = yesterdayAppointments.reduce(
		(s, a) => s + a.price,
		0,
	);
	const incomeChange =
		yesterdayIncome > 0
			? (
					((todayIncome - yesterdayIncome) / yesterdayIncome) *
					100
				).toFixed(0)
			: null;

	const todayCount = todayAppointments.length;
	const yesterdayCount = yesterdayAppointments.length;
	const countChange = todayCount - yesterdayCount;

	const metrics = [
		{
			label: "Citas hoy",
			value: todayCount.toString(),
			sub:
				countChange >= 0
					? `↑ ${countChange} vs ayer`
					: `↓ ${Math.abs(countChange)} vs ayer`,
		},
		{
			label: "Pendientes",
			value: pendingCount.toString(),
			sub: "por confirmar",
		},
		{
			label: "Ingresos hoy",
			value: `$${todayIncome.toLocaleString("es-MX")}`,
			sub: incomeChange
				? `${Number(incomeChange) >= 0 ? "↑" : "↓"} ${Math.abs(Number(incomeChange))}% vs ayer`
				: "Sin datos de ayer",
		},
		{
			label: "Clientes nuevos",
			value: monthClients.toString(),
			sub: "este mes",
		},
	];

	return (
		<div className="flex flex-col gap-6">
			{/* Métricas */}
			<div className="grid grid-cols-4 gap-3">
				{metrics.map((m) => (
					<div
						key={m.label}
						className="bg-white rounded-lg border border-gray-200 p-4"
					>
						<p className="text-xs text-gray-500 mb-1">{m.label}</p>
						<p className="text-2xl font-semibold text-gray-900">
							{m.value}
						</p>
						<p className="text-xs text-gray-400 mt-1">{m.sub}</p>
					</div>
				))}
			</div>

			{/* Cards */}
			<div className="grid grid-cols-2 gap-4">
				{/* Citas de hoy */}
				<div className="bg-white rounded-xl border border-gray-200 p-5">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-sm font-medium text-gray-900">
							Citas de hoy
						</h2>
						<Link
							href="/dashboard/calendar"
							className="text-xs text-blue-600 hover:underline"
						>
							Ver todas →
						</Link>
					</div>
					<div className="flex flex-col divide-y divide-gray-100">
						{todayAppointments.length === 0 ? (
							<p className="text-sm text-gray-400 text-center py-6">
								Sin citas para hoy
							</p>
						) : (
							todayAppointments.map((a) => (
								<div
									key={a.id}
									className="flex items-center gap-3 py-2"
								>
									<span className="text-xs text-gray-400 w-11">
										{new Date(a.date).toLocaleTimeString(
											"es-MX",
											{
												hour: "2-digit",
												minute: "2-digit",
											},
										)}
									</span>
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-900">
											{a.client.name}
										</p>
										<p className="text-xs text-gray-400">
											{a.service} · {a.barber.name}
										</p>
									</div>
									<span
										className={`text-xs px-2 py-1 rounded-full ${statusStyle[a.status]}`}
									>
										{statusLabel[a.status]}
									</span>
								</div>
							))
						)}
					</div>
				</div>

				{/* Barberos activos hoy */}
				<div className="bg-white rounded-xl border border-gray-200 p-5">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-sm font-medium text-gray-900">
							Barberos activos hoy
						</h2>
						<Link
							href="/dashboard/barbers"
							className="text-xs text-blue-600 hover:underline"
						>
							Gestionar →
						</Link>
					</div>
					<div className="flex flex-col divide-y divide-gray-100">
						{activeBarbers.length === 0 ? (
							<p className="text-sm text-gray-400 text-center py-6">
								Sin barberos registrados
							</p>
						) : (
							activeBarbers.map((b) => {
								const total = b.appointments.length;
								const completed = b.appointments.filter(
									(a) => a.status === "COMPLETED",
								).length;
								const income = b.appointments
									.filter((a) => a.status === "COMPLETED")
									.reduce((s, a) => s + a.price, 0);
								const initials = b.name
									.split(" ")
									.map((n) => n[0])
									.join("")
									.slice(0, 2)
									.toUpperCase();
								return (
									<div
										key={b.id}
										className="flex items-center gap-3 py-3"
									>
										<div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium">
											{initials}
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-900">
												{b.name}
											</p>
											<p className="text-xs text-gray-400">
												{total} citas · {completed}{" "}
												completadas
											</p>
										</div>
										<span className="text-sm font-medium text-blue-600">
											${income.toLocaleString("es-MX")}
										</span>
									</div>
								);
							})
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
