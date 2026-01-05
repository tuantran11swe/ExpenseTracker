import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Title from "./Title";

const COLORS = ["#3b82f6", "#f59e0b", "#ff8042", "#00c49f"];

// Thành phần hiển thị biểu đồ tròn (Doughnut Chart) tóm tắt Thu nhập và Chi phí
const DoughnutChart = ({ dt }) => {
  const data = [
    { name: "Thu nhập", value: dt?.income || 0 }, // Dữ liệu thu nhập
    { name: "Chi phí", value: dt?.expense || 0 }, // Dữ liệu chi phí
  ];

  return (
    <div className="flex flex-col items-center bg-white shadow-sm p-4 rounded-xl w-full md:w-[320px] h-[450px]">
      <Title title="Tóm tắt" />
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend height={36} verticalAlign="bottom" />
          <Pie
            data={data}
            dataKey="value"
            innerRadius={90}
            outerRadius={130}
            paddingAngle={5}
          >
            {data.map((item, index) => (
              <Cell fill={COLORS[index % COLORS.length]} key={item.name} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;
