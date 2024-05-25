import {
  Avatar,
  Badge,
  Divider,
  Grid,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import ProcedureApi from "../../api/procedure.api.js";
import LoadingSpinner from "../LoadingSpinner.jsx";
import { useEffect, useMemo, useRef, useState } from "react";
import Page from "../Page.jsx";
import { getFileUrlByFileId } from "../../utils/file-utils.js";
import { Person } from "@mui/icons-material";
import {
  DateCalendar,
  DayCalendarSkeleton,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import TimeslotsDisplay from "./TimeslotsDisplay.jsx";
import { queryClient } from "../../config/queryClient.js";

function beautifyDuration(duration) {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours ? hours + " h " : " "}${minutes ? minutes + " min" : ""}`;
}

export default function MasterBooking({ master }) {
  const [pickedProcedureId, setPickedProcedureId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Uses dayjs for date handling
  const [month, setMonth] = useState(dayjs()); // Tracks the currently viewed month
  const calendarRef = useRef();
  const [pageable, setPageable] = useState({
    size: 3,
    page: 0,
  });

  const { isLoading: isLoadingProcedures, data: proceduresPage } = useQuery({
    queryKey: ["masters/procedures/book", master.id, pageable],
    queryFn: () =>
      ProcedureApi.getMasterProceduresPage(master.id, {
        ...pageable,
      }).then((res) => res.data),
    keepPreviousData: true,
  });

  useEffect(() => {
    // Only update the pickedProcedureId if it has not been set
    if (proceduresPage?.content.length > 0 && pickedProcedureId === null) {
      setPickedProcedureId(proceduresPage.content[0].id);
    }
  }, [pickedProcedureId, proceduresPage]); // Depend on proceduresPage.content directly if it's stable

  const { data: timeslots, isLoading: isLoadingTimeslots } = useQuery({
    queryKey: ["fetchTimeslots", month, pickedProcedureId],
    queryFn: () =>
      ProcedureApi.getTimeslots(pickedProcedureId, month).then(
        (resp) => resp.data,
      ),
    enabled: !!month && !!pickedProcedureId,
    keepPreviousData: true,
  });

  const getDisplayTimeslots = useMemo(() => {
    const dayTimeslots =
      timeslots?.find((timeslotResponseDto) =>
        dayjs(timeslotResponseDto.searchDate).isSame(selectedDate, "day"),
      )?.timeslots || [];

    return dayTimeslots.sort((a, b) =>
      dayjs(a.startDate).isAfter(dayjs(b.startDate)) ? 1 : -1,
    );
  }, [selectedDate, timeslots]);

  // Helper function to determine if a day has timeslots
  const hasTimeslots = (day, timeslots) => {
    return timeslots?.some((timeslot) =>
      dayjs(timeslot.searchDate).isSame(day, "day"),
    );
  };

  if (isLoadingProcedures) {
    return <LoadingSpinner />;
  }

  const HighlightedDay = styled(PickersDay)(({ theme }) => ({
    "&.Mui-selected": {
      backgroundColor: theme.palette.secondary.main,
    },
  }));

  const ServerDay = (props) => {
    const {
      timeslots: currentTimeslots,
      selectedDate: currentSelectedDate,
      day,
      outsideCurrentMonth,
      ...other
    } = props;

    const dayHasTimeslots = hasTimeslots(day, currentTimeslots);
    const borderColor = dayHasTimeslots ? "secondary.main" : null;

    const isSelected =
      !props.outsideCurrentMonth &&
      dayjs(day).isSame(currentSelectedDate, "day");

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        color="primary"
        variant={dayHasTimeslots ? "dot" : undefined}
      >
        <HighlightedDay
          sx={{
            border: 2,
            borderColor,
          }}
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
          isAnimating={dayHasTimeslots}
          disabled={!dayHasTimeslots}
          selected={isSelected}
        />
      </Badge>
    );
  };

  return (
    <>
      <Stack
        direction="column"
        flex
        alignItems="center"
        justifyContent="center"
      >
        <Avatar
          sx={{
            boxShadow: 10,
            borderColor: "secondary.main",
            borderWidth: 2,
            borderStyle: "dashed",
            width: 100,
            height: 100,
            mb: 2,
          }}
          src={getFileUrlByFileId(master.avatarId)}
          alt={`${master.firstname} ${master.lastname}`}
          className="bg-stone-300"
        >
          <Person color="primary" fontSize="large" />
        </Avatar>
        <Typography
          variant="h5"
          fontWeight="bold"
          className="text-pink-800"
          gutterBottom
        >
          {`${master.firstname} ${master.lastname}`}
        </Typography>
        <Typography variant="h7" gutterBottom>
          Phone:{" "}
          <a href={`tel:+${master.phone}`} className="text-pink-900">
            +{master.phone}
          </a>
        </Typography>
      </Stack>
      <Divider className="my-4" />
      <Stack justifyContent="center" textAlign="center">
        <Typography variant="h5" fontWeight="bold" color="primary">
          Chose <span className="text-pink-800">{master.firstname}</span>&apos;s
          service
        </Typography>
      </Stack>
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        {proceduresPage?.content.map((procedure) => (
          <Grid item xs={12} key={procedure.id}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
              justifyContent={{ xs: "flex-end", sm: "space-between" }}
              sx={{
                p: 2,
                borderRadius: "15px",
                border: pickedProcedureId === procedure.id ? 2 : 0,
                boxShadow: 3, // Elevation effect
              }}
              onClick={() => {
                calendarRef.current.scrollIntoView();
                setPickedProcedureId(procedure.id);
              }}
            >
              <Stack
                sx={{
                  flex: 1, // Takes up remaining space
                  minWidth: 0, // Prevents text stack from taking more space than necessary
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  className="text-pink-800"
                  noWrap
                >
                  {procedure.title}
                </Typography>
                <Typography variant="body1">{procedure.description}</Typography>
                <Typography variant="body1">
                  <span className="font-semibold">Duration:</span>{" "}
                  <span className="text-pink-950">
                    {beautifyDuration(procedure.duration)}
                  </span>
                </Typography>
                <Typography variant="body1">
                  <span className="font-semibold">Price:</span>{" "}
                  <span className="text-pink-950">${procedure.price}</span>
                </Typography>
              </Stack>
              <Radio
                checked={pickedProcedureId === procedure.id}
                name="radio-buttons"
              />
            </Stack>
          </Grid>
        ))}
      </Grid>
      <Stack
        sx={{
          alignItems: {
            xs: "center",
            sm: "center",
            md: "flex-end",
          },
        }}
        mt={2}
      >
        <Page
          className="mt-8"
          page={pageable.page + 1}
          size={proceduresPage.totalPages}
          onPageChange={(page) => setPageable({ ...pageable, page: page - 1 })}
        />
      </Stack>
      <Stack my={4} justifyContent="center" textAlign="center">
        <Typography variant="h5" fontWeight="bold" color="primary">
          Pick available date <span className="text-pink-800">&</span> time
        </Typography>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              views={["month", "day"]}
              ref={calendarRef}
              fixedWeekNumber={6}
              loading={isLoadingTimeslots || isLoadingProcedures}
              renderLoading={() => <DayCalendarSkeleton />}
              month={month}
              value={selectedDate}
              minDate={dayjs()}
              maxDate={dayjs().add(2, "month")}
              onChange={(newDate) => {
                setSelectedDate(newDate);
              }}
              onMonthChange={(newMonth) => {
                setMonth(newMonth);
              }}
              slots={{
                day: ServerDay,
              }}
              slotProps={{
                day: { selectedDate, timeslots },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <TimeslotsDisplay
            onBookConfirm={() =>
              queryClient.invalidateQueries("fetchTimeslots")
            }
            master={master}
            procedure={proceduresPage?.content.find(
              (procedure) => procedure.id === pickedProcedureId,
            )}
            timeslots={getDisplayTimeslots}
            selectedDate={selectedDate}
          />
        </Grid>
      </Grid>
    </>
  );
}
