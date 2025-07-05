# Configuration Firebase Realtime Database

## Problème de Permission

Si vous rencontrez l'erreur "Permission denied" lors de l'accès aux données, vous devez configurer les règles de sécurité Firebase.

## Configuration des Règles de Sécurité

1. Allez dans votre console Firebase : https://console.firebase.google.com
2. Sélectionnez votre projet
3. Dans le menu de gauche, cliquez sur "Realtime Database"
4. Cliquez sur l'onglet "Règles" (Rules)
5. Remplacez les règles existantes par le contenu du fichier `firebase-rules.json`

## Règles Recommandées

Les règles dans `firebase-rules.json` permettent :

- **Lecture publique** pour `products` et `blog_posts` (nécessaire pour l'affichage public)
- **Écriture authentifiée** pour `products` et `blog_posts` (admin seulement)
- **Écriture publique** pour `bookings`, `orders`, et `contact_messages` (formulaires publics)
- **Lecture authentifiée** pour `bookings`, `orders`, et `contact_messages` (admin seulement)

## Sécurité

⚠️ **Important** : Ces règles permettent l'écriture publique pour certaines collections (réservations, commandes, messages). En production, vous devriez :

1. Implémenter une validation côté serveur
2. Ajouter des règles de validation plus strictes
3. Limiter le taux de requêtes
4. Surveiller l'utilisation

## Test des Règles

Après avoir appliqué les règles, testez votre application :

1. La page d'accueil devrait charger les produits
2. Le blog devrait afficher les articles
3. Les formulaires de contact/réservation devraient fonctionner
4. L'administration nécessite une authentification

## Dépannage

Si les erreurs persistent :

1. Vérifiez que les règles ont été correctement appliquées
2. Attendez quelques minutes pour la propagation
3. Vérifiez la configuration Firebase dans `src/config/firebase.ts`
4. Consultez les logs de la console Firebase