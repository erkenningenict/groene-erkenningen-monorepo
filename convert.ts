const input =
  "NKC1_NKC2_NKC3_NKC4_NKC5_NKC6_NKC examinator niveau 5_NKC examinator niveau 6";

const label = "Nederlands Kettingzaag Certificaat";
const base = `INSERT INTO public.certificates_per_label (label, certificate) VALUES`;
const output = input
  .split("_")
  .map((val) => {
    return `${base} ('${label}', '${val}');`;
  })
  .join("\n");

const sql = `${output}`;
console.log("sql", sql);
