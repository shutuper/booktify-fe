import { Button, Divider, Stack } from "@mui/material";
import DaySchedule from "./DaySchedule.jsx";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getWorkSchedules,
  workSchedulesUpdate,
} from "../../store/workScheduleReducer.js";

const daysOfWeek = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DayScheduler = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const workSchedules = useSelector(
    (state) => state.workSchedule.workSchedules,
  );
  const [timeslots, setTimeslots] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWorkSchedules());
  }, [dispatch]);

  useEffect(() => {
    setTimeslots([...workSchedules]);
  }, [workSchedules]);

  const saveWorkSchedule = useCallback(() => {
    (async () => {
      const resultAction = await dispatch(workSchedulesUpdate(timeslots));
      if (!workSchedulesUpdate.rejected.match(resultAction)) {
        setIsEditMode(false);
      }
    })();
  }, [dispatch, timeslots]);

  const handleAddTimeSlot = useCallback((dayOfWeek) => {
    setTimeslots((prevState) => {
      const lastEndDate = prevState
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .findLast((timeslot) => timeslot.dayOfWeek === dayOfWeek);

      return [
        ...prevState,
        {
          id: Math.random(),
          startTime: lastEndDate?.endTime ?? "08:00:00",
          endTime: lastEndDate?.endTime ?? "17:00:00",
          dayOfWeek: dayOfWeek,
        },
      ];
    });
  }, []);

  const handleTimeChange = useCallback((id, field, value) => {
    setTimeslots((prevState) => {
      return prevState.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot,
      );
    });
  }, []);

  const handleDeleteTimeSlot = useCallback((id) => {
    setTimeslots((prevState) => {
      return prevState.filter((slot) => slot.id !== id);
    });
  }, []);

  const handleCancelEdit = () => {
    setTimeslots([...workSchedules]);
    setIsEditMode(false);
  };

  const memoizedDaysSchedules = useMemo(() => {
    return daysOfWeek.map((day) => ({
      day,
      timeslots: timeslots.filter((schedule) => schedule.dayOfWeek === day),
    }));
  }, [timeslots]);

  return (
    <Container>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Typography variant="h5" fontWeight="bold" color="primary">
          My working schedule
        </Typography>
        <Stack direction="row" spacing={2}>
          {isEditMode ? (
            <>
              <Button variant="outlined" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={saveWorkSchedule}
              >
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setIsEditMode(true)}
            >
              Edit
            </Button>
          )}
        </Stack>
      </Stack>
      <Divider className="my-4" />
      {memoizedDaysSchedules.map(({ day, timeslots }) => (
        <DaySchedule
          key={day}
          dayOfWeek={day}
          onTimeChange={handleTimeChange}
          onDeleteTimeslot={handleDeleteTimeSlot}
          onAddTimeslot={handleAddTimeSlot}
          isEditMode={isEditMode}
          timeslots={timeslots}
        />
      ))}
    </Container>
  );
};

export default DayScheduler;
