import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Building2, CheckCircle2, Crown, Layers3, LockKeyhole, ShieldCheck, Sparkles, Tv, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dummyMediaPackages } from "@/features/agency-client-features/marketplace/dummy-data";
import PackageCard from "@/features/agency-client-features/marketplace/components/PackageCard";

const featureCards = [
  {
    icon: Layers3,
    title: "All channels in one place",
    copy: "Browse FM, TV, Digital, and OOH inventory with a single marketplace experience.",
  },
  {
    icon: ShieldCheck,
    title: "Built for approved workflows",
    copy: "Public visitors can explore, but plan creation and media buying stay protected behind sign-in.",
  },
  {
    icon: BarChart3,
    title: "Data-driven decisions",
    copy: "Use package reach, pricing, and placement insights to compare options before you commit.",
  },
];

const steps = [
  {
    step: "01",
    title: "Discover packages",
    copy: "Explore curated bundles and featured media options built around campaign goals.",
  },
  {
    step: "02",
    title: "Sign in to plan",
    copy: "If you want to add a package to a media plan, sign in and we will continue the flow for you.",
  },
  {
    step: "03",
    title: "Launch faster",
    copy: "We seed the media plan builder with package details so the user can move directly into execution.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const featuredPackages = dummyMediaPackages.slice(0, 3);

  return (
    <div className="min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-primary/5 text-slate-950">
      <div className="absolute inset-x-0 top-0 -z-0 h-[34rem] bg-linear-to-br from-secondary/20 via-primary/10 to-transparent" />
      <div className="absolute left-10 top-28 -z-0 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute right-6 top-40 -z-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-24 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/75 px-4 py-3 shadow-[0_20px_60px_rgba(94,73,227,0.08)] backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary text-white shadow-lg shadow-secondary/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Media Marketplace</p>
              <p className="text-base font-bold text-slate-950">Plan. Buy. Launch.</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#marketplace" className="transition-colors hover:text-primary">Marketplace</a>
            <a href="#features" className="transition-colors hover:text-primary">Features</a>
            <a href="#steps" className="transition-colors hover:text-primary">How it works</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate("/login")} className="hidden rounded-full text-slate-700 hover:bg-white hover:text-slate-950 sm:inline-flex">
              Sign in
            </Button>
            <Button onClick={() => navigate("/marketplace")} className="rounded-full bg-secondary px-5 text-primary shadow-lg shadow-secondary/20 hover:bg-secondary/90">
              Browse marketplace
            </Button>
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md">
              <Crown className="h-4 w-4 text-primary" />
              Public marketplace for media planning and campaign discovery
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Discover media packages that feel curated for real campaigns.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Browse premium FM, TV, Digital, and OOH packages, compare placements, and move into a guided media-plan workflow when you are ready to buy.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => navigate("/marketplace")}
                className="h-12 rounded-full bg-linear-to-r from-primary to-secondary px-6 text-base font-semibold text-white shadow-xl shadow-primary/20 hover:opacity-95"
              >
                Explore marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="h-12 rounded-full border-slate-200 bg-white px-6 text-base font-semibold text-slate-800 hover:bg-slate-50"
              >
                Sign in to add a plan
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Reach", value: "Multi-channel" },
                { label: "Planning", value: "Guided workflow" },
                { label: "Buying", value: "Sign-in protected" },
              ].map((item) => (
                <Card key={item.label} className="border border-white/70 bg-white/80 shadow-sm backdrop-blur-md">
                  <CardContent className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                    <p className="mt-2 text-base font-semibold text-slate-950">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-[2rem] border-[14px] border-secondary bg-linear-to-br from-white to-slate-50 p-4 shadow-[0_30px_90px_rgba(94,73,227,0.18)]">
              <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-inner">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">TaskGo marketplace</p>
                    <h2 className="text-2xl font-bold text-slate-950">Simplify media planning</h2>
                  </div>
                  <Badge className="rounded-full bg-primary/10 text-primary">Live</Badge>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-3xl bg-linear-to-br from-primary/12 via-white to-secondary/10 p-4">
                    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>Campaign workspace</span>
                        <span>Q2 planning</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Packages", value: "24" },
                          { label: "Channels", value: "4" },
                          { label: "Converted", value: "92%" },
                        ].map((metric) => (
                          <div key={metric.label} className="rounded-2xl bg-slate-50 p-3">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{metric.label}</p>
                            <p className="mt-2 text-xl font-bold text-slate-950">{metric.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl bg-secondary/10 p-4">
                          <p className="text-sm font-semibold text-slate-900">Featured flow</p>
                          <p className="mt-1 text-sm text-slate-600">Public users can browse instantly, then sign in to add media plans.</p>
                        </div>
                        <div className="rounded-2xl bg-slate-900 p-4 text-white">
                          <p className="text-sm font-semibold">Secure actions</p>
                          <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                            <LockKeyhole className="h-4 w-4" />
                            Sign-in required for planning
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Tv className="h-4 w-4 text-primary" />
                        Marketplace highlights
                      </div>
                      <div className="mt-3 space-y-3">
                        {[
                          "FM packages with planning-ready bundles",
                          "TV and Digital bundles for broader reach",
                          "OOH placements for high-visibility campaigns",
                        ].map((item) => (
                          <div key={item} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-primary/10 to-secondary/10 p-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">Trusted workflow</p>
                      <p className="mt-1 text-sm text-slate-600">Add to plan, sign in if needed, and continue with a prefilled media-plan builder.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 left-8 right-8 hidden items-center justify-between rounded-full border border-white/80 bg-white/85 px-4 py-3 shadow-lg backdrop-blur-md md:flex">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Users className="h-4 w-4 text-primary" />
                Public buyers and media partners in one marketplace
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Building2 className="h-4 w-4 text-primary" />
                Seamless public discovery to secure planning
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(94,73,227,0.08)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Curated packages", value: `${dummyMediaPackages.length}+`, note: "ready to browse" },
            { label: "Fast planning", value: "1 click", note: "to start a plan" },
            { label: "Secure access", value: "Login", note: "required to buy" },
            { label: "Responsive UI", value: "Mobile-first", note: "desktop polished" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-100 bg-linear-to-br from-slate-50 to-white p-5">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-black text-slate-950">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-600">{stat.note}</p>
            </div>
          ))}
        </section>

        <section id="features" className="space-y-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Why teams choose it</p>
            <h2 className="text-4xl font-black tracking-tight text-slate-950">A public marketplace that still feels premium and controlled.</h2>
            <p className="text-lg text-slate-600">Visitors can explore inventory, compare packages, and move into account creation only when they are ready to add a media plan.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border border-slate-100 bg-white/90 shadow-lg shadow-slate-950/5 transition-transform hover:-translate-y-1">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950">{feature.title}</h3>
                    <p className="text-sm leading-6 text-slate-600">{feature.copy}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="marketplace" className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Featured packages</p>
              <h2 className="text-4xl font-black tracking-tight text-slate-950">Preview the marketplace before you sign in.</h2>
              <p className="text-lg text-slate-600">These featured cards show the quality of the available inventory and let visitors see what they can buy after sign-in.</p>
            </div>
            <Button onClick={() => navigate("/marketplace")} className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800">
              Open marketplace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <PackageCard mediaPackage={pkg} />
              </motion.div>
            ))}
          </div>
        </section>

        <section id="steps" className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="rounded-[2rem] border border-slate-100 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/15">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary">How it works</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">From browsing to planning in three simple steps.</h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/75">The landing page introduces the marketplace. The public marketplace lets visitors compare packages. Signing in unlocks the media-plan builder.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.step} className="border border-slate-100 bg-white/90 shadow-lg shadow-slate-950/5">
                <CardContent className="space-y-4 p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-sm font-black text-primary">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-950">{step.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{step.copy}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-linear-to-r from-primary via-secondary to-cyan-300 p-8 text-white shadow-[0_25px_80px_rgba(94,73,227,0.22)]">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/75">Ready to launch</p>
              <h2 className="text-4xl font-black tracking-tight">Build campaigns with a marketplace that works for everyone.</h2>
              <p className="max-w-2xl text-sm leading-7 text-white/80">Public visitors can browse immediately. Buyers sign in only when they are ready to add a package to a media plan, keeping the marketplace open and the workflow secure.</p>
            </div>

            <div className="flex flex-col gap-3 lg:justify-self-end">
              <Button onClick={() => navigate("/marketplace")} className="rounded-full bg-white px-6 text-base font-semibold text-slate-950 hover:bg-white/90">
                Visit marketplace
              </Button>
              <Button onClick={() => navigate("/login")} variant="outline" className="rounded-full border-white/30 bg-transparent px-6 text-base font-semibold text-white hover:bg-white/10">
                Sign in to add media plan
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}