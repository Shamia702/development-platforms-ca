import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/+esm";

const supabaseUrl = "https://ftswvmbxqunmfnzgvvbd.supabase.co";
const supabaseAnonKey = "sb_publishable_yLEp5elTfhip50BUofCNSg_J-3syD0l";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
