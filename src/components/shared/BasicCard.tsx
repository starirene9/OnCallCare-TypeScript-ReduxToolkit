import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface CardData {
  name: string;
  value: number;
  doctorCount: number;
}

interface BasicCardProps {
  data: CardData[];
  activeIndex: number;
}

export default function BasicCard({ data, activeIndex }: BasicCardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "10px",
      }}
    >
      <Card
        variant="outlined"
        style={{
          minHeight: "120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardContent style={{ textAlign: "center" }}>
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            Patients Count
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {data[activeIndex]?.value}
          </Typography>
        </CardContent>
      </Card>
      <Card
        variant="outlined"
        style={{
          height: "120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardContent style={{ textAlign: "center" }}>
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            Doctor's Count
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {data[activeIndex]?.doctorCount}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
