import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background hero-gradient-dark px-4">
      <div className="animate-scale-in">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-gradient-to-r from-primary to-accent hover:opacity-90',
              card: 'bg-surface border border-border shadow-xl',
            },
          }}
        />
      </div>
    </main>
  );
}
