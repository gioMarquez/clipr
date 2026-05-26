"use client";

import { useState } from "react";
import CustomInput from "@/app/components/CustomInput";
import { createBarber, updateBarber } from "./actions";

interface Barber {
	id: string;
	name: string;
	phone: string | null;
	specialty: string | null;
}

interface Props {
	barber?: Barber;
	onClose: () => void;
}

const REGEX = {
	name: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]{2,50}$/,
	phone: /^\d{10}$/,
	specialty: /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s,]{2,60}$/,
};

const ERRORS = {
	name: "Solo letras y espacios, entre 2 y 50 caracteres",
	phone: "Debe tener exactamente 10 dígitos",
	specialty: "Solo letras, espacios y comas, entre 2 y 60 caracteres",
};

export default function BarberModal({ barber, onClose }: Props) {
	const [form, setForm] = useState({
		name: barber?.name ?? "",
		phone: barber?.phone ?? "",
		specialty: barber?.specialty ?? "",
	});

	const [touched, setTouched] = useState({
		name: false,
		phone: false,
		specialty: false,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setTouched((prev) => ({ ...prev, [e.target.name]: true }));
	};

	const getError = (field: keyof typeof REGEX, value: string) => {
		if (!value.trim()) return field === "name" ? "Campo requerido" : null;
		return REGEX[field].test(value.trim()) ? null : ERRORS[field];
	};

	const nameError = getError("name", form.name);
	const phoneError = form.phone ? getError("phone", form.phone) : null;
	const specialtyError = form.specialty
		? getError("specialty", form.specialty)
		: null;

	const isValid =
		!nameError && !phoneError && !specialtyError && form.name.trim() !== "";
	const action = barber ? updateBarber : createBarber;

	return (
		<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-900">
						{barber ? "Editar barbero" : "Agregar barbero"}
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
					{barber && (
						<input type="hidden" name="id" value={barber.id} />
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
							placeholder="Ej. Luis González"
						/>
						{touched.name && nameError && (
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
								) {
									e.preventDefault();
								}
							}}
						/>
						{touched.phone && phoneError && (
							<p className="text-red-500 text-xs">{phoneError}</p>
						)}
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-xs text-gray-500">
							Especialidad
						</label>
						<CustomInput
							name="specialty"
							type="text"
							value={form.specialty}
							onChange={handleChange}
							onBlur={handleBlur}
							placeholder="Ej. Corte clásico, Barba"
						/>
						{touched.specialty && specialtyError && (
							<p className="text-red-500 text-xs">
								{specialtyError}
							</p>
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
							{barber ? "Guardar cambios" : "Agregar"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
