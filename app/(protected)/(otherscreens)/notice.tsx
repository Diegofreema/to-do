import { Wrapper } from "@/components/ui/Wrapper";
import { NavHeader } from "@/components/ui/NavHeader";
import { NewsAnimated } from "@/components/NewsAnimated";
import { useGetNews } from "@/lib/tanstack/query";
import { ArticleSkeleton } from "@/components/Skeletons/Articleskeleton";
import { ErrorComponent } from "@/components/ErrorComponent";

const Notice = () => {
  const { data, isError, isPending, refetch, isRefetching } = useGetNews();

  if (isError) {
    return <ErrorComponent onPress={refetch} height={400} />;
  }

  if (isPending) {
    return <ArticleSkeleton arrayLength={10} />;
  }

  const onRefresh = () => {
    refetch();
  };
  return (
    <Wrapper>
      <NavHeader title={"Notice Board"} />
      <NewsAnimated
        data={data}
        onRefetch={onRefresh}
        isRefetching={isRefetching}
      />
    </Wrapper>
  );
};
export default Notice;
