import axios from "axios";

const upload = async (file) => {
  try {
    // Step 1: Get signature from backend
    const sigRes = await axios.post("http://localhost:8800/api/cloudinary/generate-signature", {
      folder: "fiverr",
    });

    const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data;

    // Step 2: Upload to Cloudinary with signature
    const data = new FormData();
    data.append("file", file);
    data.append("api_key", apiKey);
    data.append("timestamp", timestamp);
    data.append("signature", signature);
    data.append("folder", folder);

    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/dltgogmvl/image/upload`,
      data
    );

    const { url } = uploadRes.data;
    return url;

  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    throw err;
  }
};

export default upload;
