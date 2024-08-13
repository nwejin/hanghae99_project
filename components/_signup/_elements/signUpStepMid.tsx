import TextInput from '../_ui/textInput';

export default function SignUpStepMid() {
  return (
    <>
      <div className="gird gap-4">
        <div className="grid gap-2">
          <TextInput
            type="file"
            name="profile_image"
            id="profile_image"
            placeholder="프로필이미지"
            text="프로필이미지"
          />
        </div>
        <div className="grid gap-2">
          <TextInput type="text" name="name" id="이름" placeholder="아이디" text="이름" />
        </div>
        <div className="grid gap-2">
          <TextInput type="text" name="bio" id="bio" placeholder="자기소개" text="자기소개" />
        </div>
      </div>
    </>
  );
}
