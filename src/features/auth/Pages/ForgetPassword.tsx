import ForgetPasswordForm from "../component/passwordReset/ForgetPasswordForm";

export default function ForgetPassword() {
  
  return (
    <div className="w-full h-full bg-linear-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-8 overflow-y-auto">
      <ForgetPasswordForm />
    </div>
  )
}
