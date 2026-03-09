import { signOut, useSession } from "../lib/auth-client";

function SignOutButton() {
	const { data: session } = useSession();

	if (!session) return null;

	return (
		<button
			className="bg-destructive text-destructive-foreground rounded-md px-2 py-1 cursor-pointer hover:bg-destructive/80"
			onClick={() => void signOut()}
		>
			Sign out
		</button>
	);
}

export default SignOutButton;
