import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const DEFAULT_VALUES = {
  title: "",
  description: "",
  duration: "",
  price: "",
};

export default function ProcedureForm({
  open,
  handleClose,
  onSubmit,
  procedure,
}) {
  const isEditMode = !!procedure;
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (isEditMode) {
      reset({ ...procedure });
    } else {
      // Reset to initial default values when adding a new procedure
      reset(DEFAULT_VALUES);
    }
    return () => reset(DEFAULT_VALUES);
  }, [reset, procedure, isEditMode]);

  const handleInnerSubmit = (data) => {
    onSubmit({ ...data, id: procedure?.id });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {isEditMode
          ? `Update '${procedure.title}' procedure`
          : "Add New Procedure"}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleInnerSubmit)}>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            {...register("title", { required: true })}
            error={!!errors.title}
            helperText={errors.title ? "Title is required" : ""}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            {...register("description", { required: true })}
            error={!!errors.description}
            helperText={errors.description ? "Duration is required" : ""}
          />
          <TextField
            margin="dense"
            label="Duration (minutes)"
            type="number"
            fullWidth
            variant="outlined"
            {...register("duration", { required: true })}
            error={!!errors.duration}
            helperText={errors.duration ? "Duration is required" : ""}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            {...register("price", {
              required: "Price is required",
            })}
            error={!!errors.price}
            helperText={errors.price ? "Price is required" : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
              inputProps: {
                step: ".01", // This is how you specify the step attribute correctly
              },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            m: 2,
          }}
        >
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="secondary">
            {isEditMode ? "Update" : "Add New"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
