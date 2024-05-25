import { useState } from "react";
import {
  Button,
  Container,
  Grid,
  Typography,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";
import { AddCircleOutline, Person } from "@mui/icons-material";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../LoadingSpinner.jsx";
import Page from "../Page.jsx";
import MasterApi from "../../api/master.api.js";
import { getFileUrlByFileId } from "../../utils/file-utils.js";
import SalonApi from "../../api/salon.api.js";
import MasterInviteForm from "./MasterInviteForm.jsx";
import { Link } from "react-router-dom";

export default function MasterList({ salonId, salonLinkName }) {
  const [pageable, setPageable] = useState({
    size: 3,
    page: 0,
  });
  const [openForm, setOpenForm] = useState(false);

  const {
    isLoading,
    isFetching,
    data: mastersPage,
  } = useQuery({
    queryKey: ["masters/get", pageable],
    queryFn: () =>
      MasterApi.getMastersPrivate(salonId, {
        ...pageable,
      }).then((res) => res.data),
    keepPreviousData: true,
  });

  const inviteMaster = useMutation({
    mutationFn: SalonApi.inviteMaster,
    onSuccess: () => {
      handleCloseForm();
    },
  });

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleFormSubmit = (masterInvite) => {
    inviteMaster.mutate(masterInvite);
  };

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      {openForm && (
        <MasterInviteForm
          open={openForm}
          handleClose={handleCloseForm}
          onSubmit={handleFormSubmit}
        />
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
          Salon masters
        </Typography>
        <Button
          startIcon={<AddCircleOutline />}
          variant="contained"
          color="secondary"
          onClick={() => handleOpenForm()}
        >
          Invite
        </Button>
      </Stack>
      <Divider className="my-4" />
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        {mastersPage.content.map((master) => (
          <Grid item xs={12} key={master.id}>
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
                  width: 72,
                  height: 72,
                  marginRight: 2,
                }}
                src={getFileUrlByFileId(master.avatarId)}
                alt={`${master.firstname} ${master.lastname}`}
                className="bg-stone-300"
              >
                <Person color="primary" fontSize="large" />
              </Avatar>
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
                  {`${master.firstname} ${master.lastname}`}
                </Typography>
                <Typography variant="body1" noWrap>
                  Phone:{" "}
                  <a href={`tel:+${master.phone}`} className="text-pink-900">
                    +{master.phone}
                  </a>
                </Typography>
                <Typography variant="body1" noWrap>
                  Email:{" "}
                  {master.email ? (
                    <a
                      href={`mailto:${master.email}`}
                      className="text-pink-900"
                    >
                      {master.email}
                    </a>
                  ) : (
                    "-"
                  )}
                </Typography>
              </Stack>
              <Link to={`/salons/${salonLinkName}/masters/${master.id}`}>
                <Button
                  sx={{
                    boxShadow: 3,
                  }}
                  variant="contained"
                >
                  Book
                </Button>
              </Link>
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
          size={mastersPage.totalPages}
          onPageChange={(page) => setPageable({ ...pageable, page: page - 1 })}
        />
      </Stack>
    </Container>
  );
}
