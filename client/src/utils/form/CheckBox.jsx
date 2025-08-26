// interface CheckboxProps {
//   id: string;
//   label: React.ReactNode;
//   checked?: boolean;
//   onChange?: (val: boolean) => void;
// }

const Checkbox = ({ id, label, checked, onChange }) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
