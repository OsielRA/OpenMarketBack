-- Categories (ejemplo)
INSERT INTO categories (name, slug) VALUES
 ('Women', 'women'),
 ('Men', 'men'),
 ('Accessories', 'accessories'),
 ('Shoes', 'shoes');

-- Attributes
INSERT INTO attributes (code, name, value_type) VALUES
 ('color', 'Color', 'color'),
 ('size',  'Size',  'select');

INSERT INTO attribute_values (attribute_id, value, extra, position)
SELECT a.id, v.value, v.extra, v.position
FROM attributes a
JOIN (
  VALUES
    ('color','Black','{"hex":"#000000"}',1),
    ('color','White','{"hex":"#FFFFFF"}',2),
    ('color','Red','{"hex":"#FF0000"}',3),
    ('size','XS',NULL,1),
    ('size','S', NULL,2),
    ('size','M', NULL,3),
    ('size','L', NULL,4),
    ('size','XL',NULL,5)
) AS v(code,value,extra,position)
ON a.code = v.code;