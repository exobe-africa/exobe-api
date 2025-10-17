import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { SupabaseStorageService } from './supabase-storage.service';

@Module({
  providers: [StorageService, SupabaseStorageService],
  exports: [StorageService, SupabaseStorageService],
})
export class StorageModule {}


