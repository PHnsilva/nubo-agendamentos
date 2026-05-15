update provider_applications
set reviewed_by_id = (select id from users where email = 'moderador@nubo.local')
where reviewed_by_id = (select id from users where email = 'admin@nubo.local')
  and exists (select 1 from users where email = 'moderador@nubo.local')
  and exists (select 1 from users where email = 'admin@nubo.local');

update admin_decision_logs
set actor_id = (select id from users where email = 'moderador@nubo.local')
where actor_id = (select id from users where email = 'admin@nubo.local')
  and exists (select 1 from users where email = 'moderador@nubo.local')
  and exists (select 1 from users where email = 'admin@nubo.local');

delete from users
where email = 'admin@nubo.local'
  and exists (select 1 from users moderator where moderator.email = 'moderador@nubo.local')
  and not exists (select 1 from provider_applications application where application.user_id = users.id)
  and not exists (select 1 from provider_profiles profile where profile.user_id = users.id)
  and not exists (select 1 from appointments appointment where appointment.client_id = users.id);
