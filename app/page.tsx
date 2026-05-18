import Link from "next/link";
import UserPrograms from "@/components/UserPrograms";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section className="relative z-10 py-24 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            
            {/* CORNER DECORATION */}
            <div className="absolute -top-10 left-0 w-40 h-40 border-l-2 border-t-2 border-border" />

            {/* LEFT SIDE CONTENT */}
            <div className="lg:col-span-7 space-y-8 relative">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <div><span className="text-foreground">Transform</span></div>
                <div><span className="text-primary">Your Body</span></div>
                <div className="pt-2"><span className="text-foreground">With Advanced</span></div>
                <div className="pt-2">
                  <span className="text-foreground">AI</span>
                  <span className="text-primary"> Technology</span>
                </div>
              </h1>

              <p className="text-muted-foreground text-lg md:text-xl max-w-xl">
                Get a personalized fitness and nutrition plan powered by AI. 
                Tell us your goals, and we'll create the perfect program for you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/generate-program" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg text-center transition-colors">
                  Get Your Program
                </Link>
                <Link href="#how-it-works" className="border border-border hover:border-primary text-foreground font-semibold px-8 py-3 rounded-lg text-center transition-colors">
                  How It Works
                </Link>
              </div>

              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-muted-foreground text-sm">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <div className="text-muted-foreground text-sm">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-muted-foreground text-sm">AI Support</div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - IMAGE */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-border">
                <img src="/hero-ai.png" alt="AI Fitness Trainer" className="w-full h-auto object-cover" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* USER PROGRAMS SECTION */}
      <UserPrograms />

    </div>
  );
};

export default HomePage;