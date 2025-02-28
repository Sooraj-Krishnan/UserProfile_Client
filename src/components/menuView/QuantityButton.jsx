import PropTypes from "prop-types";

import { incrementQuantity, decrementQuantity } from "./MenuFunction";

const QuantitySelector = ({
  itemId,
  queryClient,
  id,
  setLocalMenuData,
  quantity,
}) => (
  <form className="max-w-xs mx-auto">
    {/* <label
      htmlFor="quantity-input"
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Choose quantity:
    </label> */}
    <div className="relative flex items-center max-w-[11rem]  border border-gray-300 rounded-lg">
      <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
        <svg
          className="w-2.5 h-2.5 text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.333 6.764a3 3 0 1 1 3.141-5.023M2.5 16H1v-2a4 4 0 0 1 4-4m7.379-8.121a3 3 0 1 1 2.976 5M15 10a4 4 0 0 1 4 4v2h-1.761M13 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-4 6h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z"
          />
        </svg>
        <span>Quantity</span>
      </div>
      <button
        type="button"
        id="decrement-button"
        data-input-counter-decrement="quantity-input"
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
        onClick={() =>
          decrementQuantity(itemId, queryClient, id, setLocalMenuData)
        }
      >
        <svg
          className="w-3 h-3 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 2"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h16"
          />
        </svg>
      </button>
      <input
        type="text"
        id="quantity-input"
        data-input-counter
        data-input-counter-min="1"
        data-input-counter-max="5"
        aria-describedby="helper-text-explanation"
        className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={quantity}
        readOnly
      />
      <button
        type="button"
        id="increment-button"
        data-input-counter-increment="quantity-input"
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
        onClick={() =>
          incrementQuantity(itemId, queryClient, id, setLocalMenuData)
        }
      >
        <svg
          className="w-3 h-3 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
      </button>
    </div>
    <p
      id="helper-text-explanation"
      className="mt-2 text-sm text-gray-500 dark:text-gray-400"
    >
      Please select the quantity.
    </p>
  </form>
);

export default QuantitySelector;

QuantitySelector.propTypes = {
  itemId: PropTypes.string.isRequired,
  queryClient: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  setLocalMenuData: PropTypes.func.isRequired,
  quantity: PropTypes.number.isRequired,
};
