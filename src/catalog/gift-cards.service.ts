import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class GiftCardsService {
  constructor(private prisma: PrismaService, private storage: StorageService) {}

  private assertAdmin(isAdmin: boolean) {
    if (!isAdmin) throw new BadRequestException('Admin only');
  }

  async createGiftCard(input: {
    code: string;
    initial_value_cents: number;
    expires_at?: Date | null;
    notes?: string | null;
    status?: 'ACTIVE' | 'INACTIVE';
    customer_id?: string | null;
    image?: string | null;
    imageBase64?: string | null;
    imageFilename?: string | null;
    imageContentType?: string | null;
  }) {
    if (!input.code || input.code.trim().length < 6) throw new BadRequestException('Gift card code too short');
    if (input.initial_value_cents < 0) throw new BadRequestException('Initial value must be >= 0');
    let image = input.image ?? null;
    if (!image && input.imageBase64 && input.imageFilename) {
      const buf = Buffer.from((input.imageBase64 as string).split(',').pop() || input.imageBase64, 'base64');
      const path = `giftcards/${Date.now()}-${input.imageFilename}`;
      const uploaded = await this.storage.uploadFileFromBuffer(path, buf, input.imageContentType || undefined);
      image = uploaded.publicUrl;
    }
    return (this.prisma as any).giftCard.create({
      data: {
        code: input.code,
        initial_value_cents: input.initial_value_cents,
        balance_cents: input.initial_value_cents,
        expires_at: input.expires_at ?? null,
        notes: input.notes ?? null,
        status: (input.status as any) ?? 'ACTIVE',
        customer_id: input.customer_id ?? null,
        image: image ?? null,
      },
    });
  }

  async updateGiftCard(id: string, input: Partial<{
    code: string;
    initial_value_cents: number;
    balance_cents: number;
    expires_at: Date | null;
    notes: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    customer_id: string | null;
    image?: string | null;
    imageBase64?: string | null;
    imageFilename?: string | null;
    imageContentType?: string | null;
  }>) {
    const gc = await (this.prisma as any).giftCard.findUnique({ where: { id } });
    if (!gc) throw new NotFoundException('Gift card not found');
    const data: any = { ...input };
    if (!data.image && input.imageBase64 && input.imageFilename) {
      const buf = Buffer.from((input.imageBase64 as string).split(',').pop() || input.imageBase64, 'base64');
      const path = `giftcards/${id}/${Date.now()}-${input.imageFilename}`;
      const uploaded = await this.storage.uploadFileFromBuffer(path, buf, input.imageContentType || undefined);
      data.image = uploaded.publicUrl;
    }
    return (this.prisma as any).giftCard.update({ where: { id }, data });
  }

  async deleteGiftCard(id: string) {
    await (this.prisma as any).giftCard.delete({ where: { id } });
    return true;
  }

  async assignGiftCardToCustomer(id: string, customer_id: string | null) {
    const gc = await (this.prisma as any).giftCard.findUnique({ where: { id } });
    if (!gc) throw new NotFoundException('Gift card not found');
    return (this.prisma as any).giftCard.update({ where: { id }, data: { customer_id } });
  }

  async getByCode(code: string) {
    return (this.prisma as any).giftCard.findUnique({ where: { code } });
  }

  async listGiftCards(params?: { status?: 'ACTIVE' | 'INACTIVE'; customer_id?: string }) {
    return (this.prisma as any).giftCard.findMany({ where: { ...(params?.status && { status: params.status }), ...(params?.customer_id && { customer_id: params.customer_id }) }, orderBy: { created_at: 'desc' } });
  }

  // Redeem within an existing transaction
  async applyGiftCardWithinTransaction(tx: any, code: string, maxAmountCents: number, orderId: string) {
    if (!code) return { applied_cents: 0, code: null as string | null };
    const giftCard = await tx.giftCard.findUnique({ where: { code } });
    if (!giftCard) throw new NotFoundException('Gift card not found');
    if (giftCard.status !== 'ACTIVE') throw new BadRequestException('Gift card inactive');
    if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) throw new BadRequestException('Gift card expired');

    const applyCents = Math.max(0, Math.min(giftCard.balance_cents, maxAmountCents));
    if (applyCents <= 0) return { applied_cents: 0, code };

    await tx.giftCard.update({ where: { id: giftCard.id }, data: { balance_cents: { decrement: applyCents } } });
    await tx.giftCardTransaction.create({
      data: {
        gift_card_id: giftCard.id,
        type: 'REDEEM',
        amount_cents: applyCents,
        order_id: orderId,
        notes: 'Applied to order',
      },
    });
    return { applied_cents: applyCents, code };
  }
}


