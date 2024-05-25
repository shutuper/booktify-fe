import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const DEFAULT_VALUES = {
  email: "",
};

export default function MasterInviteForm({ open, handleClose, onSubmit }) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    reset(DEFAULT_VALUES);
    return () => reset(DEFAULT_VALUES);
  }, [reset]);

  const handleInnerSubmit = (data) => {
    onSubmit({ ...data });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": { width: "80%", maxWidth: "400px" },
      }}
    >
      <DialogTitle>Invite master</DialogTitle>
      <form onSubmit={handleSubmit(handleInnerSubmit)}>
        <DialogContent>
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </DialogContent>
        <DialogActions sx={{ m: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="secondary">
            Invite
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
