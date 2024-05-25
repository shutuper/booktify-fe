import { Typography, Badge, Stack } from "@mui/material";
import dayjs from "dayjs";
import { Fragment, useState } from "react";
import BookingDialog from "../BookingDialog.jsx";
import { toast } from "react-toastify";

const initialState = {
  open: false,
  timeslot: null,
};
const TimeslotsDisplay = ({
  master,
  procedure,
  timeslots,
  selectedDate,
  onBookConfirm,
}) => {
  const noTimeslots = !timeslots || timeslots.length === 0;
  const [bookingDialog, setBookingDialog] = useState(initialState);

  function handleOpenDialog(timeslot) {
    setBookingDialog({
      open: true,
      timeslot,
    });
  }

  function handleDialogClose() {
    setBookingDialog(initialState);
  }

  function handleBookingConfirm() {
    setBookingDialog(initialState);
    toast.success("Appointment booked successfully!");
    onBookConfirm();
  }

  return (
    <Stack>
      {bookingDialog.open && (
        <BookingDialog
          open={bookingDialog.open}
          timeslot={bookingDialog.timeslot}
          onClose={handleDialogClose}
          onConfirm={handleBookingConfirm}
          master={master}
          procedure={procedure}
        />
      )}
      <Typography variant="h6" textAlign="center" gutterBottom>
        {noTimeslots
          ? "Chose available date"
          : `Time slots for ${dayjs(selectedDate).format("DD MMM YYYY")}`}
      </Typography>
      <Stack
        mt={1}
        direction="row"
        gap={2}
        alignItems="center"
        alignContent="center"
        sx={{
          justifyContent: { xs: "center", sm: "flex-start" }, // center on extra-small devices, flex-start from small devices and up
        }}
        flexWrap="wrap"
      >
        {timeslots.map((timeslot, index) => (
          <Fragment key={index}>
            <Badge color="primary" overlap="circular">
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                className="shadow-xl rounded-xl cursor-pointer"
                color="primary"
                sx={{
                  px: 3,
                  py: 1,
                  borderColor: "secondary.main",
                  borderRadius: "10%",
                  border: 1.9,
                  borderStyle: "solid",
                  "&:hover": {
                    backgroundColor: "secondary.main",
                    color: "primary.contrastText",
                    border: 0,
                  },
                }}
                onClick={() => handleOpenDialog(timeslot)}
              >
                <Typography variant="h7" fontWeight="bold">
                  {dayjs(timeslot.startDate).format("HH:mm")}
                </Typography>
              </Stack>
            </Badge>
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
};

export default TimeslotsDisplay;
