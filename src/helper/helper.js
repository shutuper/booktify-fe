const phoneNumberRegex = /^380\d{9}$/;

export const validatePhoneNumber = (phone) => {
  if (!phone) {
    return "Phone number required";
  }

  const normalizedValue = phone.replace(/\D/g, ""); // Remove non-digit characters
  if (!phoneNumberRegex.test(normalizedValue)) {
    return "Invalid phone format, required: +380 (00) 000 00 00";
  }

  return true;
};

export const getValidPhoneNumber = (phone) => {
  return phone ? phone.replace(/\D/g, "") : null;
};
