import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiCheck, BiLoader } from "react-icons/bi";
import { BsChevronExpand } from "react-icons/bs";
import { toast } from "sonner";
import { fetchCountries } from "../libs";
import api from "../libs/api";
import useStore from "../store";
import { Button } from "./ui/Button";
import Input from "./ui/Input";

const SettingsForm = () => {
  const { user } = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { ...user },
  });

  // State quản lý quốc gia và tiền tệ đã chọn
  const [selectedCountry, setSelectedCountry] = useState({
    country: user?.country,
    currency: user?.currency,
  });
  const [query, setQuery] = useState("");
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Xử lý khi submit form
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const newData = {
        ...values,
        country: selectedCountry.country,
        currency: selectedCountry.currency,
      };
      const { data: res } = await api.put("/user", newData);

      if (res?.user) {
        const newUser = { ...res.user, token: user.token };
        localStorage.setItem("user", JSON.stringify(newUser));
        toast.success(res?.message || "Cập nhật thành công!");
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      toast.error(
        error?.response?.data?.message || "Đã xảy ra lỗi khi cập nhật.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Lọc danh sách quốc gia dựa trên query tìm kiếm
  const filteredCountries =
    query === ""
      ? countriesData
      : countriesData.filter((country) =>
          country.country
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  // Lấy danh sách quốc gia khi component mount
  useEffect(() => {
    const getCountriesList = async () => {
      const data = await fetchCountries();
      setCountriesData(data);
    };
    getCountriesList();
  }, []);

  // Component chọn quốc gia (Combobox)
  const Countries = () => {
    return (
      <div className="w-full">
        <Combobox onChange={setSelectedCountry} value={selectedCountry}>
          <div className="relative mt-1">
            <div>
              <ComboboxInput
                className="inputStyles"
                displayValue={(country) => country?.country}
                onChange={(e) => setQuery(e.target.value)}
              />
              <ComboboxButton className="right-0 absolute inset-y-0 flex items-center pr-2">
                <BsChevronExpand className="text-gray-400" />
              </ComboboxButton>
            </div>
            <Transition
              afterLeave={() => setQuery("")}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ComboboxOptions className="absolute bg-white shadow-lg mt-1 py-1 rounded-md focus:outline-none ring-1 ring-black/5 w-full max-h-60 overflow-auto sm:text-sm text-base">
                {filteredCountries.length === 0 && query !== "" ? (
                  <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                    Không tìm thấy kết quả.
                  </div>
                ) : (
                  filteredCountries?.map((country) => (
                    <ComboboxOption
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-violet-600/20 text-white"
                            : "text-gray-900"
                        }`
                      }
                      key={country.cca2}
                      value={country}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center gap-2">
                            <img
                              alt={country.country}
                              className="rounded-sm w-8 h-5 object-cover"
                              src={country?.flag}
                            />
                            <span
                              className={`block truncate text-gray-700 ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {country?.country}
                            </span>
                          </div>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-teal-600"
                              }`}
                            >
                              <BiCheck aria-hidden="true" className="w-5 h-5" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ComboboxOption>
                  ))
                )}
              </ComboboxOptions>
            </Transition>
          </div>
        </Combobox>
      </div>
    );
  };

  return (
    <form className="space-y-5 w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex md:flex-row flex-col justify-between items-center gap-4">
        <div className="w-full">
          <Input
            disabled={loading}
            error={errors.firstName?.message}
            id="firstname"
            label="Tên"
            placeholder="VD: Nguyễn Văn A"
            type="text"
            {...register("firstname")}
            className="bg-transparent border border-gray-300 outline-none w-full text-gray-700 placeholder:text-gray-400 text-sm"
          />
        </div>
        <div className="w-full">
          <Input
            disabled={loading}
            error={errors.lastName?.message}
            id="lastname"
            label="Họ"
            placeholder="Họ của bạn"
            type="text"
            {...register("lastname")}
            className="bg-transparent border border-gray-300 outline-none w-full text-gray-700 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      <div className="flex md:flex-row flex-col justify-between items-center gap-4">
        <div className="w-full">
          <Input
            disabled={loading}
            error={errors.email?.message}
            id="email"
            label="Địa chỉ Email"
            placeholder="vi-du@email.com"
            type="email"
            {...register("email")}
            className="bg-transparent border border-gray-300 outline-none w-full text-gray-700 placeholder:text-gray-400 text-sm"
          />
        </div>
        <div className="w-full">
          <Input
            disabled={loading}
            error={errors.phone?.message}
            id="contact"
            label="Số điện thoại"
            placeholder="+84 123 456 789"
            type="text"
            {...register("contact")}
            className="bg-transparent border border-gray-300 outline-none w-full text-gray-700 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      <div className="flex md:flex-row flex-col justify-between items-center gap-4">
        <div className="w-full">
          <span className="labelStyles">Quốc gia</span>
          <Countries />
        </div>

        <div className="w-full">
          <span className="labelStyles">Tiền tệ</span>
          <select className="inputStyles">
            <option>{selectedCountry?.currency || user?.country}</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center pb-10 w-full">
        <div>
          <p className="font-semibold text-black text-lg">Ngôn ngữ</p>
          <span className="labelStyles">
            Tùy chỉnh ngôn ngữ bạn muốn sử dụng.
          </span>
        </div>

        <div className="w-28 md:w-40">
          <select className="inputStyles" disabled>
            <option value="Vietnamese">Tiếng Việt</option>
            <option value="English">Tiếng Anh</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end items-center gap-6 pb-10 border-gray-200 border-b-2">
        <Button
          className="bg-transparent px-6 border border-gray-200 text-black"
          loading={loading}
          type="reset"
          variant="outline"
        >
          Đặt lại
        </Button>
        <Button
          className="bg-violet-800 px-8 text-white"
          loading={loading}
          type="submit"
        >
          {loading ? (
            <BiLoader className="text-white animate-spin" />
          ) : (
            "Lưu thay đổi"
          )}
        </Button>
      </div>
    </form>
  );
};

export default SettingsForm;
