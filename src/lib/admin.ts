import { supabase } from './supabase'
import type { Song } from './supabase'

export interface MusicUpload {
  file: File
  name: string
  artist: string
  cover?: File
}

export const adminHelpers = {
  // Check if current user is admin (you can customize this logic)
  isAdmin: (userEmail?: string): boolean => {
    // Add your admin email(s) here
    const adminEmails = [
      'ilyastorunn@outlook.com', // Replace with your actual email
      // Add more admin emails if needed
    ]
    return userEmail ? adminEmails.includes(userEmail.toLowerCase()) : false
  },

  // Upload music file to storage (using authenticated user)
  async uploadMusicFile(file: File, fileName: string): Promise<string> {
    // Check if user is authenticated and admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !this.isAdmin(user.email)) {
      throw new Error('Unauthorized: Admin access required')
    }

    const fileExt = file.name.split('.').pop()
    const filePath = `${fileName}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('songs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('Storage upload error:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('songs')
      .getPublicUrl(filePath)
    
    return urlData.publicUrl
  },

  // Upload cover image to storage (using authenticated user)
  async uploadCoverImage(file: File, fileName: string): Promise<string> {
    // Check if user is authenticated and admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !this.isAdmin(user.email)) {
      throw new Error('Unauthorized: Admin access required')
    }

    const fileExt = file.name.split('.').pop()
    const filePath = `${fileName}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('covers')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('Storage upload error:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('covers')
      .getPublicUrl(filePath)
    
    return urlData.publicUrl
  },

  // Get audio duration from file
  async getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      const url = URL.createObjectURL(file)
      
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url)
        resolve(Math.round(audio.duration))
      }
      
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load audio metadata'))
      }
      
      audio.src = url
    })
  },

  // Add song to database (using authenticated admin user)
  async addSong(songData: {
    name: string
    artist: string
    duration: number
    file_url: string
    cover_url?: string
  }): Promise<Song> {
    // Check if user is authenticated and admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !this.isAdmin(user.email)) {
      throw new Error('Unauthorized: Admin access required')
    }

    const { data, error } = await supabase
      .from('songs')
      .insert(songData)
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      throw new Error(`Failed to save song: ${error.message}`)
    }
    return data
  },

  // Get all songs
  async getAllSongs(): Promise<Song[]> {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Delete song (admin only)
  async deleteSong(songId: string): Promise<void> {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!serviceRoleKey) {
      throw new Error('Service role key not configured')
    }

    const { createClient } = await import('@supabase/supabase-js')
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    )

    const { error } = await serviceSupabase
      .from('songs')
      .delete()
      .eq('id', songId)

    if (error) throw error
  },

  // Complete music upload process
  async uploadMusic({
    file,
    name,
    artist,
    cover
  }: MusicUpload): Promise<Song> {
    try {
      // Get audio duration
      const duration = await this.getAudioDuration(file)
      
      // Generate unique filename
      const timestamp = Date.now()
      const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
      const fileName = `${sanitizedName}_${timestamp}`
      
      // Upload music file
      const fileUrl = await this.uploadMusicFile(file, fileName)
      
      // Upload cover if provided
      let coverUrl: string | undefined
      if (cover) {
        coverUrl = await this.uploadCoverImage(cover, `${fileName}_cover`)
      }
      
      // Add to database
      const song = await this.addSong({
        name,
        artist,
        duration,
        file_url: fileUrl,
        cover_url: coverUrl
      })
      
      return song
    } catch (error) {
      console.error('Music upload error:', error)
      throw error
    }
  }
}
