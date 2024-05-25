import BaseDialog from "./BaseDialog.jsx";
import { Stack, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import MuiPhoneNumber from "mui-phone-number";
import { getValidPhoneNumber, validatePhoneNumber } from "../helper/helper.js";
import Box from "@mui/material/Box";
import AuthApi from "../api/auth.api.js";
import { useRef, useState } from "react";
import AppointmentApi from "../api/appointment.api.js";
import { MuiOtpInput } from "mui-one-time-password-input";
import localforage from "localforage";
import { updateUser } from "../store/authReducer.js";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../config/queryClient.js";

const initialOtpState = {
  sent: false,
  userId: null,
};
export default function BookingDialog({
  open,
  onClose,
  onConfirm,
  timeslot,
  procedure,
  master,
}) {
  const { handleSubmit, control, formState } = useForm();
  const currentUser = useSelector((state) => state.auth.user);
  const [otpState, setOtpState] = useState(initialOtpState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const formRef = useRef();

  const anyError =
    formState.errors && Object.keys(formState.errors).length !== 0;
  const isMasterUser = currentUser?.role === "ROLE_MASTER";
  const isClientUser = currentUser?.role === "ROLE_CLIENT";
  const isAnonUser = !currentUser;

  const handleOtpChange = (newValue) => {
    setOtp(newValue);
  };

  const handleOtpConfirm = () => {
    async function signInStep2(dto) {
      const { data } = await AuthApi.signInStep2(dto);
      return data;
    }

    if (otp && otp.length === 6 && otpState.userId) {
      signInStep2({ code: otp, userId: otpState.userId }).then(
        (authUserDto) => {
          queryClient.clear();
          localforage.setItem("accessToken", authUserDto.accessToken);
          localforage.setItem("refreshToken", authUserDto.refreshToken);
          dispatch(updateUser(authUserDto.user));
          setOtpState(initialOtpState);
        },
      );
    }
  };

  const onSubmit = (clientDto) => {
    async function bookAppointmentByMaster() {
      await AppointmentApi.bookAppointmentByMaster({
        client: {
          firstname: clientDto.firstname,
          lastname: clientDto.lastname,
          phone: getValidPhoneNumber(clientDto.phone),
        },
        procedureId: procedure.id,
        ...timeslot,
      });
    }

    if (isMasterUser) {
      bookAppointmentByMaster().then(() => onConfirm());
      return;
    }

    async function bookAppointment() {
      await AppointmentApi.bookAppointment({
        procedureId: procedure.id,
        ...timeslot,
      });
    }

    if (isClientUser) {
      bookAppointment().then(() => {
        onConfirm();
        if (isClientUser) {
          navigate("/appointments");
        }
      });
      return;
    }

    async function signUpClient() {
      const { data } = await AuthApi.signUpClient({
        ...clientDto,
        phone: getValidPhoneNumber(await clientDto.phone),
      });
      return data;
    }

    signUpClient().then((data) => {
      setOtpState({ sent: true, userId: data.userId });
    });
  };

  function handleConfirm() {
    if (isClientUser) {
      onSubmit(currentUser);
      return;
    }
    formRef.current.requestSubmit();
  }

  if (otpState.sent) {
    return (
      <BaseDialog
        open={true}
        onClose={() => setOtpState(initialOtpState)}
        title="Enter otp code from sms 💬"
        confirmButton="Confirm"
        onConfirm={handleOtpConfirm}
      >
        <MuiOtpInput
          TextFieldsProps={{ autoFocus: true }}
          display="flex"
          sx={{ width: "300px" }}
          gap={1}
          length={6}
          value={otp}
          onChange={handleOtpChange}
        />
      </BaseDialog>
    );
  }

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Confirm booking details"
      confirmButton="Book"
      onConfirm={handleConfirm}
    >
      <Stack flex gap={1}>
        <Typography
          variant="h7"
          color="primary"
          gutterBottom
        >{`Master: ${master.firstname} ${master.lastname}`}</Typography>
        <Typography
          variant="h7"
          color="primary"
          gutterBottom
        >{`Procedure: ${procedure.title} - $${procedure.price}`}</Typography>{" "}
        <Typography
          variant="h7"
          color="primary"
          gutterBottom
        >{`Time: ${dayjs(timeslot.startDate).format("HH:mm")} - ${dayjs(timeslot.endDate).format("HH:mm")} ${dayjs(timeslot.startDate).format("MMMM DD")}`}</Typography>
        {(isMasterUser || isAnonUser) && (
          <Stack spacing={2} mt={2}>
            {isMasterUser && <Typography>Enter client info</Typography>}
            {isAnonUser && <Typography>Enter your info</Typography>}
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
              <Stack direction="row" spacing={2}>
                <Controller
                  name="firstname"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      className={anyError ? null : "shadow-md"}
                      label="First Name*"
                      variant="outlined"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                  rules={{ required: "First name required" }}
                />
                <Controller
                  name="lastname"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      className={anyError ? null : "shadow-md"}
                      label="Last Name*"
                      variant="outlined"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                  rules={{ required: "Last name required" }}
                />
              </Stack>
              <Box mt={2} />
              <Stack spacing={2}>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <MuiPhoneNumber
                      className={anyError ? null : "shadow-xl"}
                      defaultCountry={"ua"}
                      onlyCountries={["ua"]}
                      label="Phone number*"
                      variant="outlined"
                      value={value}
                      onChange={onChange}
                      error={!!error}
                      helperText={error ? error.message : null}
                    />
                  )}
                  rules={{
                    required: "Phone number required",
                    validate: (phone) => validatePhoneNumber(phone),
                  }}
                />
              </Stack>
              <Box className="mt-6" />
            </form>
          </Stack>
        )}
      </Stack>
    </BaseDialog>
  );
}
