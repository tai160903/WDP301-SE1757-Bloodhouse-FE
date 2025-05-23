import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBuilding,
  faBlog,
  faTint,
} from "@fortawesome/free-solid-svg-icons";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Chart data
const chartData = {
  labels: ["Users", "Facilities", "Blog Posts", "Blood Groups"],
  datasets: [
    {
      label: "Count",
      data: [5, 10, 20, 5],
      backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6", "#ef4444"],
      borderRadius: 5,
    },
  ],
};

// Chart options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Dashboard Overview",
    },
  },
};

function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
        <Card icon={faUsers} label="Users" value={5} color="text-blue-500" />
        <Card
          icon={faBuilding}
          label="Facilities"
          value={10}
          color="text-green-500"
        />
        <Card
          icon={faBlog}
          label="Blog Posts"
          value={20}
          color="text-purple-500"
        />
        <Card
          icon={faTint}
          label="Blood Groups"
          value={5}
          color="text-red-500"
        />
      </div>

      <div className="bg-white p-4 shadow rounded">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

// Card component for DRYness
function Card({ icon, label, value, color }: any) {
  return (
    <div className="bg-white shadow p-4 rounded flex flex-col items-start">
      <div className="w-full flex justify-between items-center mb-2">
        <p className="text-gray-600 font-medium">{label}</p>
        <FontAwesomeIcon icon={icon} className={`${color} text-xl`} />
      </div>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}

export default Dashboard;
