create table users (
  id uuid primary key,
  name varchar(160) not null,
  email varchar(180) not null unique,
  password_hash varchar(255) not null,
  active boolean not null,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null
);

create table user_roles (
  user_id uuid not null references users(id) on delete cascade,
  role varchar(40) not null,
  primary key (user_id, role)
);

create table categories (
  id uuid primary key,
  name varchar(120) not null unique,
  slug varchar(140) not null unique
);

create table provider_applications (
  id uuid primary key,
  user_id uuid not null references users(id),
  public_name varchar(180) not null,
  contact_phone varchar(40) not null,
  whatsapp varchar(40) not null,
  description text not null,
  city varchar(120) not null,
  services_description text not null,
  base_price numeric(10, 2),
  profile_image_url varchar(500),
  status varchar(40) not null,
  review_message text,
  reviewed_by_id uuid references users(id),
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null
);

create table provider_application_regions (
  application_id uuid not null references provider_applications(id) on delete cascade,
  region varchar(120) not null
);

create table provider_application_categories (
  application_id uuid not null references provider_applications(id) on delete cascade,
  category varchar(120) not null
);

create table provider_application_portfolio_images (
  application_id uuid not null references provider_applications(id) on delete cascade,
  image_url varchar(500) not null
);

create table provider_profiles (
  id uuid primary key,
  user_id uuid not null unique references users(id),
  public_name varchar(180) not null,
  slug varchar(220) not null unique,
  description text not null,
  contact_phone varchar(40) not null,
  whatsapp varchar(40) not null,
  city varchar(120) not null,
  profile_image_url varchar(500),
  active boolean not null,
  rating_average numeric(3, 2) not null,
  rating_count integer not null,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null
);

create table provider_profile_regions (
  profile_id uuid not null references provider_profiles(id) on delete cascade,
  region varchar(120) not null
);

create table provider_profile_portfolio_images (
  profile_id uuid not null references provider_profiles(id) on delete cascade,
  image_url varchar(500) not null
);

create table service_offerings (
  id uuid primary key,
  provider_profile_id uuid not null references provider_profiles(id),
  category_id uuid not null references categories(id),
  name varchar(160) not null,
  description text not null,
  base_price numeric(10, 2) not null,
  estimated_duration_minutes integer not null,
  active boolean not null
);

create table availability_blocks (
  id uuid primary key,
  provider_profile_id uuid not null references provider_profiles(id) on delete cascade,
  day_of_week varchar(20) not null,
  start_time time not null,
  end_time time not null,
  active boolean not null
);

create table appointments (
  id uuid primary key,
  client_id uuid not null references users(id),
  provider_profile_id uuid not null references provider_profiles(id),
  service_offering_id uuid not null references service_offerings(id),
  scheduled_date date not null,
  start_time time not null,
  end_time time not null,
  status varchar(40) not null,
  client_note text,
  provider_note text,
  cancellation_reason text,
  created_at timestamp with time zone not null,
  updated_at timestamp with time zone not null
);

create index idx_provider_applications_status on provider_applications(status);
create index idx_provider_profiles_active on provider_profiles(active);
create index idx_service_offerings_provider on service_offerings(provider_profile_id);
create index idx_appointments_owner on appointments(client_id, provider_profile_id);
create index idx_appointments_slot on appointments(provider_profile_id, scheduled_date, start_time, status);

create table admin_decision_logs (
  id uuid primary key,
  actor_id uuid not null references users(id),
  target_type varchar(80) not null,
  target_id uuid not null,
  action varchar(80) not null,
  message text,
  created_at timestamp with time zone not null
);
