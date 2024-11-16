export const getCertificates = async (label: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/publicRegister/certificates/${label}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch certificates");
  }
  return (await response.json()) as { certificate: string }[];
};
