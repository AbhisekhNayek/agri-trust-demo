import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// Inside DashboardView
<Pie data={{
  labels: ["Approved", "Pending", "Processing"],
  datasets: [{
    label: "Claim Status",
    data: [1, 1, 1],
    backgroundColor: ["#22c55e", "#eab308", "#3b82f6"],
    borderColor: ["#14532d", "#854d0e", "#1e40af"],
    borderWidth: 1
  }]
}} options={{
  responsive: true,
  plugins: {
    legend: { position: "top", labels: { color: "#f9fafb" } },
    title: { display: true, text: "Claim Status Distribution", color: "#f9fafb" }
  }
}} />