import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../admin/entities/admin.entity';
import { ContentItem } from '../content/entities/content-item.entity';
import { SiteSetting } from '../content/entities/site-setting.entity';
import { Volunteer } from '../volunteers/entities/volunteer.entity';
import { Message } from '../messages/entities/message.entity';
import { AdminRole } from '../../common/enums/admin-role.enum';
import { ContentType, MediaCategory } from '../../common/enums/content-type.enum';
import { VolunteerStatus } from '../../common/enums/volunteer-status.enum';
import { MessageStatus } from '../../common/enums/message-status.enum';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(ContentItem)
    private readonly contentRepository: Repository<ContentItem>,
    @InjectRepository(SiteSetting)
    private readonly settingRepository: Repository<SiteSetting>,
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedSuperAdmin();
    await this.seedSiteSettings();
    await this.seedSampleContent();
    await this.seedSampleVolunteers();
    await this.seedSampleMessages();
  }

  private async seedSuperAdmin() {
    const defaultEmail = (
      this.configService.get<string>('DEFAULT_ADMIN_EMAIL') || 'admin@charity.org'
    ).toLowerCase();
    const defaultPassword =
      this.configService.get<string>('DEFAULT_ADMIN_PASSWORD') || 'Admin123!';
    const defaultName =
      this.configService.get<string>('DEFAULT_ADMIN_NAME') || 'Super Administrator';

    const existing = await this.adminRepository.findOne({
      where: { email: defaultEmail },
    });

    if (!existing) {
      this.logger.log(`Seeding initial Super Admin: ${defaultEmail}`);
      const admin = this.adminRepository.create({
        name: defaultName,
        email: defaultEmail,
        password: defaultPassword,
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
      });
      await this.adminRepository.save(admin);
      this.logger.log(`Super Admin created successfully (${defaultEmail})`);
    }
  }

  private async seedSiteSettings() {
    const count = await this.settingRepository.count();
    if (count > 0) return;

    this.logger.log('Seeding default organization site settings...');
    const defaultSettings = [
      { key: 'org_name', value: 'Elshaday Charity Organization', group: 'branding', description: 'Organization Name (EN)' },
      { key: 'org_name_am', value: 'ኤልሻዳይ የበጎ አድራጎት ድርጅት', group: 'branding', description: 'Organization Name (AM)' },
      { key: 'org_tagline', value: 'Empowering Communities, Transforming Lives', group: 'branding', description: 'Tagline' },
      { key: 'org_email', value: 'contact@elshaday.org', group: 'contact', description: 'Primary contact email' },
      { key: 'org_phone', value: '+251 934 287 380', group: 'contact', description: 'Primary phone number' },
      { key: 'org_phone_secondary', value: '+251 922 345 678', group: 'contact', description: 'Secondary phone number' },
      { key: 'org_address', value: 'Wolyta Sodo, Ethiopia (Buge Sub-city)', group: 'contact', description: 'Physical office address' },
      { key: 'org_working_hours', value: 'Monday - Friday: 8:30 AM - 5:30 PM (EAT)', group: 'contact', description: 'Office hours' },
      { key: 'social_facebook', value: 'https://facebook.com/elshadaycharity', group: 'social', description: 'Facebook page' },
      { key: 'social_telegram', value: 'https://t.me/elshadaycharity', group: 'social', description: 'Telegram channel' },
      { key: 'social_youtube', value: 'https://youtube.com/@elshadaycharity', group: 'social', description: 'YouTube channel' },
      { key: 'bank_cbe_account', value: '1000123456789 (Commercial Bank of Ethiopia)', group: 'donation', description: 'CBE Donation Account' },
      { key: 'bank_telebirr', value: '+251 934 287 380 (Telebirr)', group: 'donation', description: 'Telebirr Account' },
    ];

    for (const setting of defaultSettings) {
      await this.settingRepository.save(this.settingRepository.create(setting));
    }
  }

  private async seedSampleContent() {
    const count = await this.contentRepository.count();
    if (count > 0) return;

    this.logger.log('Seeding initial website content items...');

    const sampleItems = [
      // About Section
      {
        type: ContentType.ABOUT,
        title: 'Who We Are',
        titleAm: 'ስለ እኛ',
        subtitle: 'Dedicated to helping vulnerable families, orphans, and youths',
        content: 'Elshaday Charity Organization is a non-profit humanitarian foundation operating in Ethiopia. Founded with the mission to alleviate poverty, sponsor child education, and provide emergency relief.',
        contentAm: 'ኤልሻዳይ የበጎ አድራጎት ድርጅት በኢትዮጵያ ውስጥ የተቸገሩ ወገኖችን፣ ወላጅ አልባ ህፃናትን እና ወጣቶችን ለመርዳት የተቋቋመ ድርጅት ነው።',
        category: 'Mission & Vision',
        mediaCategory: MediaCategory.IMAGE,
        mediaUrl: '/uploads/elshaday.jpg',
        isPublished: true,
        displayOrder: 1,
      },
      // Programs
      {
        type: ContentType.PROGRAM,
        title: 'Child Education & Sponsorship',
        titleAm: 'የህፃናት ትምህርት እና ስፖንሰርሺፕ',
        subtitle: 'Covering school fees, uniforms, and books for underprivileged students',
        content: 'Our education initiative supports over 300 students each academic year, ensuring no child is left behind due to poverty.',
        contentAm: 'የትምህርት ድጋፍ ፕሮግራማችን በየአመቱ ከ300 በላይ ለሆኑ ተማሪዎች የትምህርት ቤት ወጪዎችን፣ ደንብ ልብሶችን እና መጻሕፍትን ያቀርባል።',
        category: 'Education',
        mediaCategory: MediaCategory.IMAGE,
        mediaUrl: '/uploads/els1.jpg',
        targetAmount: 500000,
        currentAmount: 320000,
        isPublished: true,
        isFeatured: true,
        displayOrder: 1,
      },
      {
        type: ContentType.PROGRAM,
        title: 'Community Food Bank & Nutrition',
        titleAm: 'የማህበረሰብ ምግብ ድጋፍ ፕሮግራም',
        subtitle: 'Providing monthly food staples to elderly and single-parent households',
        content: 'Providing essential food parcels with teff, wheat flour, edible oil, and pulses to over 150 families monthly.',
        contentAm: 'በየወሩ ለ150 ለሚሆኑ አቅመ ደካማ አረጋውያን እና እናቶች የምግብ አቅርቦት ድጋፍ ያደርጋል።',
        category: 'Humanitarian Aid',
        mediaCategory: MediaCategory.IMAGE,
        mediaUrl: '/uploads/els2.jpg',
        targetAmount: 350000,
        currentAmount: 210000,
        isPublished: true,
        isFeatured: true,
        displayOrder: 2,
      },
      // Events
      {
        type: ContentType.EVENT,
        title: 'Annual Youth Charity Run & Volunteer Meetup',
        titleAm: 'አመታዊ የበጎ ፈቃደኞች የሩጫ እና የውይይት መድረክ',
        subtitle: 'Join us for a 5km charity run in Addis Ababa to raise awareness and funds',
        content: 'Bring your running shoes and enthusiasm! All proceeds will go directly to purchasing back-to-school kits for orphans.',
        contentAm: 'በአዲስ አበባ ከተማ የሚካሄድ የ5 ኪሎ ሜትር የበጎ አድራጎት ሩጫ። የተገኘው ገቢ ሙሉ በሙሉ ለህፃናት የትምህርት ቁሳቁስ መግዣ ይውላል።',
        category: 'Fundraiser & Gathering',
        mediaCategory: MediaCategory.IMAGE,
        mediaUrl: '/uploads/austin-kehmeier-lyiKExA4zQA-unsplash.jpg',
        location: 'Meskel Square, Addis Ababa',
        eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // In 14 days
        isPublished: true,
        isFeatured: true,
        displayOrder: 1,
      },
      // News & Announcements
      {
        type: ContentType.NEWS,
        title: 'Over 200 Students Received School Kits for the New Academic Year',
        titleAm: 'ለ200 ተማሪዎች የትምህርት መርጃ ቁሳቁስ ተሰራጨ',
        subtitle: 'Community solidarity makes quality education accessible to every child',
        content: 'Thanks to our generous donors and dedicated volunteers, distribution took place successfully this weekend.',
        contentAm: 'በበጎ አድራጊዎች እና በበጎ ፈቃደኞች ትብብር የተዘጋጁ የትምህርት ቁሳቁሶች ለተማሪዎች ተበርክተዋል።',
        category: 'Community News',
        mediaCategory: MediaCategory.IMAGE,
        mediaUrl: '/uploads/20250828_151315.jpg',
        isPublished: true,
        isFeatured: true,
        displayOrder: 1,
      },
      {
        type: ContentType.ANNOUNCEMENT,
        title: 'Call for Volunteer Medical Professionals and Teachers',
        titleAm: 'የጤና ባለሙያዎች እና መምህራን የበጎ ፈቃድ ጥሪ',
        subtitle: 'Sign up for our upcoming free medical camp and weekend tutoring sessions',
        content: 'We are expanding our weekend programs and invite doctors, nurses, and certified educators to join our active volunteer pool.',
        contentAm: 'በሚቀጥለው ወር ለሚካሄደው ነፃ የህክምና ምርመራ እና የተማሪዎች የሳምንት እረፍት ትምህርት ድጋፍ የበጎ ፈቃደኞች ምዝገባ ተጀምሯል።',
        category: 'Recruitment',
        mediaCategory: MediaCategory.IMAGE,
        mediaUrl: '/uploads/20250828_161110.jpg',
        isPublished: true,
        isFeatured: true,
        displayOrder: 2,
      },
      // Gallery Media
      {
        type: ContentType.GALLERY,
        title: 'Community Outreach & Food Distribution Gallery',
        titleAm: 'የምግብ ድጋፍ ስነ-ስርዓት ፎቶዎች',
        subtitle: 'Smiles of hope from our community outreach program',
        content: 'Photos capturing the spirit of sharing and mutual support.',
        category: 'Food Distribution',
        mediaCategory: MediaCategory.IMAGE,
        mediaUrl: '/uploads/20250828_161207.jpg',
        isPublished: true,
        displayOrder: 1,
      },
      {
        type: ContentType.GALLERY,
        title: 'Children Youth Activity and Mentorship',
        titleAm: 'የህፃናት እና ወጣቶች የማበረታቻ ፕሮግራም',
        subtitle: 'Engaging our youth in creative arts and life-skills workshops',
        content: 'Youth workshop session.',
        category: 'Youth Workshops',
        mediaCategory: MediaCategory.IMAGE,
        mediaUrl: '/uploads/20250828_161243.jpg',
        isPublished: true,
        displayOrder: 2,
      },
    ];

    for (const item of sampleItems) {
      await this.contentRepository.save(this.contentRepository.create(item));
    }
  }

  private async seedSampleVolunteers() {
    const count = await this.volunteerRepository.count();
    if (count > 0) return;

    this.logger.log('Seeding sample volunteer records...');

    const sampleVolunteers = [
      {
        fullName: 'Almaz Tadesse',
        email: 'almaz.tadesse@example.com',
        phone: '+251911122233',
        gender: 'Female',
        dateOfBirth: new Date('1994-03-12'),
        city: 'Addis Ababa',
        address: 'Yeka Sub-city',
        occupation: 'Nurse',
        skills: ['First Aid', 'Patient Care', 'Health Education'],
        areasOfInterest: ['Healthcare', 'Elderly Care', 'Emergency Relief'],
        availability: 'Weekends',
        motivation: 'I love caring for vulnerable patients and want to contribute my medical skills.',
        status: VolunteerStatus.ACTIVE,
        adminNotes: 'Verified registered nurse. Approved for health camps.',
        approvedAt: new Date(),
        approvedByAdminName: 'Super Admin',
      },
      {
        fullName: 'Yonas Bekele',
        email: 'yonas.bekele@example.com',
        phone: '+251922334455',
        gender: 'Male',
        dateOfBirth: new Date('1998-07-25'),
        city: 'Wolyta Sodo',
        address: 'Buge Sub-city',
        occupation: 'High School Mathematics Teacher',
        skills: ['Teaching', 'Tutoring', 'Public Speaking'],
        areasOfInterest: ['Child Education', 'Youth Mentorship'],
        availability: 'Saturday Mornings & Sunday Afternoons',
        motivation: 'Passionate about helping children succeed in STEM subjects.',
        status: VolunteerStatus.APPROVED,
        adminNotes: 'Application approved for Saturday math tutoring.',
        approvedAt: new Date(),
        approvedByAdminName: 'Super Admin',
      },
      {
        fullName: 'Selamawit Girma',
        email: 'selamawit.g@example.com',
        phone: '+251933445566',
        gender: 'Female',
        dateOfBirth: new Date('2001-11-05'),
        city: 'Hawassa',
        address: 'Piazza',
        occupation: 'University Student (IT)',
        skills: ['Graphic Design', 'Social Media', 'Photography', 'Web Development'],
        areasOfInterest: ['Media & Communications', 'Event Coordination'],
        availability: 'Flexible (Remote & On-site)',
        motivation: 'Want to help manage charity social media and photograph charity events.',
        status: VolunteerStatus.PENDING,
      },
      {
        fullName: 'Kidus Hailu',
        email: 'kidus.hailu@example.com',
        phone: '+251944556677',
        gender: 'Male',
        dateOfBirth: new Date('1990-09-18'),
        city: 'Addis Ababa',
        address: 'Nifas Silk Lafto',
        occupation: 'Civil Engineer / Logistics Specialist',
        skills: ['Logistics', 'Warehouse Coordination', 'Driving'],
        areasOfInterest: ['Food Distribution', 'Disaster Relief'],
        availability: 'On-Call & Weekends',
        motivation: 'Available to assist with supply transport and warehouse loading.',
        status: VolunteerStatus.INACTIVE,
        adminNotes: 'Currently away on project outside city. Set to inactive temporarily.',
      },
      {
        fullName: 'Marta Assefa',
        email: 'marta.assefa@example.com',
        phone: '+251955667788',
        gender: 'Female',
        dateOfBirth: new Date('1997-01-30'),
        city: 'Adama',
        address: 'Kebele 04',
        occupation: 'Accountant',
        skills: ['Bookkeeping', 'Excel', 'Budgeting'],
        areasOfInterest: ['Administration', 'Fundraising'],
        availability: 'Evenings',
        motivation: 'Eager to assist with donation recording and financial audits.',
        status: VolunteerStatus.PENDING,
      },
    ];

    for (const v of sampleVolunteers) {
      await this.volunteerRepository.save(this.volunteerRepository.create(v));
    }
  }

  private async seedSampleMessages() {
    const count = await this.messageRepository.count();
    if (count > 0) return;

    this.logger.log('Seeding sample contact messages...');

    const sampleMessages = [
      {
        fullName: 'Solomon Tesfaye',
        email: 'solomon.tesfaye@gmail.com',
        phone: '+251911887766',
        subject: 'Donation of 50 school bags and stationery kits',
        message: 'Hello, our company would like to donate 50 school bags with stationery supplies for your education program. Please let us know how and where to drop them off.',
        status: MessageStatus.UNREAD,
      },
      {
        fullName: 'Bethlehem Desta',
        email: 'bethlehem.d@yahoo.com',
        phone: '+251922776655',
        subject: 'Volunteer group registration inquiry',
        message: 'We are a youth group of 15 university students from Addis Ababa University who wish to volunteer together for the next community feeding event.',
        status: MessageStatus.READ,
        adminNote: 'Sent group coordinator registration link.',
      },
      {
        fullName: 'Dr. Michael Chen',
        email: 'dr.chen@globalaid.org',
        phone: '+1 415 555 0192',
        subject: 'Partnership proposal for Maternal and Child Health',
        message: 'Greetings from Global Aid Initiative. We are reviewing Ethiopian humanitarian partners for our upcoming healthcare grants.',
        status: MessageStatus.REPLIED,
        repliedAt: new Date(),
        adminNote: 'Meeting scheduled with Executive Director via Zoom.',
      },
    ];

    for (const msg of sampleMessages) {
      await this.messageRepository.save(this.messageRepository.create(msg));
    }
  }
}
