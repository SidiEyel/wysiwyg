import { FileText, Mail, Megaphone, type LucideIcon } from "lucide-react"
import type { Lane } from "../types"

export const LANE_ICON: Record<Lane, LucideIcon> = {
  outreach: Mail,
  ads: Megaphone,
  posts: FileText,
}
