import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'

const crons = cronJobs()

crons.interval(
  'send WhatsApp appointment reminders',
  { minutes: 15 },
  internal.whatsapp.checkAndSendReminders
)

export default crons
