import { Skeleton } from "@/components/ui/skeleton";

export default function LandingLoading() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      <Skeleton className="w-full h-[400px] mb-12 rounded-none bg-slate-200" />
      
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl bg-slate-100" />
        ))}
      </div>
      
      <div className="container mx-auto px-4 flex gap-4 overflow-hidden mb-16">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="min-w-[280px] h-[360px] rounded-xl bg-slate-100" />
        ))}
      </div>
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
         {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
