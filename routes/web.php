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
    
    Route::resource('transactions', \App\Http\Controllers\TransactionController::class)->only(['store', 'update', 'destroy']);

    Route::get('/categories', [\App\Http\Controllers\CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [\App\Http\Controllers\CategoryController::class, 'store'])->name('categories.store');
    Route::patch('/categories/{category}', [\App\Http\Controllers\CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [\App\Http\Controllers\CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::post('/wallet-types', [\App\Http\Controllers\WalletTypeController::class, 'store'])->name('wallet-types.store');
    Route::patch('/wallet-types/{walletType}', [\App\Http\Controllers\WalletTypeController::class, 'update'])->name('wallet-types.update');
    Route::delete('/wallet-types/{walletType}', [\App\Http\Controllers\WalletTypeController::class, 'destroy'])->name('wallet-types.destroy');

    Route::get('/accounts', [\App\Http\Controllers\AccountManagementController::class, 'index'])->name('accounts.index');
    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
    Route::get('/analytics', [\App\Http\Controllers\AnalyticsController::class, 'index'])->name('analytics.index');
});

require __DIR__.'/auth.php';
