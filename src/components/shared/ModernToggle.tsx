interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}

export default function ModernToggle({ enabled, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`group relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 ease-in-out ${
        enabled 
          ? 'bg-[#A8BDBE]' 
          : 'bg-gray-300 hover:bg-gray-400'
      }`}
      role="switch"
      aria-checked={enabled}
      aria-label={label}
    >
      {/* Sliding Circle */}
      <span
        className={`inline-block h-10 w-10 transform rounded-full bg-[#FFFCF6] shadow-lg ring-0 transition-all duration-300 ease-in-out ${
          enabled 
            ? 'translate-x-10' 
            : 'translate-x-0'
        }`}
      />
    </button>
  );
}

