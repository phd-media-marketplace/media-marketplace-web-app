import HeroPanel from "../component/HeroPanel";
import LogInForm from "../component/LogInForm";

export default function Login() {
  return (
    <div className="bg-linear-to-br from-primary/10 to-secondary/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-12 xl:px-16"  >
        <div className="flex items-center justify-center min-h-screen ">
          <div className="hidden lg:block lg:w-[48%] xl:w-[45%] h-full order-1">
            <HeroPanel />
          </div>
          <div className="flex-1 order-2">
            <LogInForm />
          </div>
        </div>
      </div>
    </div>
  )
}