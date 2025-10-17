import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private supabase: SupabaseClient;
  private readonly bucketName = 'product-images';

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn('Supabase credentials not found. Image upload will not work.');
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  /**
   * Upload a file to Supabase Storage
   * @param file - The file buffer to upload
   * @param fileName - The name/path for the file in storage
   * @param contentType - The MIME type of the file
   * @returns The public URL of the uploaded file
   */
  async uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          contentType,
          upsert: true,
        });

      if (error) {
        this.logger.error(`Error uploading file: ${error.message}`);
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = this.supabase.storage.from(this.bucketName).getPublicUrl(fileName);

      this.logger.log(`File uploaded successfully: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      this.logger.error(`Exception during file upload: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload multiple files
   * @param files - Array of file data
   * @returns Array of public URLs
   */
  async uploadMultipleFiles(
    files: Array<{ buffer: Buffer; fileName: string; contentType: string }>,
  ): Promise<string[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file.buffer, file.fileName, file.contentType),
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from Supabase Storage
   * @param fileName - The name/path of the file to delete
   */
  async deleteFile(fileName: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([fileName]);

      if (error) {
        this.logger.error(`Error deleting file: ${error.message}`);
        throw new Error(`Failed to delete file: ${error.message}`);
      }

      this.logger.log(`File deleted successfully: ${fileName}`);
    } catch (error) {
      this.logger.error(`Exception during file deletion: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete multiple files
   * @param fileNames - Array of file names/paths to delete
   */
  async deleteMultipleFiles(fileNames: string[]): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove(fileNames);

      if (error) {
        this.logger.error(`Error deleting files: ${error.message}`);
        throw new Error(`Failed to delete files: ${error.message}`);
      }

      this.logger.log(`${fileNames.length} files deleted successfully`);
    } catch (error) {
      this.logger.error(`Exception during file deletion: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get a signed URL for temporary access to a file
   * @param fileName - The name/path of the file
   * @param expiresIn - Expiration time in seconds (default: 3600)
   * @returns The signed URL
   */
  async getSignedUrl(fileName: string, expiresIn = 3600): Promise<string> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .createSignedUrl(fileName, expiresIn);

      if (error) {
        this.logger.error(`Error creating signed URL: ${error.message}`);
        throw new Error(`Failed to create signed URL: ${error.message}`);
      }

      return data.signedUrl;
    } catch (error) {
      this.logger.error(`Exception during signed URL creation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extract file path from Supabase public URL
   * @param publicUrl - The public URL
   * @returns The file path
   */
  extractFilePath(publicUrl: string): string {
    const parts = publicUrl.split(`${this.bucketName}/`);
    return parts[parts.length - 1];
  }

  /**
   * Generate a unique file name
   * @param originalName - Original file name
   * @param prefix - Optional prefix (e.g., 'product', 'variant')
   * @returns A unique file name
   */
  generateUniqueFileName(originalName: string, prefix = ''): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    const sanitizedName = originalName
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .substring(0, 50);

    return `${prefix ? prefix + '-' : ''}${timestamp}-${randomString}-${sanitizedName}.${extension}`;
  }
}

