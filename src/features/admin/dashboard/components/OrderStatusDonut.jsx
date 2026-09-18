import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function OrderStatusDonut({
  items,
  activeIndex = null,
  onSliceEnter,
  onSliceLeave,
}) {
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
          onMouseEnter={(_, index, event) => onSliceEnter?.(index, event)}
          onMouseLeave={onSliceLeave}
        >
          {items.map((item, index) => (
            <Cell
              key={item.id}
              fill={item.fill}
              opacity={activeIndex === null || index === activeIndex ? 1 : 0.22}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}