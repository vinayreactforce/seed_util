import { VisibilityWatcher } from "./VisibilityWatcher";
export const ConditionalWrapper = ({ condition, control, children }: any) => {
    // If there is no condition, just show the field immediately
    if (!condition) {
      return <>{children}</>;
    }
  
    // If there IS a condition, we render the Watcher.
    // The Watcher will safely call useWatch.
    return (
      <VisibilityWatcher condition={condition} control={control}>
        {(isVisible) => (isVisible ? <>{children}</> : null)}
      </VisibilityWatcher>
    );
};