export interface FeedItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: "flower" | "fashion" ;
  brand: string;
  productLink: string;
  tags: string[];
  colors: string[];
  price?: number;
  currency?: string;
}
