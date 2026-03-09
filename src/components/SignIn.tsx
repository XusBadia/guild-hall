import { signIn } from "../lib/auth-client";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";

function SignInForm() {
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	return (
		<div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden"
			style={{ background: "linear-gradient(135deg, #09090b 0%, #18181b 40%, #1a1a2e 70%, #09090b 100%)" }}>
			
			{/* Animated background particles */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{/* Floating pixel dots */}
				<div className="absolute w-1 h-1 bg-emerald-500/30 rounded-full animate-float-1" style={{ top: '20%', left: '15%' }} />
				<div className="absolute w-1.5 h-1.5 bg-amber-400/20 rounded-full animate-float-2" style={{ top: '60%', left: '80%' }} />
				<div className="absolute w-1 h-1 bg-emerald-400/25 rounded-full animate-float-3" style={{ top: '40%', left: '60%' }} />
				<div className="absolute w-1 h-1 bg-amber-300/20 rounded-full animate-float-1" style={{ top: '75%', left: '25%' }} />
				<div className="absolute w-1.5 h-1.5 bg-emerald-500/15 rounded-full animate-float-2" style={{ top: '10%', left: '70%' }} />
				<div className="absolute w-1 h-1 bg-amber-400/25 rounded-full animate-float-3" style={{ top: '85%', left: '45%' }} />
				
				{/* Subtle grid overlay */}
				<div className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: `
							linear-gradient(rgba(52, 211, 153, 0.3) 1px, transparent 1px),
							linear-gradient(90deg, rgba(52, 211, 153, 0.3) 1px, transparent 1px)
						`,
						backgroundSize: '32px 32px',
					}}
				/>
			</div>

			{/* Main card */}
			<div className="w-full max-w-[400px] relative animate-fade-in-up">
				{/* Outer glow */}
				<div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-amber-500/10 blur-sm" />
				
				<div className="relative rounded-2xl border border-emerald-900/40 overflow-hidden"
					style={{ background: "linear-gradient(180deg, rgba(24,24,27,0.97) 0%, rgba(9,9,11,0.99) 100%)" }}>
					
					{/* Header section */}
					<div className="relative px-8 pt-10 pb-8 text-center">
						{/* Castle icon area */}
						<div className="mb-5 flex justify-center">
							<div className="relative">
								<span className="text-5xl block animate-gentle-bounce" style={{ 
									filter: 'drop-shadow(0 0 12px rgba(52, 211, 153, 0.3))',
									imageRendering: 'pixelated'
								}}>
									🏰
								</span>
								{/* Pixel sparkles around castle */}
								<div className="absolute -top-1 -right-2 w-1 h-1 bg-amber-400 animate-sparkle-1" />
								<div className="absolute top-2 -left-3 w-1 h-1 bg-emerald-400 animate-sparkle-2" />
								<div className="absolute -bottom-1 right-0 w-1 h-1 bg-amber-300 animate-sparkle-3" />
							</div>
						</div>
						
						{/* Title */}
						<h1 className="text-3xl font-bold tracking-widest uppercase"
							style={{
								background: "linear-gradient(135deg, #d4d4d8 0%, #fafafa 40%, #fbbf24 100%)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								fontFamily: "'Outfit', sans-serif",
								textShadow: "none",
							}}>
							Guild Hall
						</h1>
						
						{/* Decorative divider */}
						<div className="flex items-center justify-center gap-3 mt-4 mb-2">
							<div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-600/50" />
							<div className="flex gap-1">
								<div className="w-1 h-1 bg-emerald-500/60" />
								<div className="w-1.5 h-1.5 bg-amber-400/80" />
								<div className="w-1 h-1 bg-emerald-500/60" />
							</div>
							<div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-600/50" />
						</div>
						
						<p className="text-zinc-500 text-sm tracking-[0.2em] uppercase font-medium mt-3"
							style={{ fontFamily: "'Outfit', sans-serif" }}>
							Enter the Guild
						</p>
					</div>

					{/* Separator line */}
					<div className="mx-6 h-px bg-gradient-to-r from-transparent via-emerald-800/30 to-transparent" />

					{/* Form section */}
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

								const { error: signInError } = await signIn.email({
									email,
									password,
								});

								setLoading(false);

								if (signInError) {
									setError(signInError.message || "The guild rejects your credentials");
								}
							}}
						>
							<div className="space-y-4">
								<div className="space-y-2">
									<label
										className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500 ml-1 flex items-center gap-1.5"
										htmlFor="email"
									>
										<span className="text-emerald-500/70">⟐</span> Guild Name
									</label>
									<input
										id="email"
										className="w-full rounded-lg px-4 py-3 text-sm text-zinc-200 border outline-none transition-all duration-200 placeholder:text-zinc-600"
										style={{
											background: "rgba(9, 9, 11, 0.6)",
											borderColor: "rgba(63, 63, 70, 0.4)",
											fontFamily: "'Outfit', sans-serif",
										}}
										onFocus={(e) => {
											e.target.style.borderColor = "rgba(52, 211, 153, 0.4)";
											e.target.style.boxShadow = "0 0 0 3px rgba(52, 211, 153, 0.08), inset 0 0 12px rgba(52, 211, 153, 0.03)";
										}}
										onBlur={(e) => {
											e.target.style.borderColor = "rgba(63, 63, 70, 0.4)";
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
										className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500 ml-1 flex items-center gap-1.5"
										htmlFor="password"
									>
										<span className="text-amber-500/70">⟐</span> Secret Passphrase
									</label>
									<div className="relative">
										<input
											id="password"
											className="w-full rounded-lg px-4 py-3 pr-12 text-sm text-zinc-200 border outline-none transition-all duration-200 placeholder:text-zinc-600"
											style={{
												background: "rgba(9, 9, 11, 0.6)",
												borderColor: "rgba(63, 63, 70, 0.4)",
												fontFamily: "'Outfit', sans-serif",
											}}
											onFocus={(e) => {
												e.target.style.borderColor = "rgba(52, 211, 153, 0.4)";
												e.target.style.boxShadow = "0 0 0 3px rgba(52, 211, 153, 0.08), inset 0 0 12px rgba(52, 211, 153, 0.03)";
											}}
											onBlur={(e) => {
												e.target.style.borderColor = "rgba(63, 63, 70, 0.4)";
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
											className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
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
								className="w-full font-semibold py-3 px-4 rounded-lg text-sm tracking-[0.12em] uppercase transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
								style={{
									background: loading 
										? "linear-gradient(135deg, #064e3b 0%, #065f46 100%)" 
										: "linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)",
									color: "#d1fae5",
									boxShadow: "0 2px 8px rgba(5, 150, 105, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
									fontFamily: "'Outfit', sans-serif",
								}}
								onMouseEnter={(e) => {
									if (!loading) {
										(e.target as HTMLElement).style.boxShadow = "0 4px 16px rgba(5, 150, 105, 0.35), inset 0 1px 0 rgba(255,255,255,0.08)";
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
										<span className="inline-block w-4 h-4 border-2 border-emerald-300/30 border-t-emerald-300 rounded-full animate-spin" />
										Verifying...
									</span>
								) : (
									"⚔ Enter the Guild"
								)}
							</button>

							{error && (
								<div className="animate-fade-in-up">
									<div className="rounded-lg p-3.5 flex items-start gap-2.5"
										style={{
											background: "rgba(127, 29, 29, 0.15)",
											border: "1px solid rgba(239, 68, 68, 0.2)",
										}}>
										<span className="text-red-400/80 text-sm mt-0.5">⚠</span>
										<p className="text-red-300/80 text-xs leading-relaxed"
											style={{ fontFamily: "'Outfit', sans-serif" }}>
											{error}
										</p>
									</div>
								</div>
							)}
						</form>
					</div>

					{/* Footer */}
					<div className="px-8 pb-6 pt-1">
						<div className="flex items-center justify-center gap-2 text-zinc-700 text-[10px] tracking-[0.2em] uppercase">
							<div className="w-1 h-1 bg-emerald-800/40" />
							<span>Guild Hall v1.0</span>
							<div className="w-1 h-1 bg-emerald-800/40" />
						</div>
					</div>
				</div>
			</div>

			{/* Inline keyframe styles */}
			<style>{`
				@keyframes fade-in-up {
					from {
						opacity: 0;
						transform: translateY(16px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				@keyframes gentle-bounce {
					0%, 100% { transform: translateY(0); }
					50% { transform: translateY(-4px); }
				}
				@keyframes sparkle {
					0%, 100% { opacity: 0; transform: scale(0); }
					50% { opacity: 1; transform: scale(1); }
				}
				@keyframes float-particle {
					0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
					25% { transform: translateY(-20px) translateX(10px); opacity: 0.7; }
					50% { transform: translateY(-10px) translateX(-5px); opacity: 0.4; }
					75% { transform: translateY(-30px) translateX(15px); opacity: 0.6; }
				}
				.animate-fade-in-up {
					animation: fade-in-up 0.5s ease-out both;
				}
				.animate-gentle-bounce {
					animation: gentle-bounce 3s ease-in-out infinite;
				}
				.animate-sparkle-1 {
					animation: sparkle 2s ease-in-out infinite;
				}
				.animate-sparkle-2 {
					animation: sparkle 2s ease-in-out infinite 0.6s;
				}
				.animate-sparkle-3 {
					animation: sparkle 2s ease-in-out infinite 1.2s;
				}
				.animate-float-1 {
					animation: float-particle 6s ease-in-out infinite;
				}
				.animate-float-2 {
					animation: float-particle 8s ease-in-out infinite 1s;
				}
				.animate-float-3 {
					animation: float-particle 7s ease-in-out infinite 2s;
				}
			`}</style>
		</div>
	);
}

export default SignInForm;
