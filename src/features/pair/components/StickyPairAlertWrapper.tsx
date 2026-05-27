import { GlobalPairAlertBanner } from "./GlobalPairAlertBanner";

const StickyPairAlertWrapper = () => {
  return (
    <div className="sticky top-0 z-40 w-full pt-2 mb-4">
      <GlobalPairAlertBanner  />
    </div>
  );
};

export default StickyPairAlertWrapper;