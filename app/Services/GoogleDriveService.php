<?php

namespace App\Services;

use App\Models\User;
use Google\Client;
use Google\Service\Drive;
use Illuminate\Support\Facades\Log;

class GoogleDriveService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client();
        $this->client->setClientId(config('services.google.client_id'));
        $this->client->setClientSecret(config('services.google.client_secret'));
    }

    public function uploadSlip(User $user, $filePath, $fileName)
    {
        try {
            $this->client->setAccessToken($user->google_token);

            // Handle token refresh
            if ($this->client->isAccessTokenExpired()) {
                if ($user->google_refresh_token) {
                    $newToken = $this->client->fetchAccessTokenWithRefreshToken($user->google_refresh_token);
                    $user->update(['google_token' => json_encode($newToken)]);
                } else {
                    throw new \Exception('Google access token expired and no refresh token available.');
                }
            }

            $driveService = new Drive($this->client);
            
            $fileMetadata = new Drive\DriveFile([
                'name' => $fileName,
                'parents' => [$user->google_drive_folder_id]
            ]);

            $content = file_get_contents($filePath);
            
            $file = $driveService->files->create($fileMetadata, [
                'data' => $content,
                'mimeType' => 'image/jpeg',
                'uploadType' => 'multipart',
                'fields' => 'id'
            ]);

            return $file->id;
        } catch (\Exception $e) {
            Log::error('Google Drive Upload Error: ' . $e->getMessage());
            return null;
        }
    }
}
