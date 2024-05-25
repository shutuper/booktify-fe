import { Button, Stack } from "@mui/material";
import TimeSlot from "./TimeSlot.jsx";
import Typography from "@mui/material/Typography";

const DaySchedule = ({
  dayOfWeek,
  isEditMode,
  timeslots,
  onTimeChange,
  onAddTimeslot,
  onDeleteTimeslot,
}) => {
  const noTimeslotsPerDay = !timeslots || timeslots.length === 0;

  return (
    <>
      <h3 className="capitalize text-pink-900">
        {dayOfWeek.toLocaleLowerCase()}
      </h3>
      <Stack
        direction={isEditMode ? "column" : "row"}
        flexWrap="wrap"
        marginBottom={3}
        gap={2}
        alignItems={isEditMode ? "flex-start" : "center"}
      >
        {noTimeslotsPerDay ? (
          <Typography>Day off</Typography>
        ) : (
          timeslots.map((slot) => (
            <TimeSlot
              sx={{ mr: 2, mb: 2 }}
              key={slot.id}
              id={slot.id}
              timeSlot={slot}
              isEditMode={isEditMode}
              onChange={onTimeChange}
              onDelete={onDeleteTimeslot}
            />
          ))
        )}
        {isEditMode && (
          <Button
            onClick={() => onAddTimeslot(dayOfWeek)}
            variant="outlined"
            className="mt-2"
          >
            Add Time Slot
          </Button>
        )}
      </Stack>
    </>
  );
};

export default DaySchedule;
