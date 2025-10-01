import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  applySeller(data: any, sellerRole: Role) {
    return this.prisma.sellerApplication.create({
      data: { ...data, sellerRole },
    });
  }

  applyServiceProvider(data: any) {
    return this.prisma.serviceProviderApplication.create({
      data,
    });
  }
}


