import React from "react";
import Navigation from "../../components/Navigation";
import SelectFile from "../../components/SelectFile";
import DisplayVideos from "../../components/DisplayVideos";

const Home: React.FC = () => {
  return (
    <div>
      <Navigation />
      <SelectFile />
      <DisplayVideos />
    </div>
  );
};
export default Home;
