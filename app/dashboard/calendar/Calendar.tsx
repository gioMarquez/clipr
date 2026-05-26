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
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);

type View = "monthly" | "weekly" | "daily";

// — Helpers globales —
function appointmentsForDay(appointments: Appointment[], d: Date) {
	return appointments.filter((a) => {
		const ad = new Date(a.date);
		return (
			ad.getFullYear() === d.getFullYear() &&
			ad.getMonth() === d.getMonth() &&
			ad.getDate() === d.getDate()
		);
	});
}

function getWeekStart(date: Date) {
	const d = new Date(date);
	d.setDate(d.getDate() - d.getDay());
	return d;
}

function isToday(d: Date) {
	const today = new Date();
	return (
		d.getFullYear() === today.getFullYear() &&
		d.getMonth() === today.getMonth() &&
		d.getDate() === today.getDate()
	);
}

// — AppointmentCard —
function AppointmentCard({
	a,
	detail,
	setDetail,
}: {
	a: Appointment;
	detail: Appointment | null;
	setDetail: (a: Appointment | null) => void;
}) {
	return (
		<div
			className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 cursor-pointer hover:border-blue-300 transition"
			onClick={() => setDetail(detail?.id === a.id ? null : a)}
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
				{new Date(a.date).toLocaleTimeString("es-MX", {
					hour: "2-digit",
					minute: "2-digit",
				})}{" "}
				· ${a.price}
			</p>
			{detail?.id === a.id && (
				<div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
					{a.notes && (
						<p className="text-xs text-gray-500">📝 {a.notes}</p>
					)}
					{a.client.phone && (
						<p className="text-xs text-gray-500">
							📞 {a.client.phone}
						</p>
					)}
					{(a.status === "PENDING" || a.status === "CONFIRMED") && (
						<div className="flex gap-2 pt-1">
							{a.status === "PENDING" && (
								<button
									onClick={(e) => {
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
									updateAppointmentStatus(a.id, "CANCELLED");
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
	);
}

// — Vista mensual —
function MonthlyView({
	appointments,
	current,
	selected,
	setSelected,
	detail,
	setDetail,
}: {
	appointments: Appointment[];
	current: Date;
	selected: Date | null;
	setSelected: (d: Date) => void;
	detail: Appointment | null;
	setDetail: (a: Appointment | null) => void;
}) {
	const year = current.getFullYear();
	const month = current.getMonth();
	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	return (
		<div className="flex gap-4">
			<div className="flex-1 bg-white border border-gray-200 rounded-xl p-5">
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
				<div className="grid grid-cols-7 gap-1">
					{Array.from({ length: firstDay }).map((_, i) => (
						<div key={`e-${i}`} />
					))}
					{Array.from({ length: daysInMonth }).map((_, i) => {
						const day = i + 1;
						const date = new Date(year, month, day);
						const appts = appointmentsForDay(appointments, date);
						const isSel =
							selected?.toDateString() === date.toDateString();
						return (
							<button
								key={day}
								onClick={() => {
									setSelected(date);
									setDetail(null);
								}}
								className={`relative flex flex-col items-center rounded-lg p-1 min-h-[52px] transition
                                    ${isSel ? "bg-blue-600 text-white" : "hover:bg-gray-50"}
                                    ${isToday(date) && !isSel ? "border border-blue-400" : ""}
                                `}
							>
								<span
									className={`text-xs font-medium ${isSel ? "text-white" : "text-gray-700"}`}
								>
									{day}
								</span>
								{appts.length > 0 && (
									<div className="flex flex-wrap gap-0.5 justify-center mt-1">
										{appts.slice(0, 3).map((a) => (
											<span
												key={a.id}
												className={`w-1.5 h-1.5 rounded-full ${isSel ? "bg-white" : "bg-blue-500"}`}
											/>
										))}
										{appts.length > 3 && (
											<span
												className={`text-[9px] ${isSel ? "text-white" : "text-gray-400"}`}
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

			<div className="w-72 flex flex-col gap-3">
				{selected ? (
					<>
						<div className="bg-white border border-gray-200 rounded-xl p-4">
							<p className="text-sm font-semibold text-gray-900">
								{selected.getDate()} de{" "}
								{MONTHS[selected.getMonth()]}
							</p>
							<p className="text-xs text-gray-400 mt-0.5">
								{
									appointmentsForDay(appointments, selected)
										.length
								}{" "}
								cita
								{appointmentsForDay(appointments, selected)
									.length !== 1
									? "s"
									: ""}
							</p>
						</div>
						{appointmentsForDay(appointments, selected).length ===
						0 ? (
							<div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
								Sin citas este día
							</div>
						) : (
							<div className="flex flex-col gap-2 overflow-y-auto max-h-[520px]">
								{appointmentsForDay(appointments, selected).map(
									(a) => (
										<AppointmentCard
											key={a.id}
											a={a}
											detail={detail}
											setDetail={setDetail}
										/>
									),
								)}
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

// — Vista semanal —
function WeeklyView({
	appointments,
	current,
	detail,
	setDetail,
}: {
	appointments: Appointment[];
	current: Date;
	detail: Appointment | null;
	setDetail: (a: Appointment | null) => void;
}) {
	const weekStart = getWeekStart(current);
	const days = Array.from(
		{ length: 7 },
		(_, i) => new Date(weekStart.getTime() + i * 86400000),
	);

	return (
		<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
			<div className="grid grid-cols-7 border-b border-gray-100">
				{days.map((d) => (
					<div
						key={d.toISOString()}
						className={`p-3 text-center border-r border-gray-100 last:border-r-0 ${isToday(d) ? "bg-blue-50" : ""}`}
					>
						<p className="text-xs text-gray-400">
							{DAYS[d.getDay()]}
						</p>
						<p
							className={`text-sm font-semibold mt-0.5 ${isToday(d) ? "text-blue-600" : "text-gray-900"}`}
						>
							{d.getDate()}
						</p>
					</div>
				))}
			</div>
			<div className="grid grid-cols-7 min-h-[480px]">
				{days.map((d) => {
					const appts = appointmentsForDay(appointments, d);
					return (
						<div
							key={d.toISOString()}
							className={`p-2 border-r border-gray-100 last:border-r-0 flex flex-col gap-1.5 ${isToday(d) ? "bg-blue-50/40" : ""}`}
						>
							{appts.length === 0 ? (
								<p className="text-xs text-gray-300 text-center mt-4">
									—
								</p>
							) : (
								appts.map((a) => (
									<div
										key={a.id}
										onClick={() =>
											setDetail(
												detail?.id === a.id ? null : a,
											)
										}
										className="relative cursor-pointer rounded-lg p-1.5 bg-blue-100 border border-blue-200 hover:border-blue-400 transition"
									>
										<p className="text-[10px] font-medium text-blue-900 truncate">
											{a.client.name}
										</p>
										<p className="text-[10px] text-blue-700 truncate">
											{a.service}
										</p>
										<p className="text-[10px] text-blue-500">
											{new Date(
												a.date,
											).toLocaleTimeString("es-MX", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
										<span
											className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
												a.status === "COMPLETED"
													? "bg-green-500"
													: a.status === "CONFIRMED"
														? "bg-blue-500"
														: a.status ===
															  "CANCELLED"
															? "bg-red-500"
															: "bg-amber-500"
											}`}
										/>
										{detail?.id === a.id && (
											<div className="absolute top-full left-0 z-10 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-3 flex flex-col gap-2">
												<p className="text-xs font-semibold text-gray-900">
													{a.client.name}
												</p>
												<p className="text-xs text-gray-500">
													{a.service} ·{" "}
													{a.barber.name}
												</p>
												<span
													className={`text-xs px-2 py-0.5 rounded-full self-start ${STATUS_STYLE[a.status]}`}
												>
													{STATUS_LABEL[a.status]}
												</span>
												{(a.status === "PENDING" ||
													a.status ===
														"CONFIRMED") && (
													<div className="flex gap-1 pt-1">
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
																className="flex-1 text-xs py-1 bg-blue-600 text-white rounded-lg"
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
															className="flex-1 text-xs py-1 border border-red-200 text-red-600 rounded-lg"
														>
															Cancelar
														</button>
													</div>
												)}
											</div>
										)}
									</div>
								))
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

// — Vista diaria —
function DailyView({
	appointments,
	current,
	detail,
	setDetail,
}: {
	appointments: Appointment[];
	current: Date;
	detail: Appointment | null;
	setDetail: (a: Appointment | null) => void;
}) {
	const appts = appointmentsForDay(appointments, current);

	return (
		<div className="flex gap-4">
			<div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden">
				{HOURS.map((hour) => {
					const hourAppts = appts.filter(
						(a) => new Date(a.date).getHours() === hour,
					);
					return (
						<div
							key={hour}
							className="flex border-b border-gray-100 last:border-b-0 min-h-[56px]"
						>
							<div className="w-16 shrink-0 px-3 py-2 text-xs text-gray-400 border-r border-gray-100">
								{hour}:00
							</div>
							<div className="flex-1 p-1.5 flex flex-col gap-1">
								{hourAppts.map((a) => (
									<div
										key={a.id}
										onClick={() =>
											setDetail(
												detail?.id === a.id ? null : a,
											)
										}
										className="cursor-pointer rounded-lg px-3 py-1.5 bg-blue-50 border border-blue-200 hover:border-blue-400 transition flex items-center justify-between"
									>
										<div>
											<p className="text-xs font-medium text-blue-900">
												{a.client.name}
											</p>
											<p className="text-xs text-blue-700">
												{a.service} · {a.barber.name}
											</p>
										</div>
										<span
											className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[a.status]}`}
										>
											{STATUS_LABEL[a.status]}
										</span>
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>
			<div className="w-72 flex flex-col gap-3">
				<div className="bg-white border border-gray-200 rounded-xl p-4">
					<p className="text-sm font-semibold text-gray-900">
						{current.getDate()} de {MONTHS[current.getMonth()]}
					</p>
					<p className="text-xs text-gray-400 mt-0.5">
						{appts.length} cita{appts.length !== 1 ? "s" : ""}
					</p>
				</div>
				{detail ? (
					<AppointmentCard
						a={detail}
						detail={detail}
						setDetail={setDetail}
					/>
				) : (
					<div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
						Selecciona una cita para ver el detalle
					</div>
				)}
			</div>
		</div>
	);
}

// — Componente principal —
export default function Calendar({
	appointments,
}: {
	appointments: Appointment[];
}) {
	const today = new Date();
	const [view, setView] = useState<View>("monthly");
	const [current, setCurrent] = useState(
		new Date(today.getFullYear(), today.getMonth(), 1),
	);
	const [selected, setSelected] = useState<Date | null>(null);
	const [detail, setDetail] = useState<Appointment | null>(null);

	const year = current.getFullYear();
	const month = current.getMonth();

	const prev = () => {
		if (view === "monthly") setCurrent(new Date(year, month - 1, 1));
		if (view === "weekly")
			setCurrent(new Date(current.getTime() - 7 * 86400000));
		if (view === "daily")
			setCurrent(new Date(current.getTime() - 86400000));
	};

	const next = () => {
		if (view === "monthly") setCurrent(new Date(year, month + 1, 1));
		if (view === "weekly")
			setCurrent(new Date(current.getTime() + 7 * 86400000));
		if (view === "daily")
			setCurrent(new Date(current.getTime() + 86400000));
	};

	const headerLabel = () => {
		if (view === "monthly") return `${MONTHS[month]} ${year}`;
		if (view === "daily")
			return `${current.getDate()} de ${MONTHS[current.getMonth()]} ${current.getFullYear()}`;
		if (view === "weekly") {
			const start = getWeekStart(current);
			const end = new Date(start.getTime() + 6 * 86400000);
			return `${start.getDate()} - ${end.getDate()} de ${MONTHS[start.getMonth()]} ${start.getFullYear()}`;
		}
	};

	const changeView = (v: View) => {
		setView(v);
		setDetail(null);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<button
						onClick={prev}
						className="text-gray-400 hover:text-gray-700 px-2 py-1 rounded transition"
					>
						←
					</button>
					<h2 className="text-sm font-semibold text-gray-900 min-w-[220px] text-center">
						{headerLabel()}
					</h2>
					<button
						onClick={next}
						className="text-gray-400 hover:text-gray-700 px-2 py-1 rounded transition"
					>
						→
					</button>
				</div>
				<div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs">
					{(["monthly", "weekly", "daily"] as View[]).map((v) => (
						<button
							key={v}
							onClick={() => changeView(v)}
							className={`px-3 py-1.5 transition ${view === v ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"}`}
						>
							{
								{
									monthly: "Mensual",
									weekly: "Semanal",
									daily: "Diaria",
								}[v]
							}
						</button>
					))}
				</div>
			</div>

			{view === "monthly" && (
				<MonthlyView
					appointments={appointments}
					current={current}
					selected={selected}
					setSelected={setSelected}
					detail={detail}
					setDetail={setDetail}
				/>
			)}
			{view === "weekly" && (
				<WeeklyView
					appointments={appointments}
					current={current}
					detail={detail}
					setDetail={setDetail}
				/>
			)}
			{view === "daily" && (
				<DailyView
					appointments={appointments}
					current={current}
					detail={detail}
					setDetail={setDetail}
				/>
			)}
		</div>
	);
}
