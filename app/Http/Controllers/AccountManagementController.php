<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Account;

class AccountManagementController extends Controller
{
    public function index()
    {
        $accounts = Account::where('user_id', auth()->id())->get();
        
        return Inertia::render('Accounts/Index', [
            'accounts' => $accounts
        ]);
    }
}
