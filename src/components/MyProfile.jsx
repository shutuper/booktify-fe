import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { Avatar, Badge, Divider, Grid, Stack } from "@mui/material";
import { Delete, Person, PhotoCamera } from "@mui/icons-material";
import Container from "@mui/material/Container";
import { useRef } from "react";
import FileApi from "../api/file.api.js";
import UserApi from "../api/user.api.js";
import { updateUser } from "../store/authReducer.js";
import { getFileUrlByFileId } from "../utils/file-utils.js";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

export default function MyProfile({ hScreen }) {
  const user = useSelector((state) => state.auth.user);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      const { data } = await FileApi.uploadFile(file);
      await UserApi.updateAvatar({
        avatarId: data.id,
      });

      dispatch(updateUser({ ...user, avatarId: data.id }));
    } catch (error) {
      /* empty */
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await UserApi.updateAvatar({
        avatarId: null,
      });

      dispatch(updateUser({ ...user, avatarId: null }));
    } catch (error) {
      /* empty */
    }
  };

  return (
    <Box className={hScreen ? "h-screen" : null}>
      <Container>
        <Typography variant="h5" fontWeight="bold" color="primary">
          My profile
        </Typography>
        <Divider className="my-4" />
      </Container>
      <Container className="mt-8">
        <Grid container spacing={{ xs: 2, md: 3 }} gap={{ xs: 4, md: 8 }}>
          <Grid item>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <>
                  {user.avatarId ? (
                    <IconButton
                      onClick={handleAvatarDelete}
                      sx={{
                        border: "5px solid white",
                        backgroundColor: "#ff558f",
                        borderRadius: "50%",
                        padding: ".2rem",
                        width: 35,
                        height: 35,
                      }}
                    >
                      <Delete aria-label="delete" />
                    </IconButton>
                  ) : (
                    <PhotoCamera
                      sx={{
                        border: "5px solid white",
                        backgroundColor: "#ff558f",
                        borderRadius: "50%",
                        padding: ".2rem",
                        width: 35,
                        height: 35,
                      }}
                    />
                  )}
                </>
              }
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mb: 1.5,
                  borderColor: "secondary.main",
                  borderWidth: 3,
                  borderStyle: "dashed",
                }}
                onClick={handleAvatarClick}
                className="bg-stone-100 shadow-2xl hover:bg-pink-400 hover:animate-pulse"
                src={getFileUrlByFileId(user.avatarId) ?? null}
              >
                <Person fontSize="large" color="primary" />
              </Avatar>
            </Badge>
          </Grid>
          <Grid item xs className="mt-4">
            <Grid container spacing={2}>
              <Stack spacing={2}>
                <Stack direction="row" gap={2}>
                  <Typography fontWeight="bold">Name:</Typography>
                  <Typography>
                    {`${user.firstname} ${user.lastname}`}
                  </Typography>
                </Stack>
                <Stack direction="row" gap={2}>
                  <Typography fontWeight="bold">Phone number:</Typography>
                  <Typography>
                    <a href={`tel:+${user.phone}`}>+{user.phone}</a>
                  </Typography>
                </Stack>
                <Stack direction="row" gap={2}>
                  <Typography fontWeight="bold">Email:</Typography>
                  <Typography>
                    {user.email ? (
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    ) : (
                      "-"
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Divider className="my-4" />
    </Box>
  );
}
