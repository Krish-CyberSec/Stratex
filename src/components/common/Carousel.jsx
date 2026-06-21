import React from "react";
import { Carousel as AntCarousel } from "antd";


const carousel = () => (
  <div className="login-carousel h-full bg-[var(--university-ink)]">
    <AntCarousel autoplay className="h-full">
      <div className="h-full">
        <img src="" alt="img" className="h-full w-full object-cover" />
      </div>
      <div className="h-full">
        <img src="" alt="img" className="h-full w-full object-cover" />
      </div>
      <div className="h-full">
        <img src="" alt="img" className="h-full w-full object-cover" />
      </div>
      <div className="h-full">
        <img src="" alt="img" className="h-full w-full object-cover" />
      </div>
    </AntCarousel>
  </div>
);
export default carousel;
