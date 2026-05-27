import { getReportsData } from "./data";
import Charts from "./Charts";

export default async function ReportsPage() {
	const data = await getReportsData();
	return <Charts {...data} />;
}
