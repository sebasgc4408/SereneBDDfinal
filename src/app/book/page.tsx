import BookingPage from '@/components/BookingPage'

export default function PublicBookingPage() {
  // En una implementación real, este nombre vendría de la base de datos 
  // basándose en el parámetro de la URL (ej. /book/[psychologistId])
  return <BookingPage psychologistName="Dr. Sarah" />
}
