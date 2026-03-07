const cloudinary = require('cloudinary').v2

exports.uploadImageToCloudinary = async (file,folder,height,quality)=>{
    const options = {folder}
    if(height){
        options.height = height;
    }
    if(quality)
    {
        options.quality = quality;
    }
    options.resource_type = "auto"
    return await cloudinary.uploader.upload(file.tempFilePath,options)
}


exports.deleteAsset = async (publicId) => {
  try {
    // The 'invalidate: true' parameter ensures the CDN cache is cleared
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};