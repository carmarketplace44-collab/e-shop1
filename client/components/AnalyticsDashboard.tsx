import { useState } from "react";
import { Product } from "./ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  getViews,
  getClicks,
  getConversionRate,
  getProductScore,
} from "@/lib/analytics";

interface AnalyticsDashboardProps {
  products: Product[];
}

type SortBy = "score" | "views" | "clicks" | "conversion";

export function AnalyticsDashboard({ products }: AnalyticsDashboardProps) {
  const [sortBy, setSortBy] = useState<SortBy>("score");

  // Calculate analytics for each product
  const analyticsData = products.map((product) => ({
    id: product.id,
    name: product.name,
    image: product.images?.[0],
    views: getViews(product.id),
    clicks: getClicks(product.id),
    score: getProductScore(product.id),
    conversion: getConversionRate(product.id),
  }));

  // Sort products
  const sortedData = [...analyticsData].sort((a, b) => {
    switch (sortBy) {
      case "views":
        return b.views - a.views;
      case "clicks":
        return b.clicks - a.clicks;
      case "conversion":
        return b.conversion - a.conversion;
      case "score":
      default:
        return b.score - a.score;
    }
  });

  // Get top performers
  const topPerformer = sortedData[0];
  const topConversion = [...analyticsData].sort(
    (a, b) => b.conversion - a.conversion
  )[0];

  // Calculate totals
  const totalViews = analyticsData.reduce((sum, item) => sum + item.views, 0);
  const totalClicks = analyticsData.reduce((sum, item) => sum + item.clicks, 0);
  const avgConversion =
    analyticsData.length > 0
      ? (analyticsData.reduce((sum, item) => sum + item.conversion, 0) /
          analyticsData.length).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Product page impressions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              WhatsApp order clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgConversion}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold truncate">
              {topPerformer?.name || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Score: {topPerformer?.score || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sort Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Product Analytics</CardTitle>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2 rounded border border-input bg-background text-foreground text-sm"
            >
              <option value="score">Sort by Score</option>
              <option value="views">Sort by Views</option>
              <option value="clicks">Sort by Clicks</option>
              <option value="conversion">Sort by Conversion</option>
            </select>
          </div>
        </CardHeader>
      </Card>

      {/* Analytics Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold">Product</th>
              <th className="text-right py-3 px-4 font-semibold">Views</th>
              <th className="text-right py-3 px-4 font-semibold">Clicks</th>
              <th className="text-right py-3 px-4 font-semibold">Conv. %</th>
              <th className="text-right py-3 px-4 font-semibold">Score</th>
              <th className="text-center py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b hover:bg-gray-50 transition-colors ${
                  index === 0 ? "bg-accent/5" : ""
                }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <span className="font-medium truncate max-w-xs">
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="text-right py-4 px-4 font-semibold">
                  {item.views}
                </td>
                <td className="text-right py-4 px-4 font-semibold">
                  {item.clicks}
                </td>
                <td className="text-right py-4 px-4">
                  <span
                    className={`font-semibold ${
                      item.conversion >= 20
                        ? "text-green-600"
                        : item.conversion >= 10
                          ? "text-blue-600"
                          : "text-gray-600"
                    }`}
                  >
                    {item.conversion.toFixed(1)}%
                  </span>
                </td>
                <td className="text-right py-4 px-4">
                  <span className="font-bold text-accent">{item.score}</span>
                </td>
                <td className="text-center py-4 px-4">
                  <div className="flex gap-2 justify-center flex-wrap">
                    {index === 0 && (
                      <Badge className="bg-yellow-500 text-black text-xs">
                        🏆 Top
                      </Badge>
                    )}
                    {item.conversion === topConversion.conversion &&
                      item.conversion > 0 && (
                        <Badge className="bg-green-500 text-white text-xs">
                          🎯 Best Conv
                        </Badge>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {totalViews === 0 ? (
              <p className="text-muted-foreground text-sm">
                No analytics data yet. Users' interactions will appear here.
              </p>
            ) : (
              <>
                {topConversion && topConversion.conversion > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded">
                    <span className="text-xl">💡</span>
                    <div>
                      <p className="font-semibold text-sm">
                        {topConversion.name} has the best conversion rate
                        ({topConversion.conversion.toFixed(1)}%)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Consider featuring similar products or analyzing what makes
                        this product popular.
                      </p>
                    </div>
                  </div>
                )}

                {topPerformer && topPerformer.views > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded">
                    <span className="text-xl">🚀</span>
                    <div>
                      <p className="font-semibold text-sm">
                        {topPerformer.name} is your top performer
                      </p>
                      <p className="text-xs text-muted-foreground">
                        This product receives the most engagement. Ensure it's
                        featured prominently.
                      </p>
                    </div>
                  </div>
                )}

                {analyticsData.some((item) => item.views > 0 && item.clicks === 0) && (
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="font-semibold text-sm">
                        Some products have views but no clicks
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Improve descriptions or pricing to boost conversion rates.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
