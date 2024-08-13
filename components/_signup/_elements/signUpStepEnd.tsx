import TextInput from '../_ui/textInput';

export default function SignUpStepEnd() {
  return (
    <>
      <div className="gird gap-4">
        <div className="grid gap-2">
          <TextInput type="file" name="pet_image" id="pet_image" placeholder="반려동물 사진" text="반려동물 사진" />
        </div>
        <div className="grid gap-2">
          <TextInput
            type="text"
            name="petName"
            id="petName"
            placeholder="친구의 이름을 알려주세요!"
            text="반려동물 이름"
          />
        </div>
        <div className="grid gap-2">
          <TextInput
            type="text"
            name="petSpecies"
            id="petSpecies"
            placeholder="친구의 종을 알려주세요!"
            text="반려동물 종"
          />
        </div>
      </div>
    </>
  );
}
