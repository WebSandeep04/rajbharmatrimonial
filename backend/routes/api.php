<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\Admin\MasterDataController;

Route::post('/auth/google-login', [AuthController::class, 'googleLogin']);

Route::post('/admin/login', [AdminAuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    
    // Admin routes
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
    Route::get('/admin/users', [\App\Http\Controllers\Api\Admin\UserController::class, 'index']);
    Route::post('/admin/users', [\App\Http\Controllers\Api\Admin\UserController::class, 'store']);
    Route::put('/admin/users/{id}', [\App\Http\Controllers\Api\Admin\UserController::class, 'update']);
    Route::patch('/admin/users/{id}/status', [\App\Http\Controllers\Api\Admin\UserController::class, 'toggleStatus']);
    
    // Master Data Management
    Route::apiResource('/admin/masters/{type}', MasterDataController::class)->except(['show']);
});
