import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function StatsChart({ videoA, videoB }) {

  if (!videoA || !videoB) {
    return null;
  }

  const data = [
    {
      metric: "Views",
      VideoA: videoA.views || 0,
      VideoB: videoB.views || 0
    },
    {
      metric: "Likes",
      VideoA: videoA.likes || 0,
      VideoB: videoB.likes || 0
    },
    {
      metric: "Comments",
      VideoA: videoA.comments || 0,
      VideoB: videoB.comments || 0
    },
    {
      metric: "Engagement",
      VideoA: videoA.engagement_rate || 0,
      VideoB: videoB.engagement_rate || 0
    }
  ];

  return (
    <div
      style={{
        marginTop: "30px",
        border: "1px solid gray",
        padding: "20px"
      }}
    >
      <h2>Analytics Dashboard</h2>

      <ResponsiveContainer
        width="100%"
        height={400}
      >
        <BarChart data={data}>
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar
            dataKey="VideoA"
            name="Video A"
          />

          <Bar
            dataKey="VideoB"
            name="Video B"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatsChart;