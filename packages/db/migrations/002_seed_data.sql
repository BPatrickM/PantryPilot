-- ─────────────────────────────────────────────────────────────────────────────
-- PantryPilot — Seed Data
-- Curated ingredients catalog + starter meals
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Ingredients ───────────────────────────────────────────────────────────────

INSERT INTO ingredients (name, category, default_unit, standard_package_qty, standard_package_unit, icon_type, walmart_search_term, shoprite_search_term, is_staple) VALUES
-- Pantry staples
('olive oil',          'Pantry & Dry Goods', 'tbsp', 16.9, 'fl oz', 'bottle', 'olive oil',      'olive oil',      FALSE),
('salt',               'Pantry & Dry Goods', 'tsp',  26.0, 'oz',    'jar',    'table salt',     'table salt',     TRUE),
('black pepper',       'Pantry & Dry Goods', 'tsp',   3.0, 'oz',    'jar',    'black pepper',   'ground pepper',  TRUE),
('garlic powder',      'Pantry & Dry Goods', 'tsp',   2.5, 'oz',    'jar',    'garlic powder',  'garlic powder',  FALSE),
('onion powder',       'Pantry & Dry Goods', 'tsp',   2.5, 'oz',    'jar',    'onion powder',   'onion powder',   FALSE),
('cumin',              'Pantry & Dry Goods', 'tsp',   2.0, 'oz',    'jar',    'ground cumin',   'cumin',          FALSE),
('paprika',            'Pantry & Dry Goods', 'tsp',   2.5, 'oz',    'jar',    'paprika',        'paprika',        FALSE),
('chili powder',       'Pantry & Dry Goods', 'tsp',   2.5, 'oz',    'jar',    'chili powder',   'chili powder',   FALSE),
('Italian seasoning',  'Pantry & Dry Goods', 'tsp',   0.7, 'oz',    'jar',    'Italian seasoning', 'Italian seasoning', FALSE),
('all-purpose flour',  'Pantry & Dry Goods', 'cup',  32.0, 'oz',    'bag',    'all purpose flour', 'all purpose flour', FALSE),
('granulated sugar',   'Pantry & Dry Goods', 'cup',  32.0, 'oz',    'bag',    'white sugar',    'granulated sugar', FALSE),
('brown sugar',        'Pantry & Dry Goods', 'cup',  32.0, 'oz',    'bag',    'brown sugar',    'brown sugar',    FALSE),
('baking soda',        'Pantry & Dry Goods', 'tsp',   8.0, 'oz',    'box',    'baking soda',    'baking soda',    FALSE),
('baking powder',      'Pantry & Dry Goods', 'tsp',   8.0, 'oz',    'can',    'baking powder',  'baking powder',  FALSE),
('vanilla extract',    'Pantry & Dry Goods', 'tsp',   4.0, 'fl oz', 'bottle', 'vanilla extract','vanilla extract', FALSE),
('soy sauce',          'Pantry & Dry Goods', 'tbsp', 10.0, 'fl oz', 'bottle', 'soy sauce',      'soy sauce',      FALSE),
('chicken broth',      'Pantry & Dry Goods', 'cup',  32.0, 'fl oz', 'box',    'chicken broth',  'chicken broth',  FALSE),
('beef broth',         'Pantry & Dry Goods', 'cup',  32.0, 'fl oz', 'box',    'beef broth',     'beef broth',     FALSE),
('canned tomatoes',    'Pantry & Dry Goods', 'can',  14.5, 'oz',    'can',    'diced tomatoes', 'diced tomatoes', FALSE),
('tomato paste',       'Pantry & Dry Goods', 'tbsp',  6.0, 'oz',    'can',    'tomato paste',   'tomato paste',   FALSE),
('coconut milk',       'Pantry & Dry Goods', 'cup',  13.5, 'fl oz', 'can',    'coconut milk',   'coconut milk',   FALSE),
('pasta',              'Pantry & Dry Goods', 'oz',   16.0, 'oz',    'box',    'spaghetti pasta','spaghetti',      FALSE),
('rice',               'Pantry & Dry Goods', 'cup',  32.0, 'oz',    'bag',    'long grain rice','white rice',     FALSE),
('panko breadcrumbs',  'Pantry & Dry Goods', 'cup',   8.0, 'oz',    'box',    'panko breadcrumbs','panko',        FALSE),
-- Produce
('garlic',             'Produce',            'clove', 3.0, 'head',  'bunch',  'garlic head',    'garlic',         FALSE),
('yellow onion',       'Produce',            'each',  3.0, 'each',  'bunch',  'yellow onion',   'yellow onion',   FALSE),
('red onion',          'Produce',            'each',  1.0, 'each',  'bunch',  'red onion',      'red onion',      FALSE),
('bell pepper',        'Produce',            'each',  3.0, 'each',  'bunch',  'bell pepper',    'bell pepper',    FALSE),
('broccoli',           'Produce',            'head',  1.0, 'head',  'bunch',  'broccoli',       'broccoli',       FALSE),
('baby spinach',       'Produce',            'cup',   5.0, 'oz',    'bag',    'baby spinach',   'baby spinach',   FALSE),
('cherry tomatoes',    'Produce',            'cup',  10.0, 'oz',    'bag',    'cherry tomatoes','cherry tomatoes',FALSE),
('lemon',              'Produce',            'each',  2.0, 'each',  'bag',    'lemons',         'lemon',          FALSE),
('lime',               'Produce',            'each',  2.0, 'each',  'bag',    'limes',          'lime',           FALSE),
('ginger',             'Produce',            'inch',  4.0, 'oz',    'bunch',  'fresh ginger',   'ginger root',    FALSE),
('cilantro',           'Produce',            'bunch', 1.0, 'bunch', 'bunch',  'fresh cilantro', 'cilantro',       FALSE),
('avocado',            'Produce',            'each',  2.0, 'each',  'bag',    'avocado',        'avocado',        FALSE),
('sweet potato',       'Produce',            'each',  3.0, 'each',  'bag',    'sweet potato',   'sweet potato',   FALSE),
('zucchini',           'Produce',            'each',  2.0, 'each',  'bag',    'zucchini squash','zucchini',       FALSE),
('mushrooms',          'Produce',            'cup',   8.0, 'oz',    'bag',    'white mushrooms','mushrooms',      FALSE),
('green beans',        'Produce',            'cup',  12.0, 'oz',    'bag',    'green beans',    'green beans',    FALSE),
-- Meat
('chicken breast',     'Meat & Seafood',     'lb',    2.0, 'lb',    'bag',    'chicken breast', 'boneless chicken breast', FALSE),
('chicken thighs',     'Meat & Seafood',     'lb',    2.0, 'lb',    'bag',    'chicken thighs', 'chicken thighs', FALSE),
('ground beef',        'Meat & Seafood',     'lb',    1.0, 'lb',    'bag',    'ground beef 80/20','ground beef',  FALSE),
('ground turkey',      'Meat & Seafood',     'lb',    1.0, 'lb',    'bag',    'ground turkey',  'ground turkey',  FALSE),
('salmon fillet',      'Meat & Seafood',     'lb',    1.0, 'lb',    'bag',    'salmon fillet',  'salmon fillet',  FALSE),
('shrimp',             'Meat & Seafood',     'lb',    1.0, 'lb',    'bag',    'frozen shrimp',  'shrimp',         FALSE),
('bacon',              'Meat & Seafood',     'slice', 12.0,'oz',    'bag',    'bacon',          'bacon',          FALSE),
('Italian sausage',    'Meat & Seafood',     'lb',    1.0, 'lb',    'bag',    'Italian sausage','Italian sausage',FALSE),
-- Dairy
('butter',             'Dairy & Eggs',       'tbsp', 16.0, 'tbsp',  'box',    'unsalted butter','butter',         FALSE),
('whole milk',         'Dairy & Eggs',       'cup',   0.5, 'gallon','bottle', 'whole milk',     'whole milk',     FALSE),
('heavy cream',        'Dairy & Eggs',       'cup',  16.0, 'fl oz', 'bottle', 'heavy cream',    'heavy cream',    FALSE),
('eggs',               'Dairy & Eggs',       'each', 12.0, 'each',  'bag',    'large eggs',     'large eggs',     FALSE),
('parmesan cheese',    'Dairy & Eggs',       'cup',   5.0, 'oz',    'bag',    'parmesan cheese','parmesan',       FALSE),
('mozzarella cheese',  'Dairy & Eggs',       'cup',   8.0, 'oz',    'bag',    'mozzarella',     'mozzarella',     FALSE),
('cheddar cheese',     'Dairy & Eggs',       'cup',   8.0, 'oz',    'bag',    'cheddar cheese', 'cheddar',        FALSE),
('cream cheese',       'Dairy & Eggs',       'oz',    8.0, 'oz',    'box',    'cream cheese',   'cream cheese',   FALSE),
('greek yogurt',       'Dairy & Eggs',       'cup',  16.0, 'oz',    'jar',    'greek yogurt',   'greek yogurt',   FALSE),
-- Frozen
('frozen peas',        'Frozen',             'cup',  16.0, 'oz',    'bag',    'frozen peas',    'frozen peas',    FALSE),
('frozen corn',        'Frozen',             'cup',  16.0, 'oz',    'bag',    'frozen corn',    'frozen corn',    FALSE),
-- Beverages
('water',              'Beverages',          'cup',   1.0, 'gallon','bottle', 'water',          'water',          TRUE);

-- ── Curated Meals ─────────────────────────────────────────────────────────────

INSERT INTO meals (id, name, description, yield_servings, prep_time_mins, meal_type, is_user_created) VALUES
('11111111-0001-0001-0001-000000000001', 'Chicken Stir Fry', 'Quick weeknight stir fry with tender chicken, crisp vegetables, and savory soy-ginger sauce.', 4, 25, 'dinner', FALSE),
('11111111-0002-0002-0002-000000000002', 'Spaghetti Bolognese', 'Classic Italian meat sauce slow-cooked with tomatoes, herbs, and ground beef over pasta.', 6, 45, 'dinner', FALSE),
('11111111-0003-0003-0003-000000000003', 'Garlic Butter Salmon', 'Pan-seared salmon in a rich garlic butter lemon sauce. Ready in 20 minutes.', 2, 20, 'dinner', FALSE),
('11111111-0004-0004-0004-000000000004', 'Sheet Pan Chicken', 'One-pan roasted chicken thighs with sweet potatoes and green beans.', 4, 40, 'dinner', FALSE),
('11111111-0005-0005-0005-000000000005', 'Beef Tacos', 'Seasoned ground beef tacos with fresh toppings. Family favorite.', 4, 20, 'dinner', FALSE),
('11111111-0006-0006-0006-000000000006', 'Shrimp Fried Rice', 'Restaurant-style fried rice with shrimp, eggs, and vegetables.', 4, 20, 'dinner', FALSE),
('11111111-0007-0007-0007-000000000007', 'Chicken Tikka Masala', 'Creamy tomato-based Indian curry with tender chicken and aromatic spices.', 4, 50, 'dinner', FALSE),
('11111111-0008-0008-0008-000000000008', 'Classic Cheeseburger', 'Juicy homemade beef patties with all the toppings.', 4, 25, 'dinner', FALSE),
('11111111-0009-0009-0009-000000000009', 'Roasted Broccoli', 'Simple oven-roasted broccoli with garlic and olive oil.', 4, 20, 'dinner', FALSE),
('11111111-0010-0010-0010-000000000010', 'Garlic Bread', 'Buttery garlic bread toasted to golden perfection.', 4, 10, 'dinner', FALSE),
('11111111-0011-0011-0011-000000000011', 'Caesar Salad', 'Crisp romaine lettuce with classic Caesar dressing and croutons.', 4, 15, 'dinner', FALSE),
('11111111-0012-0012-0012-000000000012', 'Chocolate Lava Cake', 'Decadent individual chocolate cakes with a molten center.', 4, 25, 'dessert', FALSE),
('11111111-0013-0013-0013-000000000013', 'Overnight Oats', 'Creamy no-cook oats prepared the night before with your favorite toppings.', 2, 5, 'breakfast', FALSE),
('11111111-0014-0014-0014-000000000014', 'Avocado Toast', 'Smashed avocado on toasted bread with lemon and red pepper flakes.', 2, 10, 'breakfast', FALSE);

-- ── Plan Templates ────────────────────────────────────────────────────────────

INSERT INTO plan_templates (id, name, description, is_curated, is_public, season_tag) VALUES
('aaaaaaaa-0001-0001-0001-000000000001', 'Week A — Quick & Easy', 'Fast weeknight meals under 30 minutes each. Perfect for busy schedules.', TRUE, TRUE, NULL),
('aaaaaaaa-0002-0002-0002-000000000002', 'Week B — Family Favorites', 'Kid-approved crowd-pleasers the whole family will love.', TRUE, TRUE, NULL),
('aaaaaaaa-0003-0003-0003-000000000003', 'Holiday Week', 'Festive seasonal meals for a special week of cooking.', TRUE, TRUE, 'holiday');
