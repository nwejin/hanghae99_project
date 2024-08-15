import SignUpTemplates from '../../../components/_signup/_layouts/signUpTemplates';
import { app } from '@/config/firebase';

export default function SignUpPage() {
  console.log(app);
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignUpTemplates />
    </div>
  );
}

// container flex flex-col justify-center min-h-screen gap-5

// flex h-screen w-screen items-center justify-center
