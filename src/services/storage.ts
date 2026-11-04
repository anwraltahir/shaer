import {
  User,
  PoetProfile,
  Poem,
  Category,
  Collection,
  PoetApplication,
  FavoriteItem,
  FollowItem,
  AppNotification,
  ContentReport,
  AuditLog
} from '../types';

// Arabic search normalization helper: strip tashkeel, normalize alefs, yahs, taa marbuta
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // strip diacritics / tashkeel
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ئ|ؤ/g, 'ء')
    .trim()
    .toLowerCase();
}

const STORAGE_KEYS = {
  USERS: 'sudanese_poets_users_v2',
  POETS: 'sudanese_poets_profiles_v2',
  POEMS: 'sudanese_poets_poems_v2',
  CATEGORIES: 'sudanese_poets_categories_v2',
  COLLECTIONS: 'sudanese_poets_collections_v2',
  APPLICATIONS: 'sudanese_poets_applications_v2',
  FAVORITES: 'sudanese_poets_favorites_v2',
  FOLLOWS: 'sudanese_poets_follows_v2',
  NOTIFICATIONS: 'sudanese_poets_notifications_v2',
  REPORTS: 'sudanese_poets_reports_v2',
  AUDIT_LOGS: 'sudanese_poets_audit_logs_v2',
  CURRENT_USER: 'sudanese_poets_current_user_v2',
};

// Seed Categories
const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-watan',
    name: 'الشعر الوطني',
    slug: 'national-poetry',
    description: 'قصائد تخلد وجدان الأمة السودانية وتجسد حب تراب الوطن ونيله وأصالته.'
  },
  {
    id: 'cat-wajdan',
    name: 'الشعر الوجداني',
    slug: 'emotional-poetry',
    description: 'تأملات العاطفة الإنسانية، ولواعج الاشتياق والشوق في أرق تجلياتها الفصيحة.'
  },
  {
    id: 'cat-ghazal',
    name: 'الغزل العفيف',
    slug: 'ghazal',
    description: 'رقة المعنى وعفة القول في التعبير عن الحسن الإنساني وسحر الطبيعة النيلية.'
  },
  {
    id: 'cat-hikma',
    name: 'الشعر الفلسفي والحكمي',
    slug: 'philosophy-wisdom',
    description: 'تأملات في الكون والحياة والمصير والوجود الإنساني بأصالة وبلاغة فصيحة.'
  },
  {
    id: 'cat-sufi',
    name: 'الشعر الصوفي والروحي',
    slug: 'sufi-spiritual',
    description: 'فيوضات العشق الإلهي وحلقات الذكر والوجد في التجربة الصوفية السودانية.'
  },
  {
    id: 'cat-ritha',
    name: 'شعر الرثاء',
    slug: 'elegy',
    description: 'مراثٍ خالدة تبكي كبار الرواد والأحبة وتخلد مآثر الراحلين في أدب السودان.'
  },
  {
    id: 'cat-ijtimae',
    name: 'الشعر الاجتماعي',
    slug: 'social-poetry',
    description: 'معالجة قضايا المجتمع السوداني وتطلعات إنسانه نحو النهضة والعدالة والكرامة.'
  },
  {
    id: 'cat-amoudi',
    name: 'الشعر العمودي الأصيل',
    slug: 'classical-amoudi',
    description: 'درر البحر الخليلي المقفى، التزاماً ببحور الشعر العربي وأصول البيان الرصين.'
  },
  {
    id: 'cat-tafila',
    name: 'شعر التفعيلة العربي',
    slug: 'tafila-modern',
    description: 'روائع التجديد في الإيقاع العربي الفصيح مع الالتزام بوحدة التفعيلة واللغة الرصينة.'
  }
];

// Seed Authentic Sudanese Historical & Contemporary Poets
const INITIAL_POETS: PoetProfile[] = [
  {
    id: 'poet-abbasi',
    literaryName: 'محمد سعيد العباسي',
    fullName: 'محمد سعيد بن الشيخ محمد شريف العباسي',
    biography: 'رائد الشعر الكلاسيكي والعمودي في السودان، وأحد ألمع أركان النهضة الأدبية في مطلع القرن العشرين. تميزت قصائده بجزالة اللفظ ومتانة السبك والاعتزاز بالعروبة والأصالة النيلية البدوية.',
    profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400',
    birthYear: 1880,
    deathYear: 1963,
    city: 'أم درمان / النيل الأبيض',
    literarySchool: 'كلاسيكي عمودي',
    verificationStatus: true,
    profileSlug: 'mohammed-saeed-al-abbasi',
    isHistorical: true,
    sources: 'ديوان العباسي - تحقيق ومقدمة الأستاذ محمد عبد الرحيم، دار المعارف؛ تاريخ الأدب السوداني الحديث للدكتور محمد إبراهيم الشوش.',
    quotes: [
      'ألا يا نسيم الفجر بلغ تحيتي ... إلى أرض سودان الكرام الأماجد',
      'حيّ أم درمان واندب عهدها ... واسكب الدمع على أطلالها'
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'poet-tijani',
    literaryName: 'التجاني يوسف بشير',
    fullName: 'التجاني يوسف بشير البشير',
    biography: 'عبقرية الشعر السوداني وأحد أعظم شعراء الرومانسية والتأمل الفلسفي والوجداني في العالم العربي. رحل في ريعان شبابه عن خمسة وعشرين عاماً لكنه ترك ديوانه الخالد «إشراقة» الذي أسس لمدرسة شعرية وجدانية فريدة تعانق سر النيل والجمال الكوني.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    birthYear: 1912,
    deathYear: 1937,
    city: 'أم درمان',
    literarySchool: 'رومانسي وجداني',
    verificationStatus: true,
    profileSlug: 'al-tijani-yusuf-bashir',
    isHistorical: true,
    sources: 'ديوان «إشراقة» - الطبعة المعتمدة؛ دراسات أدبية: د. إحسان عباس ومحمود محمد شاكر في تجربة التجاني يوسف بشير.',
    quotes: [
      'يا نيل يا ساحر الألحان والرؤى ... بوركت من واهبٍ للحسن غلاّبِ',
      'أنت في خاطري سرٌ من النور ... وفي وجداني صلاةٌ من الطهر'
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'poet-jamma',
    literaryName: 'إدريس جمّاع',
    fullName: 'إدريس محمد جمّاع',
    biography: 'شاعر الرقة والألم الإنساني الشفيف والوجدان الصادق. صاحب الأبيات التي تناقلها أدباء العالم العربي، وتعد من أرق ما قيل في العيون والجمال والشوق. تخرج في دار العلوم بالقاهرة وعاش حياة عاصفة بالأسى والشعر النبيل.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    birthYear: 1922,
    deathYear: 1980,
    city: 'حلفاية الملوك / الخرطوم',
    literarySchool: 'رومانسي وجداني',
    verificationStatus: true,
    profileSlug: 'idris-jamma',
    isHistorical: true,
    sources: 'ديوان «لحظات باقية» - دار الفكر؛ إدريس جماع: دراسة ونصوص، الدكتور عبد المجيد عابدين.',
    quotes: [
      'أعلى الجمال تغار منّا ... ماذا عليك إذا نظرنا؟',
      'والسيف إن طال الجفون غدا لها ... كالحارس اليقظان يوم كفاحِ'
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'poet-fayturi',
    literaryName: 'محمد الفيتوري',
    fullName: 'محمد مفتاح رجب الفيتوري',
    biography: 'شاعر إفريقيا والعروبة والحرية والتصوف. من رواد شعر التفعيلة العربي الحديث في خمسينيات القرن العشرين. صدح شعره بكرامة الإنسان الإفريقي وعذوبة الإيقاع الصوفي الصادق في أرجاء العالم العربي والدولي.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    birthYear: 1936,
    deathYear: 2015,
    city: 'الجنينة / الخرطوم',
    literarySchool: 'فلسفي وصوفي',
    verificationStatus: true,
    profileSlug: 'mohammed-al-fayturi',
    isHistorical: true,
    sources: 'الأعمال الكاملة لمحمد الفيتوري - دار الشروق؛ ديوان «أغاني إفريقيا» (1956) و«معزوفة لدرويش متجول» (1969).',
    quotes: [
      'في حضرة من أهوى عبثت بي الأشواق ... حدقت بلا وجه ورقصت بلا ساقِ',
      'قلْ هي الروح التي تشرق فينا ... حين نأوي للضحى مستبشرين'
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'poet-hadi',
    literaryName: 'الهادي آدم',
    fullName: 'الهادي آدم مصطفى',
    biography: 'شاعر سوداني فحل، كتب روائع القصائد العمودية باللغة العربية الفصحى، وصاحب القصيدة الخالدة «أغداً ألقاك» التي غنتها كوكب الشرق أم كلثوم بلحن الموسيقار محمد عبد الوهاب. تخرج في كلية دار العلوم جامعة القاهرة.',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    birthYear: 1927,
    deathYear: 2006,
    city: 'الهلالية / الجزيرة',
    literarySchool: 'كلاسيكي عمودي',
    verificationStatus: true,
    profileSlug: 'al-hadi-adam',
    isHistorical: true,
    sources: 'ديوان «كوخ الأشواق» - الهيئة العامة للكتاب؛ مجلة الدوحة الثقافية وموسوعة الشعر السوداني.',
    quotes: [
      'أغداً ألقاك يا خوف فؤادي من غدِ ... يالشوقي واحتراقي في انتظار الموعدِ',
      'آه كم أخشى غدي هذا وأرجوه اقترابا ... كنت أستدنيه لكن هبته لما أهابا'
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'poet-salah',
    literaryName: 'صلاح أحمد إبراهيم',
    fullName: 'صلاح أحمد إبراهيم',
    biography: 'شاعر وأديب ودبلوماسي ومترجم فذ. جمع بين رصانة التراث العربي وثقافة العصر وأصالة البيئة النيلية. صاحب ديوان «غضبة الهبباي» وديوان «غابة الأبنوس»، وقصيدته الشهيرة «يا مريا» التي تعد علامة في التجديد الشعري العربي.',
    profileImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
    birthYear: 1933,
    deathYear: 1993,
    city: 'أم درمان',
    literarySchool: 'واقعي وتفعيلة',
    verificationStatus: true,
    profileSlug: 'salah-ahmed-ibrahim',
    isHistorical: true,
    sources: 'ديوان «غضبة الهبباي» - دار الثقافة، بيروت؛ ديوان «غابة الأبنوس»؛ دراسة الدكتور محمد النويهي حول التجديد.',
    quotes: [
      'يا مريا.. ليت لي حكمة لقمان ... ولحن الغابرين',
      'ليت لي أن أنفض الحزن الذي ... يرقد كالصخر على هذا الجبين'
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'poet-rawda',
    userId: 'user-poet-demo',
    literaryName: 'روضة الحاج',
    fullName: 'روضة الحاج محمد عثمان',
    biography: 'شاعرة وإعلامية سودانية مرموقة، من أبرز أصوات الشعر العربي الفصيح المعاصر في السودان والعالم العربي. حازت على جائزة سوق عكاظ للشعر وجوائز أدبية رفيعة، وتميزت قصائدها بدفاعها البليغ عن الهوية والتجربة الإنسانية الرفيعة.',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    birthYear: 1969,
    city: 'كسلا / الخرطوم',
    literarySchool: 'كلاسيكي عمودي',
    verificationStatus: true,
    profileSlug: 'rawda-al-hajj',
    isHistorical: false,
    sources: 'دواوين: «عش للقصيدة»، «في الساحل يعترف القلب»، «لأنني أنثى»، الهيئة المصرية العامة للكتاب.',
    quotes: [
      'أنا لم أزل في الشرفة الخضراء أرتقب الصباح ... وأمد كفي للندى العابق في زهر الأقاح',
      'كم غاب غيرك لم أشعر بفرقته ... وأنت حين تغيب الأرض تغتربُ'
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

// Seed Authentic Classical Arabic Poems by Sudanese Poets
const INITIAL_POEMS: Poem[] = [
  {
    id: 'poem-hadi-aghadan',
    poetId: 'poet-hadi',
    poetName: 'الهادي آدم',
    title: 'أغداً ألقاك',
    slug: 'aghadan-alqak',
    poemText: `أغداً ألقاك يا خوف فؤادي من غدِ ... يالشوقي واحتراقي في انتظار الموعدِ
آه كم أخشى غدي هذا وأرجوه اقترابا ... كنت أستدنيه لكن هبته لما أهابا
وأهلت فرحة القرب به حين استجابا ... هكذا أحتمل العمر نعيماً وعذابا
مهجة حرة وقلب مسه الشوق فذابا ... غداً ألقاك وإني في اشتياق للميعاد
أنت يا جنة حبي واشتياقي وجنوني ... أنت يا قبلة روحي وانطلاقي وشجوني
أغمض العين وألقاك بقلبي وعيوني ... وأناجيك كأن القرب في وجدِ سنينِ
فإذا ما هلّ فجرُ الوصل أسرعت خطايا ... تتهادى في رياض الحب أهواك منايا`,
    verses: [
      { first: 'أغداً ألقاك يا خوف فؤادي من غدِ', second: 'يالشوقي واحتراقي في انتظار الموعدِ' },
      { first: 'آه كم أخشى غدي هذا وأرجوه اقترابا', second: 'كنت أستدنيه لكن هبته لما أهابا' },
      { first: 'وأهلت فرحة القرب به حين استجابا', second: 'هكذا أحتمل العمر نعيماً وعذابا' },
      { first: 'مهجة حرة وقلب مسه الشوق فذابا', second: 'غداً ألقاك وإني في اشتياق للميعاد' },
      { first: 'أنت يا جنة حبي واشتياقي وجنوني', second: 'أنت يا قبلة روحي وانطلاقي وشجوني' },
      { first: 'أغمض العين وألقاك بقلبي وعيوني', second: 'وأناجيك كأن القرب في وجدِ سنينِ' },
      { first: 'فإذا ما هلّ فجرُ الوصل أسرعت خطايا', second: 'تتهادى في رياض الحب أهواك منايا' }
    ],
    form: 'عمودي',
    categoryId: 'cat-wajdan',
    categoryName: 'الشعر الوجداني',
    literarySchool: 'كلاسيكي عمودي',
    writtenAt: '1968',
    source: 'ديوان «كوخ الأشواق» - الهادي آدم؛ القصيدة الموثقة بالمكتبة الشعرية الوطنية.',
    copyrightStatus: 'ملك عام أدبي محفوظ الحقوق للشاعر',
    publicationStatus: 'approved',
    viewsCount: 1420,
    isFeatured: true,
    isPoemOfTheDay: true,
    approvedBy: 'إدارة منصة شعراء السودان',
    approvedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'poem-jamma-rabee',
    poetId: 'poet-jamma',
    poetName: 'إدريس جمّاع',
    title: 'في ربيع الحب',
    slug: 'fi-rabee-al-hubb',
    poemText: `في ربيع الحب كنا نتلاقى ... ننسج الآمال نوراً واشتياقا
ونسير في طريق باسمٍ ... مشرق النور صبوحاً وبراقا
أعلى الجمال تغار منا إننا ... نأوي لظل نداك حباً صادقا
ماذا عليك إذا نظرنا نظرةً ... تشفي فؤاداً هائماً ومحترقا
والسيف إن طال الجفون غدا لها ... كالحارس اليقظان في ساح الكفاح
يا من رأى الشوق في عين المحبين ... ناطقاً بالحب في سر العيون`,
    verses: [
      { first: 'في ربيع الحب كنا نتلاقى', second: 'ننسج الآمال نوراً واشتياقا' },
      { first: 'ونسير في طريق باسمٍ', second: 'مشرق النور صبوحاً وبراقا' },
      { first: 'أعلى الجمال تغار منا إننا', second: 'نأوي لظل نداك حباً صادقا' },
      { first: 'ماذا عليك إذا نظرنا نظرةً', second: 'تشفي فؤاداً هائماً ومحترقا' },
      { first: 'والسيف إن طال الجفون غدا لها', second: 'كالحارس اليقظان في ساح الكفاح' },
      { first: 'يا من رأى الشوق في عين المحبين', second: 'ناطقا بالحب في سر العيون' }
    ],
    form: 'عمودي',
    categoryId: 'cat-ghazal',
    categoryName: 'الغزل العفيف',
    literarySchool: 'رومانسي وجداني',
    writtenAt: '1952',
    source: 'ديوان «لحظات باقية» - إدريس جمّاع.',
    copyrightStatus: 'توثيق تراثي معتمد',
    publicationStatus: 'approved',
    viewsCount: 1890,
    isFeatured: true,
    isPoemOfTheDay: false,
    approvedBy: 'إدارة منصة شعراء السودان',
    approvedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'poem-tijani-mehrab',
    poetId: 'poet-tijani',
    poetName: 'التجاني يوسف بشير',
    title: 'محراب الجمال (اللوحة النيلية)',
    slug: 'mehrab-al-jamal',
    poemText: `يا نيل يا ساحر الألحان والرؤى ... بوركت من واهبٍ للحسن غلاّبِ
كم فيك من لفتةٍ للروح صاعدةٍ ... وموئلٍ للنهى والشاعر الصابي
أنت في خاطري سرٌ من النور ... تسري به في دمي أطياف أطيابي
تجري فتروي القلوب العطشى آملةً ... وتغدق الخصب في أرضٍ وأحقابِ
قد قدس الحسن في مجراك موقعه ... فكل شاطئ مجدٍ فيك ريـّانُ`,
    verses: [
      { first: 'يا نيل يا ساحر الألحان والرؤى', second: 'بوركت من واهبٍ للحسن غلاّبِ' },
      { first: 'كم فيك من لفتةٍ للروح صاعدةٍ', second: 'وموئلٍ للنهى والشاعر الصابي' },
      { first: 'أنت في خاطري سرٌ من النور', second: 'تسري به في دمي أطياف أطيابي' },
      { first: 'تجري فتروي القلوب العطشى آملةً', second: 'وتغدق الخصب في أرضٍ وأحقابِ' },
      { first: 'قد قدس الحسن في مجراك موقعه', second: 'فكل شاطئ مجدٍ فيك ريـّانُ' }
    ],
    form: 'عمودي',
    categoryId: 'cat-watan',
    categoryName: 'الشعر الوطني',
    literarySchool: 'رومانسي وجداني',
    writtenAt: '1935',
    source: 'ديوان «إشراقة» - التجاني يوسف بشير.',
    copyrightStatus: 'ملك عام أدبي موثق',
    publicationStatus: 'approved',
    viewsCount: 1650,
    isFeatured: true,
    isPoemOfTheDay: false,
    approvedBy: 'إدارة منصة شعراء السودان',
    approvedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'poem-fayturi-darweesh',
    poetId: 'poet-fayturi',
    poetName: 'محمد الفيتوري',
    title: 'معزوفة لدرويش متجول',
    slug: 'maazoufat-darweesh',
    poemText: `في حضرةِ من أهوى
عبثت بي الأشواق
حدقتُ بلا وجهٍ
ورقصتُ بلا ساقِ
وزحمتُ براياتِ طرقي
واكتظت بي في برزخ عينيّ الآفاقِ
يا أيها الواقف خلف الليل
أنا صوت الذين عبروا
ولم يتركوا أثراً سوى النار
أنا رماد النبوءات
وقنديل المعاني في سكون الدار`,
    verses: [
      { first: 'في حضرةِ من أهوى عبثت بي الأشواق', second: 'حدقتُ بلا وجهٍ ورقصتُ بلا ساقِ' },
      { first: 'وزحمتُ براياتِ طرقي واكتظت بي', second: 'في برزخ عينيّ تلألأت الآفاقِ' },
      { first: 'يا أيها الواقف خلف الليل صامتاً', second: 'أنا صوت من عبروا بنور الإشراقِ' },
      { first: 'أنا رماد النبوءات القديمة في الثرى', second: 'وقنديل آمالٍ بنبض الشاعر الباقي' }
    ],
    form: 'تفعيلة',
    categoryId: 'cat-sufi',
    categoryName: 'الشعر الصوفي والروحي',
    literarySchool: 'فلسفي وصوفي',
    writtenAt: '1969',
    source: 'ديوان «معزوفة لدرويش متجول» - دار الشروق.',
    copyrightStatus: 'موثق بالاتفاق الأدبي',
    publicationStatus: 'approved',
    viewsCount: 2130,
    isFeatured: true,
    isPoemOfTheDay: false,
    approvedBy: 'إدارة منصة شعراء السودان',
    approvedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'poem-abbasi-tahiyya',
    poetId: 'poet-abbasi',
    poetName: 'محمد سعيد العباسي',
    title: 'تحية السودان والعهد القديم',
    slug: 'tahiyyat-al-sudan',
    poemText: `ألا يا نسيم الفجر بلغ تحيتي ... إلى أرض سودان الكرام الأماجدِ
ديارٍ بها شب الشباب مهذباً ... كريم السجايا طاهر النفس ماجدِ
سقى الله وادياً بالجمال مكللاً ... رعت عهدنا فيه عيون الأوابدِ
إذا ما تذكرت الصبا وعهوده ... تحدر دمع العين فوق الوسائدِ
سلام على النيل المبارك ما جرى ... وما هبت الأرواح بين المشاهدِ`,
    verses: [
      { first: 'ألا يا نسيم الفجر بلغ تحيتي', second: 'إلى أرض سودان الكرام الأماجدِ' },
      { first: 'ديارٍ بها شب الشباب مهذباً', second: 'كريم السجايا طاهر النفس ماجدِ' },
      { first: 'سقى الله وادياً بالجمال مكللاً', second: 'رعت عهدنا فيه عيون الأوابدِ' },
      { first: 'إذا ما تذكرت الصبا وعهوده', second: 'تحدر دمع العين فوق الوسائدِ' },
      { first: 'سلام على النيل المبارك ما جرى', second: 'وما هبت الأرواح بين المشاهدِ' }
    ],
    form: 'عمودي',
    categoryId: 'cat-amoudi',
    categoryName: 'الشعر العمودي الأصيل',
    literarySchool: 'كلاسيكي عمودي',
    writtenAt: '1928',
    source: 'ديوان العباسي، تحقيق محمد عبد الرحيم.',
    copyrightStatus: 'ملك عام أدبي',
    publicationStatus: 'approved',
    viewsCount: 1100,
    isFeatured: false,
    isPoemOfTheDay: false,
    approvedBy: 'إدارة منصة شعراء السودان',
    approvedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'poem-rawda-ush',
    poetId: 'poet-rawda',
    poetName: 'روضة الحاج',
    title: 'عشٌ للقصيدة',
    slug: 'ush-lil-qaseeda',
    poemText: `أنا لم أزل في الشرفة الخضراء أرتقب الصباح
وأمد كفي للندى العابق في زهر الأقاح
أبني لروحي مسكناً بين القصائد والضياء
وأعيد صياغة المدى نثراً ونبضاً من رجاء
كم غاب غيرك لم أشعر بفرقته
وأنت حين تغيب الأرض تغتربُ
يا ساكن الوجدان في زمن النوى
أهدي لعينيك القوافي والأدبُ`,
    verses: [
      { first: 'أنا لم أزل في الشرفة الخضراء أرتقب الصباح', second: 'وأمد كفي للندى العابق في زهر الأقاح' },
      { first: 'أبني لروحي مسكناً بين القصائد والضياء', second: 'وأعيد صياغة المدى نثراً ونبضاً من رجاء' },
      { first: 'كم غاب غيرك لم أشعر بفرقته', second: 'وأنت حين تغيب الأرض تغتربُ' },
      { first: 'يا ساكن الوجدان في زمن النوى', second: 'أهدي لعينيك القوافي والأدبُ' }
    ],
    form: 'عمودي',
    categoryId: 'cat-wajdan',
    categoryName: 'الشعر الوجداني',
    literarySchool: 'كلاسيكي عمودي',
    writtenAt: '2012',
    source: 'ديوان «عش للقصيدة» - الشاعرة روضة الحاج.',
    copyrightStatus: 'مرخص من الشاعرة لمنصة شعراء السودان',
    publicationStatus: 'approved',
    viewsCount: 1540,
    isFeatured: true,
    isPoemOfTheDay: false,
    approvedBy: 'إدارة منصة شعراء السودان',
    approvedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'poem-pending-sample-1',
    poetId: 'poet-rawda',
    poetName: 'روضة الحاج',
    title: 'في ساحل النيل القديم (مسودة مراجعة)',
    slug: 'fi-sahel-al-neel',
    poemText: `وقف الزمان هنا يحدق في المدى ... ورأى الشروق على الجبين تجددا
هذا هو النيل العظيم مهابةً ... ما زال يروي في القلوب المشهدا`,
    verses: [
      { first: 'وقف الزمان هنا يحدق في المدى', second: 'ورأى الشروق على الجبين تجددا' },
      { first: 'هذا هو النيل العظيم مهابةً', second: 'ما زال يروي في القلوب المشهدا' }
    ],
    form: 'عمودي',
    categoryId: 'cat-watan',
    categoryName: 'الشعر الوطني',
    literarySchool: 'كلاسيكي عمودي',
    writtenAt: '2025',
    source: 'مخطوطة حديثة مقدمة للإدارة',
    copyrightStatus: 'قيد الاعتماد التحريري',
    publicationStatus: 'pending_review',
    viewsCount: 45,
    isFeatured: false,
    isPoemOfTheDay: false,
    createdAt: '2026-02-10T00:00:00.000Z',
    updatedAt: '2026-02-10T00:00:00.000Z'
  }
];

// Seed Historical Collections / Dawaween
const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-eshraqa',
    poetId: 'poet-tijani',
    poetName: 'التجاني يوسف بشير',
    title: 'ديوان إشراقة',
    description: 'الديوان الخالد للشاعر التجاني يوسف بشير، يجمع درره الوجدانية وفلسفته الصوفية وبديع تأملاته في النيل والجمال والألم.',
    publicationYear: 1942,
    coverImage: '/src/assets/images/poet_manuscript_ink_1793826079779.jpg',
    publisher: 'لجنة تخليد التجاني يوسف بشير - القاهرة / الخرطوم',
    poemsCount: 42,
    poemIds: ['poem-tijani-mehrab'],
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'col-lahazat',
    poetId: 'poet-jamma',
    poetName: 'إدريس جمّاع',
    title: 'ديوان لحظات باقية',
    description: 'ديوان الشاعر الرقيق إدريس جمّاع، يوثق لحظات حبه ولوعته وشوقه وألمه الإنساني بأسلوب رومانسي غاية في الإتقان والعفة.',
    publicationYear: 1969,
    coverImage: '/src/assets/images/poet_manuscript_ink_1793826079779.jpg',
    publisher: 'دار الفكر - بيروت',
    poemsCount: 38,
    poemIds: ['poem-jamma-rabee'],
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'col-aghani-ifriqiya',
    poetId: 'poet-fayturi',
    poetName: 'محمد الفيتوري',
    title: 'ديوان أغاني إفريقيا',
    description: 'أول دواوين الشاعر محمد الفيتوري وصرخة الأدب السوداني والعربي الكبرى دفاعاً عن كرامة الإنسان وثورته التحررية.',
    publicationYear: 1956,
    coverImage: '/src/assets/images/sudan_nubian_heritage_1793826079691.jpg',
    publisher: 'دار الفكر العربي - القاهرة',
    poemsCount: 26,
    poemIds: [],
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'col-abbasi',
    poetId: 'poet-abbasi',
    poetName: 'محمد سعيد العباسي',
    title: 'ديوان العباسي',
    description: 'جامع قصائد رائد الشعر الكلاسيكي والعمودي السوداني، من بدائع الشعر العربي الرصين وفصيح البلاغة النيلية.',
    publicationYear: 1948,
    coverImage: '/src/assets/images/poet_manuscript_ink_1793826079779.jpg',
    publisher: 'مطبعة مصر - القاهرة',
    poemsCount: 54,
    poemIds: ['poem-abbasi-tahiyya'],
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

// Seed Users for all roles
const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    fullName: 'أستاذ بدر الدين الطيب',
    email: 'admin@poets.sd',
    phone: '+249 91 234 5678',
    role: 'admin',
    accountStatus: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-poet-demo',
    fullName: 'روضة الحاج محمد',
    email: 'poet@poets.sd',
    phone: '+249 92 345 6789',
    role: 'approved_poet',
    accountStatus: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-pending-demo',
    fullName: 'عثمان عبد الله الصديق',
    email: 'pending@poets.sd',
    phone: '+249 93 456 7890',
    role: 'pending_poet',
    accountStatus: 'active',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z'
  },
  {
    id: 'user-reader-demo',
    fullName: 'سامي عبد الرحمن النور',
    email: 'reader@poets.sd',
    role: 'reader',
    accountStatus: 'active',
    createdAt: '2026-02-05T00:00:00.000Z',
    updatedAt: '2026-02-05T00:00:00.000Z'
  }
];

// Seed Pending Applications for the Admin Dashboard to Review
const INITIAL_APPLICATIONS: PoetApplication[] = [
  {
    id: 'app-osman-pending',
    userId: 'user-pending-demo',
    userEmail: 'pending@poets.sd',
    fullName: 'عثمان عبد الله الصديق',
    literaryName: 'عثمان الصديق النيلي',
    phone: '+249 93 456 7890',
    biography: 'شاعر سوداني معاصر من مواليد مدينة ود مدني، تخرج في كلية الآداب قسم اللغة العربية. يكتب الشعر العربي العمودي الرصين، وشارك في عدد من المنتديات الأدبية بالخرطوم والجزيرة وله قصائد منشورة في المجلات الثقافية.',
    city: 'ود مدني / الجزيرة',
    birthYear: 1988,
    literarySchool: 'كلاسيكي عمودي',
    socialLinks: 'https://twitter.com/osman_poet_sd',
    publishedWorksLinks: 'مجلة حروف الأدبية، العدد 45',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    literarySamples: [
      {
        title: 'مناجاة إلى النيل الأزرق',
        poemText: `ظمئت إلى رؤياك يا جدول الهدى ... ففاضت بقلبي من هواك جداولُ
ورحت أناجي الصبح فيك تأملاً ... كما رنمت فوق الغصون بلابلُ
لك المجد في سوداننا شيم العلا ... تصونك أجيالٌ ونفسٌ وباسلُ`,
        poemType: 'عمودي',
        source: 'مخطوطة شعرية قيد النشر'
      },
      {
        title: 'أطياف من وادي أم درمان',
        poemText: `حييّت أم درمان في غسق الدجى ... ورأيت أنوار الأصالة تشرقُ
بلدٌ به ولد الفداء مخلداً ... وبكل ركنٍ للكرامة مفرقُ`,
        poemType: 'عمودي',
        source: 'ألقيت في منتدى الرواد الثقافي 2024'
      }
    ],
    agreedToTerms: true,
    agreedToOriginality: true,
    status: 'pending',
    adminNotes: '',
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z'
  }
];

// Seed Audit Logs
const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    adminId: 'user-admin',
    adminName: 'أستاذ بدر الدين الطيب',
    action: 'اعتماد قصيدة',
    entityType: 'poem',
    entityId: 'poem-hadi-aghadan',
    details: 'تم تعيين قصيدة «أغداً ألقاك» كقصيدة اليوم واعتماد نصها المحقق.',
    createdAt: '2026-01-02T14:30:00.000Z'
  },
  {
    id: 'log-2',
    adminId: 'user-admin',
    adminName: 'أستاذ بدر الدين الطيب',
    action: 'توثيق شاعر',
    entityType: 'poet',
    entityId: 'poet-rawda',
    details: 'منح شارة التوثيق للشاعرة روضة الحاج وتفعيل صفحتها الرسمية.',
    createdAt: '2026-01-03T11:15:00.000Z'
  }
];

// Seed Reports
const INITIAL_REPORTS: ContentReport[] = [
  {
    id: 'rep-1',
    userId: 'user-reader-demo',
    userEmail: 'reader@poets.sd',
    contentType: 'poem',
    contentId: 'poem-abbasi-tahiyya',
    contentTitle: 'تحية السودان والعهد القديم',
    reason: 'typo_error',
    details: 'اقتراح مراجعة تشكيل كلمة «الأماجدِ» في الشطر الأول من البيت الأول حسب طبعة 1948.',
    status: 'pending',
    createdAt: '2026-02-06T09:00:00.000Z'
  }
];

// Seed Notifications
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-poet-demo',
    title: 'مرحباً بك في ديوان شعراء السودان',
    message: 'تم تفعيل حسابك كشاعر معتمد على المنصة. يمكنك الآن إضافة قصائدك وإدارة ديوانك الأدبي.',
    type: 'success',
    isRead: false,
    createdAt: '2026-01-01T12:00:00.000Z'
  },
  {
    id: 'notif-2',
    userId: 'user-pending-demo',
    title: 'استلام طلب الانضمام للديوان',
    message: 'تم استلام طلب انضمامك بنجاح. ملفك الأدبي ونماذج قصائدك حالياً قيد المراجعة لدى هيئة التحرير.',
    type: 'info',
    isRead: false,
    createdAt: '2026-02-01T10:05:00.000Z'
  }
];

// Helper to safely load from LocalStorage with fallback
function loadData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save to ${key}:`, err);
  }
}

// Storage Service API
export const StorageService = {
  // Reset / Re-seed function for administrative utility
  resetToDefaults: () => {
    saveData(STORAGE_KEYS.USERS, INITIAL_USERS);
    saveData(STORAGE_KEYS.POETS, INITIAL_POETS);
    saveData(STORAGE_KEYS.POEMS, INITIAL_POEMS);
    saveData(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    saveData(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS);
    saveData(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    saveData(STORAGE_KEYS.FAVORITES, []);
    saveData(STORAGE_KEYS.FOLLOWS, []);
    saveData(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    saveData(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    saveData(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  // USERS
  getUsers: (): User[] => loadData(STORAGE_KEYS.USERS, INITIAL_USERS),
  getUserById: (id: string): User | undefined => {
    return StorageService.getUsers().find(u => u.id === id);
  },
  getUserByEmail: (email: string): User | undefined => {
    return StorageService.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  saveUser: (user: User): User => {
    const users = StorageService.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      users.push(user);
    }
    saveData(STORAGE_KEYS.USERS, users);
    return user;
  },
  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // POETS
  getPoets: (): PoetProfile[] => loadData(STORAGE_KEYS.POETS, INITIAL_POETS),
  getPoetById: (id: string): PoetProfile | undefined => {
    return StorageService.getPoets().find(p => p.id === id);
  },
  getPoetBySlug: (slug: string): PoetProfile | undefined => {
    return StorageService.getPoets().find(p => p.profileSlug === slug);
  },
  getPoetByUserId: (userId: string): PoetProfile | undefined => {
    return StorageService.getPoets().find(p => p.userId === userId);
  },
  savePoet: (poet: PoetProfile): PoetProfile => {
    const poets = StorageService.getPoets();
    const idx = poets.findIndex(p => p.id === poet.id);
    if (idx >= 0) {
      poets[idx] = { ...poet, updatedAt: new Date().toISOString() };
    } else {
      poets.unshift(poet);
    }
    saveData(STORAGE_KEYS.POETS, poets);
    return poet;
  },

  // POEMS
  getPoems: (): Poem[] => loadData(STORAGE_KEYS.POEMS, INITIAL_POEMS),
  getApprovedPoems: (): Poem[] => {
    return StorageService.getPoems().filter(p => p.publicationStatus === 'approved');
  },
  getPoemById: (id: string): Poem | undefined => {
    return StorageService.getPoems().find(p => p.id === id);
  },
  getPoemBySlug: (slug: string): Poem | undefined => {
    return StorageService.getPoems().find(p => p.slug === slug);
  },
  getPoemsByPoetId: (poetId: string, includeUnapproved = false): Poem[] => {
    return StorageService.getPoems().filter(p => 
      p.poetId === poetId && (includeUnapproved || p.publicationStatus === 'approved')
    );
  },
  getPoemOfTheDay: (): Poem | undefined => {
    const approved = StorageService.getApprovedPoems();
    return approved.find(p => p.isPoemOfTheDay) || approved[0];
  },
  incrementPoemViews: (poemId: string): void => {
    const poems = StorageService.getPoems();
    const p = poems.find(x => x.id === poemId);
    if (p) {
      p.viewsCount = (p.viewsCount || 0) + 1;
      saveData(STORAGE_KEYS.POEMS, poems);
    }
  },
  savePoem: (poem: Poem): Poem => {
    const poems = StorageService.getPoems();
    const idx = poems.findIndex(p => p.id === poem.id);
    if (idx >= 0) {
      poems[idx] = { ...poem, updatedAt: new Date().toISOString() };
    } else {
      poems.unshift(poem);
    }
    saveData(STORAGE_KEYS.POEMS, poems);
    return poem;
  },
  deletePoem: (id: string): void => {
    const poems = StorageService.getPoems().filter(p => p.id !== id);
    saveData(STORAGE_KEYS.POEMS, poems);
  },

  // CATEGORIES
  getCategories: (): Category[] => loadData(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES),
  saveCategory: (cat: Category): Category => {
    const cats = StorageService.getCategories();
    const idx = cats.findIndex(c => c.id === cat.id);
    if (idx >= 0) {
      cats[idx] = cat;
    } else {
      cats.push(cat);
    }
    saveData(STORAGE_KEYS.CATEGORIES, cats);
    return cat;
  },
  deleteCategory: (id: string): void => {
    const cats = StorageService.getCategories().filter(c => c.id !== id);
    saveData(STORAGE_KEYS.CATEGORIES, cats);
  },

  // COLLECTIONS (DAWAWEEN)
  getCollections: (): Collection[] => loadData(STORAGE_KEYS.COLLECTIONS, INITIAL_COLLECTIONS),
  getCollectionsByPoetId: (poetId: string): Collection[] => {
    return StorageService.getCollections().filter(c => c.poetId === poetId);
  },
  saveCollection: (col: Collection): Collection => {
    const cols = StorageService.getCollections();
    const idx = cols.findIndex(c => c.id === col.id);
    if (idx >= 0) {
      cols[idx] = col;
    } else {
      cols.unshift(col);
    }
    saveData(STORAGE_KEYS.COLLECTIONS, cols);
    return col;
  },

  // POET APPLICATIONS
  getApplications: (): PoetApplication[] => loadData(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS),
  getApplicationById: (id: string): PoetApplication | undefined => {
    return StorageService.getApplications().find(a => a.id === id);
  },
  getApplicationByUserId: (userId: string): PoetApplication | undefined => {
    return StorageService.getApplications().find(a => a.userId === userId);
  },
  saveApplication: (app: PoetApplication): PoetApplication => {
    const apps = StorageService.getApplications();
    const idx = apps.findIndex(a => a.id === app.id);
    if (idx >= 0) {
      apps[idx] = { ...app, updatedAt: new Date().toISOString() };
    } else {
      apps.unshift(app);
    }
    saveData(STORAGE_KEYS.APPLICATIONS, apps);
    return app;
  },

  // FAVORITES
  getFavorites: (userId: string): string[] => {
    const favs = loadData<FavoriteItem[]>(STORAGE_KEYS.FAVORITES, []);
    return favs.filter(f => f.userId === userId).map(f => f.poemId);
  },
  toggleFavorite: (userId: string, poemId: string): boolean => {
    const favs = loadData<FavoriteItem[]>(STORAGE_KEYS.FAVORITES, []);
    const idx = favs.findIndex(f => f.userId === userId && f.poemId === poemId);
    let isFav = false;
    if (idx >= 0) {
      favs.splice(idx, 1);
      isFav = false;
    } else {
      favs.push({
        id: `fav-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId,
        poemId,
        createdAt: new Date().toISOString()
      });
      isFav = true;
    }
    saveData(STORAGE_KEYS.FAVORITES, favs);
    return isFav;
  },

  // FOLLOWING
  getFollowedPoetIds: (userId: string): string[] => {
    const follows = loadData<FollowItem[]>(STORAGE_KEYS.FOLLOWS, []);
    return follows.filter(f => f.userId === userId).map(f => f.poetId);
  },
  toggleFollow: (userId: string, poetId: string): boolean => {
    const follows = loadData<FollowItem[]>(STORAGE_KEYS.FOLLOWS, []);
    const idx = follows.findIndex(f => f.userId === userId && f.poetId === poetId);
    let isFollowed = false;
    if (idx >= 0) {
      follows.splice(idx, 1);
      isFollowed = false;
    } else {
      follows.push({
        id: `fol-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId,
        poetId,
        createdAt: new Date().toISOString()
      });
      isFollowed = true;
    }
    saveData(STORAGE_KEYS.FOLLOWS, follows);
    return isFollowed;
  },

  // NOTIFICATIONS
  getNotifications: (userId: string): AppNotification[] => {
    const all = loadData<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return all.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  addNotification: (userId: string, title: string, message: string, type: AppNotification['type'] = 'info'): void => {
    const all = loadData<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    all.unshift({
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    });
    saveData(STORAGE_KEYS.NOTIFICATIONS, all);
  },
  markNotificationRead: (notifId: string): void => {
    const all = loadData<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const n = all.find(x => x.id === notifId);
    if (n) {
      n.isRead = true;
      saveData(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  },

  // REPORTS
  getReports: (): ContentReport[] => loadData(STORAGE_KEYS.REPORTS, INITIAL_REPORTS),
  saveReport: (report: ContentReport): ContentReport => {
    const reports = StorageService.getReports();
    reports.unshift(report);
    saveData(STORAGE_KEYS.REPORTS, reports);
    return report;
  },
  updateReportStatus: (id: string, status: ContentReport['status']): void => {
    const reports = StorageService.getReports();
    const r = reports.find(x => x.id === id);
    if (r) {
      r.status = status;
      saveData(STORAGE_KEYS.REPORTS, reports);
    }
  },

  // AUDIT LOGS
  getAuditLogs: (): AuditLog[] => loadData(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS),
  addAuditLog: (adminId: string, adminName: string, action: string, entityType: AuditLog['entityType'], entityId: string, details: string): void => {
    const logs = StorageService.getAuditLogs();
    logs.unshift({
      id: `log-${Date.now()}`,
      adminId,
      adminName,
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString()
    });
    saveData(STORAGE_KEYS.AUDIT_LOGS, logs);
  },

  // SMART SEARCH ENGINE
  searchAll: (query: string) => {
    const normalized = normalizeArabicText(query);
    if (!normalized) {
      return { poets: [], poems: [], collections: [], categories: [] };
    }

    const poets = StorageService.getPoets().filter(p => {
      return (
        normalizeArabicText(p.literaryName).includes(normalized) ||
        normalizeArabicText(p.fullName || '').includes(normalized) ||
        normalizeArabicText(p.city).includes(normalized) ||
        normalizeArabicText(p.biography).includes(normalized) ||
        normalizeArabicText(p.literarySchool).includes(normalized)
      );
    });

    const poems = StorageService.getApprovedPoems().filter(p => {
      const matchTitle = normalizeArabicText(p.title).includes(normalized);
      const matchPoet = normalizeArabicText(p.poetName).includes(normalized);
      const matchCat = normalizeArabicText(p.categoryName).includes(normalized);
      const matchText = normalizeArabicText(p.poemText).includes(normalized);
      return matchTitle || matchPoet || matchCat || matchText;
    });

    const collections = StorageService.getCollections().filter(c => {
      return (
        normalizeArabicText(c.title).includes(normalized) ||
        normalizeArabicText(c.poetName).includes(normalized) ||
        normalizeArabicText(c.description).includes(normalized)
      );
    });

    const categories = StorageService.getCategories().filter(cat => {
      return (
        normalizeArabicText(cat.name).includes(normalized) ||
        normalizeArabicText(cat.description).includes(normalized)
      );
    });

    return { poets, poems, collections, categories };
  }
};
