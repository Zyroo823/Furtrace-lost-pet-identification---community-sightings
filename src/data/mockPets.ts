import { LostPet, Sighting, PetMatch } from '../types';

export const LAPU_LAPU_CENTER = { lat: 10.3157, lng: 123.9511 };

export const LAPU_LAPU_BARANGAYS = [
  { name: 'All Barangays', coords: LAPU_LAPU_CENTER, zoom: 13 },
  { name: 'Barangay Poblacion (City Hall / Plaza)', coords: { lat: 10.3142, lng: 123.9495 }, zoom: 15 },
  { name: 'Barangay Pusok (Marina Mall / Fernan Bridge)', coords: { lat: 10.3288, lng: 123.9635 }, zoom: 15 },
  { name: 'Barangay Basak (Gaisano Grand Mall)', coords: { lat: 10.2930, lng: 123.9615 }, zoom: 15 },
  { name: 'Barangay Mactan (Mactan Shrine / Newtown)', coords: { lat: 10.3110, lng: 124.0160 }, zoom: 15 },
  { name: 'Barangay Maribago (Resort Corridor)', coords: { lat: 10.2890, lng: 123.9975 }, zoom: 15 },
  { name: 'Barangay Gun-ob (Hoops Dome)', coords: { lat: 10.3080, lng: 123.9390 }, zoom: 15 },
  { name: 'Barangay Pajac (Pajac-Agus Crossing)', coords: { lat: 10.2845, lng: 123.9740 }, zoom: 15 },
  { name: 'Barangay Marigondon (Crossing / Suba-basbas)', coords: { lat: 10.2675, lng: 123.9635 }, zoom: 15 },
  { name: 'Barangay Pajo (Old Mactan Bridge)', coords: { lat: 10.3210, lng: 123.9450 }, zoom: 15 }
];

export const INITIAL_LOST_PETS: LostPet[] = [
  {
    id: 'pet-001',
    name: 'Barnaby',
    species: 'Cat',
    breed: 'Ginger Tabby / Puspin (Pusang Pinoy)',
    primaryColor: 'Ginger / Orange',
    secondaryColor: 'White Chest & Paws',
    gender: 'Male',
    ageYears: 3,
    microchipId: 'PH-985141004829102',
    lastSeenAddress: 'Near Lapu-Lapu City Hall & Plaza Rizal, Barangay Poblacion',
    lastSeenCoords: { lat: 10.3142, lng: 123.9495 },
    lastSeenDate: '2026-08-28',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    additionalPhotos: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80'
    ],
    distinctiveFeatures: [
      'White diamond blaze on chest',
      'Small nick on tip of left ear (neutered marker)',
      'Pink nose with tiny freckle on left nostril',
      'Striped raccoon-like tail ring pattern'
    ],
    contactName: 'Maria Santos',
    contactPhoneProtected: '+63 917 *** 8492',
    reward: 5000,
    status: 'Lost',
    embeddingVectorPreview: [0.24, -0.89, 0.45, 0.12, -0.67, 0.81, 0.33, -0.19, 0.54, -0.42]
  },
  {
    id: 'pet-002',
    name: 'Milo',
    species: 'Dog',
    breed: 'Aussie / Aspin Mix (Asong Pinoy)',
    primaryColor: 'Blue Merle & Black',
    secondaryColor: 'Copper & White chest',
    gender: 'Male',
    ageYears: 2,
    microchipId: 'PH-985141009182341',
    lastSeenAddress: 'Near Marina Mall & Pusok Access Road, Barangay Pusok',
    lastSeenCoords: { lat: 10.3288, lng: 123.9635 },
    lastSeenDate: '2026-08-29',
    photoUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80',
    additionalPhotos: [],
    distinctiveFeatures: [
      'Heterochromia (one ice blue eye, one warm brown eye)',
      'Split-face mask with white center stripe',
      'Teal woven collar with small brass bell'
    ],
    contactName: 'Danilo Cañete',
    contactPhoneProtected: '+63 928 *** 3109',
    reward: 8000,
    status: 'Lost',
    embeddingVectorPreview: [0.72, -0.15, -0.44, 0.63, -0.21, 0.94, -0.38, 0.12, -0.55, 0.61]
  },
  {
    id: 'pet-003',
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese / Puspin Cross',
    primaryColor: 'Cream / Seal Point',
    secondaryColor: 'Dark chocolate points',
    gender: 'Female',
    ageYears: 4,
    microchipId: 'PH-985141007721990',
    lastSeenAddress: 'Near Gaisano Grand Mall Mactan, Barangay Basak',
    lastSeenCoords: { lat: 10.2930, lng: 123.9615 },
    lastSeenDate: '2026-08-30',
    photoUrl: 'https://images.unsplash.com/photo-1513360309081-38f0762daed1?auto=format&fit=crop&w=800&q=80',
    distinctiveFeatures: [
      'Deep sapphire blue eyes',
      'Distinct asymmetric mask darker over right brow',
      'Plush bushy tail with bent kink at the tip'
    ],
    contactName: 'Elena Ramos',
    contactPhoneProtected: '+63 908 *** 7123',
    reward: 3500,
    status: 'Lost',
    embeddingVectorPreview: [-0.31, 0.84, -0.22, 0.51, 0.77, -0.14, 0.66, -0.48, 0.29, 0.18]
  },
  {
    id: 'pet-004',
    name: 'Buster',
    species: 'Dog',
    breed: 'Golden Retriever',
    primaryColor: 'Honey Gold',
    gender: 'Male',
    ageYears: 5,
    microchipId: 'PH-985141003445129',
    lastSeenAddress: 'Mactan Shrine & Punta Engaño Road, Barangay Mactan',
    lastSeenCoords: { lat: 10.3110, lng: 124.0160 },
    lastSeenDate: '2026-08-27',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    distinctiveFeatures: [
      'Lighter blonde fur around muzzle and ears',
      'Floppy left ear tip folds forward',
      'Extremely friendly, responds eagerly to whistling and "Buster"'
    ],
    contactName: 'Marcus Go',
    contactPhoneProtected: '+63 915 *** 9941',
    reward: 10000,
    status: 'Lost',
    embeddingVectorPreview: [0.18, 0.44, 0.91, -0.32, -0.71, 0.22, 0.54, -0.63, 0.11, 0.49]
  },
  {
    id: 'pet-005',
    name: 'Coco',
    species: 'Dog',
    breed: 'Shih Tzu / Poodle Mix',
    primaryColor: 'White & Caramel',
    gender: 'Female',
    ageYears: 2,
    microchipId: 'PH-985141002231904',
    lastSeenAddress: 'Near Bluewater Maribago Resort & Buyong Beach, Barangay Maribago',
    lastSeenCoords: { lat: 10.2890, lng: 123.9975 },
    lastSeenDate: '2026-08-31',
    photoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    distinctiveFeatures: [
      'Top-knot pink hair clip with tiny bell',
      'Curled tail with caramel plume',
      'Gentle lap dog demeanor'
    ],
    contactName: 'Jasmine Lim',
    contactPhoneProtected: '+63 922 *** 5521',
    reward: 6000,
    status: 'Lost',
    embeddingVectorPreview: [0.35, 0.62, -0.19, 0.81, -0.42, 0.33, 0.19, -0.72, 0.48, 0.11]
  }
];

export const INITIAL_SIGHTINGS: Sighting[] = [
  {
    id: 'sight-001',
    reporterName: 'Reynaldo D.',
    reporterIsAnonymous: false,
    species: 'Cat',
    photoUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
    spottedAddress: 'Alleyway near Lapu-Lapu Public Market & Wharf, Barangay Poblacion',
    approxCoords: { lat: 10.3155, lng: 123.9510 },
    exactCoordsProtected: { lat: 10.3152, lng: 123.9508 },
    privacyRadiusMeters: 300,
    spottedAt: '2026-08-31 08:45 AM',
    conditionNotes: 'Ginger cat spotted resting behind a sari-sari store near Poblacion pier. Calm and healthy, has distinct white chest patch.',
    hasCollar: false,
    exifStripped: true,
    rawExifData: {
      cameraMake: 'Apple iPhone 15 Pro',
      lens: '24mm f/1.78',
      originalGpsLat: 10.315214,
      originalGpsLng: 123.950819,
      timestamp: '2026-08-31T08:45:12Z'
    },
    embeddingVectorPreview: [0.26, -0.85, 0.42, 0.15, -0.64, 0.79, 0.31, -0.22, 0.51, -0.39]
  },
  {
    id: 'sight-002',
    reporterName: 'Mactan Community Watch',
    reporterIsAnonymous: true,
    species: 'Dog',
    photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    spottedAddress: 'Open grassy lot near Marcelo Fernan Bridge approach, Barangay Pusok',
    approxCoords: { lat: 10.3275, lng: 123.9650 },
    exactCoordsProtected: { lat: 10.3271, lng: 123.9645 },
    privacyRadiusMeters: 450,
    spottedAt: '2026-08-31 07:15 AM',
    conditionNotes: 'Energetic merle dog drinking rainwater near bridge access. Striking light blue eye clearly noticed!',
    hasCollar: true,
    collarDescription: 'Teal nylon strap visible on neck',
    exifStripped: true,
    rawExifData: {
      cameraMake: 'Google Pixel 8',
      lens: 'Main Wide 50MP',
      originalGpsLat: 10.327118,
      originalGpsLng: 123.964522,
      timestamp: '2026-08-31T07:15:44Z'
    },
    embeddingVectorPreview: [0.70, -0.18, -0.41, 0.61, -0.19, 0.91, -0.35, 0.15, -0.52, 0.58]
  },
  {
    id: 'sight-003',
    reporterName: 'Grace Villamor',
    reporterIsAnonymous: false,
    species: 'Cat',
    photoUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80',
    spottedAddress: 'Sudtunggan Road subdivision entrance, Barangay Basak',
    approxCoords: { lat: 10.2915, lng: 123.9630 },
    exactCoordsProtected: { lat: 10.2918, lng: 123.9625 },
    privacyRadiusMeters: 280,
    spottedAt: '2026-08-30 06:30 PM',
    conditionNotes: 'Cream-colored Siamese cat with dark mask hiding beneath a car. Appears shy but well-groomed.',
    hasCollar: false,
    exifStripped: true,
    rawExifData: {
      cameraMake: 'Samsung Galaxy S24 Ultra',
      lens: '24mm f/1.7',
      originalGpsLat: 10.291804,
      originalGpsLng: 123.962512,
      timestamp: '2026-08-30T18:30:21Z'
    },
    embeddingVectorPreview: [-0.28, 0.81, -0.19, 0.49, 0.74, -0.11, 0.63, -0.45, 0.31, 0.15]
  },
  {
    id: 'sight-004',
    reporterName: 'Carlos Tan',
    reporterIsAnonymous: false,
    species: 'Dog',
    photoUrl: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
    spottedAddress: 'Near The Mactan Newtown Boulevard & Beach Walk, Barangay Mactan',
    approxCoords: { lat: 10.3060, lng: 124.0080 },
    privacyRadiusMeters: 400,
    spottedAt: '2026-08-30 04:10 PM',
    conditionNotes: 'Friendly golden retriever walking along pedestrian promenade, wagging tail at passing tourists.',
    hasCollar: false,
    exifStripped: true,
    embeddingVectorPreview: [0.15, 0.41, 0.88, -0.29, -0.68, 0.19, 0.51, -0.60, 0.14, 0.46]
  },
  {
    id: 'sight-005',
    reporterName: 'Aling Nena',
    reporterIsAnonymous: true,
    species: 'Dog',
    photoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    spottedAddress: 'Near Maribago Barangay Hall & Bagumbayan Crossing, Barangay Maribago',
    approxCoords: { lat: 10.2870, lng: 123.9950 },
    exactCoordsProtected: { lat: 10.2872, lng: 123.9948 },
    privacyRadiusMeters: 320,
    spottedAt: '2026-08-31 09:10 AM',
    conditionNotes: 'Small fluffy dog sitting on front porch bench. Pink bow clip still intact.',
    hasCollar: true,
    collarDescription: 'Pink ribbon with small bell',
    exifStripped: true,
    embeddingVectorPreview: [0.33, 0.60, -0.21, 0.79, -0.40, 0.35, 0.21, -0.70, 0.46, 0.13]
  }
];

export const INITIAL_MATCHES: PetMatch[] = [
  {
    id: 'match-001',
    lostPetId: 'pet-001', // Barnaby in Poblacion
    sightingId: 'sight-001',
    overallScore: 92,
    facialGeometryScore: 94,
    colorHistogramScore: 91,
    markingPatternScore: 93,
    distanceKm: 0.22,
    status: 'Pending',
    createdAt: '2026-08-31 08:48 AM',
    aiAnalysisNotes: 'MobileNetV3 feature vectors indicate 94% alignment in facial stripe geometry and chest blaze pigmentation. Distance is only 220 meters from Lapu-Lapu City Hall in Barangay Poblacion.',
    keypoints: [
      {
        id: 'kp-1',
        name: 'White Chest Diamond Blaze',
        confidence: 0.96,
        description: 'V-shaped white chest marking matches Barnaby’s profile with 96% spatial overlap.',
        petCoord: { x: 52, y: 68 },
        sightingCoord: { x: 50, y: 70 },
        category: 'marking'
      },
      {
        id: 'kp-2',
        name: 'Left Ear Tip Notch',
        confidence: 0.91,
        description: 'OpenCV edge gradient detected 2.1mm triangular indentation on left auricular apex.',
        petCoord: { x: 38, y: 22 },
        sightingCoord: { x: 40, y: 24 },
        category: 'ear'
      },
      {
        id: 'kp-3',
        name: 'Nasal Freckle Landmark',
        confidence: 0.94,
        description: 'Dark melanin spot located adjacent to left nostril ridge confirmed in both captures.',
        petCoord: { x: 50, y: 46 },
        sightingCoord: { x: 49, y: 48 },
        category: 'facial'
      },
      {
        id: 'kp-4',
        name: 'Tabby Forehead M-Pattern',
        confidence: 0.93,
        description: 'Facial crest stripe contour aligns with 0.08 cosine distance variance.',
        petCoord: { x: 51, y: 31 },
        sightingCoord: { x: 51, y: 33 },
        category: 'facial'
      }
    ]
  },
  {
    id: 'match-002',
    lostPetId: 'pet-002', // Milo in Pusok
    sightingId: 'sight-002',
    overallScore: 89,
    facialGeometryScore: 92,
    colorHistogramScore: 88,
    markingPatternScore: 87,
    distanceKm: 0.28,
    status: 'Reviewing',
    createdAt: '2026-08-31 07:22 AM',
    aiAnalysisNotes: 'Iris chromatic variance model confirmed heterochromia match (Ice Blue OD, Brown OS). Spotted 280 meters from last seen location near Pusok / Marcelo Fernan Bridge.',
    keypoints: [
      {
        id: 'kp-5',
        name: 'Heterochromia Iris Contrast',
        confidence: 0.98,
        description: 'Right eye #79BAEC (cyan-blue) vs Left eye #5C3A21 (amber-brown) spectral match.',
        petCoord: { x: 44, y: 36 },
        sightingCoord: { x: 45, y: 35 },
        category: 'facial'
      },
      {
        id: 'kp-6',
        name: 'Asymmetric Split-Face Fur Pattern',
        confidence: 0.92,
        description: 'Dark pigmentation boundary line bisecting nasal bridge at 14-degree angle.',
        petCoord: { x: 50, y: 40 },
        sightingCoord: { x: 51, y: 39 },
        category: 'marking'
      },
      {
        id: 'kp-7',
        name: 'Teal Nylon Collar Swatch',
        confidence: 0.89,
        description: 'Color extraction matches RGB(32, 178, 170) teal collar with brass bell fixture.',
        petCoord: { x: 50, y: 82 },
        sightingCoord: { x: 52, y: 80 },
        category: 'collar'
      }
    ]
  },
  {
    id: 'match-003',
    lostPetId: 'pet-003', // Luna in Basak
    sightingId: 'sight-003',
    overallScore: 85,
    facialGeometryScore: 88,
    colorHistogramScore: 86,
    markingPatternScore: 81,
    distanceKm: 0.24,
    status: 'Verified',
    createdAt: '2026-08-30 06:45 PM',
    aiAnalysisNotes: 'Seal point gradient segmentation matches Siamese mask profile with high confidence. Located 240m from Gaisano Grand Mall Basak.',
    keypoints: [
      {
        id: 'kp-8',
        name: 'Sapphire Iris Landmark',
        confidence: 0.95,
        description: 'Albinistic Siamese tapetum lucidum reflection characteristics detected.',
        petCoord: { x: 46, y: 38 },
        sightingCoord: { x: 47, y: 37 },
        category: 'facial'
      },
      {
        id: 'kp-9',
        name: 'Brow Mask Asymmetry',
        confidence: 0.87,
        description: 'Hyperpigmented chocolate patch extending 1.4cm higher over right supraorbital arch.',
        petCoord: { x: 56, y: 28 },
        sightingCoord: { x: 55, y: 29 },
        category: 'facial'
      }
    ]
  },
  {
    id: 'match-004',
    lostPetId: 'pet-004', // Buster in Mactan
    sightingId: 'sight-004',
    overallScore: 82,
    facialGeometryScore: 84,
    colorHistogramScore: 85,
    markingPatternScore: 78,
    distanceKm: 0.95,
    status: 'Pending',
    createdAt: '2026-08-30 04:25 PM',
    aiAnalysisNotes: 'Golden coat spectrum aligns within 0.12 Euclidean distance. Sighting occurred 950m along Mactan Newtown strip near Mactan Shrine.',
    keypoints: [
      {
        id: 'kp-10',
        name: 'Cranial Width to Snout Ratio',
        confidence: 0.89,
        description: 'Golden retriever skull proportions match registered dimensions within 3% tolerance.',
        petCoord: { x: 50, y: 35 },
        sightingCoord: { x: 50, y: 34 },
        category: 'facial'
      },
      {
        id: 'kp-11',
        name: 'Left Auricular Fold',
        confidence: 0.86,
        description: 'Distinctive anterior fold of left ear cartilage matched.',
        petCoord: { x: 30, y: 40 },
        sightingCoord: { x: 28, y: 42 },
        category: 'ear'
      }
    ]
  },
  {
    id: 'match-005',
    lostPetId: 'pet-005', // Coco in Maribago
    sightingId: 'sight-005',
    overallScore: 95,
    facialGeometryScore: 96,
    colorHistogramScore: 94,
    markingPatternScore: 95,
    distanceKm: 0.32,
    status: 'Verified',
    createdAt: '2026-08-31 09:25 AM',
    aiAnalysisNotes: 'MobileNetV3 vector cosine distance 0.95. Top-knot pink hair clip and caramel plume coat verified near Maribago Barangay Hall.',
    keypoints: [
      {
        id: 'kp-12',
        name: 'Top-Knot Hair Clip Detection',
        confidence: 0.97,
        description: 'Pink accessory signature identified on coronal head region.',
        petCoord: { x: 50, y: 15 },
        sightingCoord: { x: 50, y: 16 },
        category: 'marking'
      },
      {
        id: 'kp-13',
        name: 'Caramel Eye Ring Pigment',
        confidence: 0.94,
        description: 'Symmetric caramel coloration circling both orbits.',
        petCoord: { x: 48, y: 36 },
        sightingCoord: { x: 49, y: 37 },
        category: 'marking'
      }
    ]
  }
];
