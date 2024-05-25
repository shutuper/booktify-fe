import Container from "@mui/material/Container";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SalonApi from "../api/salon.api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import SalonHeader from "../components/salon/SalonHeader.jsx";
import MasterApi from "../api/master.api.js";
import MasterBooking from "../components/master/MasterBooking.jsx";
import { useEffect } from "react";

export default function MasterBookingPage() {
  let { salonLinkName, masterId } = useParams();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isLoading: isLoadingSalon, data: salon } = useQuery({
    queryKey: ["salons/linkName/booking"],
    queryFn: () =>
      SalonApi.getSalonByLinkName({ salonLinkName }).then((res) => res.data),
    enabled: !!salonLinkName,
  });

  const { isLoading: isLoadingMaster, data: master } = useQuery({
    queryKey: ["salons/master/get"],
    queryFn: () =>
      MasterApi.getMaster(salon.id, masterId).then((res) => res.data),
    enabled: !!masterId && !!salon,
  });

  if (isLoadingSalon || isLoadingMaster) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Container className="mt-4 min-h-screen bg-stone-100 rounded shadow-2xl p-8 space-y-8">
        <Container>
          <SalonHeader
            salon={salon}
            isEditable={false}
            goBackButton={true}
            showDesc={false}
          />
          {master?.id && <MasterBooking master={master} />}
        </Container>
      </Container>
    </>
  );
}
