-- =====================================================
-- MERRY'S FOOD ET NUTRITION - SCHÉMA DE BASE DE DONNÉES
-- =====================================================
-- Version: 1.0
-- Date: 2025-01-15
-- Description: Schéma complet pour l'application e-commerce et consultation nutrition

-- =====================================================
-- 1. SUPPRESSION DES TABLES EXISTANTES (SI NÉCESSAIRE)
-- =====================================================

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

-- =====================================================
-- 2. CRÉATION DES TABLES PRINCIPALES
-- =====================================================

-- Table des utilisateurs (admin uniquement)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    permissions TEXT[] DEFAULT ARRAY['read', 'write', 'delete'],
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Table des catégories de produits
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des produits
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    category_type VARCHAR(50) NOT NULL CHECK (category_type IN ('supplement', 'ebook', 'program')),
    image_url VARCHAR(500) NOT NULL,
    gallery_images TEXT[], -- Array d'URLs d'images
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0,
    ingredients TEXT, -- Pour les suppléments
    usage_instructions TEXT, -- Instructions d'utilisation
    nutritional_info JSONB, -- Informations nutritionnelles
    tags TEXT[], -- Tags pour la recherche
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des articles de blog
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    author VARCHAR(255) NOT NULL DEFAULT 'Merry Dubois',
    read_time VARCHAR(20) NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des consultations/réservations
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    consultation_type VARCHAR(50) DEFAULT 'initial' CHECK (consultation_type IN ('initial', 'follow_up')),
    price DECIMAL(8,2) DEFAULT 60.00,
    notes TEXT, -- Notes internes
    whatsapp_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des paniers (sessions temporaires)
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL, -- ID de session du navigateur
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL, -- Prix au moment de l'ajout
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des commandes WhatsApp
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50) NOT NULL,
    whatsapp_number VARCHAR(50),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    shipping_cost DECIMAL(8,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    payment_method VARCHAR(50),
    shipping_address TEXT,
    notes TEXT,
    whatsapp_message_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des articles de commande
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL, -- Nom du produit au moment de la commande
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des messages de contact
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des abonnés newsletter
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 3. CRÉATION DES INDEX POUR LES PERFORMANCES
-- =====================================================

-- Index pour les produits
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- Index pour les articles de blog
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX idx_blog_posts_date ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Index pour les réservations
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_email ON bookings(email);

-- Index pour les commandes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_orders_customer ON orders(customer_email);

-- Index pour les paniers
CREATE INDEX idx_cart_session ON cart_items(session_id);
CREATE INDEX idx_cart_product ON cart_items(product_id);

-- =====================================================
-- 4. INSERTION DES DONNÉES INITIALES
-- =====================================================

-- Insertion de l'utilisateur admin
INSERT INTO users (email, password_hash, name, role, permissions) VALUES 
('admin@merrysfood.fr', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXzgVmeRBdaa', 'Merry Dubois', 'super_admin', ARRAY['read', 'write', 'delete', 'admin']);

-- Insertion des catégories
INSERT INTO categories (name, slug, description, sort_order) VALUES 
('Compléments alimentaires', 'supplements', 'Compléments naturels pour votre santé', 1),
('E-books nutrition', 'ebooks', 'Guides et livres numériques sur la nutrition', 2),
('Programmes wellness', 'programs', 'Programmes complets de bien-être', 3);

-- Insertion des produits
INSERT INTO products (name, slug, description, short_description, price, category_type, image_url, in_stock, rating, reviews_count, ingredients, usage_instructions) VALUES 
(
    'Complément Vitamine D3',
    'vitamine-d3-complement',
    'Vitamine D3 naturelle pour renforcer votre système immunitaire et vos os. Notre formule premium est extraite de sources naturelles et garantit une absorption optimale.',
    'Vitamine D3 naturelle pour renforcer votre système immunitaire et vos os.',
    24.99,
    'supplement',
    'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=500',
    true,
    4.8,
    127,
    'Vitamine D3 (cholécalciférol) 1000 UI, huile de tournesol bio, gélatine bovine',
    'Prendre 1 capsule par jour avec un verre d''eau, de préférence pendant les repas.'
),
(
    'Guide Nutrition Équilibrée',
    'guide-nutrition-equilibree',
    'E-book complet avec 50 recettes saines et conseils nutritionnels personnalisés. Découvrez les secrets d''une alimentation équilibrée avec nos experts.',
    'E-book complet avec 50 recettes saines et conseils nutritionnels personnalisés.',
    19.99,
    'ebook',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
    true,
    4.9,
    89,
    NULL,
    'Téléchargement immédiat après achat. Compatible tous appareils.'
),
(
    'Programme Détox 21 jours',
    'programme-detox-21-jours',
    'Programme complet avec menu, exercices et suivi personnalisé pour une détoxification en profondeur et un regain d''énergie.',
    'Programme complet avec menu, exercices et suivi personnalisé.',
    67.00,
    'program',
    'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=500',
    true,
    4.9,
    156,
    NULL,
    'Accès immédiat à la plateforme. Suivi personnalisé inclus.'
);

-- Insertion des articles de blog
INSERT INTO blog_posts (title, slug, excerpt, content, image_url, read_time, tags) VALUES 
(
    'Les 5 superaliments à intégrer dans votre alimentation',
    'superaliments-alimentation-sante',
    'Découvrez ces aliments exceptionnels qui boosteront votre santé au quotidien.',
    'Les superaliments sont des aliments naturellement riches en nutriments essentiels. Dans cet article, nous explorons les 5 superaliments incontournables : les baies de goji, le quinoa, les graines de chia, les épinards et les myrtilles. Chacun apporte des bénéfices uniques pour votre santé.',
    'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
    '5 min',
    ARRAY['nutrition', 'superaliments', 'santé']
),
(
    'Comment bien s''hydrater : guide complet',
    'hydratation-guide-complet',
    'L''hydratation est cruciale pour votre santé. Apprenez les bonnes pratiques.',
    'L''eau représente environ 60% du poids corporel chez l''adulte. Une bonne hydratation est essentielle pour le bon fonctionnement de tous nos organes. Découvrez combien boire, quand boire et comment optimiser votre hydratation.',
    'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=800',
    '3 min',
    ARRAY['hydratation', 'eau', 'conseils']
);

-- =====================================================
-- 5. REQUÊTES UTILES POUR L'APPLICATION
-- =====================================================

-- Requête pour récupérer tous les produits actifs avec leur catégorie
/*
SELECT 
    p.id,
    p.name,
    p.slug,
    p.description,
    p.short_description,
    p.price,
    p.category_type,
    p.image_url,
    p.in_stock,
    p.rating,
    p.reviews_count,
    c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
ORDER BY p.created_at DESC;
*/

-- Requête pour récupérer les produits par catégorie
/*
SELECT * FROM products 
WHERE category_type = 'supplement' 
AND is_active = true 
ORDER BY rating DESC, reviews_count DESC;
*/

-- Requête pour récupérer les articles de blog publiés
/*
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
ORDER BY published_at DESC;
*/

-- Requête pour récupérer les réservations du jour
/*
SELECT 
    id,
    name,
    email,
    phone,
    booking_time,
    status,
    message
FROM bookings 
WHERE booking_date = CURRENT_DATE 
ORDER BY booking_time;
*/

-- Requête pour calculer le chiffre d'affaires mensuel
/*
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_orders,
    SUM(total_amount) as revenue
FROM orders 
WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered')
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
*/

-- Requête pour les produits les plus vendus
/*
SELECT 
    p.name,
    p.price,
    SUM(oi.quantity) as total_sold,
    SUM(oi.total_price) as total_revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
GROUP BY p.id, p.name, p.price
ORDER BY total_sold DESC
LIMIT 10;
*/

-- Requête pour nettoyer les anciens paniers (plus de 7 jours)
/*
DELETE FROM cart_items 
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '7 days';
*/

-- =====================================================
-- 6. FONCTIONS UTILES
-- =====================================================

-- Fonction pour générer un numéro de commande unique
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR(50) AS $$
DECLARE
    new_number VARCHAR(50);
    counter INTEGER := 1;
BEGIN
    LOOP
        new_number := 'MF' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD(counter::TEXT, 4, '0');
        
        IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_number) THEN
            RETURN new_number;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. TRIGGERS POUR LA MISE À JOUR AUTOMATIQUE
-- =====================================================

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. VUES UTILES POUR LES STATISTIQUES
-- =====================================================

-- Vue pour les statistiques du dashboard
CREATE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
    (SELECT COUNT(*) FROM blog_posts WHERE is_published = true) as total_articles,
    (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
    (SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as orders_this_month,
    (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered') AND created_at >= CURRENT_DATE - INTERVAL '30 days') as revenue_this_month;

-- Vue pour les produits avec leurs statistiques
CREATE VIEW products_with_stats AS
SELECT 
    p.*,
    c.name as category_name,
    COALESCE(order_stats.total_sold, 0) as total_sold,
    COALESCE(order_stats.total_revenue, 0) as total_revenue
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN (
    SELECT 
        oi.product_id,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
    GROUP BY oi.product_id
) order_stats ON p.id = order_stats.product_id;

-- =====================================================
-- FIN DU SCHÉMA
-- =====================================================

-- Commentaires finaux
COMMENT ON DATABASE current_database() IS 'Base de données pour Merry''s Food et nutrition - Application e-commerce et consultation';
COMMENT ON TABLE users IS 'Utilisateurs administrateurs du système';
COMMENT ON TABLE products IS 'Catalogue des produits (compléments, e-books, programmes)';
COMMENT ON TABLE blog_posts IS 'Articles de blog sur la nutrition';
COMMENT ON TABLE bookings IS 'Réservations de consultations nutritionnelles';
COMMENT ON TABLE orders IS 'Commandes passées via WhatsApp';
COMMENT ON TABLE contact_messages IS 'Messages de contact des visiteurs';