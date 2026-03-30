# E-Shop Analytics & Auto-Optimization System

## Overview

The e-shop includes a lightweight, frontend-only analytics and auto-optimization system that tracks user behavior and automatically optimizes product visibility based on performance metrics.

## Key Features

### 1. **Real-Time Tracking**
- **Product Views**: Tracked automatically when users visit product detail pages
- **WhatsApp Clicks**: Tracked when users click "Order on WhatsApp"
- All data stored locally in `localStorage` for privacy

### 2. **Analytics Calculations**
- **Views**: Number of times a product was viewed
- **Clicks**: Number of times WhatsApp CTA was clicked
- **Conversion Rate**: `(Clicks / Views) * 100` - percentage of viewers who clicked
- **Product Score**: `(Clicks * 2) + Views` - weighted engagement metric

### 3. **Auto-Optimization**
- **Top 5 by Score** → Automatically featured
- **Top 3 by Clicks** → Automatically promoted with "🔥 Trending Now" tag
- **Dynamic Banner**: Homepage banner automatically displays top 3 products by score
- **Updates in Real-Time**: As users interact, product rankings change

### 4. **Daily Analytics Sync**
- Automatically syncs analytics to GitHub once every 24 hours
- Merges local data with existing GitHub analytics
- Maintains persistent analytics across sessions
- Admin can manually trigger sync anytime

### 5. **Analytics Dashboard**
- View per-product metrics (views, clicks, conversion rate, score)
- Sort by: Score, Views, Clicks, Conversion Rate
- Key metrics: Total Views, Total Clicks, Average Conversion, Best Performer
- Insights and recommendations based on data

## How It Works

### Tracking System

#### 1. Product View Tracking
```typescript
import { trackProductView } from '@/lib/analytics';

// Automatically called when ProductDetail page loads
useEffect(() => {
  if (id) {
    trackProductView(id);
  }
}, [id]);
```

#### 2. WhatsApp Click Tracking
```typescript
import { trackWhatsAppClick } from '@/lib/analytics';

// Called when user clicks WhatsApp CTA
const handleWhatsAppClick = () => {
  trackWhatsAppClick(productId);
  // ... open WhatsApp
};
```

### Local Storage Structure

```javascript
// Views stored in: e_shop_analytics_views
{
  "product_id_1": 15,
  "product_id_2": 8,
  ...
}

// Clicks stored in: e_shop_analytics_clicks
{
  "product_id_1": 3,
  "product_id_2": 1,
  ...
}

// Last sync timestamp: e_shop_analytics_last_sync
"2024-03-15T10:30:00.000Z"
```

### Analytics Calculation Functions

```typescript
import { 
  getViews,           // Get view count
  getClicks,          // Get click count
  getConversionRate,  // Get conversion %
  getProductScore,    // Get engagement score
  getTopProductsByMetric  // Get top N products
} from '@/lib/analytics';

// Examples
const views = getViews('product_123');        // => 15
const clicks = getClicks('product_123');      // => 3
const rate = getConversionRate('product_123'); // => 20.0
const score = getProductScore('product_123');  // => 45
```

## GitHub Integration

### Data Structure Extension

Your `products.json` is extended with analytics:

```json
{
  "products": [...],
  "categories": [...],
  "analytics": {
    "product_views": {
      "product_id": 100
    },
    "whatsapp_clicks": {
      "product_id": 25
    },
    "last_synced_at": "2024-03-15T10:30:00.000Z"
  }
}
```

### Auto-Sync Process

1. **Check**: Is it been 24+ hours since last sync?
2. **Fetch**: Get current `products.json` from GitHub
3. **Merge**: Combine local analytics with GitHub analytics (additive)
4. **Push**: Update `products.json` on GitHub with merged data
5. **Update**: Local `last_synced_at` timestamp

### Manual Sync

Admin Panel → Settings → Analytics Sync → "Sync Analytics Now"

## Auto-Feature System

### How It Works

Products are automatically updated based on performance:

1. **Top 5 by Score** → `is_featured = true`
2. **Top 3 by Clicks** → `is_promoted = true`, `promotion_tag = "🔥 Trending Now"`

### Dynamic Homepage Banner

The homepage banner automatically displays the top 3 products by engagement score. As users interact with products, the banner updates in real-time.

### Product Ranking Formula

```
Score = (WhatsApp Clicks × 2) + Product Views
```

Example:
- Product A: 50 views, 15 clicks → Score = (15 × 2) + 50 = **80**
- Product B: 100 views, 5 clicks → Score = (5 × 2) + 100 = **110** ⭐ Winner

Clicks are weighted 2x because they indicate buying intent.

## Admin Analytics Dashboard

### Tab Location
Admin Panel → Analytics Tab

### Metrics Displayed

| Metric | Description |
|--------|-------------|
| **Views** | Number of times product was viewed |
| **Clicks** | Number of WhatsApp order attempts |
| **Conversion %** | (Clicks / Views) × 100 |
| **Score** | Engagement metric (Clicks × 2) + Views |

### Sorting Options
- **Score** (default) - Overall engagement
- **Views** - Most popular products
- **Clicks** - Highest purchase intent
- **Conversion** - Best converting products

### Key Insights
- **Top Performer Badge** 🏆 - Highest scoring product
- **Best Conversion Badge** 🎯 - Highest conversion rate
- Automatic recommendations for optimization

## Performance Considerations

### Lightweight Design
- No server needed
- No external analytics services
- Pure localStorage + GitHub
- ~20KB total code

### Privacy
- All tracking is local
- No third-party trackers
- Data only synced to GitHub if configured
- Users can clear data anytime

### Cache Strategy
- Products cached in localStorage
- Analytics cached locally
- GitHub sync happens once per 24 hours
- Can be manually triggered

## Best Practices

### 1. Regular Sync
- Keep GitHub analytics updated
- Manual sync weekly if not using auto-sync
- Check analytics dashboard regularly

### 2. Optimization Tips
- Monitor top 5 products - keep them in stock
- Products with high views but low clicks need:
  - Better descriptions
  - Clearer pricing
  - Improved images
- Use conversion data to refine product listings

### 3. Product Management
- Featured products = top 5 performers
- Promoted products = top 3 by clicks
- These update automatically (don't edit manually)
- Only edit product details, not featured/promoted flags

## Troubleshooting

### Analytics Not Showing Data?
1. Clear localStorage and refresh: Settings → Clear Product Cache
2. Make sure you're viewing product details (not just browsing)
3. Click WhatsApp button to generate click data
4. Wait for auto-sync or manually sync

### Sync Failing?
1. Check GitHub token is set: `VITE_GITHUB_TOKEN`
2. Verify repo access: `VITE_GITHUB_OWNER/VITE_GITHUB_REPO`
3. Ensure `products.json` exists in the repo
4. Check network connectivity

### Analytics Data Lost?
1. Check GitHub repo for backed-up data
2. Local data can be exported: Settings → Export Local Data
3. Previous syncs are stored in GitHub commit history

## Environment Variables

```bash
# Required for analytics sync
VITE_GITHUB_TOKEN=your_token_here

# Repository details
VITE_GITHUB_OWNER=your_username
VITE_GITHUB_REPO=e-shop-data
```

## Examples

### Example 1: Track Custom Interaction

```typescript
import { trackProductView } from '@/lib/analytics';

// In a custom component
const handleCustomEvent = (productId) => {
  trackProductView(productId);
};
```

### Example 2: Get Product Ranking

```typescript
import { getProductsRankedByScore } from '@/lib/analytics';

const products = [
  { id: 'p1' },
  { id: 'p2' },
  { id: 'p3' }
];

const ranked = getProductsRankedByScore(products.map(p => p.id));
// Returns: [{ productId, score, views, clicks, conversionRate }, ...]
```

### Example 3: Check Sync Status

```typescript
import { shouldSync } from '@/lib/analytics';

if (shouldSync()) {
  console.log('Analytics sync available - 24+ hours since last sync');
  syncAnalytics();
}
```

## API Reference

### Tracking Functions
- `trackProductView(productId: string)` - Track product view
- `trackWhatsAppClick(productId: string)` - Track WhatsApp click

### Query Functions
- `getViews(productId: string): number` - Get view count
- `getClicks(productId: string): number` - Get click count
- `getConversionRate(productId: string): number` - Get conversion %
- `getProductScore(productId: string): number` - Get score

### Utility Functions
- `shouldSync(): boolean` - Check if 24+ hours since sync
- `updateLastSync(): void` - Update sync timestamp
- `getLocalAnalytics(): AnalyticsData` - Get all local data
- `clearLocalAnalytics(): void` - Clear all tracking data

### Advanced Functions
- `mergeAnalytics(local, remote)` - Merge analytics (used internally)
- `getTopProductsByMetric(ids, metric, limit)` - Get top N products
- `getProductsRankedByScore(ids)` - Get ranked products with details

## Future Enhancements

Potential additions (not required):
- Customer feedback ratings
- Search analytics
- Geographic tracking (if users allow)
- A/B testing framework
- Email campaigns integration
- Inventory alerts based on demand

## Support

For issues or questions:
1. Check ANALYTICS.md (this file)
2. Review admin panel insights
3. Export local data for debugging
4. Check GitHub sync logs

---

**Version**: 1.0  
**Last Updated**: 2024  
**System**: Lightweight Frontend Analytics
