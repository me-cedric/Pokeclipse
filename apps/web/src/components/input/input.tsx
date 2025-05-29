import { useEffect, useRef, useState } from "react";
import "./input.css";

interface InputProps {
  value: string;
  size?: number;
  type?: "text" | "password" | "number" | "tel";
  isConfirmInput?: boolean;
  onlyNumber?: boolean;
  onChange: (value: string) => void;
}

const numberMask = (num: string): string => num.replace(/\D/g, "");

const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  i: number,
  size: number,
  isConfirmInput: boolean,
  arrayValue: string[],
  refs: React.RefObject<HTMLInputElement | null>[],
  handleChange: (char: string, index: number) => void
): void => {
  if (e.key === "ArrowLeft" && i > 0) {
    refs[(isConfirmInput ? i + size : i) - 1].current?.focus();
  } else if (e.key === "ArrowRight" && i < size - 1) {
    refs[(isConfirmInput ? i + size : i) + 1].current?.focus();
  } else if (
    (e.key === "Backspace" || e.key === "Delete") &&
    i > 0 &&
    (!arrayValue[i] || arrayValue[i] === "")
  ) {
    handleChange("", i - 1);
    refs[(isConfirmInput ? i + size : i) - 1].current?.focus();
  }
  if (e.key === "Delete" || (e.key === "Backspace" && arrayValue[i])) {
    handleChange("", i);
  }
};

const handleInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  i: number,
  size: number,
  isConfirmInput: boolean,
  arrayValue: string[],
  onlyNumber: boolean,
  refs: React.RefObject<HTMLInputElement | null>[],
  handleChange: (char: string, index: number) => void
): void => {
  let targetValue = "";
  let focusNext = true;

  if (e.currentTarget.value && arrayValue[i]) {
    if (onlyNumber && numberMask(e.currentTarget.value).length < 2) {
      focusNext = false;
    }
    const values = Object.values(
      onlyNumber ? numberMask(e.currentTarget.value) : e.currentTarget.value
    );
    for (const j of values) {
      if (j !== arrayValue[i]) {
        e.currentTarget.value = j;
        break;
      }
    }
    if (
      e.currentTarget.value.length > 1 &&
      ((onlyNumber && numberMask(e.currentTarget.value[0])) || !onlyNumber)
    ) {
      e.currentTarget.value = e.currentTarget.value[0];
    }
  }
  if (e.currentTarget.value) {
    targetValue =
      (onlyNumber
        ? numberMask(e.currentTarget.value)
        : e.currentTarget.value) || "";
    if (targetValue && i < size - 1 && focusNext) {
      refs[(isConfirmInput ? i + size : i) + 1].current?.focus();
    }
  } else if (!arrayValue[i] && i > 0) {
    refs[(isConfirmInput ? i + size : i) - 1].current?.focus();
  }
  handleChange(targetValue || " ", i);
};

const convertValueToArray = (size: number, value: string): string[] => {
  const stringToArray: string[] = [];

  for (let i = 0; i < size; i++) {
    if (i + 1 <= value.length) {
      stringToArray[i] = value[i];
    } else {
      stringToArray[i] = "";
    }
  }

  return stringToArray;
};

const initArray = (arrayValue: string[], size: number) => {
  for (let i = 0; i < size; i++) {
    arrayValue.push("");
  }
};

/**
 * InputBox component for handling multiple input fields.
 * @example
 * const [value, setValue] = useState("");
 * const onChange = (newValue: string) => {
 *   if (newValue && newValue !== value) {
 *     setValue(newValue);
 *   }
 * };
 * <InputBox
 *   value={value}
 *   size={6}
 *   type="text"
 *   isConfirmInput={false}
 *   onlyNumber={false}
 *   onChange={(newValue) => onChange(newValue)}
 * />
 */
export default function InputBox({
  value,
  size,
  type,
  isConfirmInput,
  onlyNumber,
  onChange,
}: InputProps) {
  if (!size) {
    size = 10;
  }
  const [arrayValue, setArrayValue] = useState<string[]>([]);

  useEffect(() => {
    if (arrayValue.length === 0) {
      console.log("init array");
      initArray(arrayValue, size);
    }
  }, [arrayValue, size]);

  useEffect(() => {
    if (arrayValue.length === 0 && value && value.length === size) {
      console.log("init array with value");
      setArrayValue(convertValueToArray(size, value));
    }
  }, [arrayValue.length, size, value]);

  const renderInputs = () => {
    const items = [];
    const refs: React.RefObject<HTMLInputElement | null>[] = [];
    for (let i = 0; i < size; i++) {
      const inputRef = useRef<HTMLInputElement>(null);
      refs.push(inputRef);
      items.push(
        <input
          className="input-box"
          key={i}
          type={type ?? "text"}
          value={arrayValue[i] && arrayValue[i] !== " " ? arrayValue[i] : ""}
          onChange={(e) =>
            handleInput(
              e,
              i,
              size,
              isConfirmInput || false,
              arrayValue,
              onlyNumber || false,
              refs,
              handleChange
            )
          }
          onKeyDown={(e) =>
            handleKeyDown(
              e,
              i,
              size,
              isConfirmInput || false,
              arrayValue,
              refs,
              handleChange
            )
          }
          ref={refs[i]}
        />
      );
    }
    return items.map((item, index) => {
      const key = `${arrayValue[index] ?? ""}-${index}`;
      return (
        <div key={key} className="input-container">
          {item}
        </div>
      );
    });
  };

  const handleChange = (char: string, index: number) => {
    const result = arrayValue;
    result[index] = char;
    setArrayValue(result);
    onChange(result.join(""));
  };

  return <div className="input-group">{renderInputs()}</div>;
}
