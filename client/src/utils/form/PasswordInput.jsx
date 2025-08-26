import { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import PasswordRules from "./PasswordRules";

// interface PasswordInputProps {
//   id: string;
//   label: string;
//   value: string;
//   onChange: (val: string) => void;
//   error?: string;
//   placeholder?: string;
//   withRules?: boolean;
// }

const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  withRules
}) => {
  const [show, setShow] = useState(false);
  const [showRules, setShowRules] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiLock className="h-5 w-5 text-gray-400" />
        </div>

        <input
        autoComplete="new-password"
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          
          placeholder={placeholder}
          className={`w-full pl-10 pr-16 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-8 pr-3 flex items-center"
        >
          {show ? <FiEye className="h-5 w-5 text-gray-400" /> : <FiEyeOff className="h-5 w-5 text-gray-400" />}
        </button>

        {withRules && (
          <button
            type="button"
            onClick={() => setShowRules(prev=>!prev)}
            className="absolute inset-y-0 right-0 pr-2 flex items-center"
          >
            <span className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-100 text-black font-bold text-xs">
              !
            </span>
          </button>
        )}

        {showRules && <PasswordRules onClose={() => setShowRules(false)} />}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PasswordInput;
