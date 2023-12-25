import { useState } from "react";
import Spinner from "../spinner/Spinner";

function UseSpinner() {
  const [loading, setLoading] = useState(false);

  return [
    loading ? <Spinner /> : null,
    () => setLoading(true), //Show loader
    () => setLoading(false), //Hide Loader
  ];
}

export default UseSpinner;
