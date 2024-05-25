import { useForm } from "react-hook-form";
import {
  Button,
  TextField,
  Grid,
  Container,
  Typography,
  Divider,
  Badge,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Delete, PhotoCamera, Upload } from "@mui/icons-material";
import { getFileUrlByFileId } from "../../utils/file-utils.js";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../LoadingSpinner.jsx";
import FileApi from "../../api/file.api.js";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export default function SalonForm({ salon, onSave, onCancel }) {
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState({
    avatar: false,
    banner: false,
  });
  const [fileIds, setFileIds] = useState({
    avatarId: salon?.avatarId || null,
    bannerId: salon?.bannerId || null,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: salon?.title || "",
      linkName: salon?.linkName || "",
      description: salon?.description || "",
      address: salon?.address || "",
    },
  });

  useEffect(() => {
    reset({
      title: salon?.title || "",
      linkName: salon?.linkName || "",
      description: salon?.description || "",
      address: salon?.address || "",
    });

    setFileIds({
      avatarId: salon?.avatarId || null,
      bannerId: salon?.bannerId || null,
    });
  }, [reset, salon]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleImageClick = (inputRef) => {
    inputRef.current.click();
  };

  const handleImageChange = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageLoading({
      ...imageLoading,
      [type]: true,
    });

    try {
      const { data } = await FileApi.uploadFile(file);
      setFileIds((prev) => ({ ...prev, [type]: data.id }));
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setImageLoading({
        ...imageLoading,
        [type]: false,
      });
    }
  };

  const handleImageDelete = (type) => {
    setFileIds((prev) => ({ ...prev, [type]: null }));
  };

  const onSubmit = (salonDto) => {
    (async () => {
      setIsLoading(true);

      salonDto.avatarId = fileIds.avatarId;
      salonDto.bannerId = fileIds.bannerId;
      onSave(salonDto);
      setIsLoading(false);
    })();
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" fontWeight="bold" color="primary">
        My salon
      </Typography>
      <Divider className="my-4" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid
            item
            xs={12}
            sm={6}
            container
            justifyContent="center"
            alignItems="center"
          >
            <Container className="mt-2">
              <Typography
                variant="h6"
                fontWeight="semi-bold"
                color="primary"
                textAlign="center"
              >
                Banner
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center">
                <input
                  type="file"
                  accept="image/*"
                  ref={bannerInputRef}
                  style={{ display: "none" }}
                  onChange={(event) => handleImageChange(event, "bannerId")}
                />
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <>
                      {fileIds.bannerId ? (
                        <IconButton
                          onClick={() => handleImageDelete("bannerId")}
                          sx={{
                            border: "5px solid white",
                            backgroundColor: "#ff558f",
                            borderRadius: "50%",
                            padding: ".2rem",
                            width: 35,
                            height: 35,
                          }}
                        >
                          <Delete />
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
                  <Box
                    sx={{
                      width: 400, // Use 100% width for full container width
                      height: 200, // Adjust the height as needed
                      mb: 1.5,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      borderRadius: "12px", // Optional: for rounded corners
                      boxShadow: "0px 4px 12px rgba(0,0,0,0.1)", // Optional: for shadow effect
                      backgroundImage: `url(${getFileUrlByFileId(fileIds?.bannerId)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      "@media (max-width:600px)": {
                        height: 150, // Smaller height for smaller devices
                        width: 300,
                      },
                      "@media (min-width:601px) and (max-width:960px)": {
                        height: 175, // Adjust height for medium devices
                        width: 350,
                      },
                    }}
                    className="hover:bg-pink-400 hover:animate-pulse"
                    onClick={() => handleImageClick(bannerInputRef)}
                  >
                    {imageLoading.banner ? (
                      <CircularProgress size={24} color="primary" />
                    ) : (
                      !fileIds?.bannerId && (
                        <Upload fontSize="large" color="primary" />
                      )
                    )}
                  </Box>
                </Badge>
              </Box>
            </Container>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            container
            justifyContent="center"
            alignItems="center"
          >
            <Container>
              <Typography
                variant="h6"
                fontWeight="semi-bold"
                color="primary"
                textAlign="center"
              >
                Avatar
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center">
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInputRef}
                  style={{ display: "none" }}
                  onChange={(event) => handleImageChange(event, "avatarId")}
                />
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    imageLoading.avatar ? (
                      <CircularProgress size={24} sx={{ color: "primary" }} />
                    ) : (
                      <>
                        {fileIds.avatarId ? (
                          <IconButton
                            onClick={() => handleImageDelete("avatarId")}
                            sx={{
                              border: "5px solid white",
                              backgroundColor: "#ff558f",
                              borderRadius: "50%",
                              padding: ".2rem",
                              width: 35,
                              height: 35,
                            }}
                          >
                            <Delete />
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
                    )
                  }
                >
                  <Avatar
                    onClick={() => handleImageClick(avatarInputRef)}
                    sx={{ width: 100, height: 100, mb: 1.5 }}
                    className="bg-stone-100 shadow-2xl hover:bg-pink-400 hover:animate-pulse"
                    src={getFileUrlByFileId(fileIds?.avatarId)}
                  >
                    {!fileIds?.avatarId && !imageLoading.avatar && (
                      <Upload fontSize="large" color="primary" />
                    )}
                  </Avatar>
                </Badge>
              </Box>
            </Container>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              {...register("title", { required: "Title is required" })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Tooltip
              title="Will be used as a link part of the salon booking page"
              placement="top"
            >
              <TextField
                fullWidth
                label="Link Name"
                {...register("linkName", {
                  required: "Link Name is required",
                  pattern: {
                    value: /^\w+$/,
                    message:
                      "Only 'a-z', 'A-Z', '0-9' and '_' characters allowed in link name",
                  },
                })}
                error={!!errors.linkName}
                helperText={errors.linkName?.message}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              {...register("description")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              {...register("address", { required: "Address is required" })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid
            direction="row"
            container
            gap={2}
            mt={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {salon?.id ? "Update" : "Create"} Salon
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
