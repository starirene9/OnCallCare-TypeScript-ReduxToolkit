import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useIntl } from "react-intl";
import { getTimeAgo } from "../../utils";
interface CardData {
  name: string;
  value: number;
  doctorCount: number;
  timeStamp: string;
}

interface BasicCardProps {
  data: CardData[];
  activeIndex: number;
  timeAgo: string;
}

export default function BasicCard({
  data,
  activeIndex,
  timeAgo,
}: BasicCardProps) {
  const intl = useIntl();

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
        elevation={3}
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
            {intl.formatMessage({ id: "patientCount" })}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {data[activeIndex]?.value}
          </Typography>
        </CardContent>
      </Card>
      <Card
        elevation={3}
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
            {intl.formatMessage({ id: "doctorCount" })}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {data[activeIndex]?.doctorCount}
          </Typography>
        </CardContent>
      </Card>
      {data[activeIndex] && getTimeAgo(data[activeIndex]?.timeStamp) !== "" && (
        <Typography
          variant="caption"
          sx={{
            textAlign: "center",
            fontSize: "11px",
            color: "#666",
            marginTop: "-3px",
          }}
        >
          {intl.formatMessage({ id: "timestamp" }, { time: timeAgo })}
        </Typography>
      )}
    </div>
  );
}
