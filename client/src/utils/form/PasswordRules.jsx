// interface PasswordRulesProps {
//   onClose: () => void;
// }

const PasswordRules = ({ onClose }) => {
  return (
    <div onClick={onClose} className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-700 z-10">
      <p className="font-semibold mb-1">Password must include:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>At least 8 characters</li>
        <li>One uppercase letter (A–Z)</li>
        <li>One lowercase letter (a–z)</li>
        <li>One number (0–9)</li>
        <li>One special character (!@#$...)</li>
      </ul>
    </div>
  );
};

export default PasswordRules;
