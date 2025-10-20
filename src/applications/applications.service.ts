import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { Prisma, Role } from '@prisma/client';
import { SellerApplicationInput } from '../graphql/dto/seller-application.input';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  async applySeller(input: SellerApplicationInput, sellerRole: Role) {
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
      const application = await this.prisma.sellerApplication.create({ data });
      
      this.sendApplicationConfirmationEmail(application, input).catch(err => {
        console.error('Failed to send application confirmation email:', err);
      });
      
      return application;
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

    let owner = await this.prisma.user.findUnique({ where: { email: app.email } });
    if (!owner) {
      owner = await this.prisma.user.create({
        data: {
          email: app.email,
          password: '',
          name: `${app.first_name} ${app.last_name}`.trim(),
          first_name: app.first_name,
          last_name: app.last_name,
          phone: app.phone || undefined,
          role: app.seller_role,
          is_active: true,
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: owner.id },
        data: {
          name: owner.name || `${app.first_name} ${app.last_name}`.trim(),
          first_name: owner.first_name || app.first_name,
          last_name: owner.last_name || app.last_name,
          phone: owner.phone || app.phone || undefined,
          role: owner.role === 'CUSTOMER' ? app.seller_role : owner.role,
        },
      });
      owner = await this.prisma.user.findUnique({ where: { email: app.email } });
    }

    const slugBase = app.business_name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${slugBase}-${Math.random().toString(36).slice(2, 6)}`;
    const sellerType = app.seller_role === 'RETAILER' ? 'RETAILER' : 'WHOLESALER';

    const vendor = await (this.prisma as any).vendor.create({
      data: {
        name: app.business_name,
        slug,
        description: app.business_summary ?? undefined,
        owner_user_id: owner!.id,
        account_manager_user_id: owner!.id,
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

  getSellerApplications(params: { status?: string; take?: number; skip?: number } = {}) {
    const { status, take = 50, skip = 0 } = params;
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.sellerApplication.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take,
      skip,
    });
  }

  getServiceProviderApplications(params: { status?: string; take?: number; skip?: number } = {}) {
    const { status, take = 50, skip = 0 } = params;
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.serviceProviderApplication.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take,
      skip,
    });
  }

  async rejectSellerApplication(applicationId: string, rejectionData: { rejectionType: string; description: string }, rejectedByUserId?: string) {
    const app = await this.prisma.sellerApplication.findUnique({ where: { id: applicationId } });
    if (!app) throw new NotFoundException('Application not found');

    await this.prisma.sellerApplication.update({
      where: { id: applicationId },
      data: { status: 'REJECTED' }
    });

    await this.prisma.applicationRejectionReason.create({
      data: {
        application_id: applicationId,
        application_type: 'seller',
        rejection_type: rejectionData.rejectionType,
        description: rejectionData.description,
        rejected_by_user_id: rejectedByUserId,
      },
    });

    this.sendRejectionEmail(app, rejectionData).catch(err => {
      console.error('Failed to send rejection email:', err);
    });

    return true;
  }

  async updateSellerApplication(applicationId: string, data: any) {
    const app = await this.prisma.sellerApplication.findUnique({ where: { id: applicationId } });
    if (!app) throw new NotFoundException('Application not found');
    
    if (app.status !== 'PENDING') {
      throw new BadRequestException('Cannot update application that has already been processed');
    }

    return this.prisma.sellerApplication.update({
      where: { id: applicationId },
      data: {
        seller_role: data.sellerRole || data.seller_role as any,
        business_type: data.businessType || data.business_type,
        applicant_type: data.applicantType || data.applicant_type,
        first_name: data.firstName || data.first_name,
        last_name: data.lastName || data.last_name,
        email: data.email,
        phone: data.phone,
        landline: data.landline,
        identification_type: data.identificationType || data.identification_type,
        business_name: data.businessName || data.business_name,
        business_registration: data.businessRegistration || data.business_registration,
        sa_id_number: data.saIdNumber || data.sa_id_number,
        vat_registered: data.vatRegistered || data.vat_registered,
        vat_number: data.vatNumber || data.vat_number,
        monthly_revenue: data.monthlyRevenue || data.monthly_revenue,
        physical_stores: data.physicalStores || data.physical_stores,
        number_of_stores: data.numberOfStores || data.number_of_stores,
        supplier_to_retailers: data.supplierToRetailers || data.supplier_to_retailers,
        other_marketplaces: data.otherMarketplaces || data.other_marketplaces,
        address: data.address,
        city: data.city,
        province: data.province,
        postal_code: data.postalCode || data.postal_code,
        unique_products: data.uniqueProducts || data.unique_products,
        primary_category: data.primaryCategory || data.primary_category,
        stock_type: data.stockType || data.stock_type,
        product_description: data.productDescription || data.product_description,
        owned_brands: data.ownedBrands || data.owned_brands,
        reseller_brands: data.resellerBrands || data.reseller_brands,
        website: data.website,
        social_media: data.socialMedia || data.social_media,
        business_summary: data.businessSummary || data.business_summary,
        how_did_you_hear: data.howDidYouHear || data.how_did_you_hear,
        agree_to_terms: data.agreeToTerms !== undefined ? data.agreeToTerms : data.agree_to_terms,
      },
    });
  }

  private async sendApplicationConfirmationEmail(application: any, input: SellerApplicationInput) {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'https://exobe.africa';
      const sellerType = application.seller_role === 'RETAILER' ? 'Retailer' : 'Wholesaler';

      await this.email.sendTemplatedEmail({
        to: application.email,
        subject: `Application Received - ${application.business_name}`,
        template: 'applications/seller-application-confirmation',
        variables: {
          firstName: application.first_name,
          lastName: application.last_name,
          businessName: application.business_name,
          sellerType,
          primaryCategory: application.primary_category,
          city: application.city,
          province: application.province,
          submittedDate: new Date(application.created_at).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          websiteUrl: frontendUrl,
          year: new Date().getFullYear().toString(),
        },
      });

      console.log(`Application confirmation email sent to ${application.email}`);
    } catch (error) {
      console.error('Error sending application confirmation email:', error);
      throw error;
    }
  }

  private async sendRejectionEmail(application: any, rejectionData: { rejectionType: string; description: string }) {
    try {
      const frontendUrl = process.env.FRONTEND_URL || 'https://exobe.africa';

      await this.email.sendTemplatedEmail({
        to: application.email,
        subject: `Application Rejected - ${application.business_name}`,
        template: 'applications/seller-application-rejection',
        variables: {
          firstName: application.first_name,
          lastName: application.last_name,
          businessName: application.business_name,
          rejectionType: rejectionData.rejectionType,
          rejectionDescription: rejectionData.description,
          websiteUrl: frontendUrl,
          year: new Date().getFullYear().toString(),
        },
      });

      console.log(`Application rejection email sent to ${application.email}`);
    } catch (error) {
      console.error('Error sending application rejection email:', error);
      throw error;
    }
  }
}


