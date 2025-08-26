import { FiUser, FiMail } from "react-icons/fi";

// interface TextInputProps {
//   id: string;
//   label: string;
//   type?: string;
//   icon?: "user" | "mail";
//   value: string;
//   onChange: (val: string) => void;
//   error?: string;
//   placeholder?: string;
//   autoComplete?: string;
// }

const TextInput = ({
  id,
  label,
  type = "text",
  icon,
  value,
  onChange,
  error,
  placeholder,
  autoComplete
}) => {
  const Icon = icon === "user" ? FiUser : icon === "mail" ? FiMail : null;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TextInput;
