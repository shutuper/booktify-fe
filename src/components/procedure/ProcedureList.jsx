import { useState } from "react";
import {
  Button,
  Container,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import { Edit, Delete, AddCircleOutline } from "@mui/icons-material";
import ProcedureApi from "../../api/procedure.api.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../LoadingSpinner.jsx";
import { queryClient } from "../../config/queryClient.js";
import Page from "../Page.jsx";
import ProcedureForm from "./ProcedureForm.jsx";
import Box from "@mui/material/Box";

function beautifyDuration(duration) {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours ? hours + " h " : " "}${minutes ? minutes + " min" : ""}`;
}

export default function ProcedureList({ masterId }) {
  const [pageable, setPageable] = useState({
    size: 6,
    page: 0,
  });
  const [openForm, setOpenForm] = useState({
    open: false,
    procedure: null,
  });

  const { isLoading, data: proceduresPage } = useQuery({
    queryKey: ["masters/procedures", pageable],
    queryFn: () =>
      ProcedureApi.getMasterProceduresPage(masterId, {
        ...pageable,
      }).then((res) => res.data),
    keepPreviousData: true,
  });

  const deleteProcedure = useMutation({
    mutationFn: ProcedureApi.delete,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["masters/procedures"] });
    },
  });

  const createProcedure = useMutation({
    mutationFn: ProcedureApi.createProcedure,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["masters/procedures"] });
      handleCloseForm();
    },
  });

  const updateProcedure = useMutation({
    mutationFn: ProcedureApi.patchProcedure,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["masters/procedures"] });
      handleCloseForm();
    },
  });

  const handleOpenForm = (procedure) => {
    setOpenForm({
      open: true,
      procedure: procedure ?? null,
    });
  };

  const handleCloseForm = () => {
    setOpenForm({
      open: false,
      procedure: null,
    });
  };

  const handleFormSubmit = (procedure) => {
    if (procedure.id) {
      updateProcedure.mutate({
        procedureId: procedure.id,
        procedureDto: procedure,
      });
    } else {
      createProcedure.mutate(procedure);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      {openForm.open && (
        <ProcedureForm
          open={openForm.open}
          procedure={openForm.procedure}
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
          Procedures
        </Typography>
        <Button
          startIcon={<AddCircleOutline />}
          variant="contained"
          color="secondary"
          onClick={() => handleOpenForm(null)}
        >
          Add New
        </Button>
      </Stack>
      <Divider className="my-4" />
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        {proceduresPage.content.map((procedure) => (
          <Grid item xs={12} sm={6} md={4} key={procedure.id}>
            <Paper
              elevation={3}
              style={{ padding: "20px" }}
              sx={{
                borderRadius: "15px",
              }}
            >
              <Typography variant="h6" className="text-pink-800 font-bold">
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
              <Box m={0} display="flex" justifyContent="flex-end">
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleOpenForm(procedure)}>
                    <Edit color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    onClick={() => deleteProcedure.mutate(procedure.id)}
                  >
                    <Delete color="secondary" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
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
    </Container>
  );
}
