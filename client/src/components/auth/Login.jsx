import { Button } from "@/components/ui/button";
import { ChevronLeft, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Link to="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">
          <>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </>
        </Button>
      </Link>
      <div className="mx-auto flex flex-col items-center w-full max-w-[350px] space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Megaphone className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to login to your account
          </p>

          <form>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  {...register("email", { required: true })}
                />
                {errors?.email && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="password">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password", { required: true })}
                />
                {errors?.password && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button>Login</Button>
            </div>
          </form>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            to="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
