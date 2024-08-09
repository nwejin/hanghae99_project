import TextInput from '../atoms/textInput';
import LoginBtn from '../atoms/loginBtn';

export default function LoginForm() {
  return (
    <form className="mx-auto w-full max-w-sm rounded-md bg-white p-6 shadow-md">
      <div className="mb-4">
        <TextInput type="text" name="username" id="username" placeholder="아이디" />
      </div>
      <div className="mb-4">
        <TextInput type="password" name="password" id="password" placeholder="비밀번호" />
      </div>
      <LoginBtn />
    </form>
  );
}
