import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const FEATURED_COUNTRIES = [
  { code: "us", name: "United States", flag: "🇺🇸", count: 120 },
  { code: "gb", name: "United Kingdom", flag: "🇬🇧", count: 85 },
  { code: "de", name: "Germany", flag: "🇩🇪", count: 60 },
  { code: "fr", name: "France", flag: "🇫🇷", count: 45 },
  { code: "jp", name: "Japan", flag: "🇯🇵", count: 70 },
  { code: "ca", name: "Canada", flag: "🇨🇦", count: 50 },
];

const CATEGORIES = [
  { id: "business", label: "Business" },
  { id: "technology", label: "Technology" },
  { id: "health", label: "Health" },
  { id: "sports", label: "Sports" },
  { id: "entertainment", label: "Entertainment" },
];

export default function CountryFilter() {
  return (
    <Card className="p-6 sticky top-24">
      <h2 className="text-xl font-semibold text-news-gray mb-4">
        Filter by Country
      </h2>

      {/* Clear All Button */}
      <div className="mb-4">
        <Button variant="outline" size="sm">
          Clear All Filters
        </Button>
      </div>

      {/* Featured Countries */}
      <div className="space-y-2 mb-6">
        {FEATURED_COUNTRIES.map((country) => (
          <Button
            key={country.code}
            variant="ghost"
            className="country-button"
          >
            <span className="text-2xl mr-3">{country.flag}</span>
            <div className="flex-1 text-left">
              <div className="font-medium text-news-gray">{country.name}</div>
              <div className="text-sm text-gray-500">
                {country.count} articles
              </div>
            </div>
          </Button>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Category Filters */}
      <div>
        <h3 className="text-lg font-medium text-news-gray mb-4">Categories</h3>
        <div className="space-y-3">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox id={category.id} className="border-gray-300" />
              <label
                htmlFor={category.id}
                className="text-sm text-news-gray cursor-pointer"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
