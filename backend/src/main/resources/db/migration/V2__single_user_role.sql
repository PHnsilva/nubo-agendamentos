alter table users add column role varchar(40);

update users
set role = case
  when exists (
    select 1 from user_roles
    where user_roles.user_id = users.id
      and user_roles.role in ('ADMIN', 'MODERADOR')
  ) then 'MODERADOR'
  when exists (
    select 1 from user_roles
    where user_roles.user_id = users.id
      and user_roles.role = 'PRESTADOR'
  ) then 'PRESTADOR'
  else 'CLIENTE'
end;

alter table users alter column role set not null;

update provider_profiles
set active = false
where user_id in (
  select id from users
  where role <> 'PRESTADOR'
);

drop table user_roles;
