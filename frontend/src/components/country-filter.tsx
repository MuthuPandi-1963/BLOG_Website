import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import type { StatsResponse } from "@/lib/queryClient";

interface CountryFilterProps {
  selectedCountry: string;
  selectedCategory: string;
  onCountryChange: (country: string) => void;
  onCategoryChange: (category: string) => void;
}

const FEATURED_COUNTRIES = [
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
];

const CATEGORIES = [
  { id: 'business', label: 'Business' },
  { id: 'technology', label: 'Technology' },
  { id: 'health', label: 'Health' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Entertainment' },
];

export default function CountryFilter({ 
  selectedCountry, 
  selectedCategory, 
  onCountryChange, 
  onCategoryChange 
}: CountryFilterProps) {
  const { data: statsData, isLoading } = useQuery<StatsResponse>({
    queryKey: ["/api/stats/countries"],
    retry: false,
  });

  const getArticleCount = (countryCode: string): number => {
    if (!statsData?.stats) return 0;
    const stat = statsData.stats.find((s: any) => s.country === countryCode);
    return stat ? stat.count : 0;
  };

  return (
    <Card className="p-6 sticky top-24" data-testid="country-filter">
      <h2 className="text-xl font-semibold text-news-gray mb-4">Filter by Country</h2>
      
      {/* Clear All Button */}
      {(selectedCountry || selectedCategory) && (
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onCountryChange('');
              onCategoryChange('');
            }}
            data-testid="button-clear-filters"
          >
            Clear All Filters
          </Button>
        </div>
      )}
      
      {/* Featured Countries */}
      <div className="space-y-2 mb-6">
        {FEATURED_COUNTRIES.map((country) => {
          const isSelected = selectedCountry === country.code;
          const articleCount = getArticleCount(country.code);
          
          return (
            <Button
              key={country.code}
              variant="ghost"
              className={`country-button ${
                isSelected ? 'bg-blue-50 border-news-blue text-news-blue' : ''
              }`}
              onClick={() => onCountryChange(isSelected ? '' : country.code)}
              data-testid={`button-country-${country.code}`}
            >
              <span className="text-2xl mr-3">{country.flag}</span>
              <div className="flex-1 text-left">
                <div className={`font-medium ${isSelected ? 'text-news-blue' : 'text-news-gray'}`}>
                  {country.name}
                </div>
                <div className="text-sm text-gray-500">
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin inline" />
                  ) : (
                    `${articleCount} articles`
                  )}
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      <Separator className="my-6" />

      {/* Category Filters */}
      <div>
        <h3 className="text-lg font-medium text-news-gray mb-4">Categories</h3>
        <div className="space-y-3">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox
                id={category.id}
                checked={selectedCategory === category.id}
                onCheckedChange={(checked) => {
                  onCategoryChange(checked ? category.id : '');
                }}
                className="border-gray-300 text-news-blue focus:ring-news-blue"
                data-testid={`checkbox-category-${category.id}`}
              />
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
