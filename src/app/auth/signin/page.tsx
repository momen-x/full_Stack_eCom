import { signIn } from "@/auth";
import { SubmitButton } from "./submit-button";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
        className="flex flex-col items-center gap-4"
      >
        <h1 className="text-2xl font-bold">Sign In</h1>
        <SubmitButton>Sign in with Google</SubmitButton>
      </form>
    </div>
  );
}