import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Title from "./Title";

// Thành phần hiển thị biểu đồ đường (Line Chart) cho hoạt động giao dịch (Thu nhập & Chi phí)
export const Chart = ({ data }) => {
  return (
    <div className="flex-1 w-full">
      <Title title="Hoạt động giao dịch" />

      <ResponsiveContainer className="mt-5" height={500} width={"100%"}>
        <LineChart
          data={data}
          height={300}
          margin={{
            bottom: 5,
            left: 20,
            right: 30,
            top: 5,
          }}
          width={500}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" padding={{ left: 30, right: 30 }} />
          <YAxis width={80} />
          <Tooltip />
          <Legend />

          {/* Biểu diễn thu nhập và chi phí bằng các đường kẻ */}
          <Line
            activeDot={{ r: 8 }}
            dataKey="income"
            name="Thu nhập"
            stroke="#8884d8"
            type="monotone"
          />
          <Line
            dataKey="expense"
            name="Chi phí"
            stroke="#82ca9d"
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
