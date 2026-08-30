const Select = ({ label, name, value, onChange, options }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;