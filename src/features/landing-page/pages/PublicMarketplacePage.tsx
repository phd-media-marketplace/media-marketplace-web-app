import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Packages from "@/features/agency-features/marketplace/pages/Packages";

export default function PublicMarketplacePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-primary/5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-white/70 bg-linear-to-r from-slate-950 via-primary to-secondary p-8 text-white shadow-[0_25px_80px_rgba(94,73,227,0.18)]"
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-secondary" />
                Public marketplace preview
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                Browse media packages, then sign in when you are ready to plan.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
                The marketplace is open to everyone. Adding a package to a media plan requires a sign-in so we can save your workflow and keep the planning experience secure.
              </p>
            </div>

            <div className="flex flex-col gap-3 justify-self-start lg:justify-self-end">
              <Button onClick={() => navigate("/login")} className="rounded-full bg-white px-6 text-base font-semibold text-slate-950 hover:bg-white/90">
                Sign in to plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" className="rounded-full border-white/30 bg-transparent px-6 text-base font-semibold text-white hover:bg-white/10">
                Back to landing page
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { icon: ShoppingBag, title: "Curated packages", copy: "Browse premium bundles with clear pricing and reach." },
              { icon: ShieldCheck, title: "Protected actions", copy: "Sign-in required only when you add a package to a plan." },
              { icon: Sparkles, title: "Premium experience", copy: "Modern cards, sharp visuals, and fast discovery." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-secondary" />
                  <p className="mt-3 text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-white/70">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </motion.section>

        <Packages />
      </div>
    </div>
  );
}