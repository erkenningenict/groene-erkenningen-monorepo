export const getCertificates = async (label: string) => {
  const response = await fetch(
    `http://localhost:3000/publicRegister/certificates/${label}`,
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
