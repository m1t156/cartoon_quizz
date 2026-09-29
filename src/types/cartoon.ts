export type CartoonCategory =
  | "cartoon-network"
  | "nickelodeon"
  | "disney"
  | "classic"
  | "anime"
  | "bibi"
  | "superhero"
  | "adult-animation"
  | "international"
  | "toy-battle";

export interface Cartoon {
  id: number;
  name: string;
  originalName?: string;
  aliases?: string[];
  category: CartoonCategory;
  region?: string;
  year?: number;
  image?: string;
  seed?: number;
  tags?: string[];
}
