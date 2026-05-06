import { useState } from "react";

export default function useToggle(initialValue = false) {
  const [value, setValue] = useState(Boolean(initialValue));

  const toggle = () => setValue((prev) => !prev);

  return { value, toggle, setValue };
}
