import LoginForm from "../components/login/LoginForm";

const Login = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--university-surface-soft)]">
      <div className="h-2 bg-[var(--university-red)]" />
      <div className="h-1 bg-[var(--university-gold)]" />
      <main className="flex min-h-[calc(100vh-12px)] items-center justify-center px-4 py-10">
        <LoginForm />
      </main>
    </div>
  );
};

export default Login;
