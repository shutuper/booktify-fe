import Container from "@mui/material/Container";
import SignInForm from "../components/SignInForm.jsx";

function SignInPage() {
  return (
    <>
      <Container
        className="mt-4 bg-stone-200 h-screen rounded shadow-2xl py-8"
        sx={{ justifyContent: "center" }}
      >
        <SignInForm />
      </Container>
    </>
  );
}

export default SignInPage;
