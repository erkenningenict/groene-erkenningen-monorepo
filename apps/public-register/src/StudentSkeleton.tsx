import { Skeleton } from "@repo/ui/skeleton";

type StudentSkeletonsProps = {
  count: number;
};
export default function StudentSkeletons({ count }: StudentSkeletonsProps) {
  return (
    <>
      <div className="w-80 border-b border-gray-500"></div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 pt-2">
          <Skeleton className="w-48 h-7" />
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-52 h-9" />
        </div>
      ))}
    </>
  );
}
