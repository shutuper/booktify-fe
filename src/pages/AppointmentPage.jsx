import Container from "@mui/material/Container";
import AppointmentList from "../components/appointment/AppointmentList.jsx";

function AppointmentsPage() {
  return (
    <>
      <Container className="mt-4 min-h-screen bg-stone-100 rounded shadow-2xl p-8 space-y-8">
        <AppointmentList />
      </Container>
    </>
  );
}

export default AppointmentsPage;
