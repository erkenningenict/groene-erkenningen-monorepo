import { Skeleton } from "@repo/ui/skeleton";

type StudentSkeletonsProps = {
  count: number;
};
export default function StudentSkeletons({ count }: StudentSkeletonsProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1">
          <Skeleton className="w-48 h-7" />
          <Skeleton className="w-32 h-7" />
          <Skeleton className="w-48 h-9" />
          <Skeleton className="w-80 h-9" />
          <div className="w-80 border-b border-gray-300 pt-2"></div>
        </div>
      ))}
    </>
  );
}
