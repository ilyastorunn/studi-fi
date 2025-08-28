"use client";

import { Suspense } from "react";
import { Background } from "@/components/Layout/Background";
import { Header } from "@/components/Layout/Header";
import { MusicUpload } from "@/components/Admin/MusicUpload";

export default function AdminPage() {
  return (
    <div className="min-h-screen relative">
      <Background />
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>
      
      <main className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 
              style={{
                fontFamily: 'var(--font-comfortaa)',
                fontSize: '32px',
                color: '#15142F',
                fontWeight: '700',
                marginBottom: '12px',
              }}
            >
              Admin Panel
            </h1>
            <p 
              style={{
                fontFamily: 'var(--font-comfortaa)',
                fontSize: '18px',
                color: '#15142F',
                fontWeight: '400',
              }}
            >
              Manage studi-fi music library
            </p>
          </div>

          <MusicUpload />
        </div>
      </main>
    </div>
  );
}
