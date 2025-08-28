"use client";

import { useState, useRef } from "react";
import { adminHelpers } from "@/lib/admin";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Music, X, CheckCircle, AlertCircle } from "lucide-react";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

export function MusicUpload() {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    artist: "",
    file: null as File | null,
    cover: null as File | null,
  });
  
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
  });

  // Check if user is admin
  const isAdmin = adminHelpers.isAdmin(user?.email);

  if (!isAdmin) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-500" size={24} />
          <div>
            <h3 className="font-semibold text-red-800">Access Denied</h3>
            <p className="text-red-600">You don&apos;t have permission to upload music.</p>
          </div>
        </div>
      </Card>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
      if (!validTypes.includes(file.type)) {
        setUploadState(prev => ({
          ...prev,
          error: 'Please select a valid audio file (MP3, WAV, OGG)'
        }));
        return;
      }
      
      setFormData(prev => ({ ...prev, file }));
      setUploadState(prev => ({ ...prev, error: null }));
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadState(prev => ({
          ...prev,
          error: 'Please select a valid image file (JPG, PNG, WebP)'
        }));
        return;
      }
      
      setFormData(prev => ({ ...prev, cover: file }));
      setUploadState(prev => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.artist || !formData.file) {
      setUploadState(prev => ({
        ...prev,
        error: 'Please fill in all required fields and select an audio file'
      }));
      return;
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      success: false,
    });

    try {
      await adminHelpers.uploadMusic({
        file: formData.file,
        name: formData.name,
        artist: formData.artist,
        cover: formData.cover || undefined,
      });

      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        success: true,
      });

      // Reset form
      setFormData({
        name: "",
        artist: "",
        file: null,
        cover: null,
      });
      
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (coverInputRef.current) coverInputRef.current.value = "";

      // Hide success message after 3 seconds
      setTimeout(() => {
        setUploadState(prev => ({ ...prev, success: false }));
      }, 3000);

    } catch (error: unknown) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Upload failed. Please try again.',
        success: false,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      artist: "",
      file: null,
      cover: null,
    });
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  return (
    <Card 
      className="p-6 border-none shadow-2xl bg-transparent"
      style={{
        backgroundColor: 'rgba(234, 234, 242, 0.3)',
        backdropFilter: 'blur(10px)',
        borderRadius: '50px',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Music className="text-[#15142F]" size={24} />
        <h2 
          style={{
            fontFamily: 'var(--font-comfortaa)',
            fontSize: '24px',
            color: '#15142F',
            fontWeight: '600',
          }}
        >
          Upload Music
        </h2>
      </div>

      {uploadState.success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="text-green-500" size={20} />
          <span className="text-green-800 font-medium">Music uploaded successfully!</span>
        </div>
      )}

      {uploadState.error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-500" size={20} />
          <span className="text-red-800">{uploadState.error}</span>
          <button
            onClick={() => setUploadState(prev => ({ ...prev, error: null }))}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Song Name */}
        <div>
          <label 
            style={{
              fontFamily: 'var(--font-comfortaa)',
              fontSize: '16px',
              color: '#15142F',
              fontWeight: '500',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            Song Name *
          </label>
          <Input
            type="text"
            placeholder="Enter song name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={uploadState.isUploading}
            style={{
              backgroundColor: 'rgba(217, 217, 217, 0.9)',
              borderRadius: '25px',
              border: 'none',
              padding: '12px 20px',
              fontFamily: 'var(--font-comfortaa)',
              color: '#15142F',
            }}
          />
        </div>

        {/* Artist Name */}
        <div>
          <label 
            style={{
              fontFamily: 'var(--font-comfortaa)',
              fontSize: '16px',
              color: '#15142F',
              fontWeight: '500',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            Artist Name *
          </label>
          <Input
            type="text"
            placeholder="Enter artist name"
            value={formData.artist}
            onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
            disabled={uploadState.isUploading}
            style={{
              backgroundColor: 'rgba(217, 217, 217, 0.9)',
              borderRadius: '25px',
              border: 'none',
              padding: '12px 20px',
              fontFamily: 'var(--font-comfortaa)',
              color: '#15142F',
            }}
          />
        </div>

        {/* Audio File Upload */}
        <div>
          <label 
            style={{
              fontFamily: 'var(--font-comfortaa)',
              fontSize: '16px',
              color: '#15142F',
              fontWeight: '500',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            Audio File * {formData.file && `(${formData.file.name})`}
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-600" style={{ fontFamily: 'var(--font-comfortaa)' }}>
              Click to select audio file
            </p>
            <p className="text-sm text-gray-500 mt-1">MP3, WAV, OGG supported</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            disabled={uploadState.isUploading}
            className="hidden"
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <label 
            style={{
              fontFamily: 'var(--font-comfortaa)',
              fontSize: '16px',
              color: '#15142F',
              fontWeight: '500',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            Cover Image (Optional) {formData.cover && `(${formData.cover.name})`}
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => coverInputRef.current?.click()}
          >
            <Upload className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'var(--font-comfortaa)' }}>
              Click to select cover image
            </p>
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverSelect}
            disabled={uploadState.isUploading}
            className="hidden"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={uploadState.isUploading}
            style={{
              backgroundColor: 'rgba(234, 234, 242, 0.3)',
              borderRadius: '25px',
              padding: '12px 24px',
              fontFamily: 'var(--font-comfortaa)',
              color: '#15142F',
              border: '1px solid rgba(21, 20, 47, 0.2)',
            }}
          >
            Reset
          </Button>
          
          <Button
            type="submit"
            disabled={uploadState.isUploading || !formData.name || !formData.artist || !formData.file}
            style={{
              backgroundColor: '#4A90E2',
              borderRadius: '25px',
              padding: '12px 24px',
              fontFamily: 'var(--font-comfortaa)',
              color: 'white',
              border: 'none',
            }}
          >
            {uploadState.isUploading ? 'Uploading...' : 'Upload Music'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
