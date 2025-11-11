-- =====================================
-- SEED: PLESS RESTÓ DEMO
-- =====================================

-- 1️⃣ Crear el negocio demo
insert into businesses (name, slug, whatsapp_number, address, logo_url)
values (
  'Pless Restó Demo',
  'pless-demo',
  '+5491122334455',
  'Av. Demo 123, Buenos Aires',
  'https://placehold.co/300x300?text=Pless+Demo'
);

-- 2️⃣ Usuario administrador demo
-- ⚠️ Este usuario debe existir en Supabase Auth (crear manualmente con email/password)
insert into users (id, business_id, role)
values (
  '169d616b-5336-49e8-b323-53f97617995d',  -- reemplazar por el ID real del usuario Auth
  (select id from businesses where slug = 'pless-demo'),
  'admin'
);

-- 3️⃣ Categorías
insert into categories (business_id, name, sort_order)
values
((select id from businesses where slug = 'pless-demo'), 'Entradas', 1),
((select id from businesses where slug = 'pless-demo'), 'Platos principales', 2),
((select id from businesses where slug = 'pless-demo'), 'Pastas', 3),
((select id from businesses where slug = 'pless-demo'), 'Pizzas', 4),
((select id from businesses where slug = 'pless-demo'), 'Hamburguesas', 5),
((select id from businesses where slug = 'pless-demo'), 'Bebidas', 6),
((select id from businesses where slug = 'pless-demo'), 'Postres', 7),
((select id from businesses where slug = 'pless-demo'), 'Promos', 8);

-- =====================================
-- 4️⃣ Productos (5 por categoría)
-- =====================================

-- Entradas
insert into products (business_id, category_id, name, description, price, image_url)
select b.id, c.id, p.name, p.description, p.price, p.image_url
from businesses b
join categories c on c.business_id = b.id and c.name = 'Entradas'
cross join (
  values
  ('Empanadas criollas', 'De carne cortada a cuchillo, al horno', 1800, 'https://placehold.co/600x400?text=Empanadas'),
  ('Bruschettas', 'Pan de campo con tomate, ajo y oliva', 2200, 'https://placehold.co/600x400?text=Bruschettas'),
  ('Bastones de muzzarella', 'Rebozados con salsa tártara', 2500, 'https://placehold.co/600x400?text=Bastones'),
  ('Papas Pless', 'Con cheddar, panceta y verdeo', 2600, 'https://placehold.co/600x400?text=Papas+Pless'),
  ('Rabas', 'Crocantes con limón y alioli', 3900, 'https://placehold.co/600x400?text=Rabas')
) as p(name, description, price, image_url)
where b.slug = 'pless-demo';

-- Platos principales
insert into products (business_id, category_id, name, description, price, image_url)
select b.id, c.id, p.name, p.description, p.price, p.image_url
from businesses b
join categories c on c.business_id = b.id and c.name = 'Platos principales'
cross join (
  values
  ('Milanesa napolitana', 'Con papas fritas o puré', 5500, 'https://placehold.co/600x400?text=Milanesa'),
  ('Suprema grillada', 'Con ensalada fresca', 5200, 'https://placehold.co/600x400?text=Suprema'),
  ('Bife de chorizo', 'A punto con papas al romero', 6700, 'https://placehold.co/600x400?text=Bife'),
  ('Pollo al limón', 'Con arroz y verduras salteadas', 5900, 'https://placehold.co/600x400?text=Pollo'),
  ('Tacos Pless', 'Rellenos de carne, vegetales y guacamole', 4800, 'https://placehold.co/600x400?text=Tacos')
) as p(name, description, price, image_url)
where b.slug = 'pless-demo';

-- Pastas
insert into products (business_id, category_id, name, description, price, image_url)
select b.id, c.id, p.name, p.description, p.price, p.image_url
from businesses b
join categories c on c.business_id = b.id and c.name = 'Pastas'
cross join (
  values
  ('Ravioles de ricotta', 'Con salsa fileto o crema', 4200, 'https://placehold.co/600x400?text=Ravioles'),
  ('Sorrentinos de jamón y queso', 'Salsa a elección', 4500, 'https://placehold.co/600x400?text=Sorrentinos'),
  ('Fideos al pesto', 'Con albahaca y parmesano', 4000, 'https://placehold.co/600x400?text=Fideos'),
  ('Ñoquis caseros', 'De papa con salsa boloñesa', 4300, 'https://placehold.co/600x400?text=Ñoquis'),
  ('Lasagna', 'Capas de carne, salsa y muzzarella', 4800, 'https://placehold.co/600x400?text=Lasagna')
) as p(name, description, price, image_url)
where b.slug = 'pless-demo';

-- Pizzas
insert into products (business_id, category_id, name, description, price, image_url)
select b.id, c.id, p.name, p.description, p.price, p.image_url
from businesses b
join categories c on c.business_id = b.id and c.name = 'Pizzas'
cross join (
  values
  ('Pizza muzzarella', 'Salsa de tomate y queso muzzarella', 4500, 'https://placehold.co/600x400?text=Muzzarella'),
  ('Pizza napolitana', 'Con tomate fresco, ajo y orégano', 4800, 'https://placehold.co/600x400?text=Napolitana'),
  ('Pizza fugazzetta', 'Cebolla caramelizada y muzzarella', 4900, 'https://placehold.co/600x400?text=Fugazzetta'),
  ('Pizza especial', 'Jamón, morrón y aceitunas', 5200, 'https://placehold.co/600x400?text=Especial'),
  ('Pizza cuatro quesos', 'Blend de quesos premium', 5600, 'https://placehold.co/600x400?text=4+Quesos')
) as p(name, description, price, image_url)
where b.slug = 'pless-demo';

-- Hamburguesas
insert into products (business_id, category_id, name, description, price, image_url)
select b.id, c.id, p.name, p.description, p.price, p.image_url
from businesses b
join categories c on c.business_id = b.id and c.name = 'Hamburguesas'
cross join (
  values
  ('Clásica', 'Carne 180g, cheddar y lechuga', 4500, 'https://placehold.co/600x400?text=Clasica'),
  ('BBQ', 'Con panceta, cheddar y salsa BBQ', 4900, 'https://placehold.co/600x400?text=BBQ'),
  ('Veggie', 'Medallón de lentejas y palta', 4300, 'https://placehold.co/600x400?text=Veggie'),
  ('Blue Cheese', 'Queso azul y cebolla caramelizada', 5200, 'https://placehold.co/600x400?text=Blue'),
  ('Doble Pless', 'Doble carne, doble cheddar', 5700, 'https://placehold.co/600x400?text=Doble')
) as p(name, description, price, image_url)
where b.slug = 'pless-demo';

-- Bebidas
insert into products (business_id, category_id, name, description, price, image_url)
select b.id, c.id, p.name, p.description, p.price, p.image_url
from businesses b
join categories c on c.business_id = b.id and c.name = 'Bebidas'
cross join (
  values
  ('Agua sin gas', '500 ml', 1000, 'https://placehold.co/600x400?text=Agua'),
  ('Agua con gas', '500 ml', 1000, 'https://placehold.co/600x400?text=Agua+Gas'),
  ('Gaseosa', 'Coca-Cola 500 ml', 1500, 'https://placehold.co/600x400?text=Gaseosa'),
  ('Cerveza artesanal', 'IPA o Golden 500 ml', 2500, 'https://placehold.co/600x400?text=Cerveza'),
  ('Vino tinto copa', 'Malbec joven', 2900, 'https://placehold.co/600x400?text=Vino')
) as p(name, description, price, image_url)
where b.slug = 'pless-demo';

-- Postres
insert into products (business_id, category_id, name, description, price, image_url)
select b.id, c.id, p.name, p.description, p.price, p.image_url
from businesses b
join categories c on c.business_id = b.id and c.name = 'Postres'
cross join (
  values
  ('Flan casero', 'Con dulce de leche o crema', 1800, 'https://placehold.co/600x400?text=Flan'),
  ('Brownie', 'Con helado de vainilla', 2300, 'https://placehold.co/600x400?text=Brownie'),
  ('Tiramisú', 'Receta italiana', 2500, 'https://placehold.co/600x400?text=Tiramisu'),
  ('Helado 2 bochas', 'Sabores a elección', 1900, 'https://placehold.co/600x400?text=Helado'),
  ('Panqueque', 'Con dulce de leche artesanal', 2100, 'https://placehold.co/600x400?text=Panqueque')
) as p(name, description, price, image_url)
where b.slug = 'pless-demo';

-- Promos
insert into products (business_id, category_id, name, description, price, image_url)
select b.id, c.id, p.name, p.description, p.price, p.image_url
from businesses b
join categories c on c.business_id = b.id and c.name = 'Promos'
cross join (
  values
  ('Promo Pizza + Gaseosa', 'Pizza muzzarella + gaseosa 500ml', 5200, 'https://placehold.co/600x400?text=Promo+Pizza'),
  ('Promo Burger + Papas', 'Hamburguesa clásica + papas', 5100, 'https://placehold.co/600x400?text=Promo+Burger'),
  ('Promo Doble', '2 hamburguesas + 2 bebidas', 9700, 'https://placehold.co/600x400?text=Promo+Doble'),
  ('Promo Pasta + Copa de vino', 'Sorrentinos + copa de vino', 5800, 'https://placehold.co/600x400?text=Promo+Pasta'),
  ('Promo Familiar', 'Pizza grande + 1.5L gaseosa + postre', 8900, 'https://placehold.co/600x400?text=Promo+Familiar')
) as p(name, description, price, image_url)
where b.slug = 'pless-demo';
