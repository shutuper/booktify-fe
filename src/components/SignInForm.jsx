import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Divider,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MuiPhoneNumber from "mui-phone-number";
import { getValidPhoneNumber, validatePhoneNumber } from "../helper/helper.js";
import { useState } from "react";
import BaseDialog from "./BaseDialog.jsx";
import { MuiOtpInput } from "mui-one-time-password-input";
import AuthApi from "../api/auth.api.js";
import localforage from "localforage";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/authReducer.js";
import { useLocation, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { queryClient } from "../config/queryClient.js";

const SignInPage = () => {
  const { handleSubmit, control, formState } = useForm();
  const [openDialog, setOpenDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const { state: locationState } = useLocation();

  const handleClickShowPassword = () =>
    setShowPassword((prevState) => !prevState);

  function authenticate(authUserDto) {
    (async () => {
      await queryClient.clear();
      await localforage.setItem("accessToken", authUserDto.accessToken);
      await localforage.setItem("refreshToken", authUserDto.refreshToken);
      await dispatch(updateUser(authUserDto.user));
      const redirectToSignIn =
        locationState?.redirectTo?.pathname === "/sign-in";
      if (redirectToSignIn) {
        navigate("/");
        return;
      }

      navigate(
        `${locationState?.redirectTo?.pathname || "/"}${locationState?.redirectTo?.search || ""}`,
      );
    })();
  }

  function handleDialogClose() {
    setOpenDialog(false);
  }

  const anyError =
    formState.errors && Object.keys(formState.errors).length !== 0;

  const onSubmit = (dto) => {
    async function signInStep1() {
      const { data } = await AuthApi.signInStep1({
        ...dto,
        phone: getValidPhoneNumber(dto.phone),
      });
      return data;
    }

    signInStep1().then((authUserDto) => {
      if (authUserDto.otpSent) {
        setUser(authUserDto.user);
        setOpenDialog(true);
      } else {
        authenticate(authUserDto);
      }
    });
  };

  const handleOtpChange = (newValue) => {
    setOtp(newValue);
  };

  const handleOtpConfirm = () => {
    async function signInStep2(dto) {
      const { data } = await AuthApi.signInStep2(dto);
      return data;
    }

    if (otp && otp.length === 6 && user) {
      signInStep2({ code: otp, userId: user.id }).then((authUserDto) => {
        authenticate(authUserDto);
      });
    }
  };

  return (
    <Stack
      className="mt-8 text-center items-center border-4 border-stone-600"
      justifyContent="center"
    >
      <Stack
        alignItems="center"
        className="shadow-2xl bg-stone-100"
        sx={{
          border: 2,
          color: "secondary.main",
          borderColor: "secondary",
          p: 6,
          borderRadius: 6,
          borderStyle: "dashed",
        }}
      >
        <Typography variant="h4" color="primary" fontWeight="bold">
          <p>Login to your account 💅</p>
          <Divider className="mt-2" />
        </Typography>
        <Box className="mt-6" />
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <Box className="mt-4" />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  className={anyError ? null : "shadow-xl"}
                  label="Password (optional)"
                  variant="outlined"
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Typography variant="caption" px={1}>
              If no password is entered, you will receive an SMS code
            </Typography>
          </Stack>
          <Box className="mt-6" />
          <div>
            <Button
              type="submit"
              size="large"
              variant="outlined"
              color="primary"
              className="font-bold animate-pulse shadow-xl"
            >
              Login now
            </Button>
          </div>
        </form>
      </Stack>
      <BaseDialog
        open={openDialog}
        onClose={handleDialogClose}
        title="Enter otp code from sms 💬"
        confirmButton="Confirm"
        onConfirm={handleOtpConfirm}
      >
        <MuiOtpInput
          autoFocus
          TextFieldsProps={{ type: "tel", autoFocus: true, marginLeft: 0 }}
          display="flex"
          sx={{
            width: {
              xs: "260px",
              md: "300px",
            },
          }}
          gap={1}
          length={6}
          value={otp}
          onChange={handleOtpChange}
        />
      </BaseDialog>
    </Stack>
  );
};

export default SignInPage;
