import HeroPanel from "../component/HeroPanel";
import SignUpForm from "../component/registration/SignUpForm";

export default function SignUp() {
  return (
    <div className="bg-linear-to-br from-primary/10 to-secondary/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-12 xl:px-16"  >
        <div className="flex items-center justify-center min-h-screen ">
          <div className="hidden lg:block lg:w-[48%] xl:w-[45%] h-full order-2">
            <HeroPanel />
          </div>
          <div className="flex-1 order-1">
            <SignUpForm/>
          </div>
        </div>
      </div>
    </div>
  )
}
