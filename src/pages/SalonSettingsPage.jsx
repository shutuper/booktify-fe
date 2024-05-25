import Container from "@mui/material/Container";
import SalonSettings from "../components/salon/SalonSettings.jsx";

function SalonSettingsPage() {
  return (
    <>
      <Container className="mt-4 min-h-screen bg-stone-100 rounded shadow-2xl p-8 space-y-8">
        <SalonSettings />
      </Container>
    </>
  );
}

export default SalonSettingsPage;
