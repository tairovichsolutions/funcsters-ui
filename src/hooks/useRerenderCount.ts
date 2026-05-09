import React from "react";

export const useRerenderCount = (name: string): void => {
  const commits = React.useRef(0);

  React.useEffect(() => {
    commits.current += 1;

  });
};
