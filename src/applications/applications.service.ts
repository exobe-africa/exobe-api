import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { SellerApplicationInput } from '../graphql/dto/seller-application.input';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async applySeller(input: SellerApplicationInput, sellerRole: Role) {
    // Validate required fields before processing
    if (!input.firstName || !input.lastName || !input.email || !input.phone) {
      throw new BadRequestException('Required contact information is missing');
    }

    if (!input.businessName || !input.address || !input.city || !input.province || !input.postalCode) {
      throw new BadRequestException('Required business information is missing');
    }

    if (!input.primaryCategory || !input.stockType || !input.productDescription) {
      throw new BadRequestException('Required product information is missing');
    }

    if (!input.businessSummary || !input.howDidYouHear) {
      throw new BadRequestException('Required business summary information is missing');
    }

    if (!input.agreeToTerms) {
      throw new BadRequestException('You must agree to the terms and conditions');
    }

    // Map camelCase input to snake_case database fields
    const data = {
      seller_role: sellerRole,
      business_type: input.businessType,
      applicant_type: input.applicantType,
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone: input.phone,
      landline: input.landline,
      identification_type: input.identificationType,
      business_name: input.businessName,
      business_registration: input.businessRegistration,
      sa_id_number: input.saIdNumber,
      vat_registered: input.vatRegistered,
      vat_number: input.vatNumber,
      monthly_revenue: input.monthlyRevenue,
      physical_stores: input.physicalStores,
      number_of_stores: input.numberOfStores,
      supplier_to_retailers: input.supplierToRetailers,
      other_marketplaces: input.otherMarketplaces,
      address: input.address,
      city: input.city,
      province: input.province,
      postal_code: input.postalCode,
      unique_products: input.uniqueProducts,
      primary_category: input.primaryCategory,
      stock_type: input.stockType,
      product_description: input.productDescription,
      owned_brands: input.ownedBrands,
      reseller_brands: input.resellerBrands,
      website: input.website,
      social_media: input.socialMedia,
      business_summary: input.businessSummary,
      how_did_you_hear: input.howDidYouHear,
      agree_to_terms: input.agreeToTerms,
    };

    try {
      console.log('Creating seller application with data:', JSON.stringify(data, null, 2));
      return await this.prisma.sellerApplication.create({ data });
    } catch (error) {
      console.error('Error creating seller application:', error);
      console.error('Error details:', {
        name: error?.name,
        message: error?.message,
        code: error?.code,
        meta: error?.meta,
        stack: error?.stack
      });

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('A similar application already exists. Please use a different value.');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('One of the provided values is invalid. Please review your input.');
        }
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Some fields are invalid or missing. Please review highlighted fields.');
      }

      if (error?.message?.includes('vat_registered')) {
        throw new BadRequestException('VAT registration status must be either "yes" or "no".');
      }
      if (error?.message?.includes('identification_type')) {
        throw new BadRequestException('Identification type must be either "sa-id" or "passport".');
      }
      if (error?.message?.includes('applicant_type')) {
        throw new BadRequestException('Applicant type must be either "individual" or "company".');
      }
      if (error?.message?.includes('business_type')) {
        throw new BadRequestException('Business type must be either "retailer" or "wholesaler".');
      }
      if (error?.message?.includes('stock_type')) {
        throw new BadRequestException('Stock type must be either "manufactured-locally", "mixture", or "imported".');
      }
      if (error?.message?.includes('primary_category')) {
        throw new BadRequestException('Please select a valid primary category from the dropdown.');
      }
      if (error?.message?.includes('province')) {
        throw new BadRequestException('Please select a valid province from the dropdown.');
      }
      if (error?.message?.includes('email')) {
        throw new BadRequestException('Please enter a valid email address.');
      }
      if (error?.message?.includes('phone')) {
        throw new BadRequestException('Please enter a valid phone number.');
      }
      if (error?.message?.includes('postal_code')) {
        throw new BadRequestException('Please enter a valid postal code.');
      }

      throw new BadRequestException((error as any)?.message || 'Failed to submit application. Please check all required fields are filled correctly.');
    }
  }

  applyServiceProvider(data: any) {
    return this.prisma.serviceProviderApplication.create({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.dateOfBirth,
        id_number: data.idNumber,
        identification_type: data.identificationType,
        service_categories: data.serviceCategories,
        primary_service: data.primaryService,
        experience: data.experience,
        qualifications: data.qualifications,
        portfolio: data.portfolio,
        hourly_rate: data.hourlyRate,
        availability: data.availability,
        address: data.address,
        city: data.city,
        province: data.province,
        postal_code: data.postalCode,
        service_radius: data.serviceRadius,
        transport_mode: data.transportMode,
        business_name: data.businessName,
        business_registration: data.businessRegistration,
        vat_registered: data.vatRegistered,
        vat_number: data.vatNumber,
        bank_details: data.bankDetails,
        emergency_contact: data.emergencyContact,
        work_samples: data.workSamples,
        client_references: data.clientReferences,
        certifications: data.certifications,
        insurance: data.insurance,
        background_check: data.backgroundCheck,
        motivation: data.motivation,
        goals: data.goals,
        how_did_you_hear: data.howDidYouHear,
        agree_to_terms: data.agreeToTerms,
        agree_to_background: data.agreeToBackground,
      },
    });
  }

  async approveSellerApplication(applicationId: string) {
    const app = await this.prisma.sellerApplication.findUnique({ where: { id: applicationId } });
    if (!app) throw new NotFoundException('Application not found');
    await this.prisma.sellerApplication.update({ where: { id: applicationId }, data: { status: 'APPROVED' } });
    const owner = await this.prisma.user.findUnique({ where: { email: app.email } });
    const ownerUserId = owner?.id ?? (await this.prisma.user.create({ data: { email: app.email, password: '', name: `${app.first_name} ${app.last_name}` } })).id;
    const slugBase = app.business_name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${slugBase}-${Math.random().toString(36).slice(2, 6)}`;
    const sellerType = app.seller_role === 'RETAILER' ? 'RETAILER' : 'WHOLESALER';
    const vendor = await (this.prisma as any).vendor.create({
      data: {
        name: app.business_name,
        slug,
        description: app.business_summary ?? undefined,
        owner_user_id: ownerUserId,
        account_manager_user_id: ownerUserId,
        status: 'APPROVED',
        is_active: true,
        seller_type: sellerType,
      },
    });
    if (sellerType === 'RETAILER') {
      await (this.prisma as any).retailerAccount.create({ data: { vendor_id: vendor.id } });
    } else {
      await (this.prisma as any).wholesalerAccount.create({ data: { vendor_id: vendor.id } });
    }
    return vendor;
  }
}


