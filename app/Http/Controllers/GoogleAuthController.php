<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Google\Client;
use Google\Service\Drive;
use Illuminate\Support\Facades\Log;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')
            ->scopes([
                'openid', 
                'profile', 
                'email', 
                Drive::DRIVE_FILE
            ])
            ->with(['access_type' => 'offline', 'prompt' => 'consent'])
            ->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $user = User::where('google_id', $googleUser->id)
                ->orWhere('email', $googleUser->email)
                ->first();

            if (!$user) {
                // Create new user if not exists
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'password' => bcrypt(\Illuminate\Support\Str::random(16)),
                ]);
            }

            // Update tokens
            $user->update([
                'google_id' => $googleUser->id,
                'google_token' => $googleUser->token,
                'google_refresh_token' => $googleUser->refreshToken ?? $user->google_refresh_token,
            ]);

            Auth::login($user);

            // Ensure Vpocket folder exists in Drive
            $this->ensureDriveFolder($user);

            return redirect()->route('dashboard')->with('success', 'เชื่อมต่อ Google Account เรียบร้อยแล้ว');
        } catch (\Exception $e) {
            Log::error('Google Auth Error: ' . $e->getMessage());
            return redirect()->route('login')->with('error', 'การเชื่อมต่อผิดพลาด: ' . $e->getMessage());
        }
    }

    private function ensureDriveFolder(User $user)
    {
        if ($user->google_drive_folder_id) return;

        $client = new Client();
        $client->setAccessToken($user->google_token);

        $driveService = new Drive($client);
        
        // Search for existing folder
        $query = "name = 'Vpocket' and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
        $results = $driveService->files->listFiles(['q' => $query]);

        if (count($results->getFiles()) > 0) {
            $folder = $results->getFiles()[0];
            $user->update(['google_drive_folder_id' => $folder->id]);
        } else {
            // Create new folder
            $fileMetadata = new Drive\DriveFile([
                'name' => 'Vpocket',
                'mimeType' => 'application/vnd.google-apps.folder'
            ]);
            $folder = $driveService->files->create($fileMetadata, ['fields' => 'id']);
            $user->update(['google_drive_folder_id' => $folder->id]);
        }
    }
}
