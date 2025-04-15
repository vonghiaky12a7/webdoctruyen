<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StoryController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\ReadingProgressController;
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\StoryFavoriteController;
use App\Http\Controllers\StoryCommentController;
use App\Http\Controllers\StoryRatingController;
// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    Route::post('/google', [AuthController::class, 'googleRedirect'])->name('google.redirect');
    Route::get('/google/callback', [AuthController::class, 'googleCallback'])->name('google.callback');
});


Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(
        function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);

        }
    );
    Route::get('/reading-history', [ReadingProgressController::class, 'getReadingHistory']);
    Route::post('/reading-progress', [ReadingProgressController::class, 'updateProgress']);
    Route::get('/reading-progress/{storyId}', [ReadingProgressController::class, 'getProgress']);


    // User routes with admin middleware
    Route::middleware('admin')->prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });
});


Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/upload/single', [UploadController::class, 'uploadSingleImage']);
    Route::post('/upload/multiple', [UploadController::class, 'uploadMultipleImages']);
    Route::post('/upload/delete', [UploadController::class, 'deleteImage']);
});


// Public story routes with rate limiting
Route::prefix('stories')->group(function () {
    Route::get('/', [StoryController::class, 'index']);
    Route::get('/list', [StoryController::class, 'list']);
    Route::get('/top', [StoryController::class, 'top']);
    Route::get('/{storyId}', [StoryController::class, 'show']);
    Route::get('/{storyId}/chapters', [ChapterController::class, 'getChapters']);
    Route::get('/{storyId}/chapter/{chapterId}', [ChapterController::class, 'getChapter']);
    Route::get('/{storyId}/ratings', [StoryRatingController::class, 'getRatings']);
    Route::get('/{storyId}/comments', [StoryCommentController::class, 'getComments']);
});

// Protected story routes
Route::middleware('auth:sanctum')->prefix('stories')->group(function () {
    Route::post('/favorite', [StoryFavoriteController::class, 'addToFavorites']);
    Route::delete('/favorite', [StoryFavoriteController::class, 'removeFromFavorites']);
    Route::get('/favorites/{userId}', [StoryFavoriteController::class, 'getFavorites']);
    Route::post('/favorites/check', [StoryFavoriteController::class, 'checkFavoriteStatus']);
    Route::post('/comment', [StoryCommentController::class, 'addComment']);
    Route::delete('/comments/{commentId}', [StoryCommentController::class, 'destroyById']);
    Route::post('/rating', [StoryRatingController::class, 'addRating']);

    // Admin-only story operations
    Route::middleware('admin')->group(function () {
        Route::post('/', [StoryController::class, 'store']);
        Route::put('/{storyId}', [StoryController::class, 'update']);
        Route::delete('/{storyId}', [StoryController::class, 'destroy']);

        // Chapter admin routes
        Route::post('/{storyId}/chapters', [ChapterController::class, 'storeChapter']);
        Route::put('/{storyId}/chapter/{chapterId}', [ChapterController::class, 'updateChapter']);
        Route::delete('/{storyId}/chapter/{chapterId}', [ChapterController::class, 'destroyChapter']);
    });
});

// Genre routes
Route::prefix('genres')->group(function () {
    Route::get('/', [GenreController::class, 'index']);
    Route::get('/{genreId}', [GenreController::class, 'show']);

    // Admin-only genre operations
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::post('/', [GenreController::class, 'store']);
        Route::put('/{idgenreId}', [GenreController::class, 'update']);
        Route::delete('/{genreId}', [GenreController::class, 'destroy']);
    });
});
