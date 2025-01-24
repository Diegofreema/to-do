import { Wrapper } from "@/components/ui/Wrapper";
import { NavHeader } from "@/components/ui/NavHeader";
import { LecturesAnimated } from "@/components/LecturesAnimated";
import { useAuth } from "@/lib/zustand/useAuth";
import { useGetLectures } from "@/lib/tanstack/query";

import { ArticleSkeleton } from "@/components/Skeletons/Articleskeleton";
import { ErrorComponent } from "@/components/ErrorComponent";

const Lectures = () => {
  const id = useAuth((state) => state.user.id);
  const {
    data: lectures,
    isPending: isPendingLectures,
    isError: isErrorLectures,
    isRefetching,
    refetch,
  } = useGetLectures(id);

  if (isErrorLectures) {
    return <ErrorComponent onPress={refetch} />;
  }
  if (isPendingLectures) {
    return <ArticleSkeleton arrayLength={10} />;
  }
  const onRefresh = () => {
    refetch();
  };
  return (
    <Wrapper>
      <NavHeader title="Lectures" />
      <LecturesAnimated
        data={lectures}
        onRefresh={onRefresh}
        refreshing={isRefetching}
      />
    </Wrapper>
  );
};
export default Lectures;
