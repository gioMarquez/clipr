"use client";

import { useState } from "react";
import { deleteClient } from "./actions";
import ClientModal from "./ClientModal";

interface Client {
	id: string;
	name: string;
	phone: string | null;
	email: string | null;
	createdAt: Date;
	_count: { appointments: number };
}

export default function ClientList({ clients }: { clients: Client[] }) {
	const [search, setSearch] = useState("");
	const [modal, setModal] = useState<"create" | "edit" | null>(null);
	const [selected, setSelected] = useState<Client | null>(null);

	const filtered = clients.filter(
		(c) =>
			c.name.toLowerCase().includes(search.toLowerCase()) ||
			c.email?.toLowerCase().includes(search.toLowerCase()) ||
			c.phone?.includes(search),
	);

	const openEdit = (client: Client) => {
		setSelected(client);
		setModal("edit");
	};
	const closeModal = () => {
		setModal(null);
		setSelected(null);
	};

	return (
		<>
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900">
						Clientes
					</h1>
					<p className="text-sm text-gray-400 mt-1">
						{clients.length} clientes registrados
					</p>
				</div>
				<button
					onClick={() => setModal("create")}
					className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-neutral-800 transition hover:scale-[1.02] active:scale-95"
				>
					+ Agregar cliente
				</button>
			</div>

			{/* Búsqueda */}
			<div className="mb-4">
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Buscar por nombre, email o teléfono..."
					className="w-full max-w-sm px-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition"
				/>
			</div>

			{/* Tabla */}
			<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-gray-100 bg-gray-50">
							<th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
								Nombre
							</th>
							<th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
								Teléfono
							</th>
							<th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
								Email
							</th>
							<th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
								Citas
							</th>
							<th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
								Registro
							</th>
							<th className="px-4 py-3" />
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{filtered.length === 0 ? (
							<tr>
								<td
									colSpan={6}
									className="text-center py-12 text-gray-400 text-sm"
								>
									{search
										? "Sin resultados para tu búsqueda"
										: "No hay clientes registrados aún"}
								</td>
							</tr>
						) : (
							filtered.map((c) => (
								<tr
									key={c.id}
									className="hover:bg-gray-50 transition"
								>
									<td className="px-4 py-3">
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium shrink-0">
												{c.name
													.split(" ")
													.map((n) => n[0])
													.join("")
													.slice(0, 2)
													.toUpperCase()}
											</div>
											<span className="font-medium text-gray-900">
												{c.name}
											</span>
										</div>
									</td>
									<td className="px-4 py-3 text-gray-500">
										{c.phone ?? "—"}
									</td>
									<td className="px-4 py-3 text-gray-500">
										{c.email ?? "—"}
									</td>
									<td className="px-4 py-3">
										<span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
											{c._count.appointments} cita
											{c._count.appointments !== 1
												? "s"
												: ""}
										</span>
									</td>
									<td className="px-4 py-3 text-gray-400 text-xs">
										{new Date(
											c.createdAt,
										).toLocaleDateString("es-MX", {
											day: "2-digit",
											month: "short",
											year: "numeric",
										})}
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center gap-2 justify-end">
											<button
												onClick={() => openEdit(c)}
												className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-700"
											>
												Editar
											</button>
											<form action={deleteClient}>
												<input
													type="hidden"
													name="id"
													value={c.id}
												/>
												<button
													type="submit"
													className="text-xs px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition text-red-600"
												>
													Eliminar
												</button>
											</form>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{modal === "create" && <ClientModal onClose={closeModal} />}
			{modal === "edit" && selected && (
				<ClientModal client={selected} onClose={closeModal} />
			)}
		</>
	);
}
