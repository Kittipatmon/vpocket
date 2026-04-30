<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/auth/google', [\App\Http\Controllers\GoogleAuthController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [\App\Http\Controllers\GoogleAuthController::class, 'callback'])->name('google.callback');

use App\Http\Controllers\DashboardController;

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/goal', [ProfileController::class, 'updateGoal'])->name('profile.goal.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/accounts', [\App\Http\Controllers\AccountController::class, 'store'])->name('accounts.store');
    Route::patch('/accounts/{account}', [\App\Http\Controllers\AccountController::class, 'update'])->name('accounts.update');
    Route::delete('/accounts/{account}', [\App\Http\Controllers\AccountController::class, 'destroy'])->name('accounts.destroy');
    
    Route::post('/transactions', [\App\Http\Controllers\TransactionController::class, 'store'])->name('transactions.store');
    Route::delete('/transactions/bulk', [\App\Http\Controllers\TransactionController::class, 'bulkDestroy'])->name('transactions.bulk-destroy');
    Route::patch('/transactions/{transaction}', [\App\Http\Controllers\TransactionController::class, 'update'])->name('transactions.update');
    Route::resource('transactions', \App\Http\Controllers\TransactionController::class)->only(['store', 'update', 'destroy']);

    Route::get('/categories', [\App\Http\Controllers\CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [\App\Http\Controllers\CategoryController::class, 'store'])->name('categories.store');
    Route::patch('/categories/{category}', [\App\Http\Controllers\CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [\App\Http\Controllers\CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::post('/wallet-types', [\App\Http\Controllers\WalletTypeController::class, 'store'])->name('wallet-types.store');
    Route::patch('/wallet-types/{walletType}', [\App\Http\Controllers\WalletTypeController::class, 'update'])->name('wallet-types.update');
    Route::delete('/wallet-types/{walletType}', [\App\Http\Controllers\WalletTypeController::class, 'destroy'])->name('wallet-types.destroy');

    Route::post('/goals', [\App\Http\Controllers\GoalController::class, 'store'])->name('goals.store');
    Route::patch('/goals/{goal}', [\App\Http\Controllers\GoalController::class, 'update'])->name('goals.update');
    Route::delete('/goals/{goal}', [\App\Http\Controllers\GoalController::class, 'destroy'])->name('goals.destroy');

    Route::get('/accounts', [\App\Http\Controllers\AccountManagementController::class, 'index'])->name('accounts.index');
    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
    Route::get('/market', [\App\Http\Controllers\MarketController::class, 'index'])->name('market.index');
    Route::get('/analytics', [\App\Http\Controllers\AnalyticsController::class, 'index'])->name('analytics.index');

    Route::post('/ocr/scan', [\App\Http\Controllers\OcrController::class, 'scan'])->name('ocr.scan');
});

require __DIR__.'/auth.php';
