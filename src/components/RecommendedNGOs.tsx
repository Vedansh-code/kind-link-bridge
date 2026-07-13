import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecommendations, RecommendationNGO } from "../services/recommendationApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MapPin, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface RecommendedNGOsProps {
  userId: number | string | null;
  favorites: string[];
  onToggleFavorite: (ngoId: string) => Promise<void>;
}

export const RecommendedNGOs: React.FC<RecommendedNGOsProps> = ({
  userId,
  favorites,
  onToggleFavorite,
}) => {
  const [recommendations, setRecommendations] = useState<RecommendationNGO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchRecs = async (uid: number | string) => {
    try {
      setLoading(true);
      setError(false);
      const data = await getRecommendations(uid);
      // Ensure we have an array
      const recsArray = Array.isArray(data) ? data : ((data as any).recommendations || []);
      setRecommendations(recsArray);
    } catch (err) {
      console.error("Error loading recommendations:", err);
      setError(true);
      // Clear recommendations on failure to trigger empty/fallback state gracefully
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRecs(userId);
    } else {
      setLoading(false);
      setRecommendations([]);
    }
  }, [userId]);

  // Handle toggling favorite from inside the card
  const handleFavoriteClick = async (ngoId: string) => {
    try {
      await onToggleFavorite(ngoId);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update favorites. Please try again.",
      });
    }
  };

  // Render Skeleton Loaders
  if (loading) {
    return (
      <div className="mb-10 w-full animate-pulse">
        <div className="flex items-center space-x-2 mb-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
        {/* Mobile Horizontal Scroll Skeleton */}
        <div className="flex space-x-6 overflow-x-auto pb-4 md:hidden">
          {[1, 2, 3].map((n) => (
            <div key={n} className="min-w-[280px] w-[280px] border rounded-xl p-4 bg-card space-y-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-10" />
              </div>
            </div>
          ))}
        </div>
        {/* Desktop Responsive Grid Skeleton */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="border rounded-xl p-4 bg-card space-y-4">
              <Skeleton className="h-36 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex space-x-2 pt-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle Empty Recommendations or API Error
  const hasNoRecommendations = recommendations.length === 0;

  return (
    <div className="mb-10 w-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Recommended For You</h2>
        </div>
        {userId && !error && recommendations.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchRecs(userId)}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Refresh
          </Button>
        )}
      </div>

      {hasNoRecommendations ? (
        <Card className="border border-dashed border-border/80 bg-accent/20 p-8 text-center rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center space-y-4 p-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="max-w-md">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {error 
                  ? "We encountered an issue loading your personalized suggestions. Explore NGOs to help us learn your preferences."
                  : "We're learning your preferences. Explore NGOs to receive personalized recommendations."}
              </p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link to="/causes">Explore NGOs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Layout: Horizontal Scroll */}
          <div className="flex md:hidden space-x-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
            {recommendations.map((ngo) => {
              const ngoId = String(ngo._id || ngo.id);
              const isFavorited = favorites.includes(ngoId);
              const score = ngo.match_score ?? ngo.score ?? ngo.matchScore;
              const locationText = ngo.location ?? ngo.locations ?? "India";
              const desc = ngo.description ?? ngo.tagline ?? ngo.about ?? "";
              const imgPlaceholder = ngo.image ?? ngo.emoji ?? ngo.icon ?? "🏢";

              return (
                <div key={ngoId} className="min-w-[290px] w-[290px] snap-center">
                  <Card className="border border-border/80 bg-card/60 backdrop-blur rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 group">
                    <div className="h-28 bg-gradient-to-r from-primary/30 to-secondary/30 relative flex items-center justify-center">
                      <div className="text-4xl">{imgPlaceholder}</div>
                      {score !== undefined && (
                        <div className="absolute top-3 left-3 bg-emerald-500/90 text-white font-bold text-xs px-2 py-1 rounded-full shadow flex items-center space-x-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{score}% Match</span>
                        </div>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleFavoriteClick(ngoId)}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur hover:bg-white text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>

                    <CardContent className="p-4 flex flex-col justify-between min-h-[160px]">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {ngo.name}
                          </h3>
                        </div>
                        <Badge variant="secondary" className="mb-2 text-[10px] py-0.5 px-2">
                          {ngo.category}
                        </Badge>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                          {desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center text-muted-foreground text-[10px]">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{locationText}</span>
                        </div>
                        <Button asChild size="sm" variant="default" className="text-xs py-1 h-8">
                          <Link to={`/ngo/${ngoId}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Desktop Layout: Responsive Grid */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((ngo) => {
              const ngoId = String(ngo._id || ngo.id);
              const isFavorited = favorites.includes(ngoId);
              const score = ngo.match_score ?? ngo.score ?? ngo.matchScore;
              const locationText = ngo.location ?? ngo.locations ?? "India";
              const desc = ngo.description ?? ngo.tagline ?? ngo.about ?? "";
              const imgPlaceholder = ngo.image ?? ngo.emoji ?? ngo.icon ?? "🏢";

              return (
                <Card 
                  key={ngoId} 
                  className="border border-border/80 bg-card/60 backdrop-blur rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group card-hover"
                >
                  <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative flex items-center justify-center border-b border-border/40">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{imgPlaceholder}</div>
                    {score !== undefined && (
                      <div className="absolute top-3 left-3 bg-emerald-500/90 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1 animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        <span>{score}% Match</span>
                      </div>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleFavoriteClick(ngoId)}
                      className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur hover:bg-background shadow-sm hover:text-red-500 transition-colors"
                    >
                      <Heart className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2 text-xs font-semibold text-primary border-primary/20 bg-primary/5">
                        {ngo.category}
                      </Badge>
                      <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {ngo.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-auto">
                      <div className="flex items-center text-muted-foreground text-xs">
                        <MapPin className="h-4 w-4 mr-1 text-primary/70" />
                        <span>{locationText}</span>
                      </div>
                      <Button asChild variant="default" size="sm" className="h-9 px-4">
                        <Link to={`/ngo/${ngoId}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
