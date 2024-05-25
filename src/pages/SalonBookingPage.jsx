import Container from "@mui/material/Container";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SalonApi from "../api/salon.api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import SalonHeader from "../components/salon/SalonHeader.jsx";
import MasterBookingList from "../components/master/MasterBookingList.jsx";

export default function SalonBookingPage() {
  let { salonLinkName } = useParams();

  const { isLoading, data: salon } = useQuery({
    queryKey: ["salons/linkName"],
    queryFn: () =>
      SalonApi.getSalonByLinkName({ salonLinkName }).then((res) => res.data),
    enabled: !!salonLinkName,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Container className="mt-4 min-h-screen bg-stone-100 rounded shadow-2xl p-8 space-y-8">
        {salon && (
          <Container>
            <SalonHeader salon={salon} isEditable={false} showDesc={true} />
            {salon?.id && (
              <MasterBookingList
                salonId={salon.id}
                salonLinkName={salon.linkName}
              />
            )}
          </Container>
        )}
      </Container>
    </>
  );
}
