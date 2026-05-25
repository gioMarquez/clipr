"use client";

import { useState, useRef, useEffect } from "react";
import { logoutUser } from "../dashboard/actions";

interface Props {
	name: string;
	email: string;
	initials: string;
}

export default function UserMenu({ name, email, initials }: Props) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={ref}>
			<button
				onClick={() => setOpen(!open)}
				className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
			>
				<div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-medium">
					{initials}
				</div>
				{name}
				<span className="text-gray-400 text-xs">
					{open ? "▲" : "▼"}
				</span>
			</button>

			{open && (
				<div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
					<div className="px-4 py-3 border-b border-gray-100">
						<p className="text-sm font-medium text-gray-900">
							{name}
						</p>
						<p className="text-xs text-gray-400">{email}</p>
					</div>

					<div className="py-1">
						<a
							href="/dashboard/perfil"
							className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
						>
							👤 Mi perfil
						</a>
						<form action={logoutUser}>
							<button
								type="submit"
								className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
							>
								🚪 Cerrar sesión
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
