-- USERS
CREATE TABLE users (
  id              BIGSERIAL PRIMARY KEY,
  email           CITEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  full_name       VARCHAR(150) NOT NULL,
  phone           VARCHAR(30),
  role            VARCHAR(20) NOT NULL DEFAULT 'customer',
  status          VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_role_chk   CHECK (role IN ('customer','creator','admin')),
  CONSTRAINT users_status_chk CHECK (status IN ('active','suspended','pending'))
);

-- STORES (una tienda por vendedor; TODO multi-tienda)
CREATE TABLE stores (
  id              BIGSERIAL PRIMARY KEY,
  owner_user_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  name            VARCHAR(120) NOT NULL,
  slug            VARCHAR(140) NOT NULL,
  description     TEXT,
  logo_url        TEXT,
  rating_avg      NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (slug),
  UNIQUE (owner_user_id)  -- TODO Cambiarlo para multi-tienda
);

-- ADDRESSES (libreta del usuario)
CREATE TABLE addresses (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label         VARCHAR(80),           -- "Casa", "Trabajo", etc.
  recipient     VARCHAR(150) NOT NULL,
  phone         VARCHAR(30),
  line1         VARCHAR(160) NOT NULL,
  line2         VARCHAR(160),
  city          VARCHAR(120) NOT NULL,
  state         VARCHAR(120) NOT NULL,
  postal_code   VARCHAR(20)  NOT NULL,
  country_code  CHAR(2)      NOT NULL,
  is_default    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX addresses_user_idx ON addresses(user_id);


-- CATEGORIES (jerarquía simple por adjacency list)
CREATE TABLE categories (
  id          BIGSERIAL PRIMARY KEY,
  parent_id   BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  name        VARCHAR(120) NOT NULL,
  slug        VARCHAR(140) NOT NULL,
  position    INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (slug)
);
CREATE INDEX categories_parent_idx ON categories(parent_id);

-- BRANDS
CREATE TABLE brands (
  id          BIGSERIAL PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  slug        VARCHAR(140) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (slug),
  UNIQUE (name)
);

-- ATTRIBUTES (ej. color, size)
CREATE TABLE attributes (
  id          BIGSERIAL PRIMARY KEY,
  code        VARCHAR(60) NOT NULL,     -- 'color', 'size'
  name        VARCHAR(120) NOT NULL,
  value_type  VARCHAR(20) NOT NULL DEFAULT 'text', -- text|number|color|select
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (code),
  CONSTRAINT attributes_value_type_chk CHECK (value_type IN ('text','number','color','select'))
);

-- ATTRIBUTE VALUES (ej. Red, Black, S, M, L)
CREATE TABLE attribute_values (
  id            BIGSERIAL PRIMARY KEY,
  attribute_id  BIGINT NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
  value         VARCHAR(120) NOT NULL,
  extra         JSONB,             -- ej. {"hex":"#000000"} para color
  position      INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (attribute_id, value)
);
CREATE INDEX attribute_values_attr_idx ON attribute_values(attribute_id);


-- PRODUCTS (listings de una tienda)
CREATE TABLE products (
  id              BIGSERIAL PRIMARY KEY,
  store_id        BIGINT NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
  category_id     BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  brand_id        BIGINT REFERENCES brands(id) ON DELETE SET NULL,
  title           VARCHAR(180) NOT NULL,
  slug            VARCHAR(200) NOT NULL,
  description     TEXT,
  condition       VARCHAR(20) NOT NULL DEFAULT 'new',       -- new|used|refurbished
  status          VARCHAR(20) NOT NULL DEFAULT 'draft',     -- draft|published|archived
  has_variants    BOOLEAN NOT NULL DEFAULT TRUE,
  price           NUMERIC(12,2),
  stock_qty       INT,
  currency        CHAR(3) DEFAULT 'MXN',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (store_id, slug),
  CONSTRAINT products_condition_chk CHECK (condition IN ('new','used','refurbished')),
  CONSTRAINT products_status_chk    CHECK (status IN ('draft','published','archived'))
);
CREATE INDEX products_store_idx    ON products(store_id);
CREATE INDEX products_category_idx ON products(category_id);

-- PRODUCT IMAGES
CREATE TABLE product_images (
  id          BIGSERIAL PRIMARY KEY,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  position    INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX product_images_prod_idx ON product_images(product_id);

-- PRODUCT ↔ OPTIONS (qué atributos variabilizan este producto: ej. color, size)
CREATE TABLE product_options (
  product_id    BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  attribute_id  BIGINT NOT NULL REFERENCES attributes(id) ON DELETE RESTRICT,
  position      INT NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, attribute_id)
);

-- PRODUCT VARIANTS (SKU concreto)
CREATE TABLE product_variants (
  id              BIGSERIAL PRIMARY KEY,
  product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku             VARCHAR(64) NOT NULL,
  price           NUMERIC(12,2) NOT NULL,
  compare_at_price NUMERIC(12,2),
  stock_qty       INT NOT NULL DEFAULT 0,
  barcode         VARCHAR(64),
  weight_grams    INT,
  length_cm       NUMERIC(10,2),
  width_cm        NUMERIC(10,2),
  height_cm       NUMERIC(10,2),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, sku)
);
CREATE INDEX product_variants_product_idx ON product_variants(product_id);

-- VARIANT VALUES (qué valor toma cada atributo en la variante: ej. Color=Black, Size=M)
CREATE TABLE product_variant_values (
  variant_id      BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  attribute_id    BIGINT NOT NULL REFERENCES attributes(id) ON DELETE RESTRICT,
  attribute_value_id BIGINT NOT NULL REFERENCES attribute_values(id) ON DELETE RESTRICT,
  PRIMARY KEY (variant_id, attribute_id)
);
CREATE INDEX pvv_variant_idx ON product_variant_values(variant_id);


-- CARTS
CREATE TABLE carts (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT REFERENCES users(id) ON DELETE SET NULL,
  session_id    VARCHAR(100),                       -- para invitados
  status        VARCHAR(20) NOT NULL DEFAULT 'active', -- active|converted|abandoned
  currency      CHAR(3) DEFAULT 'MXN',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX carts_user_idx ON carts(user_id);
CREATE INDEX carts_session_idx ON carts(session_id);

CREATE TABLE cart_items (
  id              BIGSERIAL PRIMARY KEY,
  cart_id         BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id      BIGINT REFERENCES product_variants(id) ON DELETE RESTRICT,
  quantity        INT NOT NULL CHECK (quantity > 0),
  price_at_add    NUMERIC(12,2) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX cart_items_cart_idx ON cart_items(cart_id);

-- ORDERS (multi-vendedor: cada línea conoce su store)
CREATE TABLE orders (
  id              BIGSERIAL PRIMARY KEY,
  user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status          VARCHAR(20) NOT NULL DEFAULT 'pending',   -- pending|paid|cancelled|refunded|completed
  payment_status  VARCHAR(20) NOT NULL DEFAULT 'pending',   -- pending|authorized|paid|failed|refunded
  currency        CHAR(3) DEFAULT 'MXN',
  subtotal_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount    NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT orders_status_chk CHECK (status IN ('pending','paid','cancelled','refunded','completed')),
  CONSTRAINT orders_pay_status_chk CHECK (payment_status IN ('pending','authorized','paid','failed','refunded'))
);
CREATE INDEX orders_user_idx ON orders(user_id);

CREATE TABLE order_items (
  id                 BIGSERIAL PRIMARY KEY,
  order_id           BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  store_id           BIGINT NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
  product_id         BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id         BIGINT REFERENCES product_variants(id) ON DELETE RESTRICT,
  title_snapshot     VARCHAR(180) NOT NULL,
  sku_snapshot       VARCHAR(64),
  price              NUMERIC(12,2) NOT NULL,
  quantity           INT NOT NULL CHECK (quantity > 0),
  fulfillment_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending|processing|shipped|delivered|cancelled|returned
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT order_items_fulfill_chk CHECK (fulfillment_status IN ('pending','processing','shipped','delivered','cancelled','returned'))
);
CREATE INDEX order_items_order_idx ON order_items(order_id);
CREATE INDEX order_items_store_idx ON order_items(store_id);

-- ORDER ADDRESSES (fotografía de direcciones)
CREATE TABLE order_addresses (
  id            BIGSERIAL PRIMARY KEY,
  order_id      BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  type          VARCHAR(20) NOT NULL,   -- shipping|billing
  recipient     VARCHAR(150) NOT NULL,
  phone         VARCHAR(30),
  line1         VARCHAR(160) NOT NULL,
  line2         VARCHAR(160),
  city          VARCHAR(120) NOT NULL,
  state         VARCHAR(120) NOT NULL,
  postal_code   VARCHAR(20)  NOT NULL,
  country_code  CHAR(2)      NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT order_addresses_type_chk CHECK (type IN ('shipping','billing'))
);
CREATE INDEX order_addresses_order_idx ON order_addresses(order_id);


-- PAYMENTS
CREATE TABLE payments (
  id             BIGSERIAL PRIMARY KEY,
  order_id       BIGINT NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  provider       VARCHAR(40) NOT NULL,       -- stripe|paypal|oxxo...
  status         VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending|authorized|paid|failed|refunded
  amount         NUMERIC(12,2) NOT NULL,
  currency       CHAR(3) DEFAULT 'MXN',
  transaction_id VARCHAR(120),
  raw_payload    JSONB,
  processed_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT payments_status_chk CHECK (status IN ('pending','authorized','paid','failed','refunded'))
);
CREATE INDEX payments_order_idx ON payments(order_id);

-- SHIPMENTS
CREATE TABLE shipments (
  id            BIGSERIAL PRIMARY KEY,
  order_id      BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  store_id      BIGINT NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
  carrier       VARCHAR(60),    -- DHL, FedEx...
  service       VARCHAR(60),
  tracking_no   VARCHAR(80),
  status        VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending|shipped|delivered|cancelled|returned
  shipped_at    TIMESTAMPTZ,
  delivered_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT shipments_status_chk CHECK (status IN ('pending','shipped','delivered','cancelled','returned'))
);
CREATE INDEX shipments_order_idx ON shipments(order_id);

CREATE TABLE shipment_items (
  id             BIGSERIAL PRIMARY KEY,
  shipment_id    BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  order_item_id  BIGINT NOT NULL REFERENCES order_items(id) ON DELETE RESTRICT,
  quantity       INT NOT NULL CHECK (quantity > 0)
);
CREATE INDEX shipment_items_ship_idx ON shipment_items(shipment_id);

-- (Opcional) REFUNDS
CREATE TABLE refunds (
  id            BIGSERIAL PRIMARY KEY,
  payment_id    BIGINT NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
  amount        NUMERIC(12,2) NOT NULL,
  reason        VARCHAR(160),
  processed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- PRODUCT REVIEWS
CREATE TABLE product_reviews (
  id            BIGSERIAL PRIMARY KEY,
  product_id    BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  author_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title         VARCHAR(160),
  body          TEXT,
  status        VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending|approved|rejected
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reviews_status_chk CHECK (status IN ('pending','approved','rejected')),
  UNIQUE (product_id, author_user_id) -- 1 reseña por usuario/producto
);
CREATE INDEX product_reviews_prod_idx ON product_reviews(product_id);

-- SELLER REVIEWS (opcional)
CREATE TABLE seller_reviews (
  id             BIGSERIAL PRIMARY KEY,
  store_id       BIGINT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  author_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  rating         SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title          VARCHAR(160),
  body           TEXT,
  status         VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT seller_reviews_status_chk CHECK (status IN ('pending','approved','rejected')),
  UNIQUE (store_id, author_user_id)
);
CREATE INDEX seller_reviews_store_idx ON seller_reviews(store_id);

-- WISHLIST
CREATE TABLE wishlists (
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);


CREATE TABLE inventory_movements (
  id           BIGSERIAL PRIMARY KEY,
  variant_id   BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  change_qty   INT NOT NULL,              -- +n o -n
  reason       VARCHAR(60) NOT NULL,      -- order|refund|manual|adjustment
  reference    VARCHAR(120),              -- ej. order id/nota
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX inventory_movements_variant_idx ON inventory_movements(variant_id);
