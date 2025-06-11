import axios from "axios";
import imageUrl from "../assets/bonus.jpg";

export const uploadFiles = async (
  files: (File | null)[],
  uploadUrl: string
) => {
  const formData = new FormData();

  files.forEach((file, index) => {
    if (file) {
      const fieldName = `file${index + 1}`;
      formData.append(fieldName, file);
    }
  });

  try {
    const response = await axios.post(uploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Сервер вернул:", response.data);
    return response.data;
  } catch (err) {
    console.error("Ошибка при загрузке файлов:", err);
    throw err;
  }
};

export async function makeFileFromLocalAsset(): Promise<File> {
  // Делаем GET-запрос через axios, указывая responseType: 'blob'
  const response = await axios.get<Blob>(imageUrl, {
    responseType: "blob",
  });

  const blob = response.data; // это уже Blob

  // Создаём объект File на основе полученного Blob
  return new File([blob], "banner", { type: blob.type });
}
