const supaBase_Url = 'https://zrrcbbmpemqqouusbdbx.supabase.co';
const supaBase_Key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpycmNiYm1wZW1xcW91dXNiZGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMjY0ODksImV4cCI6MjA5NTkwMjQ4OX0.KYdyE93CmeXSCtwk0Tm9VHDDcZV57X8AjUC-1Eq4Wfg';

export const supaBase = supabase.createClient(supaBase_Url, supaBase_Key);

