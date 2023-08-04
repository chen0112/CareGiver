import { Area } from "react-easy-crop";

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Use this line if you're loading images from different domains.
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, crop: Area) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  // Calculate the actual size of the cropped image based on the original image size and the cropping percentage
  const imageWidth = image.naturalWidth;
  const imageHeight = image.naturalHeight;
  const cropX = (crop.x / 100) * imageWidth;
  const cropY = (crop.y / 100) * imageHeight;
  const cropWidth = (crop.width / 100) * imageWidth;
  const cropHeight = (crop.height / 100) * imageHeight;

  // Set the canvas size to the size of the cropped image
  canvas.width = cropWidth;
  canvas.height = cropHeight;

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  // Return the data URL of the cropped image
  return canvas.toDataURL("image/jpeg");
};

export default getCroppedImg;
