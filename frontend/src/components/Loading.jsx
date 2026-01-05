import { FaSpinner } from "react-icons/fa";

// Thành phần hiển thị biểu tượng đang tải (Loading Spinner)
const Loading = () => {
  return (
    <div className="flex justify-center items-center py-2 w-full">
      <FaSpinner className="text-violet-600 animate-spin" size={28} />
    </div>
  );
};

export default Loading;
