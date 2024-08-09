interface TextInputProps {
  type: string;
  name: string;
  id: string;
  placeholder?: string;
}

export default function TextInput({ type, name, id, placeholder }: TextInputProps) {
  return (
    <>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 p-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </>
  );
}
