import RegistrationEngine from "./RegistrationEngine";

export const metadata = {
  title: "Register | SOPHEP - GIMUN 25",
  description: "Register for Pakistan's premier Model United Nations conference.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-dvh bg-[var(--color-bg)] pt-16 lg:pt-20">
      <RegistrationEngine />
    </main>
  );
}
