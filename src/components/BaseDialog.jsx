import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function BaseDialog({
  open,
  onClose,
  title,
  confirmButton,
  cancelButton = "Cancel",
  children,
  onConfirm,
  confirmDisabled = false,
}) {
  return (
    <>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{
          sx: { borderRadius: "10px", p: 2 },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          fontSize="1.6rem"
          textAlign="center"
        >
          {title}
        </DialogTitle>
        <DialogContent dividers>
          <>{children}</>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
          <Button variant="outlined" autoFocus onClick={onClose}>
            {cancelButton}
          </Button>
          <Button
            variant="outlined"
            disabled={confirmDisabled}
            autoFocus
            onClick={onConfirm}
          >
            {confirmButton}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
