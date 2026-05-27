"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
	LineChart,
	Line,
	CartesianGrid,
} from "recharts";

interface Props {
	incomeByMonth: { month: string; total: number }[];
	citasPorEstado: { name: string; value: number; color: string }[];
	rendimientoBarberos: { name: string; citas: number; ingresos: number }[];
	serviciosMasSolicitados: { name: string; value: number }[];
	clientesNuevosPorMes: { month: string; total: number }[];
	clientesFrecuentes: { name: string; citas: number; gasto: number }[];
}

const COLORS = [
	"#3b82f6",
	"#8b5cf6",
	"#f59e0b",
	"#10b981",
	"#ef4444",
	"#ec4899",
];

function Card({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
			<h3 className="text-sm font-semibold text-gray-900">{title}</h3>
			{children}
		</div>
	);
}

export default function Charts({
	incomeByMonth,
	citasPorEstado,
	rendimientoBarberos,
	serviciosMasSolicitados,
	clientesNuevosPorMes,
	clientesFrecuentes,
}: Props) {
	const totalIngresos = incomeByMonth.reduce((s, m) => s + m.total, 0);
	const totalCitas = citasPorEstado.reduce((s, e) => s + e.value, 0);

	return (
		<div className="flex flex-col gap-5">
			{/* Métricas rápidas */}
			<div className="grid grid-cols-3 gap-4">
				<div className="bg-white border border-gray-200 rounded-xl p-4">
					<p className="text-xs text-gray-400 mb-1">
						Ingresos del año
					</p>
					<p className="text-2xl font-semibold text-gray-900">
						${totalIngresos.toLocaleString()}
					</p>
				</div>
				<div className="bg-white border border-gray-200 rounded-xl p-4">
					<p className="text-xs text-gray-400 mb-1">Total de citas</p>
					<p className="text-2xl font-semibold text-gray-900">
						{totalCitas}
					</p>
				</div>
				<div className="bg-white border border-gray-200 rounded-xl p-4">
					<p className="text-xs text-gray-400 mb-1">
						Tasa de cancelación
					</p>
					<p className="text-2xl font-semibold text-gray-900">
						{totalCitas > 0
							? `${(((citasPorEstado.find((e) => e.name === "Canceladas")?.value ?? 0) / totalCitas) * 100).toFixed(1)}%`
							: "0%"}
					</p>
				</div>
			</div>

			{/* Ingresos por mes */}
			<Card title="Ingresos por mes">
				<ResponsiveContainer width="100%" height={220}>
					<BarChart data={incomeByMonth}>
						<XAxis dataKey="month" tick={{ fontSize: 11 }} />
						<YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                            formatter={(value) => [
                                `$${Number(value ?? 0).toLocaleString()}`,
                                "Ingresos",
                            ]}
                        />
						<Bar
							dataKey="total"
							fill="#3b82f6"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</Card>

			<div className="grid grid-cols-2 gap-4">
				{/* Citas por estado */}
				<Card title="Citas por estado">
					<ResponsiveContainer width="100%" height={220}>
						<PieChart>
							<Pie
								data={citasPorEstado}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								outerRadius={80}
								label={({ name, percent }) =>
									`${name} ${(percent * 100).toFixed(0)}%`
								}
								labelLine={false}
							>
								{citasPorEstado.map((e, i) => (
									<Cell key={i} fill={e.color} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</Card>

				{/* Servicios más solicitados */}
				<Card title="Servicios más solicitados">
					<ResponsiveContainer width="100%" height={220}>
						<BarChart
							data={serviciosMasSolicitados}
							layout="vertical"
						>
							<XAxis type="number" tick={{ fontSize: 11 }} />
							<YAxis
								dataKey="name"
								type="category"
								tick={{ fontSize: 11 }}
								width={90}
							/>
							<Tooltip />
							<Bar dataKey="value" radius={[0, 4, 4, 0]}>
								{serviciosMasSolicitados.map((_, i) => (
									<Cell
										key={i}
										fill={COLORS[i % COLORS.length]}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</Card>
			</div>

			{/* Clientes nuevos por mes */}
			<Card title="Clientes nuevos por mes">
				<ResponsiveContainer width="100%" height={200}>
					<LineChart data={clientesNuevosPorMes}>
						<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
						<XAxis dataKey="month" tick={{ fontSize: 11 }} />
						<YAxis tick={{ fontSize: 11 }} />
						<Tooltip />
						<Line
							type="monotone"
							dataKey="total"
							stroke="#3b82f6"
							strokeWidth={2}
							dot={{ r: 3 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</Card>

			<div className="grid grid-cols-2 gap-4">
				{/* Rendimiento por barbero */}
				<Card title="Rendimiento por barbero">
					<ResponsiveContainer width="100%" height={200}>
						<BarChart data={rendimientoBarberos}>
							<XAxis dataKey="name" tick={{ fontSize: 11 }} />
							<YAxis tick={{ fontSize: 11 }} />
							<Tooltip />
							<Bar
								dataKey="citas"
								name="Citas"
								fill="#3b82f6"
								radius={[4, 4, 0, 0]}
							/>
							<Bar
								dataKey="ingresos"
								name="Ingresos"
								fill="#10b981"
								radius={[4, 4, 0, 0]}
							/>
							<Legend />
						</BarChart>
					</ResponsiveContainer>
				</Card>

				{/* Clientes frecuentes */}
				<Card title="Clientes frecuentes">
					<div className="flex flex-col divide-y divide-gray-100">
						{clientesFrecuentes.length === 0 ? (
							<p className="text-sm text-gray-400 text-center py-4">
								Sin datos
							</p>
						) : (
							clientesFrecuentes.map((c, i) => (
								<div
									key={c.name}
									className="flex items-center gap-3 py-2.5"
								>
									<span className="text-xs font-semibold text-gray-300 w-4">
										{i + 1}
									</span>
									<div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium">
										{c.name
											.split(" ")
											.map((n) => n[0])
											.join("")
											.slice(0, 2)
											.toUpperCase()}
									</div>
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-900">
											{c.name}
										</p>
										<p className="text-xs text-gray-400">
											{c.citas} citas
										</p>
									</div>
									<span className="text-sm font-medium text-blue-600">
										${c.gasto.toLocaleString()}
									</span>
								</div>
							))
						)}
					</div>
				</Card>
			</div>
		</div>
	);
}
