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
import AuthApi from "../api/auth.api.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SalonApi from "../api/salon.api.js";

const SignUpForm = () => {
  const { handleSubmit, control, formState } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("inviteToken");

  const { data: salonFromInvite, isLoading: isLoadingInvitation } = useQuery({
    queryKey: ["invite", inviteToken],
    queryFn: () =>
      SalonApi.getSalonFromInviteToken({ inviteToken }).then(
        (resp) => resp.data,
      ),
    enabled: !!inviteToken, // Only execute the query if inviteToken is defined
  });

  const handleClickShowPassword = () =>
    setShowPassword((prevState) => !prevState);

  const anyError =
    formState.errors && Object.keys(formState.errors).length !== 0;

  const onSubmit = (signUpDto) => {
    async function signUp() {
      await AuthApi.signUpMaster({
        ...signUpDto,
        phone: getValidPhoneNumber(await signUpDto.phone),
        inviteToken: inviteToken,
      });
    }

    signUp().then(() => navigate("/sign-in"));
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
          <p>⏳ Sign up for business 💅</p>
          <Divider className="my-2" />
        </Typography>
        {isLoadingInvitation && (
          <Typography>Loading your invitation...</Typography>
        )}
        {salonFromInvite && (
          <Typography>
            You have been invited to join {salonFromInvite.title}
          </Typography>
        )}
        <Box className="mt-6" />
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <Box className="mt-5" />
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
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  className={anyError ? null : "shadow-xl"}
                  label="Email"
                  variant="outlined"
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
              rules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
            />
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
                  label="Password*"
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
              rules={{
                required: "Password required",
                minLength: {
                  value: 8,
                  message: "Minimal password length - 8 characters",
                },
              }}
            />
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
              Sign up
            </Button>
            <Typography
              className="mt-3 hover:font-bold cursor-pointer"
              variant="subtitle2"
              onClick={() => navigate("/sign-in")}
            >
              Have an account? - Login
            </Typography>
          </div>
        </form>
      </Stack>
    </Stack>
  );
};

export default SignUpForm;
