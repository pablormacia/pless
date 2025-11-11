-- ==========================
-- PLESS - MODELO DE DATOS
-- ==========================

-- Negocios / Comercios
create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,  -- usado para el link pless.ar/<slug>
  whatsapp_number text not null,
  address text,
  logo_url text,
  created_at timestamp with time zone default now()
);

-- Usuarios (administradores del negocio)
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  business_id uuid references businesses(id) on delete cascade,
  role text default 'admin',
  created_at timestamp with time zone default now()
);

-- Categorías de productos
create table categories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  name text not null,
  sort_order int default 0,
  created_at timestamp with time zone default now()
);

-- Productos
create table products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  available boolean default true,
  created_at timestamp with time zone default now()
);

-- Pedidos (solo registro básico, los mensajes se envían por WhatsApp)
create table orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade,
  client_name text,
  phone text,
  total numeric(10,2),
  items jsonb not null, -- lista de productos [{id, name, qty, price}]
  mode text check (mode in ('retiro', 'envio')) default 'retiro',
  status text check (status in ('pendiente', 'confirmado', 'cancelado')) default 'pendiente',
  created_at timestamp with time zone default now()
);

-- ==========================
-- ÍNDICES
-- ==========================

create index idx_products_business_id on products(business_id);
create index idx_categories_business_id on categories(business_id);
create index idx_orders_business_id on orders(business_id);

-- ==========================
-- RLS (Row Level Security)
-- ==========================

alter table businesses enable row level security;
alter table users enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- ==========================
-- POLÍTICAS BÁSICAS
-- ==========================

-- Usuarios autenticados pueden ver y editar solo su negocio
create policy "Users can view their business"
  on businesses
  for select
  using (id in (select business_id from users where users.id = auth.uid()));

-- Productos visibles públicamente (modo catálogo/pedido)
create policy "Public can view products"
  on products
  for select
  using (available = true);

-- Administrador puede gestionar sus productos
create policy "Admins manage their products"
  on products
  for all
  using (business_id in (select business_id from users where users.id = auth.uid()));

-- Categorías visibles públicamente
create policy "Public can view categories"
  on categories
  for select
  using (true);

create policy "Admins manage their categories"
  on categories
  for all
  using (business_id in (select business_id from users where users.id = auth.uid()));

-- Pedidos: cualquiera puede insertar (pedido público)
create policy "Anyone can create orders"
  on orders
  for insert
  with check (true);

-- Admin puede ver solo sus pedidos
create policy "Admin can view orders of their business"
  on orders
  for select
  using (business_id in (select business_id from users where users.id = auth.uid()));
