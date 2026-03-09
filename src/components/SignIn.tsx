import { signIn } from "../lib/auth-client";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";

function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--gh-bg-deep)" }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 rpg-grid-bg rpg-bg-pattern" />

      {/* Floating pixel particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 bg-emerald-500/30 animate-float-1" style={{ top: "20%", left: "15%" }} />
        <div className="absolute w-1.5 h-1.5 bg-amber-400/20 animate-float-2" style={{ top: "60%", left: "80%" }} />
        <div className="absolute w-1 h-1 bg-emerald-400/25 animate-float-3" style={{ top: "40%", left: "60%" }} />
        <div className="absolute w-1 h-1 bg-amber-300/20 animate-float-1" style={{ top: "75%", left: "25%" }} />
        <div className="absolute w-1.5 h-1.5 bg-purple-500/15 animate-float-2" style={{ top: "10%", left: "70%" }} />
        <div className="absolute w-1 h-1 bg-amber-400/25 animate-float-3" style={{ top: "85%", left: "45%" }} />
      </div>

      {/* Main card */}
      <div className="w-full max-w-[400px] relative animate-fade-in-up">
        {/* Gold border glow */}
        <div
          className="absolute -inset-[2px] rounded-sm"
          style={{
            background: "linear-gradient(135deg, rgba(200, 168, 78, 0.3), transparent, rgba(200, 168, 78, 0.2))",
            filter: "blur(1px)",
          }}
        />

        <div
          className="relative rounded-sm overflow-hidden"
          style={{
            background: "linear-gradient(180deg, var(--gh-bg-card) 0%, var(--gh-bg-deep) 100%)",
            border: "2px solid var(--gh-border-gold-dim)",
            boxShadow: "0 0 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* Corner ornaments */}
          <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: "var(--gh-border-gold)" }} />
          <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: "var(--gh-border-gold)" }} />
          <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: "var(--gh-border-gold)" }} />
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: "var(--gh-border-gold)" }} />

          {/* Header */}
          <div className="relative px-8 pt-10 pb-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <span
                  className="text-5xl block animate-gentle-bounce"
                  style={{
                    filter: "drop-shadow(0 0 12px rgba(251, 191, 36, 0.3))",
                    imageRendering: "pixelated",
                  }}
                >
                  🏰
                </span>
                <div className="absolute -top-1 -right-2 w-1 h-1 bg-amber-400 animate-sparkle-1" />
                <div className="absolute top-2 -left-3 w-1 h-1 bg-emerald-400 animate-sparkle-2" />
                <div className="absolute -bottom-1 right-0 w-1 h-1 bg-amber-300 animate-sparkle-3" />
              </div>
            </div>

            <h1
              className="font-pixel text-base tracking-widest"
              style={{
                color: "var(--gh-gold)",
                textShadow: "0 0 20px rgba(251, 191, 36, 0.3)",
              }}
            >
              GUILD HALL
            </h1>

            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3 mt-4 mb-2">
              <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, var(--gh-border-gold-dim))" }} />
              <div className="flex gap-1.5">
                <div className="w-1 h-1" style={{ backgroundColor: "var(--gh-emerald)" }} />
                <div className="w-1.5 h-1.5" style={{ backgroundColor: "var(--gh-gold)" }} />
                <div className="w-1 h-1" style={{ backgroundColor: "var(--gh-emerald)" }} />
              </div>
              <div className="h-px w-12" style={{ background: "linear-gradient(270deg, transparent, var(--gh-border-gold-dim))" }} />
            </div>

            <p
              className="font-rpg text-lg tracking-[0.2em] uppercase mt-3"
              style={{ color: "var(--gh-text-faint)" }}
            >
              Enter the Guild
            </p>
          </div>

          {/* Divider */}
          <div className="mx-6 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--gh-border-gold-dim), transparent)" }} />

          {/* Form */}
          <div className="px-8 py-8">
            <form
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setLoading(true);

                const formData = new FormData(e.target as HTMLFormElement);
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;

                const { error: signInError } = await signIn.email({ email, password });
                setLoading(false);

                if (signInError) {
                  setError(signInError.message || "The guild rejects your credentials");
                }
              }}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    className="font-pixel text-[7px] uppercase tracking-[0.15em] ml-1 flex items-center gap-1.5"
                    style={{ color: "var(--gh-text-faint)" }}
                    htmlFor="email"
                  >
                    <span style={{ color: "var(--gh-emerald)" }}>▸</span> Guild Name
                  </label>
                  <input
                    id="email"
                    className="w-full rounded-sm px-4 py-3 text-sm border outline-none transition-all duration-200"
                    style={{
                      background: "var(--gh-bg-deep)",
                      borderColor: "var(--gh-border)",
                      color: "var(--gh-text)",
                      fontFamily: "var(--font-rpg)",
                      fontSize: "16px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--gh-emerald-dim)";
                      e.target.style.boxShadow = "0 0 0 2px rgba(52, 211, 153, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--gh-border)";
                      e.target.style.boxShadow = "none";
                    }}
                    type="email"
                    name="email"
                    placeholder="adventurer@guild.hall"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="font-pixel text-[7px] uppercase tracking-[0.15em] ml-1 flex items-center gap-1.5"
                    style={{ color: "var(--gh-text-faint)" }}
                    htmlFor="password"
                  >
                    <span style={{ color: "var(--gh-gold)" }}>▸</span> Secret Passphrase
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      className="w-full rounded-sm px-4 py-3 pr-12 text-sm border outline-none transition-all duration-200"
                      style={{
                        background: "var(--gh-bg-deep)",
                        borderColor: "var(--gh-border)",
                        color: "var(--gh-text)",
                        fontFamily: "var(--font-rpg)",
                        fontSize: "16px",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--gh-emerald-dim)";
                        e.target.style.boxShadow = "0 0 0 2px rgba(52, 211, 153, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--gh-border)";
                        e.target.style.boxShadow = "none";
                      }}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                      style={{ color: "var(--gh-text-faint)" }}
                    >
                      {showPassword ? (
                        <IconEyeOff className="w-4.5 h-4.5" />
                      ) : (
                        <IconEye className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="w-full font-pixel text-[8px] py-3.5 px-4 rounded-sm tracking-[0.12em] uppercase transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? "linear-gradient(135deg, #064e3b, #065f46)"
                    : "linear-gradient(135deg, #065f46, #047857, #059669)",
                  color: "#d1fae5",
                  border: "1px solid #10b981",
                  boxShadow: "0 2px 8px rgba(5, 150, 105, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.target as HTMLElement).style.boxShadow = "0 4px 16px rgba(5, 150, 105, 0.35), 0 0 20px rgba(52, 211, 153, 0.15)";
                    (e.target as HTMLElement).style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.boxShadow = "0 2px 8px rgba(5, 150, 105, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)";
                  (e.target as HTMLElement).style.transform = "translateY(0)";
                }}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-3 h-3 border-2 border-emerald-300/30 border-t-emerald-300 rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "⚔ Enter the Guild"
                )}
              </button>

              {error && (
                <div className="animate-fade-in-up">
                  <div
                    className="rounded-sm p-3 flex items-start gap-2"
                    style={{
                      background: "rgba(127, 29, 29, 0.15)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    <span className="text-red-400/80 text-sm mt-0.5">⚠</span>
                    <p className="font-rpg text-sm" style={{ color: "rgba(239, 68, 68, 0.8)" }}>
                      {error}
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 pb-6 pt-1">
            <div
              className="flex items-center justify-center gap-2 font-pixel text-[6px] tracking-[0.2em] uppercase"
              style={{ color: "var(--gh-text-faint)" }}
            >
              <div className="w-1 h-1" style={{ backgroundColor: "var(--gh-border-gold-dim)" }} />
              <span>Guild Hall v2.0</span>
              <div className="w-1 h-1" style={{ backgroundColor: "var(--gh-border-gold-dim)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
