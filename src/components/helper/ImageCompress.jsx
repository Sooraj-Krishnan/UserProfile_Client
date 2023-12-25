import imageCompression from "browser-image-compression";

async function HandleImageUpload(event) {
  const imageFile = event[0]?.originFileObj;

  const options = {
    maxSizeMB: 0.5,
    fileType: "image/webp",
    maxWidthOrHeight: 1920,
  };
  try {
    const compressedFile = await imageCompression(imageFile, options);

    return compressedFile;
  } catch (error) {
    console.log(error);
  }
}

export default HandleImageUpload;
