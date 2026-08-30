const Button = ({ text }) => {
  return (
    <button
      className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 py-3 text-white font-semibold transition hover:-translate-y-1 hover:shadow-xl"
    >
      {text}
    </button>
  );
};

export default Button;