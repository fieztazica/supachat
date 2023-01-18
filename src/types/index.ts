import { Database } from "./supabase"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export type Channel = Database["public"]["Tables"]["channels"]["Row"]

export type Message = Database["public"]["Tables"]['messages']['Row']

export type Member = Database["public"]['Tables']['members']['Row']