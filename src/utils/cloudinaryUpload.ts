import cloudinary from "../config/cloudinary";

interface CloudinaryUploadResult {
	secure_url: string;
	public_id: string;
}

export const uploadImageToCloudinary = (
	buffer: Buffer,
	folder = "ecommerce/products",
): Promise<CloudinaryUploadResult> => {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				folder,
				resource_type: "image",
			},
			(error, result) => {
				if (error || !result) {
					reject(error || new Error("Image upload failed"));
					return;
				}

				resolve({
					secure_url: result.secure_url,
					public_id: result.public_id,
				});
			},
		);

		uploadStream.end(buffer);
	});
};

export const deleteImageFromCloudinary = async (publicId: string) => {
	await cloudinary.uploader.destroy(publicId);
};
