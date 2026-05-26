import RegistrationEngine from "./RegistrationEngine";

export const metadata = {
  title: "Register | SOPHEP - GIMUN 25",
  description: "Register for Pakistan's premier Model United Nations conference.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-20">
      {/* We removed the .container-sophep to allow full width for the grid layout */}
      <RegistrationEngine />
    </main>
  );
}
