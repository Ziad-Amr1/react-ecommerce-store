import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function OrderStatusDonut({ items }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={items}
          dataKey="count"
          nameKey="label"
          innerRadius="60%"
          outerRadius="85%"
          paddingAngle={2}
          stroke="var(--color-surface)"
          strokeWidth={2}
        >
          {items.map((item) => (
            <Cell key={item.id} fill={item.fill} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}