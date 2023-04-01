import SyncLoader from "react-spinners/SyncLoader";
import { loadingBackdropStyle } from "../../libs";

function Loader({ isLoading = false }) {
  return (
    <SyncLoader
      color="#1A94FF"
      loading={isLoading}
      cssOverride={loadingBackdropStyle}
      size={15}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}

export default Loader;
