import Container from "@mui/material/Container";
import MyProfile from "../components/MyProfile.jsx";
import DayScheduler from "../components/work-schedule/DayScheduler.jsx";
import { useSelector } from "react-redux";
import { Divider } from "@mui/material";

function MainPage() {
  const user = useSelector((state) => state.auth.user);
  const showScheduler = user?.role === "ROLE_MASTER";

  return (
    <>
      <Container className="mt-4 bg-stone-100 rounded shadow-2xl p-8 space-y-8">
        <MyProfile hScreen={!showScheduler} />
        <Divider className="my-4" />
        {showScheduler && <DayScheduler />}
      </Container>
    </>
  );
}

export default MainPage;
