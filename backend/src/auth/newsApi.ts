interface NewsAPIArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  author: string;
  publishedAt: string;
  source: {
    name: string;
  };
  content?: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

const COUNTRY_CODES: Record<string, string> = {
  'us': 'United States',
  'gb': 'United Kingdom', 
  'de': 'Germany',
  'fr': 'France',
  'jp': 'Japan',
  'ca': 'Canada',
  'au': 'Australia',
  'in': 'India',
  'br': 'Brazil',
  'ru': 'Russia',
  'cn': 'China',
  'it': 'Italy',
  'es': 'Spain',
  'mx': 'Mexico',
  'kr': 'South Korea',
};

const CATEGORIES :string[] = [
  'general',
  'business', 
  'technology',
  'health',
  'science',
  'sports',
  'entertainment',
];

export class NewsApiService {
  private apiKey: string;
  private baseUrl = 'https://newsapi.org/v2';

  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('NEWS_API_KEY not found in environment variables. News fetching will not work.');
    }
  }

  
  async fetchTopHeadlines(country?: string, category?: string, pageSize = 20): Promise<NewsAPIArticle[]> {
    if (!this.apiKey) {
      throw new Error('NewsAPI key not configured');
    }

    const params = new URLSearchParams({
      apiKey: this.apiKey,
      pageSize: pageSize.toString(),
    });

    if (country) {
      params.append('country', country);
    }

    if (category && CATEGORIES.includes(category)) {
      params.append('category', category);
    }

    const url = `${this.baseUrl}/top-headlines?${params.toString()}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NewsAPI request failed: ${response.status} ${response.statusText}`);
      }

      const data: NewsAPIResponse = await response.json();
      console.log("data" ,data);
      
      if (data.status !== 'ok') {
        throw new Error(`NewsAPI returned error status: ${data.status}`);
      }

      return data.articles.filter(article => 
        article.title && 
        article.url && 
        article.publishedAt &&
        article.title !== '[Removed]'
      );
    } catch (error) {
      console.error('Error fetching news from NewsAPI:', error);
      throw error;
    }
  }

  async searchNews(query: string, country?: string): Promise<NewsAPIArticle[]> {
    if (!this.apiKey) {
      throw new Error('NewsAPI key not configured');
    }

    const params = new URLSearchParams({
      apiKey: this.apiKey,
      q: query,
      sortBy: 'publishedAt',
      pageSize: '20',
    });

    if (country) {
      params.append('language', this.getLanguageFromCountry(country));
    }

    const url = `${this.baseUrl}/everything?${params.toString()}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NewsAPI search request failed: ${response.status} ${response.statusText}`);
      }

      const data: NewsAPIResponse = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`NewsAPI returned error status: ${data.status}`);
      }

      return data.articles.filter(article => 
        article.title && 
        article.url && 
        article.publishedAt &&
        article.title !== '[Removed]'
      );
    } catch (error) {
      console.error('Error searching news from NewsAPI:', error);
      throw error;
    }
  }

  private getLanguageFromCountry(countryCode: string): string {
    const languageMap: Record<string, string> = {
      'us': 'en',
      'gb': 'en',
      'de': 'de', 
      'fr': 'fr',
      'jp': 'jp',
      'ca': 'en',
      'au': 'en',
      'in': 'en',
      'br': 'pt',
      'ru': 'ru',
      'cn': 'zh',
      'it': 'it',
      'es': 'es',
      'mx': 'es',
      'kr': 'ko',
    };
    return languageMap[countryCode] || 'en';
  }

  getCountryName(countryCode: string): string {
    return COUNTRY_CODES[countryCode] || countryCode.toUpperCase();
  }

  getAllCountries(): { code: string; name: string; flag: string }[] {
    const countryFlags: Record<string, string> = {
      'us': '🇺🇸',
      'gb': '🇬🇧', 
      'de': '🇩🇪',
      'fr': '🇫🇷',
      'jp': '🇯🇵',
      'ca': '🇨🇦',
      'au': '🇦🇺',
      'in': '🇮🇳',
      'br': '🇧🇷',
      'ru': '🇷🇺',
      'cn': '🇨🇳',
      'it': '🇮🇹',
      'es': '🇪🇸',
      'mx': '🇲🇽',
      'kr': '🇰🇷',
    };

    return Object.entries(COUNTRY_CODES).map(([code, name]) => ({
      code,
      name,
      flag: countryFlags[code] || '🏳️',
    }));
  }

  getCategories(): string[] {
    return CATEGORIES;
  }
}

export const newsApi = new NewsApiService();
