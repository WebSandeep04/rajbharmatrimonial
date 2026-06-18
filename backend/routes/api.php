<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminAuthController as AdminAdminAuthController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/auth/google-login', [AuthController::class, 'googleLogin']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::get('/matches', [\App\Http\Controllers\Api\MatchController::class, 'getRecommendedMatches']);
    Route::get('/users/{id}', [\App\Http\Controllers\Api\MatchController::class, 'getUserProfile']);
});

Route::get('/master-data', [\App\Http\Controllers\Api\MasterDataController::class, 'all']);

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAdminAuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'ability:admin'])->group(function () {
        Route::post('/logout', [AdminAdminAuthController::class, 'logout']);
        Route::get('/me', [AdminAdminAuthController::class, 'me']);
        
        // User Management
        Route::apiResource('users', AdminUserController::class)->except(['destroy', 'show']);
        Route::patch('users/{id}/status', [AdminUserController::class, 'toggleStatus']);
        
        // Master Data Management
        Route::apiResource('religion-masters', \App\Http\Controllers\Api\Admin\ReligionMasterController::class)->except(['show']);
        Route::apiResource('caste-masters', \App\Http\Controllers\Api\Admin\CasteMasterController::class)->except(['show']);
        Route::apiResource('gotra-masters', \App\Http\Controllers\Api\Admin\GotraMasterController::class)->except(['show']);
        Route::apiResource('nakshatra-masters', \App\Http\Controllers\Api\Admin\NakshatraMasterController::class)->except(['show']);
        Route::apiResource('rashi-masters', \App\Http\Controllers\Api\Admin\RashiMasterController::class)->except(['show']);
        Route::apiResource('state-masters', \App\Http\Controllers\Api\Admin\StateMasterController::class)->except(['show']);
        Route::apiResource('city-masters', \App\Http\Controllers\Api\Admin\CityMasterController::class)->except(['show']);
        Route::apiResource('highest_education-masters', \App\Http\Controllers\Api\Admin\HighestEducationMasterController::class)->except(['show']);
        Route::apiResource('profession-masters', \App\Http\Controllers\Api\Admin\ProfessionMasterController::class)->except(['show']);
        Route::apiResource('income_range-masters', \App\Http\Controllers\Api\Admin\IncomeRangeMasterController::class)->except(['show']);
        Route::apiResource('body_type-masters', \App\Http\Controllers\Api\Admin\BodyTypeMasterController::class)->except(['show']);
        Route::apiResource('complexion-masters', \App\Http\Controllers\Api\Admin\ComplexionMasterController::class)->except(['show']);
        Route::apiResource('blood_group-masters', \App\Http\Controllers\Api\Admin\BloodGroupMasterController::class)->except(['show']);
        Route::apiResource('diet-masters', \App\Http\Controllers\Api\Admin\DietMasterController::class)->except(['show']);
        Route::apiResource('marital_status-masters', \App\Http\Controllers\Api\Admin\MaritalStatusMasterController::class)->except(['show']);
        Route::apiResource('family_type-masters', \App\Http\Controllers\Api\Admin\FamilyTypeMasterController::class)->except(['show']);
        Route::apiResource('profile_created_for-masters', \App\Http\Controllers\Api\Admin\ProfileCreatedForMasterController::class)->except(['show']);
    });
});
