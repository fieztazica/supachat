import { useRef } from "react";
const useFocus = () => {
  const htmlElRef = useRef<HTMLElement>(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};
export default useFocus
