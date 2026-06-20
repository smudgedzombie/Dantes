import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice, calculateSavings } from "@/lib/format";
import { Tag, TrendingUp, ExternalLink, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface DealCardProps {
  deal: any;
  className?: string;
  staggerIndex?: number;
}

const platformColors = {
  shopee: "bg-[#EE4D2D] text-white hover:bg-[#EE4D2D]/90",
  lazada: "bg-[#0A0A2A] text-white hover:bg-[#0A0A2A]/90",
  tiktok: "bg-black text-white hover:bg-black/90",
  any: "bg-gray-800 text-white"
};

const platformNames = {
  shopee: "Shopee",
  lazada: "Lazada",
  tiktok: "TikTok Shop",
  any: "Any Platform"
};

export function DealCard({ deal, className, staggerIndex = 0 }: DealCardProps) {
  return (
    <a 
      href={deal.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "group block animate-in fade-in slide-in-from-bottom duration-500 fill-mode-both",
        className
      )}
      style={{ animationDelay: `${staggerIndex * 50}ms` }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border group-hover:border-primary/50 relative h-full flex flex-col">
        {deal.isTrending && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-accent text-accent-foreground border-none font-bold gap-1 flex items-center shadow-md animate-pulse">
              <TrendingUp className="w-3 h-3" />
              HOT DEAL
            </Badge>
          </div>
        )}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
          <Badge className={cn("font-semibold border-none shadow-md", platformColors[deal.platform as keyof typeof platformColors])}>
            {platformNames[deal.platform as keyof typeof platformNames] || deal.platform}
          </Badge>
          {deal.isVerified && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </Badge>
          )}
        </div>
        
        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
          {deal.imageUrl ? (
            <img 
              src={deal.imageUrl} 
              alt={deal.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/5 group-hover:scale-105 transition-transform duration-500">
              <Tag className="w-12 h-12 opacity-20" />
            </div>
          )}
          
          <div className="absolute bottom-2 left-2 flex gap-2">
            <Badge variant="destructive" className="font-bold text-sm shadow-md">
              -{deal.discountPercent}%
            </Badge>
          </div>
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">
            {deal.category}
          </div>
          <h3 className="font-bold text-base leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">
            {deal.title}
          </h3>
          
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xl font-black text-primary">
                {formatPrice(deal.salePrice)}
              </span>
              <span className="text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/50">
                {formatPrice(deal.originalPrice)}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Save {formatPrice(calculateSavings(deal.originalPrice, deal.salePrice))}
              </span>
              <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </a>
  );
}
