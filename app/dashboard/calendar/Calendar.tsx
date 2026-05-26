"use client";

import { useState } from "react";
import { updateAppointmentStatus } from "./actions";

interface Appointment {
	id: string;
	date: Date;
	status: string;
	service: string;
	price: number;
	notes: string | null;
	client: { name: string; phone: string | null };
	barber: { name: string };
}

interface Props {
	appointments: Appointment[];
}

const STATUS_STYLE: Record<string, string> = {
	COMPLETED: "bg-green-100 text-green-800",
	CONFIRMED: "bg-blue-100  text-blue-800",
	PENDING: "bg-amber-100 text-amber-800",
	CANCELLED: "bg-red-100   text-red-800",
};

const STATUS_LABEL: Record<string, string> = {
	COMPLETED: "Completada",
	CONFIRMED: "Confirmada",
	PENDING: "Pendiente",
	CANCELLED: "Cancelada",
};

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
	"Enero",
	"Febrero",
	"Marzo",
	"Abril",
	"Mayo",
	"Junio",
	"Julio",
	"Agosto",
	"Septiembre",
	"Octubre",
	"Noviembre",
	"Diciembre",
];

export default function Calendar({ appointments }: Props) {
	const today = new Date();
	const [current, setCurrent] = useState(
		new Date(today.getFullYear(), today.getMonth(), 1),
	);
	const [selected, setSelected] = useState<Date | null>(null);
	const [detail, setDetail] = useState<Appointment | null>(null);

	const year = current.getFullYear();
	const month = current.getMonth();

	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	const prev = () => setCurrent(new Date(year, month - 1, 1));
	const next = () => setCurrent(new Date(year, month + 1, 1));

	const appointmentsForDay = (day: number) => {
		return appointments.filter((a) => {
			const d = new Date(a.date);
			return (
				d.getFullYear() === year &&
				d.getMonth() === month &&
				d.getDate() === day
			);
		});
	};

	const selectedAppointments = selected
		? appointmentsForDay(selected.getDate())
		: [];

	const isToday = (day: number) =>
		today.getFullYear() === year &&
		today.getMonth() === month &&
		today.getDate() === day;

	const isSelected = (day: number) =>
		selected?.getFullYear() === year &&
		selected?.getMonth() === month &&
		selected?.getDate() === day;

	return (
		<div className="flex gap-4">
			{/* Calendario */}
			<div className="flex-1 bg-white border border-gray-200 rounded-xl p-5">
				{/* Header */}
				<div className="flex items-center justify-between mb-4">
					<button
						onClick={prev}
						className="text-gray-400 hover:text-gray-700 px-2 py-1 rounded transition"
					>
						←
					</button>
					<h2 className="text-sm font-semibold text-gray-900">
						{MONTHS[month]} {year}
					</h2>
					<button
						onClick={next}
						className="text-gray-400 hover:text-gray-700 px-2 py-1 rounded transition"
					>
						→
					</button>
				</div>

				{/* Días de la semana */}
				<div className="grid grid-cols-7 mb-2">
					{DAYS.map((d) => (
						<div
							key={d}
							className="text-center text-xs text-gray-400 font-medium py-1"
						>
							{d}
						</div>
					))}
				</div>

				{/* Cuadrícula */}
				<div className="grid grid-cols-7 gap-1">
					{Array.from({ length: firstDay }).map((_, i) => (
						<div key={`empty-${i}`} />
					))}
					{Array.from({ length: daysInMonth }).map((_, i) => {
						const day = i + 1;
						const appts = appointmentsForDay(day);
						return (
							<button
								key={day}
								onClick={() => {
									setSelected(new Date(year, month, day));
									setDetail(null);
								}}
								className={`
                                    relative flex flex-col items-center rounded-lg p-1 min-h-[52px] transition
                                    ${isSelected(day) ? "bg-blue-600 text-white" : "hover:bg-gray-50"}
                                    ${isToday(day) && !isSelected(day) ? "border border-blue-400" : ""}
                                `}
							>
								<span
									className={`text-xs font-medium ${isSelected(day) ? "text-white" : "text-gray-700"}`}
								>
									{day}
								</span>
								{appts.length > 0 && (
									<div className="flex flex-wrap gap-0.5 justify-center mt-1">
										{appts.slice(0, 3).map((a) => (
											<span
												key={a.id}
												className={`w-1.5 h-1.5 rounded-full ${isSelected(day) ? "bg-white" : "bg-blue-500"}`}
											/>
										))}
										{appts.length > 3 && (
											<span
												className={`text-[9px] ${isSelected(day) ? "text-white" : "text-gray-400"}`}
											>
												+{appts.length - 3}
											</span>
										)}
									</div>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Panel lateral */}
			<div className="w-72 flex flex-col gap-3">
				{selected ? (
					<>
						<div className="bg-white border border-gray-200 rounded-xl p-4">
							<p className="text-sm font-semibold text-gray-900">
								{selected.getDate()} de{" "}
								{MONTHS[selected.getMonth()]}
							</p>
							<p className="text-xs text-gray-400 mt-0.5">
								{selectedAppointments.length} cita
								{selectedAppointments.length !== 1 ? "s" : ""}
							</p>
						</div>

						{selectedAppointments.length === 0 ? (
							<div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
								Sin citas este día
							</div>
						) : (
							<div className="flex flex-col gap-2 overflow-y-auto max-h-[520px]">
								{selectedAppointments.map((a) => (
									<div
										key={a.id}
										className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 cursor-pointer hover:border-blue-300 transition"
										onClick={() =>
											setDetail(
												detail?.id === a.id ? null : a,
											)
										}
									>
										<div className="flex items-center justify-between">
											<p className="text-sm font-medium text-gray-900">
												{a.client.name}
											</p>
											<span
												className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[a.status]}`}
											>
												{STATUS_LABEL[a.status]}
											</span>
										</div>
										<p className="text-xs text-gray-500">
											{a.service} · {a.barber.name}
										</p>
										<p className="text-xs text-gray-400">
											{new Date(
												a.date,
											).toLocaleTimeString("es-MX", {
												hour: "2-digit",
												minute: "2-digit",
											})}
											{" · "}${a.price}
										</p>

										{/* Detalle expandible */}
										{detail?.id === a.id && (
											<div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
												{a.notes && (
													<p className="text-xs text-gray-500">
														📝 {a.notes}
													</p>
												)}
												{a.client.phone && (
													<p className="text-xs text-gray-500">
														📞 {a.client.phone}
													</p>
												)}
												{(a.status === "PENDING" ||
													a.status ===
														"CONFIRMED") && (
													<div className="flex gap-2 pt-1">
														{a.status ===
															"PENDING" && (
															<button
																onClick={(
																	e,
																) => {
																	e.stopPropagation();
																	updateAppointmentStatus(
																		a.id,
																		"CONFIRMED",
																	);
																}}
																className="flex-1 text-xs py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
															>
																Confirmar
															</button>
														)}
														<button
															onClick={(e) => {
																e.stopPropagation();
																updateAppointmentStatus(
																	a.id,
																	"CANCELLED",
																);
															}}
															className="flex-1 text-xs py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
														>
															Cancelar
														</button>
													</div>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</>
				) : (
					<div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
						Selecciona un día para ver las citas
					</div>
				)}
			</div>
		</div>
	);
}
