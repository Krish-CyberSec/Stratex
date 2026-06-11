import { useRef, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Button from "../common/Button";

const AtIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
  </svg>
);

const LockIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 3l18 18" />
    <path d="M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6" />
    <path d="M9.9 4.4A10.4 10.4 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-3.2 4.2" />
    <path d="M6.1 6.1A18 18 0 0 0 2 12s3.5 8 10 8a10.7 10.7 0 0 0 4.3-.9" />
  </svg>
);

const StyledLink = styled(NavLink)`
  color: #000000;
  font-size: 13px;
  margin: 20px auto;

  &:hover span {
    text-decoration: underline;
  }
`;

const Loginform = () => {
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const handlesubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passRef.current.value;
    console.log("Login submitted", { email, hasPassword: Boolean(password) });
  };

  return (
    <div className="w-full max-w-sm rounded-lg bg-white p-4 border-[0.5px] border-gray-300">
      <section className="mb-4">
        <h3 className="text-2xl pt-4 pb-2" style={{ fontWeight: 600 }}>
          Login
        </h3>
        <p className="font-light text-gray-500" style={{ fontWeight: 400 }}>
          Enter your email below to login to your account
        </p>
      </section>
      <form
        action=""
        method="post"
        className="flex flex-col"
        onSubmit={handlesubmit}
      >
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <div className="relative my-3 w-[95%] m-auto">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <AtIcon />
          </span>
          <input
            ref={emailRef}
            type="email"
            name="email"
            id="email"
            placeholder="student@university.edu.in"
            className="border-[0.5px] h-9 rounded-lg w-full py-1 pl-9 pr-2"
          />
        </div>
        <label htmlFor="pass" className="font-semibold">
          Password
        </label>
        <div className="relative my-3 mb-5 w-[95%] mx-auto">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <LockIcon />
          </span>
          <input
            ref={passRef}
            type={showPassword ? "text" : "password"}
            name="pass"
            id="pass"
            placeholder="password"
            className="border-[0.5px] h-9 rounded-lg w-full py-1 pl-9 pr-9"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((isVisible) => !isVisible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        <Button text="Login" bg="Green" />
        <StyledLink to="/support">
          Can't Login? <span>Contact Support</span>
        </StyledLink>
      </form>
    </div>
  );
};

export default Loginform;
