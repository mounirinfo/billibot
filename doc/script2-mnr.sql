alter table public.schools enable row level security;

create policy "Public read schools"
on public.schools
for select
using (true);
