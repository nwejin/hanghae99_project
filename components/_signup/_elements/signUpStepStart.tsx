import TextInput from '../_ui/textInput';

export default function SignUpStepStart() {
  return (
    <>
      <div className="gird gap-4">
        <div className="grid gap-2">
          <TextInput type="text" name="userId" id="userId" placeholder="아이디" text="아이디" />
        </div>
        <div className="grid gap-2">
          <TextInput type="text" name="email" id="email" placeholder="pet@example.com" text="이메일" />
        </div>
        <div className="grid gap-2">
          <TextInput type="password" name="password" id="password" placeholder="비밀번호" text="비밀번호" />
        </div>
        <div className="grid gap-2">
          <TextInput
            type="password"
            name="password_verify"
            id="password_verify"
            placeholder="비밀번호 확인"
            text="비밀번호 확인"
          />
        </div>
      </div>
    </>
  );
}
