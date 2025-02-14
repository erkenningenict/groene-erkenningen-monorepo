import useFetch from "./useFetch";
import SearchForm from "./SearchForm";

type CertificatesProps = {
  label: string;
};

export default function Certificates({ label }: CertificatesProps) {
  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;

  const {
    data: certificates,
    isLoading: isLoadingCertificates,
    isError: isErrorCertificates,
  } = useFetch<{ certificate: string }[]>(
    `${apiBaseUrl}/publicRegister/certificates/${label}`,
  );

  return (
    <SearchForm
      isLoadingCertificates={isLoadingCertificates}
      isErrorCertificates={isErrorCertificates}
      certificates={certificates || []}
      label={label}
    />
  );
}
