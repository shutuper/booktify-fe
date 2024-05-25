import { TextField, Button, Box } from "@mui/material";
import Typography from "@mui/material/Typography";

const TimeSlot = ({ id, timeSlot, onChange, onDelete, isEditMode }) => {
  const handleTimeChange = (field, value) => {
    onChange(id, field, value);
  };

  let content;

  if (isEditMode) {
    content = (
      <>
        <TextField
          focused={true}
          label="Start Time"
          type="time"
          size="small"
          color="secondary"
          disabled={!isEditMode}
          value={timeSlot.startTime}
          onChange={(e) => handleTimeChange("startTime", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Time"
          focused={true}
          type="time"
          size="small"
          disabled={!isEditMode}
          color="secondary"
          value={timeSlot.endTime}
          onChange={(e) => handleTimeChange("endTime", e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </>
    );
  } else {
    content = (
      <>
        <Typography>{`${timeSlot.startTime} - ${timeSlot.endTime}`}</Typography>
      </>
    );
  }

  return (
    <Box display="flex" gap={2} alignItems="center">
      {content}
      {isEditMode && (
        <Button variant="outlined" color="error" onClick={() => onDelete(id)}>
          Remove
        </Button>
      )}
    </Box>
  );
};

export default TimeSlot;
