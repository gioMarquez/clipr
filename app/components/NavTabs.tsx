"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
	{ label: "Resumen", href: "/dashboard" },
	{ label: "Calendario", href: "/dashboard/calendar" },
	{ label: "Clientes", href: "/dashboard/clients" },
	{ label: "Barberos", href: "/dashboard/barbers" },
	{ label: "Reportes", href: "/dashboard/reports" },
];

export default function NavTabs() {
	const pathname = usePathname();

	const isActive = (href: string) =>
		href === "/dashboard"
			? pathname === "/dashboard"
			: pathname.startsWith(href);

	return (
		<div className="bg-white border-b border-gray-200 px-6 flex gap-0">
			{tabs.map((tab) => (
				<Link
					key={tab.href}
					href={tab.href}
					className={`px-4 py-3 text-sm border-b-2 transition-all ${
						isActive(tab.href)
							? "text-blue-600 border-blue-600 font-medium"
							: "text-gray-500 border-transparent hover:text-blue-600 hover:border-blue-600"
					}`}
				>
					{tab.label}
				</Link>
			))}
		</div>
	);
}
