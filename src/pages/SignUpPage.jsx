import SignUpForm from "../components/SignUpForm.jsx";
import Container from "@mui/material/Container";

function SignUpPage() {
  return (
    <>
      <Container
        className="mt-4 bg-stone-200 h-screen rounded shadow-2xl py-8"
        sx={{ justifyContent: "center" }}
      >
        <SignUpForm />
      </Container>
    </>
  );
}

export default SignUpPage;
