import React, {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import "./input.css";

const numberMask = (num: string): string => num.replace(/\D/g, "");

interface InputProps {
  value: string;
  className?: string;
  style?: CSSProperties;
  size?: number;
  type?: "text" | "password" | "number" | "tel";
  isConfirmInput?: boolean;
  onlyNumber?: boolean;
  onChange: (value: string) => void;
}

export default function InputBox({
  value,
  className,
  style,
  size = 10,
  type = "text",
  onlyNumber = false,
  onChange,
}: InputProps) {
  const [arrayValue, setArrayValue] = useState<string[]>([]);
  const refs = useRef<React.RefObject<HTMLInputElement>[]>([]);

  // Ensure refs only initialized once
  if (refs.current.length !== size) {
    refs.current = Array(size)
      .fill(null)
      .map(
        () => React.createRef<HTMLInputElement>() as RefObject<HTMLInputElement>
      );
  }

  useEffect(() => {
    // Initialize only once
    if (arrayValue.length === 0) {
      if (value && value.length === size) {
        setArrayValue(value.split(""));
      } else {
        setArrayValue(Array(size).fill(""));
      }
    }
  }, [arrayValue.length, value, size]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number
  ) => {
    if (e.key === " ") {
      e.preventDefault();
      handleChange(" ", i);
      if (i < size - 1) {
        refs.current[i + 1]?.current?.focus();
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.current?.focus();
    } else if (e.key === "ArrowRight" && i < size - 1) {
      refs.current[i + 1]?.current?.focus();
    } else if (e.key === "Backspace") {
      e.preventDefault();

      setArrayValue((prev) => {
        const result = [...prev];

        // Shift left from i+1 to end
        for (let j = i; j < size - 1; j++) {
          result[j] = result[j + 1];
        }
        // Clear last item
        result[size - 1] = "";

        // Call onChange in effect (see below)
        return result;
      });

      // Move focus logically
      if (i > 0) {
        refs.current[i - 1]?.current?.focus();
      } else {
        refs.current[i]?.current?.focus();
      }
    } else if (e.key === "Delete") {
      e.preventDefault();
      handleChange("", i);
    }
  };

  const handleChange = (char: string, index: number) => {
    setArrayValue((prev) => {
      const result = [...prev];
      if (char === "") {
        result[index] = "";
      } else {
        for (let j = size - 1; j > index; j--) {
          result[j] = result[j - 1];
        }
        result[index] = char;
      }
      return result;
    });
  };
  useEffect(() => {
    onChange(arrayValue.join(""));
  }, [arrayValue, onChange]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const inputVal = e.currentTarget.value;
    if (!inputVal) return;

    const prevChar = arrayValue[i];
    let char = "";

    if (onlyNumber) {
      const filtered = numberMask(inputVal);
      if (filtered.length > 0) {
        char = filtered[filtered.length - 1];
      }
    } else {
      char = inputVal[inputVal.length - 1];
    }

    if (!char || char === prevChar) return;

    handleChange(char, i);

    // Move focus to next input if any
    if (i < size - 1) {
      refs.current[i + 1]?.current?.focus();
    }
  };

  return (
    <div className={`${className ?? ""} input-group`} style={style}>
      {arrayValue.map((val, i) => (
        <div key={i} className="input-container">
          <input
            className="input-box"
            type={type}
            value={val ?? ""}
            ref={refs.current[i]}
            onChange={(e) => handleInput(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        </div>
      ))}
    </div>
  );
}
