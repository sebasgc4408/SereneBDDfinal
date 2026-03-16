import Link from "next/link"

export default function PublicBookingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-white border border-[#F2F2F0] rounded-3xl p-8 text-center shadow-[0_8px_40px_rgb(0,0,0,0.03)]">
        <h1 className="text-2xl font-light text-[#292524] mb-4">
          Enlace de reserva incompleto
        </h1>
        <p className="text-[#78716C] mb-6">
          Para reservar necesitas el enlace público de tu psicólogo con formato{" "}
          <span className="font-mono text-[#57534E]">/book/&lt;slug&gt;</span>.
        </p>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#292524] px-6 text-sm font-medium text-white hover:bg-[#1C1917]"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
