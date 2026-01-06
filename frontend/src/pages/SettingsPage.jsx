import ChangePasswordForm from "../components/ChangePasswordForm";
import SettingsForm from "../components/SettingsForm";
import Title from "../components/Title";
import useStore from "../store";

/**
 * Trang Cài đặt (Settings Page)
 * Hiển thị thông tin cá nhân và form cập nhật cài đặt người dùng.
 */
const SettingsPage = () => {
  // Lấy thông tin người dùng từ store toàn cục
  const { user } = useStore((state) => state);

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen">
      <div className="bg-gray-50 shadow-lg mx-auto my-6 md:my-10 px-4 md:px-10 py-4 w-full max-w-4xl">
        {/* Phần tiêu đề cài đặt chung */}
        <div className="mt-6 border-gray-200 border-b-2">
          <Title title="Cài đặt chung" />
        </div>

        <div className="py-10">
          {/* Thông tin hồ sơ người dùng */}
          <p className="font-bold text-black text-lg">Thông tin hồ sơ</p>

          <div className="flex items-center gap-4 my-8">
            {/* Avatar hiển thị chữ cái đầu của tên */}
            <div className="flex justify-center items-center bg-violet-600 rounded-full w-12 h-12 font-bold text-white text-2xl cursor-pointer">
              <p>{user?.firstname?.charAt(0)}</p>
            </div>

            {/* Hiển thị đầy đủ Họ và Tên */}
            <p className="font-semibold text-black text-2xl">
              {user?.firstname} {user?.lastname}
            </p>
          </div>

          {/* Form cài đặt chi tiết */}
          <SettingsForm />
          {!user?.provider && <ChangePasswordForm />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
