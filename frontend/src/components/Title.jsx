// Thành phần hiển thị tiêu đề nhỏ cho các khối nội dung
const Title = ({ title }) => {
  return (
    <p className="mb-5 font-semibold text-gray-600 text-2xl 2xl:text-3xl">
      {title}
    </p>
  );
};

export default Title;
