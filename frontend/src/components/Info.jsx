// Thành phần hiển thị tiêu đề và phụ đề thông tin (thường dùng ở đầu trang)
const Info = ({ title, subTitle }) => {
  return (
    <div className="flex md:flex-row flex-col justify-between md:items-center py-8">
      <div className="mb-6">
        <h1 className="mb-2 font-semibold text-black text-4xl">{title}</h1>
        <span className="text-gray-600">{subTitle}</span>
      </div>
    </div>
  );
};

export default Info;
