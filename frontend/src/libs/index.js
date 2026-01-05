import { v4 as uuidv4 } from "uuid";

// Hàm ẩn một phần số tài khoản (ví dụ: 1234********5678)
export const maskAccountNumber = (accountNumber) => {
  if (typeof accountNumber !== "string" || accountNumber.length < 12) {
    return accountNumber;
  }

  const firstFour = accountNumber.substring(0, 4);
  const lastFour = accountNumber.substring(accountNumber.length - 4);

  const maskedDigits = "*".repeat(accountNumber.length - 8);

  return `${firstFour}${maskedDigits}${lastFour}`;
};

// Hàm định dạng số tiền theo tiền tệ (mặc định là VND cho người Việt)
export const formatCurrency = (value) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (Number.isNaN(value)) {
    return "Giá trị không hợp lệ";
  }

  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  // Sử dụng locale vi-VN để hiển thị định dạng tiền Việt (ví dụ: 100.000 ₫)
  return new Intl.NumberFormat("vi-VN", {
    currency: user?.currency || "VND",
    style: "currency",
  }).format(numberValue);
};

// Hàm lấy ngày của 7 ngày trước (định dạng YYYY-MM-DD)
export const getDateSevenDaysAgo = () => {
  const today = new Date();

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  return sevenDaysAgo.toISOString().split("T")[0];
};

// Hàm lấy danh sách quốc gia và tiền tệ từ API bên ngoài
export async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();

    if (response.ok) {
      const countries = data.map((country) => {
        const currencies = country.currencies || {};
        const currencyCode = Object.keys(currencies)[0];

        return {
          country: country.name?.common || "",
          currency: currencyCode || "",
          flag: country.flags?.png || "",
        };
      });

      const sortedCountries = countries.sort((a, b) =>
        a.country.localeCompare(b.country),
      );

      return sortedCountries;
    } else {
      console.error(`Error: ${data.message}`);
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    return [];
  }
}

// Hàm tạo số tài khoản ngẫu nhiên
export function generateAccountNumber() {
  let accountNumber = "";
  while (accountNumber.length < 13) {
    const uuid = uuidv4().replace(/-/g, "");
    accountNumber += uuid.replace(/\D/g, "");
  }
  return accountNumber.substr(0, 13);
}
