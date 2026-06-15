import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";

const StyledLink = styled(NavLink)`
  background: var(--university-blue-dark);
  color: #fff;
  padding: 10px;
  border: 0.5px var(--university-blue-dark);
  border-radius: 6px;
  &:hover {
  background:var(--university-blue);
  }
`;
const Error = () => {
  return (
    <>
      <div
        className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: `url(${logo})`,
            backgroundSize: "min(42vw, 420px)",
            
          }}
        />
        <span className="w-full fixed top-0">
          <div className="h-2 w-full bg-[var(--university-red)]"></div>
          <div className="h-1 w-full bg-[var(--university-gold)]"></div>
        </span>
        <span className="text-[20vw] font-extrabold text-[#d3d9e2d4] fixed z-0">
          <h3>404</h3>
        </span>
        <section className="relative flex justify-center ">
          <div className="w-[80%]  text-center">
            <h4 className="font-extrabold text-5xl leading-16 text-[var(--university-blue)]">
              WE ARE SORRY, PAGE NOT FOUND
            </h4>
            <p className="text-xs mb-4 leading-6">
              THE PAGE YOU ARE LOOKING FOR MIGHT HAVE BEEN REMOVED HAD ITS NAME
              CHANGED OR TEMPORARILY UNAVAILABLE
            </p>
            <StyledLink to="/">Back To HomePage</StyledLink>
          </div>
        </section>
      </div>
    </>
  );
};

export default Error;
