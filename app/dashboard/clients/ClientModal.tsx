"use client";

import { useState } from "react";
import CustomInput from "@/app/components/CustomInput";
import { createClient, updateClient } from "./actions";

interface Client {
	id: string;
	name: string;
	phone: string | null;
	email: string | null;
}

interface Props {
	client?: Client;
	onClose: () => void;
}

const REGEX = {
	name: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]{2,50}$/,
	phone: /^\d{10}$/,
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const ERRORS = {
	name: "Solo letras y espacios, entre 2 y 50 caracteres",
	phone: "Debe tener exactamente 10 dígitos",
	email: "Email inválido",
};

export default function ClientModal({ client, onClose }: Props) {
	const [form, setForm] = useState({
		name: client?.name ?? "",
		phone: client?.phone ?? "",
		email: client?.email ?? "",
	});

	const [touched, setTouched] = useState({
		name: false,
		phone: false,
		email: false,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
		setTouched((prev) => ({ ...prev, [e.target.name]: true }));

	const nameError =
		touched.name && !REGEX.name.test(form.name.trim()) ? ERRORS.name : null;
	const phoneError =
		touched.phone && form.phone && !REGEX.phone.test(form.phone)
			? ERRORS.phone
			: null;
	const emailError =
		touched.email && form.email && !REGEX.email.test(form.email)
			? ERRORS.email
			: null;

	const isValid =
		REGEX.name.test(form.name.trim()) &&
		(!form.phone || REGEX.phone.test(form.phone)) &&
		(!form.email || REGEX.email.test(form.email));

	const action = client ? updateClient : createClient;

	return (
		<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-900">
						{client ? "Editar cliente" : "Agregar cliente"}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 text-xl"
					>
						✕
					</button>
				</div>

				<form
					action={async (formData) => {
						await action(formData);
						onClose();
					}}
					className="flex flex-col gap-3"
				>
					{client && (
						<input type="hidden" name="id" value={client.id} />
					)}

					<div className="flex flex-col gap-1">
						<label className="text-xs text-gray-500">
							Nombre completo *
						</label>
						<CustomInput
							name="name"
							type="text"
							value={form.name}
							onChange={handleChange}
							onBlur={handleBlur}
							placeholder="Ej. Juan Pérez"
						/>
						{nameError && (
							<p className="text-red-500 text-xs">{nameError}</p>
						)}
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-xs text-gray-500">
							Teléfono
						</label>
						<CustomInput
							name="phone"
							type="tel"
							value={form.phone}
							onChange={handleChange}
							onBlur={handleBlur}
							placeholder="Ej. 2411234567"
							maxLength={10}
							onKeyDown={(e) => {
								if (
									!/[0-9]/.test(e.key) &&
									![
										"Backspace",
										"Delete",
										"ArrowLeft",
										"ArrowRight",
										"Tab",
									].includes(e.key)
								)
									e.preventDefault();
							}}
						/>
						{phoneError && (
							<p className="text-red-500 text-xs">{phoneError}</p>
						)}
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-xs text-gray-500">Email</label>
						<CustomInput
							name="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							onBlur={handleBlur}
							placeholder="Ej. juan@email.com"
						/>
						{emailError && (
							<p className="text-red-500 text-xs">{emailError}</p>
						)}
					</div>

					<div className="flex gap-2 justify-end pt-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={!isValid}
							className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{client ? "Guardar cambios" : "Agregar"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
