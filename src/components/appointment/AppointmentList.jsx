import { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Stack,
  Divider,
  Avatar,
  Badge,
  TextField,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../LoadingSpinner.jsx";
import Page from "../Page.jsx";

import { getFileUrlByFileId } from "../../utils/file-utils.js";

import AppointmentApi from "../../api/appointment.api.js";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import BaseDialog from "../BaseDialog.jsx";
import { queryClient } from "../../config/queryClient.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const initialCancelDialogState = {
  open: false,
  appointmentId: null,
  cancelReason: "",
};
export default function AppointmentList() {
  const authUser = useSelector((state) => state.auth.user);
  const isMasterView = authUser.role === "ROLE_MASTER";
  const [cancelDialog, setCancelDialog] = useState(initialCancelDialogState);
  const [pageable, setPageable] = useState({
    size: 5,
    page: 0,
  });
  const navigate = useNavigate();

  const {
    isLoading,
    isFetching,
    data: appointmentsPage,
  } = useQuery({
    queryKey: ["appointments/get", pageable],
    queryFn: () =>
      AppointmentApi.getAppointments(pageable).then((res) => res.data),
    keepPreviousData: true,
  });

  const cancelAppointment = useMutation({
    mutationFn: AppointmentApi.cancelAppointment,
    onSuccess: () => {
      handleCloseDialog();
      toast.success("Appointment canceled");
      queryClient.invalidateQueries("appointments/get");
    },
  });

  function handleMasterClick(masterId, salonLinkName) {
    if (isMasterView) {
      return;
    }
    navigate(`/salons/${salonLinkName}/masters/${masterId}`);
  }

  function handleCloseDialog() {
    setCancelDialog(initialCancelDialogState);
  }
  function handleCancelAppointment() {
    cancelAppointment.mutate({
      appointmentId: cancelDialog.appointmentId,
      cancelReason: cancelDialog.cancelReason,
    });
  }

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      {cancelDialog.open && (
        <BaseDialog
          title="Enter cancellation reason"
          open={cancelDialog.open}
          confirmDisabled={cancelDialog.cancelReason.trim().length === 0}
          onConfirm={handleCancelAppointment}
          onClose={handleCloseDialog}
          confirmButton="Confirm"
          cancelButton="Back"
        >
          <TextField
            className={"shadow-md"}
            fullWidth
            label="Required"
            variant="outlined"
            value={cancelDialog.cancelReason}
            onChange={(event) =>
              setCancelDialog((prevState) => ({
                ...prevState,
                cancelReason: event.target.value,
              }))
            }
          />
        </BaseDialog>
      )}
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        gap={2}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary"
          ml={1}
          gutterBottom
        >
          Appointments
        </Typography>
      </Stack>
      <Divider className="my-4" />
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        {appointmentsPage.content.map((appointment) => (
          <Grid item xs={12} key={appointment.id}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
              justifyContent={{ xs: "flex-end", sm: "space-between" }}
              sx={{
                p: 2,
                borderRadius: "15px",
                boxShadow: 3, // Elevation effect
              }}
            >
              <Avatar
                sx={{
                  boxShadow: 3,
                  borderColor: "secondary.main",
                  borderWidth: 2,
                  borderStyle: "dashed",
                  width: 86,
                  height: 86,
                  marginRight: 2,
                }}
                src={getFileUrlByFileId(
                  isMasterView
                    ? appointment.client.avatarId
                    : appointment.master.avatarId,
                )}
                alt="avatar"
                onClick={() =>
                  handleMasterClick(
                    appointment.master.id,
                    appointment.salon.linkName,
                  )
                }
                className="bg-stone-300 hover:animate-pulse"
              >
                <Person color="primary" fontSize="large" />
              </Avatar>
              <Stack
                sx={{
                  flex: 1, // Takes up remaining space
                  minWidth: 0, // Prevents text stack from taking more space than necessary
                }}
                gap={1}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  className="text-pink-800"
                  flexWrap="wrap"
                >
                  {`${appointment.salon.title} - ${appointment.procedure.title}`}
                </Typography>
                <Typography
                  variant="h7"
                  fontWeight="bold"
                  className="text-pink-800"
                  flexWrap="wrap"
                >
                  {`${dayjs(appointment.startDate).format("MMMM DD")}, ${dayjs(appointment.startDate).format("HH:mm")} - ${dayjs(appointment.endDate).format("HH:mm")}`}
                </Typography>
                <Typography
                  variant="h7"
                  fontWeight="bold"
                  color="primary"
                  flexWrap="wrap"
                >
                  {isMasterView
                    ? `${appointment.client.firstname} ${appointment.client.lastname}`
                    : `${appointment.master.firstname} ${appointment.master.lastname}`}
                </Typography>
                <Typography variant="body1" noWrap>
                  Phone:{" "}
                  {isMasterView ? (
                    <a
                      href={`tel:+${appointment.client.phone}`}
                      className="text-pink-900"
                    >
                      +{appointment.client.phone}
                    </a>
                  ) : (
                    <a
                      href={`tel:+${appointment.master.phone}`}
                      className="text-pink-900"
                    >
                      +{appointment.master.phone}
                    </a>
                  )}
                </Typography>
                {appointment.canceledReason && (
                  <Typography variant="body1" wrap="wrap">
                    Cancel reason: {appointment.canceledReason}
                  </Typography>
                )}
              </Stack>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="flex-end"
                gap={3}
                spacing={1}
                p={2}
                pr={4}
              >
                <Badge
                  color={
                    appointment.status === "ACTIVE" ? "secondary" : "primary"
                  }
                  badgeContent={
                    appointment.status === "CANCELED"
                      ? "Canceled"
                      : dayjs(appointment.endDate).isBefore(dayjs())
                        ? "Finished"
                        : "Upcoming"
                  }
                  sx={{
                    ".MuiBadge-badge": {
                      fontSize: "0.75rem",
                      height: "auto",
                      padding: "6px 8px",
                    },
                  }}
                />
                {appointment.status === "ACTIVE" && (
                  <Badge
                    className="cursor-pointer"
                    size="small"
                    badgeContent="Cancel"
                    onClick={() => {
                      setCancelDialog({
                        open: true,
                        appointmentId: appointment.id,
                        cancelReason: "",
                      });
                    }}
                  />
                )}
              </Stack>
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
          size={appointmentsPage.totalPages}
          onPageChange={(page) => setPageable({ ...pageable, page: page - 1 })}
        />
      </Stack>
    </Container>
  );
}
