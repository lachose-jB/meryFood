-- =====================================================
-- DONNÉES D'EXEMPLE POUR MERRY'S FOOD ET NUTRITION
-- =====================================================

-- Insertion de données d'exemple supplémentaires

-- Produits supplémentaires
INSERT INTO products (name, slug, description, short_description, price, category_type, image_url, in_stock, rating, reviews_count, ingredients, usage_instructions, tags) VALUES 

-- Compléments alimentaires
(
    'Oméga-3 Premium',
    'omega-3-premium',
    'Huile de poisson pure, riche en EPA et DHA pour la santé cardiovasculaire. Nos capsules sont purifiées et testées pour éliminer les métaux lourds.',
    'Huile de poisson pure, riche en EPA et DHA pour la santé cardiovasculaire.',
    32.50,
    'supplement',
    'https://images.pexels.com/photos/3683101/pexels-photo-3683101.jpeg?auto=compress&cs=tinysrgb&w=500',
    true,
    4.7,
    203,
    'Huile de poisson (EPA 180mg, DHA 120mg), vitamine E, gélatine de poisson',
    'Prendre 2 capsules par jour avec les repas.'
),
(
    'Probiotiques Multi-Souches',
    'probiotiques-multi-souches',
    'Complexe de 10 milliards de probiotiques pour une flore intestinale équilibrée. Formule avancée avec 8 souches différentes.',
    'Complexe de 10 milliards de probiotiques pour une flore intestinale équilibrée.',
    28.90,
    'supplement',
    'https://images.pexels.com/photos/3683111/pexels-photo-3683111.jpeg?auto=compress&cs=tinysrgb&w=500',
    true,
    4.6,
    94,
    'Lactobacillus acidophilus, Bifidobacterium bifidum, Lactobacillus casei, inuline',
    'Prendre 1 capsule par jour à jeun avec un verre d''eau.'
),
(
    'Magnésium Bisglycinate',
    'magnesium-bisglycinate',
    'Magnésium hautement biodisponible pour réduire la fatigue et soutenir le système nerveux. Forme chélatée pour une absorption optimale.',
    'Magnésium hautement biodisponible pour réduire la fatigue.',
    22.90,
    'supplement',
    'https://images.pexels.com/photos/3683109/pexels-photo-3683109.jpeg?auto=compress&cs=tinysrgb&w=500',
    true,
    4.8,
    156,
    'Magnésium bisglycinate 200mg, cellulose microcristalline',
    'Prendre 1 à 2 capsules par jour avec les repas.'
),

-- E-books
(
    'Recettes Anti-Inflammatoires',
    'recettes-anti-inflammatoires',
    'E-book avec 30 recettes pour réduire l''inflammation naturellement. Découvrez les aliments anti-inflammatoires et leurs bienfaits.',
    'E-book avec 30 recettes pour réduire l''inflammation naturellement.',
    15.99,
    'ebook',
    'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=500',
    true,
    4.8,
    67,
    NULL,
    'Téléchargement immédiat. Format PDF compatible tous appareils.'
),
(
    'Guide du Jeûne Intermittent',
    'guide-jeune-intermittent',
    'Guide complet pour débuter le jeûne intermittent en toute sécurité. Méthodes, conseils et plans de repas inclus.',
    'Guide complet pour débuter le jeûne intermittent en toute sécurité.',
    24.99,
    'ebook',
    'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=500',
    true,
    4.7,
    89,
    NULL,
    'Accès immédiat après achat. Bonus : planning de repas.'
),

-- Programmes
(
    'Programme Perte de Poids 12 Semaines',
    'programme-perte-poids-12-semaines',
    'Programme complet de 12 semaines avec nutrition, exercices et suivi personnalisé pour une perte de poids durable.',
    'Programme complet de 12 semaines pour une perte de poids durable.',
    149.00,
    'program',
    'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=500',
    true,
    4.9,
    234,
    NULL,
    'Accès plateforme + suivi hebdomadaire + groupe privé.'
),
(
    'Programme Énergie & Vitalité',
    'programme-energie-vitalite',
    'Programme de 6 semaines pour retrouver énergie et vitalité grâce à une nutrition optimisée et des habitudes saines.',
    'Programme de 6 semaines pour retrouver énergie et vitalité.',
    89.00,
    'program',
    'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=500',
    true,
    4.8,
    178,
    NULL,
    'Accès immédiat + coaching personnalisé inclus.'
);

-- Articles de blog supplémentaires
INSERT INTO blog_posts (title, slug, excerpt, content, image_url, read_time, tags) VALUES 

(
    'Planification des repas : organisez votre semaine',
    'planification-repas-organisation',
    'Optimisez votre temps et votre nutrition avec une planification efficace.',
    'La planification des repas est un outil puissant pour maintenir une alimentation équilibrée tout en économisant du temps et de l''argent. Dans cet article, découvrez nos méthodes éprouvées pour organiser vos repas de la semaine, préparer vos courses et gagner en sérénité au quotidien.',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    '7 min',
    ARRAY['planification', 'organisation', 'repas', 'meal-prep']
),
(
    'Les bienfaits des oméga-3 pour votre santé',
    'bienfaits-omega-3-sante',
    'Découvrez pourquoi les oméga-3 sont essentiels pour votre organisme.',
    'Les acides gras oméga-3 sont des nutriments essentiels que notre corps ne peut pas produire. Ils jouent un rôle crucial dans la santé cardiovasculaire, cérébrale et inflammatoire. Apprenez où les trouver et comment optimiser vos apports.',
    'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?auto=compress&cs=tinysrgb&w=800',
    '5 min',
    ARRAY['omega-3', 'santé', 'nutrition', 'compléments']
),
(
    'Micronutriments : les héros méconnus de votre assiette',
    'micronutriments-vitamines-mineraux',
    'Vitamines et minéraux : petites quantités, grands effets sur votre santé.',
    'Les micronutriments, bien qu''nécessaires en petites quantités, sont indispensables au bon fonctionnement de notre organisme. Découvrez le rôle de chaque vitamine et minéral, et comment éviter les carences courantes.',
    'https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg?auto=compress&cs=tinysrgb&w=800',
    '6 min',
    ARRAY['micronutriments', 'vitamines', 'minéraux', 'carences']
),
(
    'Alimentation et immunité : renforcez vos défenses',
    'alimentation-immunite-defenses',
    'Comment soutenir votre système immunitaire par l''alimentation.',
    'Notre système immunitaire dépend largement de notre alimentation. Certains nutriments et aliments peuvent considérablement renforcer nos défenses naturelles. Découvrez les meilleurs alliés de votre immunité.',
    'https://images.pexels.com/photos/1640779/pexels-photo-1640779.jpeg?auto=compress&cs=tinysrgb&w=800',
    '8 min',
    ARRAY['immunité', 'défenses', 'alimentation', 'santé']
);

-- Réservations d'exemple
INSERT INTO bookings (name, email, phone, booking_date, booking_time, message, status, consultation_type) VALUES 
('Sophie Martin', 'sophie.martin@email.com', '06 12 34 56 78', '2025-01-20', '09:00', 'Première consultation pour rééquilibrage alimentaire', 'confirmed', 'initial'),
('Pierre Dubois', 'pierre.dubois@email.com', '06 23 45 67 89', '2025-01-20', '14:00', 'Suivi programme perte de poids', 'confirmed', 'follow_up'),
('Marie Leroy', 'marie.leroy@email.com', '06 34 56 78 90', '2025-01-21', '10:30', 'Consultation nutrition sportive', 'pending', 'initial'),
('Jean Moreau', 'jean.moreau@email.com', '06 45 67 89 01', '2025-01-21', '15:30', 'Questions sur les compléments alimentaires', 'pending', 'initial'),
('Claire Rousseau', 'claire.rousseau@email.com', '06 56 78 90 12', '2025-01-22', '09:00', 'Suivi détox', 'confirmed', 'follow_up');

-- Commandes d'exemple
INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, total_amount, shipping_cost, status, payment_status) VALUES 
(generate_order_number(), 'Antoine Durand', 'antoine.durand@email.com', '06 11 22 33 44', 57.49, 4.90, 'confirmed', 'paid'),
(generate_order_number(), 'Isabelle Moreau', 'isabelle.moreau@email.com', '06 22 33 44 55', 89.00, 0.00, 'processing', 'paid'),
(generate_order_number(), 'Thomas Lefevre', 'thomas.lefevre@email.com', '06 33 44 55 66', 24.99, 4.90, 'shipped', 'paid'),
(generate_order_number(), 'Caroline Petit', 'caroline.petit@email.com', '06 44 55 66 77', 149.00, 0.00, 'delivered', 'paid');

-- Articles de commandes d'exemple
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price) 
SELECT 
    o.id,
    p.id,
    p.name,
    CASE 
        WHEN o.order_number LIKE '%0001' THEN 2
        WHEN o.order_number LIKE '%0002' THEN 1
        WHEN o.order_number LIKE '%0003' THEN 1
        ELSE 1
    END,
    p.price,
    CASE 
        WHEN o.order_number LIKE '%0001' THEN p.price * 2
        ELSE p.price
    END
FROM orders o
CROSS JOIN products p
WHERE 
    (o.order_number LIKE '%0001' AND p.name = 'Complément Vitamine D3') OR
    (o.order_number LIKE '%0001' AND p.name = 'Magnésium Bisglycinate') OR
    (o.order_number LIKE '%0002' AND p.name = 'Programme Énergie & Vitalité') OR
    (o.order_number LIKE '%0003' AND p.name = 'Complément Vitamine D3') OR
    (o.order_number LIKE '%0004' AND p.name = 'Programme Perte de Poids 12 Semaines');

-- Messages de contact d'exemple
INSERT INTO contact_messages (first_name, last_name, email, phone, subject, message, status) VALUES 
('Laura', 'Dubois', 'laura.dubois@email.com', '06 12 34 56 78', 'consultation', 'Bonjour, je souhaiterais avoir des informations sur vos consultations nutritionnelles.', 'new'),
('Marc', 'Leroy', 'marc.leroy@email.com', '06 23 45 67 89', 'products', 'Avez-vous des compléments adaptés aux sportifs ?', 'read'),
('Julie', 'Martin', 'julie.martin@email.com', '06 34 56 78 90', 'partnership', 'Je représente une salle de sport et souhaiterais discuter d''un partenariat.', 'replied'),
('David', 'Rousseau', 'david.rousseau@email.com', '06 45 67 89 01', 'support', 'Je n''arrive pas à télécharger mon e-book.', 'closed');

-- Abonnés newsletter d'exemple
INSERT INTO newsletter_subscribers (email, name) VALUES 
('sophie.martin@email.com', 'Sophie Martin'),
('pierre.dubois@email.com', 'Pierre Dubois'),
('marie.leroy@email.com', 'Marie Leroy'),
('jean.moreau@email.com', 'Jean Moreau'),
('claire.rousseau@email.com', 'Claire Rousseau'),
('antoine.durand@email.com', 'Antoine Durand'),
('isabelle.moreau@email.com', 'Isabelle Moreau'),
('thomas.lefevre@email.com', 'Thomas Lefèvre'),
('caroline.petit@email.com', 'Caroline Petit'),
('laura.dubois@email.com', 'Laura Dubois');