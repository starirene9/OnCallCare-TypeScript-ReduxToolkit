import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

interface SwtichProps {
  name: string;
  labelPlacement?: "start" | "end" | "top" | "bottom";
  labelStyle?: React.CSSProperties;
}

export default function FormControlLabelPosition({
  name,
  labelPlacement = "start",
  labelStyle = {},
}: SwtichProps) {
  return (
    <FormControl component="fieldset">
      <FormGroup aria-label="position" row>
        <FormControlLabel
          value={name}
          control={<Switch color="primary" />}
          label={<span style={labelStyle}>{name}</span>}
          labelPlacement={labelPlacement}
        />
      </FormGroup>
    </FormControl>
  );
}
