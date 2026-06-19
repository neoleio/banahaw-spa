import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vvfjvrfmosdvgfsnrzvw.supabase.co'
const supabaseAnonKey = 'sb_publishable_ai6zZkeSgh_6eX2nrnAIsQ_qgDCUZNr'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
