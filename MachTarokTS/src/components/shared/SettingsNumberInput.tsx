import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type NumericSettingInputProps = {
  value: number;
  min?: number;
  max?: number;
  allowZero?: boolean;
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export const SettingsNumberInput: React.FC<NumericSettingInputProps> = ({
  value,
  min,
  max,
  allowZero = true,
  step = 1,
  disabled,
  onChange,
}) => {
  const [draft, setDraft] = useState<string>(String(value));

  // If value changes externally (server update), sync draft
  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const parsed = Number(draft);
    if (Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }

    let next = parsed;
    if (min !== undefined) {
        if (next < min && allowZero && value > next) {
            next = 0;
        } else {
            next = Math.max(min, next);
        }
    }
    if (max !== undefined) next = Math.min(max, next);

    if (next !== value) {
      onChange(next);
    } else {
      setDraft(String(value)); // normalize formatting
    }
  };

  return (
    <Input
      type="number"
      value={draft}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
    />
  );
};
