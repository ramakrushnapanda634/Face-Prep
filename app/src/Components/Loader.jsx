import React, { useState, useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";
const Loader = () => {
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, []);
  return (
    <RotatingLines
      strokeColor="black"
      strokeWidth="5"
      animationDuration="1"
      width="96"
      visible={true}
    />
  );
};
export default Loader;
