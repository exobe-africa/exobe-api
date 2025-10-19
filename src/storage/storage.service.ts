import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface UploadResult {
  publicUrl: string;
  path: string;
}

@Injectable()
export class StorageService {
  private client: SupabaseClient;
  private bucket: string;

  constructor() {
    const url = process.env.SUPABASE_URL as string;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
    const bucket = (process.env.SUPABASE_PUBLIC_BUCKET as string) || 'exobe-assets';
    if (!url || !key) {
      throw new Error('Missing Supabase configuration: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
    }
    this.client = createClient(url, key, { auth: { persistSession: false } });
    this.bucket = bucket;
  }

  async uploadFileFromBuffer(path: string, buffer: Buffer, contentType?: string): Promise<UploadResult> {
    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(path, buffer, { contentType, upsert: true });
    if (error) {
      throw error;
    }
    const { data: publicUrl } = this.client.storage.from(this.bucket).getPublicUrl(path);
    return { publicUrl: publicUrl.publicUrl, path };
  }

  async moveFile(fromPath: string, toPath: string): Promise<void> {
    const { error } = await this.client.storage.from(this.bucket).move(fromPath, toPath);
    if (error) throw error;
  }

  async deleteFile(path: string): Promise<void> {
    const { error } = await this.client.storage.from(this.bucket).remove([path]);
    if (error) throw error;
  }
}


