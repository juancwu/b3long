import { FC } from "react";

const Loader: FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div
        className="border-r-transparent animate-spin inline-block w-12 h-12 border-4 rounded-full"
        role="status"
      >
        <span className="hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
