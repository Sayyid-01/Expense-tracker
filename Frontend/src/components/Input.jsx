const Input = ({ label, name, type, placeholder, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">{label}</label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default Input;