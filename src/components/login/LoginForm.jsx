import { useRef, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Button from "../common/Button";
import logo from "../../assets/loginLogo.png";
import axios from "axios";
const AtIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
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
    className="h-4 w-4"
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
    className="h-4 w-4"
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
    className="h-4 w-4"
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
  color: var(--university-muted);
  font-size: 13px;
  margin: 20px auto;

  span {
    color: var(--university-blue);
    font-weight: 600;
  }

  &:hover span,
  &:focus-visible span {
    text-decoration: underline;
  }
`;

const roles = [
  { id: "student", label: "Student", placeholder: "student@university.edu.in" },
  { id: "faculty", label: "Faculty", placeholder: "faculty@university.edu.in" },
];

const LoginForm = () => {
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passRef.current.value;

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      const roles = data.user.roles;

      if (!roles.includes(selectedRole.id)) {
        alert("Selected role does not match your account");
        return;
      }
      console.log(data);
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    } finally {
      emailRef.current.value = "";
      passRef.current.value = "";
    }

    // console.log("Login submitted", {
    //   role: selectedRole.id,
    //   email,
    //   hasPassword: Boolean(password),
    // });
  };

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg border border-[var(--university-border)] bg-white shadow-[0_18px_50px_rgba(6,77,131,0.16)]">
      <div className="h-1.5 bg-[var(--university-blue)]" />
      <div className="p-6">
        <section className="mb-5">
          <img
            src={logo}
            alt="K.R. Mangalam University"
            className="mx-auto mb-5 h-auto w-full max-w-[320px] object-contain"
          />

          <h1 className="pb-2 text-center text-2xl font-semibold text-[var(--university-ink)]">
            {selectedRole.label} Login
          </h1>
          <p className="text-center text-sm text-[var(--university-muted)]">
            Select your account type and enter your credentials.
          </p>
        </section>

        <div
          aria-label="Account type"
          className="mb-5 grid grid-cols-2 rounded-md border border-[var(--university-border)] bg-[var(--university-surface-soft)] p-1"
          role="group"
        >
          {roles.map((role) => {
            const isSelected = selectedRole.id === role.id;

            return (
              <button
                key={role.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedRole(role)}
                className={`h-9 rounded-sm text-sm font-semibold transition ${
                  isSelected
                    ? "bg-[var(--university-blue)] text-white shadow-sm"
                    : "cursor-pointer text-[var(--university-muted)] hover:text-[var(--university-blue)]"
                }`}
              >
                {role.label}
              </button>
            );
          })}
        </div>

        <form
          action=""
          method="post"
          className="flex flex-col"
          onSubmit={handlesubmit}
        >
          <input type="hidden" name="role" value={selectedRole.id} />
          <label
            htmlFor="email"
            className="text-sm font-semibold text-[var(--university-ink)]"
          >
            Email address
          </label>
          <div className="relative my-2 mb-4">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--university-blue)]">
              <AtIcon />
            </span>
            <input
              ref={emailRef}
              type="email"
              name="email"
              id="email"
              placeholder={selectedRole.placeholder}
              className="h-10 w-full rounded-md border border-[var(--university-border)] bg-white py-1 pl-9 pr-3 text-sm outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[rgba(19,164,220,0.18)]"
            />
          </div>
          <label
            htmlFor="pass"
            className="text-sm font-semibold text-[var(--university-ink)]"
          >
            Password
          </label>
          <div className="relative my-2 mb-5">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--university-blue)]">
              <LockIcon />
            </span>
            <input
              ref={passRef}
              type={showPassword ? "text" : "password"}
              name="pass"
              id="pass"
              placeholder="Enter your password"
              className="h-10 w-full rounded-md border border-[var(--university-border)] bg-white py-1 pl-9 pr-10 text-sm outline-none transition focus:border-[var(--university-blue)] focus:ring-2 focus:ring-[rgba(19,164,220,0.18)]"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((isVisible) => !isVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--university-muted)] transition hover:text-[var(--university-blue)]"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          <Button text={`Login as ${selectedRole.label}`} />
          <StyledLink to="/support">
            Can't Login? <span>Contact Support</span>
          </StyledLink>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
