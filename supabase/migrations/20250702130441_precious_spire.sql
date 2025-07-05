-- =====================================================
-- REQUÊTES UTILES POUR MERRY'S FOOD ET NUTRITION
-- =====================================================

-- =====================================================
-- 1. REQUÊTES POUR LES PRODUITS
-- =====================================================

-- Récupérer tous les produits actifs avec pagination
SELECT 
    id,
    name,
    slug,
    short_description,
    price,
    category_type,
    image_url,
    in_stock,
    rating,
    reviews_count,
    is_featured
FROM products 
WHERE is_active = true 
ORDER BY 
    is_featured DESC,
    created_at DESC
LIMIT 20 OFFSET 0;

-- Recherche de produits par nom ou description
SELECT 
    id,
    name,
    slug,
    short_description,
    price,
    category_type,
    image_url,
    rating,
    reviews_count
FROM products 
WHERE is_active = true 
AND (
    name ILIKE '%vitamine%' 
    OR description ILIKE '%vitamine%'
    OR array_to_string(tags, ' ') ILIKE '%vitamine%'
)
ORDER BY rating DESC;

-- Produits par catégorie avec filtres de prix
SELECT 
    id,
    name,
    price,
    rating,
    reviews_count,
    image_url
FROM products 
WHERE is_active = true 
AND category_type = 'supplement'
AND price BETWEEN 20 AND 50
ORDER BY rating DESC, reviews_count DESC;

-- Produits les plus populaires (mieux notés)
SELECT 
    id,
    name,
    price,
    rating,
    reviews_count,
    image_url
FROM products 
WHERE is_active = true 
AND rating IS NOT NULL
ORDER BY rating DESC, reviews_count DESC
LIMIT 6;

-- Produits en rupture de stock
SELECT 
    id,
    name,
    price,
    stock_quantity,
    updated_at
FROM products 
WHERE is_active = true 
AND (in_stock = false OR stock_quantity <= 0)
ORDER BY updated_at DESC;

-- =====================================================
-- 2. REQUÊTES POUR LES COMMANDES
-- =====================================================

-- Commandes récentes avec détails
SELECT 
    o.id,
    o.order_number,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.total_amount,
    o.status,
    o.created_at,
    COUNT(oi.id) as items_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY o.id
ORDER BY o.created_at DESC;

-- Détails d'une commande spécifique
SELECT 
    o.order_number,
    o.customer_name,
    o.customer_email,
    o.total_amount,
    o.status,
    o.created_at,
    oi.product_name,
    oi.quantity,
    oi.unit_price,
    oi.total_price
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.order_number = 'MF202501150001'
ORDER BY oi.created_at;

-- Chiffre d'affaires par mois
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_order_value
FROM orders 
WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered')
AND created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Top 10 des produits les plus vendus
SELECT 
    oi.product_name,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.total_price) as total_revenue,
    COUNT(DISTINCT oi.order_id) as number_of_orders,
    AVG(oi.unit_price) as average_price
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
AND o.created_at >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY oi.product_name
ORDER BY total_quantity_sold DESC
LIMIT 10;

-- Commandes en attente de traitement
SELECT 
    o.order_number,
    o.customer_name,
    o.customer_phone,
    o.total_amount,
    o.created_at,
    EXTRACT(HOUR FROM (CURRENT_TIMESTAMP - o.created_at)) as hours_pending
FROM orders o
WHERE o.status = 'pending'
ORDER BY o.created_at;

-- =====================================================
-- 3. REQUÊTES POUR LES CONSULTATIONS
-- =====================================================

-- Consultations du jour
SELECT 
    id,
    name,
    email,
    phone,
    booking_time,
    consultation_type,
    status,
    message
FROM bookings 
WHERE booking_date = CURRENT_DATE
ORDER BY booking_time;

-- Consultations de la semaine
SELECT 
    booking_date,
    booking_time,
    name,
    email,
    phone,
    status,
    consultation_type
FROM bookings 
WHERE booking_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY booking_date, booking_time;

-- Statistiques des consultations par mois
SELECT 
    DATE_TRUNC('month', booking_date) as month,
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
    COUNT(CASE WHEN consultation_type = 'initial' THEN 1 END) as initial_consultations,
    COUNT(CASE WHEN consultation_type = 'follow_up' THEN 1 END) as follow_up_consultations
FROM bookings 
WHERE booking_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', booking_date)
ORDER BY month DESC;

-- Créneaux disponibles pour une date donnée
WITH time_slots AS (
    SELECT generate_series(
        '09:00'::time,
        '17:00'::time,
        '1 hour 30 minutes'::interval
    )::time as slot_time
),
booked_slots AS (
    SELECT booking_time
    FROM bookings 
    WHERE booking_date = '2025-01-20'
    AND status IN ('confirmed', 'pending')
)
SELECT ts.slot_time
FROM time_slots ts
LEFT JOIN booked_slots bs ON ts.slot_time = bs.booking_time
WHERE bs.booking_time IS NULL
ORDER BY ts.slot_time;

-- =====================================================
-- 4. REQUÊTES POUR LE BLOG
-- =====================================================

-- Articles récents publiés
SELECT 
    id,
    title,
    slug,
    excerpt,
    image_url,
    author,
    read_time,
    tags,
    published_at
FROM blog_posts 
WHERE is_published = true 
ORDER BY published_at DESC
LIMIT 10;

-- Articles par tag
SELECT 
    id,
    title,
    slug,
    excerpt,
    image_url,
    read_time,
    published_at
FROM blog_posts 
WHERE is_published = true 
AND 'nutrition' = ANY(tags)
ORDER BY published_at DESC;

-- Articles les plus récents par catégorie de tags
SELECT DISTINCT ON (tag)
    tag,
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.image_url,
    bp.published_at
FROM blog_posts bp
CROSS JOIN LATERAL unnest(bp.tags) as tag
WHERE bp.is_published = true
ORDER BY tag, bp.published_at DESC;

-- =====================================================
-- 5. REQUÊTES POUR LES STATISTIQUES DASHBOARD
-- =====================================================

-- Vue d'ensemble des statistiques
SELECT 
    -- Produits
    (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
    (SELECT COUNT(*) FROM products WHERE is_active = true AND in_stock = false) as out_of_stock_products,
    
    -- Commandes
    (SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as orders_this_month,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered') AND created_at >= CURRENT_DATE - INTERVAL '30 days') as revenue_this_month,
    
    -- Consultations
    (SELECT COUNT(*) FROM bookings WHERE booking_date >= CURRENT_DATE) as upcoming_bookings,
    (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
    
    -- Blog
    (SELECT COUNT(*) FROM blog_posts WHERE is_published = true) as published_articles,
    
    -- Messages
    (SELECT COUNT(*) FROM contact_messages WHERE status = 'new') as new_messages,
    
    -- Newsletter
    (SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = true) as newsletter_subscribers;

-- Évolution des ventes par semaine (12 dernières semaines)
SELECT 
    DATE_TRUNC('week', created_at) as week,
    COUNT(*) as orders_count,
    SUM(total_amount) as total_revenue
FROM orders 
WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered')
AND created_at >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week;

-- Répartition des ventes par catégorie de produits
SELECT 
    p.category_type,
    COUNT(oi.id) as items_sold,
    SUM(oi.total_price) as category_revenue,
    AVG(oi.unit_price) as average_price
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
AND o.created_at >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY p.category_type
ORDER BY category_revenue DESC;

-- =====================================================
-- 6. REQUÊTES DE MAINTENANCE
-- =====================================================

-- Nettoyer les anciens paniers (plus de 7 jours)
DELETE FROM cart_items 
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '7 days';

-- Mettre à jour les statistiques des produits
UPDATE products 
SET reviews_count = (
    SELECT COUNT(*)
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE oi.product_id = products.id
    AND o.status = 'delivered'
)
WHERE id IN (
    SELECT DISTINCT product_id 
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status = 'delivered'
);

-- Archiver les anciennes commandes (plus d'un an)
UPDATE orders 
SET status = 'archived'
WHERE created_at < CURRENT_DATE - INTERVAL '1 year'
AND status = 'delivered';

-- =====================================================
-- 7. REQUÊTES POUR LES RAPPORTS
-- =====================================================

-- Rapport mensuel des ventes
SELECT 
    TO_CHAR(o.created_at, 'YYYY-MM') as month,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(o.total_amount) as total_revenue,
    AVG(o.total_amount) as average_order_value,
    COUNT(DISTINCT o.customer_email) as unique_customers,
    SUM(oi.quantity) as total_items_sold
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
AND o.created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY TO_CHAR(o.created_at, 'YYYY-MM')
ORDER BY month DESC;

-- Rapport des consultations
SELECT 
    TO_CHAR(booking_date, 'YYYY-MM') as month,
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_consultations,
    COUNT(CASE WHEN consultation_type = 'initial' THEN 1 END) as new_clients,
    COUNT(CASE WHEN consultation_type = 'follow_up' THEN 1 END) as returning_clients,
    SUM(price) as consultation_revenue
FROM bookings 
WHERE booking_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY TO_CHAR(booking_date, 'YYYY-MM')
ORDER BY month DESC;

-- Top clients par valeur de commandes
SELECT 
    customer_email,
    customer_name,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_spent,
    AVG(total_amount) as average_order_value,
    MAX(created_at) as last_order_date
FROM orders 
WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered')
GROUP BY customer_email, customer_name
HAVING COUNT(*) > 1
ORDER BY total_spent DESC
LIMIT 20;