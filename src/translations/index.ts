export type Language = 'en' | 'ar';

export interface Translations {
  // Navigation & Brand
  appName: string;
  tagline: string;
  searchPlaceholder: string;
  searchItemsPlaceholder: string;
  newReport: string;
  notifications: string;
  dashboard: string;
  maintenance: string;
  myReports: string;
  submitIssue: string;
  lostAndFound: string;
  lostItems: string;
  foundItems: string;
  claimRequests: string;
  updates: string;
  emergencyHotline: string;
  emergencyOps: string;
  helpCenter: string;
  
  // Roles
  student: string;
  doctor: string;
  admin: string;
  studentView: string;
  doctorView: string;
  adminHub: string;
  activeWorkspace: string;
  roleDescStudent: string;
  roleDescDoctor: string;
  roleDescAdmin: string;

  // Header & User
  welcomeBack: string;
  academicTerm: string;
  opsNominal: string;
  noticeHVAC: string;
  
  // Dashboard Metrics
  totalSubmitted: string;
  inProgressRepairs: string;
  resolvedIssues: string;
  lostFoundMatches: string;
  activeNow: string;
  satisfactionRating: string;
  newMatches: string;
  activeSemesterTracking: string;
  avgResolutionSLA: string;

  // Active Maintenance
  activeMaintenanceReports: string;
  activeTrackingCount: string;
  realtimeDispatched: string;
  viewAuditTrail: string;
  reportIssueBtn: string;
  lostDirectory: string;
  dispatchedAgo: string;
  quickPingTech: string;
  addPhoto: string;
  feedback: string;
  
  // Lost & Found
  lostFoundRegistry: string;
  activeItemsCount: string;
  recentVerifiedEntries: string;
  browseAllItems: string;
  submitFastClaim: string;
  reportLostItem: string;
  reportFoundItem: string;
  safeWithSecurity: string;
  reportedLost: string;
  claimPending: string;
  returnedResolved: string;
  initiateClaim: string;
  matchFoundItem: string;
  underReview: string;
  archivedRecord: string;
  allCategories: string;
  allLocations: string;
  anyTime: string;

  // Live Activity Stream
  campusActivityFeed: string;
  live: string;

  // Submit Issue Wizard
  submitTitle: string;
  stepIndicator: string;
  issueTitleLabel: string;
  issueTitlePlaceholder: string;
  categoryLabel: string;
  categorySelectHint: string;
  locationHierarchy: string;
  building: string;
  floor: string;
  room: string;
  priorityLabel: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  quickSnippets: string;
  photoEvidence: string;
  dropzoneText: string;
  dropzoneSubtext: string;
  assetBarcode: string;
  assetBarcodeHint: string;
  saveDraft: string;
  submitAndGenerateTracking: string;

  // Live Tracking
  liveTrackingCase: string;
  statusInProgress: string;
  statusPending: string;
  statusResolved: string;
  eta: string;
  ticketSubmitted: string;
  technicianDispatched: string;
  inRepair: string;
  resolvedSignoff: string;
  fieldScan: string;

  // Admin Dashboard
  adminConsoleTitle: string;
  adminSubtitle: string;
  opsCommandCore: string;
  academicYear: string;
  allDepartments: string;
  last30Days: string;
  broadcastNotice: string;
  exportReports: string;
  workOrdersTab: string;
  pendingClaimsTab: string;
  userDirectoryTab: string;
  categoryBreakdown: string;
  zoneEfficiency: string;
  fieldTechnicians: string;
  openWorkOrders: string;
  avgResolutionTime: string;
  activeClaims: string;
  activeTechnicians: string;
  approveClaim: string;
  rejectClaim: string;
  requestAdditionalProof: string;

  // Status & Priority labels
  priorityLow: string;
  priorityModerate: string;
  priorityHigh: string;
  priorityUrgent: string;
  categoryElectricity: string;
  categoryAC: string;
  categoryNetwork: string;
  categoryFurniture: string;
  categoryCleaning: string;
  categoryLab: string;
  categoryOther: string;

  // Modals & Forms
  secureClaimTitle: string;
  privateFeaturesLabel: string;
  privateFeaturesPlaceholder: string;
  privateFeaturesHint: string;
  proofUploadLabel: string;
  proofUploadPlaceholder: string;
  pickupMethodLabel: string;
  centralDeskPickup: string;
  centralDeskDesc: string;
  deanPickup: string;
  deanPickupDesc: string;
  submitClaimBtn: string;
  close: string;
  cancel: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "UniHelp",
    tagline: "University Support & Facilities Platform",
    searchPlaceholder: "Search lost and found items...",
    searchItemsPlaceholder: "Search by keyword (e.g. iPad, AirPods, HydroFlask, student card, brown wallet, locker keys)...",
    newReport: "New Report",
    notifications: "Notifications",
    dashboard: "Dashboard",
    maintenance: "Maintenance",
    myReports: "My Reports",
    submitIssue: "Submit Issue",
    lostAndFound: "Lost & Found",
    lostItems: "Lost Items",
    foundItems: "Found Items",
    claimRequests: "Claim Requests",
    updates: "Updates",
    emergencyHotline: "Emergency Hotline",
    emergencyOps: "Ext: 4444 (Campus Ops)",
    helpCenter: "Help & Protocol Center",
    
    student: "Student",
    doctor: "Doctor",
    admin: "Admin",
    studentView: "Student View",
    doctorView: "Doctor View",
    adminHub: "Admin Hub",
    activeWorkspace: "Active Workspace:",
    roleDescStudent: "Self-reporting mode enabled for labs & lecture halls.",
    roleDescDoctor: "Faculty priority reporting enabled for classrooms and offices.",
    roleDescAdmin: "Full administrative dispatch, review, and analytics control.",

    welcomeBack: "Welcome back",
    academicTerm: "Term 2 • Academic Session",
    opsNominal: "Operations 98.4% Nominal",
    noticeHVAC: "HVAC seasonal servicing scheduled for Engineering Labs tomorrow 08:00 AM",
    
    totalSubmitted: "Total Submitted",
    inProgressRepairs: "In-Progress Repairs",
    resolvedIssues: "Resolved Issues",
    lostFoundMatches: "Lost & Found Matches",
    activeNow: "Active Now",
    satisfactionRating: "100% Student satisfaction rating",
    newMatches: "New Matches",
    activeSemesterTracking: "Active academic semester tracking",
    avgResolutionSLA: "Avg resolution SLA: 4.2 hours",

    activeMaintenanceReports: "Active Maintenance Reports",
    activeTrackingCount: "tracking",
    realtimeDispatched: "Real-time status updates dispatched to campus physical plant teams",
    viewAuditTrail: "View Complete Audit Trail & Notes",
    reportIssueBtn: "+ Report Maintenance Issue",
    lostDirectory: "Lost Directory",
    dispatchedAgo: "Dispatched",
    quickPingTech: "Quick Ping Tech",
    addPhoto: "Add Photo",
    feedback: "Feedback",

    lostFoundRegistry: "Campus Lost & Found Central Registry",
    activeItemsCount: "Active Items",
    recentVerifiedEntries: "Recent verified entries cataloged at campus custodial hubs",
    browseAllItems: "Browse All Items",
    submitFastClaim: "Submit Fast Claim",
    reportLostItem: "+ Report Lost Item",
    reportFoundItem: "+ Report Found Item",
    safeWithSecurity: "Safe with Security",
    reportedLost: "Reported Lost",
    claimPending: "Claim Pending",
    returnedResolved: "Returned / Reclaimed",
    initiateClaim: "Initiate Identity Claim",
    matchFoundItem: "Match Found Item",
    underReview: "Under Review by Staff",
    archivedRecord: "Archived Record",
    allCategories: "All Categories",
    allLocations: "All Locations",
    anyTime: "Any Time",

    campusActivityFeed: "Campus Activity Feed",
    live: "Live",

    submitTitle: "Submit a Maintenance or Facility Issue",
    stepIndicator: "Step 1 of 3 • Details & Location",
    issueTitleLabel: "Issue Title",
    issueTitlePlaceholder: "e.g. Broken laboratory fume hood sash or ceiling leak...",
    categoryLabel: "Category Classification",
    categorySelectHint: "Select one facility domain",
    locationHierarchy: "Campus Location Hierarchy",
    building: "Building",
    floor: "Floor / Level",
    room: "Room / Zone",
    priorityLabel: "Priority Urgency Level",
    descriptionLabel: "Detailed Symptoms & Description",
    descriptionPlaceholder: "Describe the issue symptoms, safety risks, and when it started...",
    quickSnippets: "Quick Snippets:",
    photoEvidence: "Photo / Video Evidence & Asset Identification",
    dropzoneText: "Drag and drop or Browse",
    dropzoneSubtext: "Supports JPG, PNG, HEIC, MP4 (Max 15MB)",
    assetBarcode: "Asset Barcode",
    assetBarcodeHint: "Attach campus facility sticker tag from the unit frame",
    saveDraft: "Save Draft",
    submitAndGenerateTracking: "Submit Report & Generate Tracking ID",

    liveTrackingCase: "Live Tracking Case",
    statusInProgress: "STATUS: IN PROGRESS",
    statusPending: "STATUS: PENDING DISPATCH",
    statusResolved: "STATUS: RESOLVED",
    eta: "ETA ~ 2:00 PM",
    ticketSubmitted: "1. Ticket Submitted",
    technicianDispatched: "2. Technician Dispatched",
    inRepair: "3. In Repair (Active Diagnostics)",
    resolvedSignoff: "4. Resolution & Sign-off",
    fieldScan: "FIELD SCAN",

    adminConsoleTitle: "Facilities & Campus Services Management Console",
    adminSubtitle: "Central Administration • Real-Time Campus Infrastructure Oversight & Audit Logs",
    opsCommandCore: "Ops Command Core",
    academicYear: "Academic Year 2024–2025",
    allDepartments: "All Departments (Unified)",
    last30Days: "Last 30 Days",
    broadcastNotice: "Broadcast Notice",
    exportReports: "Export Reports",
    workOrdersTab: "Maintenance Work Orders",
    pendingClaimsTab: "Pending Claim Reviews",
    userDirectoryTab: "User Directory",
    categoryBreakdown: "Issue Category Breakdown",
    zoneEfficiency: "Zone Resolution Efficiency",
    fieldTechnicians: "Field Technicians",
    openWorkOrders: "Open Work Orders",
    avgResolutionTime: "Avg Resolution Time",
    activeClaims: "Claims Pending",
    activeTechnicians: "Technicians Online",
    approveClaim: "Approve & Log Release",
    rejectClaim: "Reject Claim",
    requestAdditionalProof: "Request Additional Proof",

    priorityLow: "Low Priority",
    priorityModerate: "Moderate Queue",
    priorityHigh: "High Priority",
    priorityUrgent: "Urgent Hazard",
    categoryElectricity: "Electricity",
    categoryAC: "Air Conditioning",
    categoryNetwork: "Network & Wi-Fi",
    categoryFurniture: "Furniture",
    categoryCleaning: "Janitorial & Cleaning",
    categoryLab: "Laboratory Equipment",
    categoryOther: "Other Infrastructure",

    secureClaimTitle: "Submit Secure Claim Request",
    privateFeaturesLabel: "Private Identifying Features / Description",
    privateFeaturesPlaceholder: "Describe confidential traits: Lock screen wallpaper (e.g., photo of golden retriever), specific serial number, stickers behind case, distinct scratch on bottom bezel, engraved initials, or content of notes app...",
    privateFeaturesHint: "Visible only to verified Campus Security Administrators to prevent fraudulent pickup.",
    proofUploadLabel: "Proof of Ownership Documentation (Optional)",
    proofUploadPlaceholder: "Click to upload receipt, Apple ID dashboard, or serial number screenshot",
    pickupMethodLabel: "Preferred Reclaim Method",
    centralDeskPickup: "Central Security Desk",
    centralDeskDesc: "Admin Tower, 1st Floor (Window 3)",
    deanPickup: "Department Dean Pickup",
    deanPickupDesc: "Engineering Student Affairs Lobby",
    submitClaimBtn: "Submit Verified Claim Request",
    close: "Close",
    cancel: "Cancel"
  },
  ar: {
    appName: "UniHelp",
    tagline: "منصة الصيانة والدعم الجامعي",
    searchPlaceholder: "ابحث عن العناصر المفقودة أو التي تم العثور عليها...",
    searchItemsPlaceholder: "البحث بالكلمات المفتاحية (مثل: آيباد، سماعات، زجاجة ماء، بطاقة جامعية، محفظة)...",
    newReport: "بلاغ جديد",
    notifications: "الإشعارات",
    dashboard: "لوحة التحكم",
    maintenance: "الصيانة",
    myReports: "بلاغاتي",
    submitIssue: "تقديم بلاغ",
    lostAndFound: "المفقودات والمعثورات",
    lostItems: "المفقودات",
    foundItems: "المعثورات",
    claimRequests: "طلبات استعادة المفقودات",
    updates: "التحديثات",
    emergencyHotline: "خط الطوارئ",
    emergencyOps: "تحويلة: 4444 (عمليات الحرم)",
    helpCenter: "مركز المساعدة",

    student: "طالب",
    doctor: "عضو هيئة تدريس",
    admin: "مشرف النظام",
    studentView: "واجهة الطالب",
    doctorView: "واجهة عضو هيئة التدريس",
    adminHub: "مركز الإدارة",
    activeWorkspace: "مساحة العمل الحالية:",
    roleDescStudent: "تم تفعيل وضع البلاغات الذاتية للمختبرات وقاعات المحاضرات.",
    roleDescDoctor: "تم تفعيل أولوية البلاغات لأعضاء هيئة التدريس والقاعات الدراسية والمكاتب.",
    roleDescAdmin: "تحكم كامل في توجيه الفنيين، مراجعة المطالبات، والتحليلات المباشرة.",

    welcomeBack: "مرحبًا بعودتك",
    academicTerm: "الفصل الدراسي الثاني",
    opsNominal: "العمليات تعمل بنسبة 98.4%",
    noticeHVAC: "صيانة التكييف المجدولة لمختبرات الهندسة غدًا في تمام الساعة 08:00 صباحًا",

    totalSubmitted: "إجمالي البلاغات",
    inProgressRepairs: "أعمال قيد التنفيذ",
    resolvedIssues: "البلاغات المكتملة",
    lostFoundMatches: "عناصر تم العثور عليها",
    activeNow: "نشط الآن",
    satisfactionRating: "نسبة رضا الطلاب 100%",
    newMatches: "تطابقات جديدة",
    activeSemesterTracking: "تتبع الفصل الدراسي الحالي",
    avgResolutionSLA: "متوسط وقت الحل: 4.2 ساعات",

    activeMaintenanceReports: "بلاغات الصيانة النشطة",
    activeTrackingCount: "قيد المتابعة",
    realtimeDispatched: "تحديثات فورية يتم إرسالها لفرق الصيانة الميدانية في الحرم الجامعي",
    viewAuditTrail: "عرض سجل التدقيق الكامل والملاحظات",
    reportIssueBtn: "+ تسجيل بلاغ صيانة",
    lostDirectory: "سجل المفقودات",
    dispatchedAgo: "تم التوجيه",
    quickPingTech: "تنبيه سريع للفني",
    addPhoto: "إضافة صورة",
    feedback: "تقييم الخدمة",

    lostFoundRegistry: "السجل المركزي للمفقودات والمعثورات",
    activeItemsCount: "عنصر مسجل",
    recentVerifiedEntries: "أحدث المدخلات الموثقة والمحفوظة لدى مكاتب الأمن والحراسة",
    browseAllItems: "تصفح جميع العناصر",
    submitFastClaim: "تقديم مطالبة سريعة",
    reportLostItem: "+ الإبلاغ عن مفقود",
    reportFoundItem: "+ الإبلاغ عن معثور عليه",
    safeWithSecurity: "في حوزة الأمن الجامعي",
    reportedLost: "مفقود مسجل",
    claimPending: "مطالبة قيد المراجعة",
    returnedResolved: "تم الاسترداد للمالك",
    initiateClaim: "بدء إجراءات إثبات الملكية",
    matchFoundItem: "مطابقة معثور عليه",
    underReview: "قيد المراجعة من المشرف",
    archivedRecord: "سجل مؤرشف",
    allCategories: "جميع الفئات",
    allLocations: "جميع المباني والمواقع",
    anyTime: "أي وقت",

    campusActivityFeed: "نشاط الحرم الجامعي المباشر",
    live: "مباشر",

    submitTitle: "الإبلاغ عن عطل أو مشكلة صيانة",
    stepIndicator: "الخطوة 1 من 3 • التفاصيل والموقع",
    issueTitleLabel: "عنوان البلاغ",
    issueTitlePlaceholder: "مثال: عطل في شاشة العرض أو تسريب مياه في السقف...",
    categoryLabel: "تصنيف المشكلة",
    categorySelectHint: "اختر نوع المشكلة",
    locationHierarchy: "موقع الحرم الجامعي",
    building: "المبنى",
    floor: "الطابق / المستوى",
    room: "القاعة أو الغرفة",
    priorityLabel: "مستوى الأولوية والاستعجال",
    descriptionLabel: "وصف المشكلة",
    descriptionPlaceholder: "اشرح المشكلة، مخاطر السلامة المحتملة، ووقت حدوثها...",
    quickSnippets: "أوصاف مقترحة:",
    photoEvidence: "الصور والأدلة ورقم الأصل (الباركود)",
    dropzoneText: "اسحب الصورة هنا أو اختر ملفًا",
    dropzoneSubtext: "الصور والفيديوهات حتى 15 ميجابايت",
    assetBarcode: "رمز الأصل (الباركود)",
    assetBarcodeHint: "أدخل رقم الملصق المثبت على الجهاز أو الوحدة",
    saveDraft: "حفظ كمسودة",
    submitAndGenerateTracking: "إرسال البلاغ وإنشاء رقم تتبّع",

    liveTrackingCase: "حالة تتبع مباشرة",
    statusInProgress: "الحالة: قيد الصيانة والإصلاح",
    statusPending: "بانتظار توجيه الفني",
    statusResolved: "تم الإصلاح",
    eta: "الوقت المقدر ~ 2:00 مساءً",
    ticketSubmitted: "1. تم استلام البلاغ",
    technicianDispatched: "2. تم توجيه الفني المختص",
    inRepair: "3. قيد الإصلاح (فحص تشخيصي)",
    resolvedSignoff: "4. اكتمال الإصلاح والاعتماد",
    fieldScan: "مسح ميداني",

    adminConsoleTitle: "منصة إدارة المرافق والخدمات الجامعية",
    adminSubtitle: "الإدارة المركزية • المتابعة اللحظية للبنية التحتية وسجلات التدقيق",
    opsCommandCore: "مركز التحكم بالعمليات",
    academicYear: "العام الأكاديمي 2024–2025",
    allDepartments: "جميع الكليات والأقسام",
    last30Days: "آخر 30 يومًا",
    broadcastNotice: "بث تنبيه عام",
    exportReports: "تصدير التقارير",
    workOrdersTab: "أوامر عمل الصيانة",
    pendingClaimsTab: "مراجعة طلبات الاسترداد",
    userDirectoryTab: "دليل المستخدمين",
    categoryBreakdown: "توزيع البلاغات حسب الفئة",
    zoneEfficiency: "كفاءة الاستجابة حسب المنطقة",
    fieldTechnicians: "الفنيون الميدانيون",
    openWorkOrders: "أوامر العمل المفتوحة",
    avgResolutionTime: "متوسط وقت الحل",
    activeClaims: "مطالبات قيد التحقق",
    activeTechnicians: "فنيون متصلون",
    approveClaim: "اعتماد وتسليم العنصر",
    rejectClaim: "رفض المطالبة",
    requestAdditionalProof: "طلب إثباتات إضافية",

    priorityLow: "أولوية منخفضة",
    priorityModerate: "أولوية متوسطة",
    priorityHigh: "أولوية مرتفعة",
    priorityUrgent: "طارئ / خطر سلامة",
    categoryElectricity: "الكهرباء والإنارة",
    categoryAC: "التكييف والتهوية",
    categoryNetwork: "الشبكة والإنترنت",
    categoryFurniture: "الأثاث المكتبي والمقاعد",
    categoryCleaning: "النظافة والصحة البيئية",
    categoryLab: "المختبرات والوسائط التعليمية",
    categoryOther: "مرافق وبنية تحتية أخرى",

    secureClaimTitle: "طلب استعادة العنصر بأمان",
    privateFeaturesLabel: "علامات سرية تثبت ملكيتك للعنصر",
    privateFeaturesPlaceholder: "اذكر تفاصيل لا تظهر في الصور، مثل الرقم التسلسلي أو خدش مميز أو ملصق على الغطاء...",
    privateFeaturesHint: "لن تظهر هذه المعلومات إلا لمسؤولي الأمن للتحقق من الملكية.",
    proofUploadLabel: "مستندات إثبات الملكية (اختياري)",
    proofUploadPlaceholder: "اضغط لرفع فاتورة الشراء، لقطة شاشة للحساب أو الرقم التسلسلي",
    pickupMethodLabel: "طريقة الاستلام المفضلة",
    centralDeskPickup: "مكتب الأمن المركزي",
    centralDeskDesc: "برج الإدارة، الدور الأرضي (شباك 3)",
    deanPickup: "مكتب شؤون الطلاب بالكلية",
    deanPickupDesc: "بهو كلية الهندسة والحاسب",
    submitClaimBtn: "إرسال طلب الاسترداد",
    close: "إغلاق",
    cancel: "إلغاء"
  }
};
