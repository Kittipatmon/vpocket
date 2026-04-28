<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\Category;

class DashboardController extends Controller
{
    protected $financeService;

    public function __construct(\App\Services\FinanceService $financeService)
    {
        $this->financeService = $financeService;
    }

    public function index()
    {
        $data = $this->financeService->getDashboardData(auth()->user());

        return Inertia::render('Dashboard', $data);
    }
}
