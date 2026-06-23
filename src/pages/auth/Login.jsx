import LoginForm from "../../components/login/LoginForm";
import Carousel from "../../components/common/Carousel";

const Login = () => {
  return (
    <div className="relative h-screen overflow-hidden bg-[var(--university-surface-soft)]">
      {/* <div className="h-2 bg-[var(--university-red)]" />
      <div className="h-1 bg-[var(--university-gold)]" /> */}
      <main className="flex h-screen w-full items-center justify-center px-4 py-10 lg:px-0 lg:py-0">
        {" "}
        {/*[calc(100vh-12px)] */}
        <div className="hidden h-full bg-amber-200 lg:block lg:w-1/2">
          <Carousel />
        </div>
        <div className="lg:w-1/2 md:w-full flex justify-center items-center ">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
