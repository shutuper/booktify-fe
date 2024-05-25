import { Avatar, Button, Divider, Grid, Stack } from "@mui/material";
import { getFileUrlByFileId } from "../../utils/file-utils.js";
import { ContentCopy, Person } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import BooktifyBanner from "../../assets/booktify_banner.jpeg";

export default function SalonHeader({
  isEditable,
  salon,
  handleEditMode,
  goBackButton = false,
  showDesc = true,
}) {
  const navigate = useNavigate();

  function handleCopySalonLink() {
    const url = `${window.location.origin}/salons/${salon.linkName}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Salon booking url copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy salon booking url!");
      });
  }

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Stack
          direction="row"
          gap={2}
          alignContent="center"
          alignItems="center"
          justifyContent="space-between"
        >
          {salon.avatarId && (
            <Avatar
              sx={{
                borderColor: "secondary.main",
                borderWidth: 2,
                borderStyle: "dashed",
                width: {
                  xs: 40, // Size for extra-small devices
                  sm: 48, // Size for small devices and up
                  md: 56, // Default size for medium devices and up
                },
                height: {
                  xs: 40, // Size for extra-small devices
                  sm: 48, // Size for small devices and up
                  md: 56, // Default size for medium devices and up
                },
              }}
              className="bg-stone-100 shadow-2xl hover:bg-pink-400 hover:animate-pulse"
              src={getFileUrlByFileId(salon.avatarId)}
            >
              <Person fontSize="large" color="primary" />
            </Avatar>
          )}
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            sx={{
              fontSize: {
                xs: "1rem", // smaller font size on extra-small devices
                sm: "1.25rem", // slightly larger font size on small devices and up
                md: "1.5rem", // default h5 size for medium devices and up
              },
            }}
          >
            {salon.title}{" "}
            <Tooltip title="Copy salon booking url" placement="right">
              <IconButton onClick={handleCopySalonLink}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
        </Stack>
        {isEditable && (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleEditMode}
            >
              Edit
            </Button>
          </Grid>
        )}
        {goBackButton && (
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => navigate(`/salons/${salon.linkName}`)}
            >
              Back
            </Button>
          </Grid>
        )}
      </Grid>
      <Divider className="my-4" />
      <Stack>
        <Stack>
          <Box
            sx={{
              width: "auto", // Use 100% width for full container width
              height: 200, // Adjust the height as needed
              mb: 1.5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              borderRadius: "12px", // Optional: for rounded corners
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)", // Optional: for shadow effect
              backgroundImage: `url(${getFileUrlByFileId(salon.bannerId) ?? BooktifyBanner})`,
              backgroundSize: "cover",
              borderColor: "primary.main",
              borderWidth: 3,
              borderStyle: "solid",
              backgroundPosition: "center",
              "@media (max-width:600px)": {
                height: 150, // Smaller height for smaller devices
                width: "auto",
              },
              "@media (min-width:601px) and (max-width:960px)": {
                height: 175, // Adjust height for medium devices
                width: "auto",
              },
            }}
          />
        </Stack>
        {showDesc && (
          <>
            {salon.description && (
              <Typography
                variant="h6"
                color="primary"
                textAlign="center"
                mb={1}
              >
                {salon.description}
              </Typography>
            )}
            <Typography color="primary" textAlign="center" variant="h7">
              <strong>Address:</strong> {salon.address}
            </Typography>
          </>
        )}
      </Stack>
      <Divider className="my-4" />
    </>
  );
}
