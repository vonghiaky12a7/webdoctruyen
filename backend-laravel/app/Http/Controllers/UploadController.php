<?php

namespace App\Http\Controllers;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function uploadMultipleImages(Request $request)
{
    try {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|max:10240'
        ]);

        $uploadedImages = [];
        $files = $request->file('images');

        foreach ($files as $file) {
            // Lấy tên file từ formData (customFileName)
            $originalFileName = $file->getClientOriginalName();
            $fileNameWithoutExtension = pathinfo($originalFileName, PATHINFO_FILENAME);

            // Ví dụ: "MyStory_Chapter_1_image1" → tách tên truyện và số chương
            preg_match('/^(.*?)_Chapter_([0-9]+)_/', $fileNameWithoutExtension, $matches);

            $storyName = $matches[1] ?? 'unknown_story';
            $chapterNumber = $matches[2] ?? '0';

            // Tạo folder động theo tên truyện và số chương
            $folderPath = "listmanga/{$storyName}/chapters/{$chapterNumber}";

            // Upload lên Cloudinary
            $result = Cloudinary::upload($file->getRealPath(), [
                'folder' => $folderPath,
                'public_id' => $fileNameWithoutExtension,
                'transformation' => [
                    'quality' => 'auto',
                    'fetch_format' => 'auto'
                ]
            ]);

            $uploadedImages[] = [
                'url' => $result->getSecurePath(),
                'public_id' => $result->getPublicId()
            ];
        }

        return response()->json([
            'success' => true,
            'images' => $uploadedImages,
            'message' => 'Upload nhiều ảnh thành công'
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Lỗi khi upload ảnh: ' . $e->getMessage()
        ], 500);
    }
}


    // Upload một ảnh
    public function uploadSingleImage(Request $request)
{
    try {
        $request->validate([
            'image' => 'required|image|max:10240',
            'type' => 'required|string|in:avatar,background', // chỉ chấp nhận avatar hoặc background
            'story_name' => 'required_if:type,background|string|max:255' 
        ]);

        $uploadedFile = $request->file('image');
        $type = $request->input('type');
        $storyName = $request->input('story_name');

        // Đặt folder tương ứng
        $folder = match ($type) {
            'avatar' => 'avatars',
            'background' => 'listmanga/' . $storyName .'/background', // Đường dẫn cho background
            default => 'uploads/others'
        };

        $result = Cloudinary::upload($uploadedFile->getRealPath(), [
            'folder' => $folder,
            'transformation' => [
                'quality' => 'auto',
                'fetch_format' => 'auto'
            ]
        ]);

        return response()->json([
            'success' => true,
            'url' => $result->getSecurePath(),
            'public_id' => $result->getPublicId(),
            'message' => 'Upload ảnh thành công'
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Lỗi khi upload ảnh: ' . $e->getMessage()
        ], 500);
    }
}

public function deleteImage(Request $request)
{
    try {
        $request->validate([
            'publicId' => 'required|string'
        ]);

        $publicId = $request->input('publicId');
        \Log::info("public_id to be deleted: " . $publicId);

        $response = Cloudinary::destroy($publicId);
        \Log::info("Cloudinary response: " . json_encode($response));

        return response()->json([
            'success' => true,
            'message' => 'Xóa ảnh thành công'
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Lỗi khi xóa ảnh: ' . $e->getMessage()
        ], 500);
    }
}




}