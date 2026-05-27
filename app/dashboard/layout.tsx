import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import UserMenu from "@/app/components/UserMenu";
import NavTabs from "../components/NavTabs";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();
	if (!session) redirect("/login");

	const initials = session.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-6">
				<div className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
					✂ CLIPR
				</div>
				<UserMenu
					name={session.name}
					email={session.email}
					initials={initials}
				/>
			</nav>

			<NavTabs />

			<main className="p-6">{children}</main>
		</div>
	);
}
