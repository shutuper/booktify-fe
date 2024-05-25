import { useSelector } from "react-redux";
import { Divider } from "@mui/material";
import Container from "@mui/material/Container";
import { useQuery } from "@tanstack/react-query";
import SalonApi from "../../api/salon.api.js";
import LoadingSpinner from "../LoadingSpinner.jsx";
import SalonForm from "./SalonForm.jsx";
import { queryClient } from "../../config/queryClient.js";
import { useState } from "react";
import ProcedureList from "../procedure/ProcedureList.jsx";
import MasterList from "../master/MasterList.jsx";
import SalonHeader from "./SalonHeader.jsx";

export default function SalonSettings() {
  const user = useSelector((state) => state.auth.user);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    isLoading,
    data: salon,
    error,
  } = useQuery({
    queryKey: ["masters/salons/get"],
    queryFn: () => SalonApi.getSalon(user.id, true).then((res) => res.data),
  });

  console.log(salon);

  const handleSave = async (salonData) => {
    try {
      // Assuming `salon` is defined in the outer scope of `SalonSettings`
      if (salon && salon.id) {
        // Update existing salon
        await SalonApi.updateSalon(salon.id, salonData);
      } else {
        // Create new salon
        await SalonApi.createSalon(salonData);
      }
      // Handle response (e.g., show success message, refetch salon data, etc.)

      await queryClient.invalidateQueries({ queryKey: ["masters/salons/get"] });
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error saving salon:", error);
    } finally {
      setIsEditMode(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If there's an error, assume no salon data exists and switch to add/edit mode
  if (error || !salon || isEditMode) {
    return (
      <SalonForm
        salon={salon}
        onSave={handleSave}
        onCancel={() => setIsEditMode(false)}
      />
    );
  }

  return (
    <Container>
      <SalonHeader
        salon={salon}
        isEditable={true}
        handleEditMode={() => setIsEditMode(true)}
      />
      {user?.id && <ProcedureList masterId={user.id} />}
      <Divider className="my-4" />
      {salon?.id && (
        <MasterList salonId={salon.id} salonLinkName={salon.linkName} />
      )}
    </Container>
  );
}
