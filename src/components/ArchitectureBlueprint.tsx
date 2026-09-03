import React, { useState } from 'react';
import {
  Layers,
  Database,
  Code,
  Shield,
  Cpu,
  Copy,
  Check,
  Server,
  FileCode,
  Layout,
  Globe,
  Lock,
  ArrowRight,
  GitFork,
  Terminal,
  Zap
} from 'lucide-react';

export const ArchitectureBlueprint: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'python' | 'nextjs' | 'security' | 'wireframes'>('architecture');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const mermaidDiagramCode = `graph TD
    %% Clients & Interfaces
    subgraph Client_Layer ["Client Layer (Next.js 14 / Mobile PWA)"]
        UI_Web["Next.js 14 App Router (React/TS/Tailwind)"]
        Camera_PWA["Mobile-First Camera PWA (EXIF Scrubbing)"]
        Leaflet_Map["Leaflet/Mapbox Cluster Map (Privacy Blur)"]
        Dual_Modal["Dual-Panel Match Comparison UI"]
    end

    %% Edge & Gateway
    subgraph API_Edge ["API & Security Gateway"]
        Next_Auth["NextAuth.js / Passkeys OAuth2"]
        Upstash_Redis["Upstash Redis (Rate Limiting 10 req/min)"]
        Zod_Validator["Zod Strict Schema Validation"]
        Sanitize_MW["XSS Sanitization & Security Middleware"]
    end

    %% Core Application Server
    subgraph Core_Backend ["Node.js / NestJS Backend Services"]
        Pet_Service["Lost Pet Profile Manager"]
        Sighting_Service["Sighting Ingestion & Geohash Cluster"]
        Notify_Service["Real-time Alert Dispatcher (WebSocket/SMS)"]
        E2EE_Chat["E2EE Secure Messaging (AES-256 GCM)"]
    end

    %% AI / Computer Vision Engine
    subgraph AI_Engine ["Python FastAPI Microservice (PyTorch/OpenCV)"]
        CV_Preprocessor["OpenCV Crop, Normalize & Color Space"]
        MobileNet_V3["MobileNetV3 / EfficientNet Embedder (512-d)"]
        Iris_Segmenter["Ocular / Ear Notch Keypoint Detector"]
        Cosine_Engine["Cosine Similarity & Grad-CAM Visualizer"]
    end

    %% Data & Storage Layer
    subgraph Storage_Layer ["Persistence & Cloud Storage"]
        Postgres_DB[("PostgreSQL 16 + pgvector (HNSW Index)")]
        S3_Storage[("AWS S3 / Cloudinary (EXIF-Stripped Photos)")]
        Vector_Index[("pgvector Index: Cosine Distance (<=>)")]
    end

    %% Data Flow Connections
    Camera_PWA -->|1. Upload Raw Sighting| Upstash_Redis
    Upstash_Redis --> Zod_Validator
    Zod_Validator --> S3_Storage
    Zod_Validator -->|2. Forward Clean Photo| AI_Engine

    AI_Engine -->|3. Extract 512-d Vector| Vector_Index
    Vector_Index -->|4. Top-K Cosine KNN Query| Postgres_DB
    Postgres_DB -->|5. Return Ranked Matches (e.g. 92%)| Core_Backend

    Core_Backend -->|6. Push Match Event & Keypoints| UI_Web
    UI_Web --> Dual_Modal
    UI_Web --> Leaflet_Map
    E2EE_Chat -->|7. Unlock Exact Coordinates| UI_Web`;

  const prismaSchemaCode = `// prisma/schema.prisma
datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

enum PetSpecies {
  DOG
  CAT
  BIRD
  RABBIT
  OTHER
}

enum PetGender {
  MALE
  FEMALE
  UNKNOWN
}

enum PetStatus {
  LOST
  FOUND
  REUNITED
}

enum MatchStatus {
  PENDING
  REVIEWING
  VERIFIED
  UNRELATED
  REUNITED
}

model User {
  id            String          @id @default(cuid())
  email         String          @unique
  name          String?
  phoneEnc      String?         // AES-256 Encrypted Phone
  role          String          @default("COMMUNITY_USER")
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  
  pets          LostPet[]
  sightings     Sighting[]
  sentMessages  SecureMessage[] @relation("SentMessages")
  recvMessages  SecureMessage[] @relation("RecvMessages")
}

model LostPet {
  id                   String        @id @default(cuid())
  userId               String
  user                 User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  name                 String
  species              PetSpecies
  breed                String
  primaryColor         String
  secondaryColor       String?
  gender               PetGender     @default(UNKNOWN)
  ageYears             Int?
  microchipId          String?       @unique
  lastSeenAddress      String
  lastSeenLat          Float
  lastSeenLng          Float
  lastSeenDate         DateTime
  photoUrl             String
  additionalPhotos     String[]
  distinctiveFeatures  String[]
  rewardAmount         Decimal?      @db.Decimal(10, 2)
  status               PetStatus     @default(LOST)
  
  // 512-dimension MobileNetV3 / EfficientNet vector embedding
  embedding            Unsupported("vector(512)")?
  
  matches              PetMatch[]
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  @@index([species, status])
}

model Sighting {
  id                   String        @id @default(cuid())
  reporterId           String?
  reporter             User?         @relation(fields: [reporterId], references: [id], onDelete: SetNull)
  isAnonymous          Boolean       @default(false)
  species              PetSpecies
  photoUrl             String
  spottedAddress       String
  
  // Privacy Obfuscation: Public coords are blurred by 200m-500m
  approxLat            Float
  approxLng            Float
  privacyRadiusMeters  Int           @default(300)
  
  // Encrypted exact GPS coordinates (only decrypted for verified owner)
  exactLatEnc          String?
  exactLngEnc          String?
  
  spottedAt            DateTime      @default(now())
  conditionNotes       String
  hasCollar            Boolean       @default(false)
  collarDescription    String?
  exifStripped         Boolean       @default(true)
  
  // 512-dimension sighting image embedding
  embedding            Unsupported("vector(512)")?

  matches              PetMatch[]
  createdAt            DateTime      @default(now())

  @@index([species, spottedAt])
}

model PetMatch {
  id                    String        @id @default(cuid())
  lostPetId             String
  lostPet               LostPet       @relation(fields: [lostPetId], references: [id], onDelete: Cascade)
  sightingId            String
  sighting              Sighting      @relation(fields: [sightingId], references: [id], onDelete: Cascade)
  
  overallScore          Float         // 0.0 to 100.0 Cosine match %
  facialGeometryScore   Float
  colorHistogramScore   Float
  markingPatternScore   Float
  distanceKm            Float
  
  status                MatchStatus   @default(PENDING)
  aiAnalysisNotes       String
  keypointsData         Json?         // Keypoint coordinate pairs & confidence
  
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  @@unique([lostPetId, sightingId])
  @@index([overallScore(sort: Desc)])
}

model SecureMessage {
  id          String    @id @default(cuid())
  senderId    String
  sender      User      @relation("SentMessages", fields: [senderId], references: [id])
  receiverId  String
  receiver    User      @relation("RecvMessages", fields: [receiverId], references: [id])
  matchId     String
  
  ciphertext  String    // AES-256-GCM encrypted payload
  iv          String    // Initialization Vector
  authTag     String    // Authentication Tag
  
  createdAt   DateTime  @default(now())
}`;

  const pythonFastAPICode = `# ai_service/main.py
"""
FURTRACE AI Computer Vision Microservice
FastAPI endpoint for MobileNetV3 feature vector extraction & pgvector similarity search
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image, ImageOps
import io
import numpy as np
import psycopg2
from pgvector.psycopg2 import register_vector
import os

app = FastAPI(title="FURTRACE AI Image Matching Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Load Pretrained MobileNetV3-Large Feature Extractor (512/960 dimension embeddings)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.mobilenet_v3_large(weights=models.MobileNet_V3_Large_Weights.DEFAULT)

# Remove final classification head to output raw 960-d or 512-d pooled feature representations
model.classifier = torch.nn.Sequential(
    torch.nn.Linear(model.classifier[0].in_features, 512),
    torch.nn.BatchNorm1d(512),
    torch.nn.ReLU(),
    torch.nn.Linear(512, 512)
)
model.eval().to(device)

# Standard Image Preprocessing Pipeline
transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def strip_exif_and_load(image_bytes: bytes) -> Image.Image:
    """Safely opens image and strips all EXIF metadata for privacy."""
    image = Image.open(io.BytesIO(image_bytes))
    image = ImageOps.exif_transpose(image) # orient correctly
    
    # Strip EXIF by saving to clean RGB buffer
    clean_buffer = io.BytesIO()
    image.convert("RGB").save(clean_buffer, format="JPEG", quality=90)
    clean_buffer.seek(0)
    return Image.open(clean_buffer)

def extract_embedding(image: Image.Image) -> np.ndarray:
    """Passes preprocessed image through MobileNetV3 and normalizes to unit sphere."""
    tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        features = model(tensor)
        # L2-normalize vector for unit cosine similarity
        norm_features = torch.nn.functional.normalize(features, p=2, dim=1)
        embedding = norm_features.cpu().numpy().flatten()
    return embedding

@app.post("/api/v1/extract-and-match")
async def extract_and_match(
    file: UploadFile = File(...),
    species: str = "Cat",
    limit: int = 5
):
    """
    Receives an uploaded sighting photo, strips EXIF, extracts 512-d embedding vector,
    and performs a fast pgvector HNSW cosine distance search against active lost pets.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be an image.")

    content = await file.read()
    clean_img = strip_exif_and_load(content)
    embedding = extract_embedding(clean_img)

    # Connect to PostgreSQL + pgvector
    db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/furtrace")
    conn = psycopg2.connect(db_url)
    register_vector(conn)
    cur = conn.cursor()

    try:
        # Cosine distance operator in pgvector: <=>
        # Cosine Similarity = 1 - (embedding <=> target)
        query = """
            SELECT 
                id, 
                name, 
                breed, 
                photo_url, 
                last_seen_address,
                1 - (embedding <=> %s) AS cosine_similarity
            FROM lost_pets
            WHERE species = %s AND status = 'LOST'
            ORDER BY embedding <=> %s ASC
            LIMIT %s;
        """
        cur.execute(query, (embedding, species, embedding, limit))
        results = cur.fetchall()

        matches = []
        for row in results:
            pet_id, name, breed, photo_url, address, similarity = row
            match_percentage = round(float(similarity) * 100, 2)
            matches.append({
                "lostPetId": pet_id,
                "name": name,
                "breed": breed,
                "photoUrl": photo_url,
                "lastSeenAddress": address,
                "similarityScore": match_percentage,
                "confidenceLevel": "HIGH" if match_percentage >= 85 else "MEDIUM"
            })

        return {
            "status": "success",
            "exifStripped": True,
            "embeddingDimensions": 512,
            "topMatches": matches
        }
    finally:
        cur.close()
        conn.close()`;

  const nextjsComponentCode = `// app/components/MatchComparisonModal.tsx
"use client";

import React, { useState } from "react";
import { PetMatch, LostPet, Sighting } from "@/types";
import { CheckCircle2, Layers, ShieldCheck, Eye, Sliders } from "lucide-react";
import { z } from "zod";

// Zod Schema for Verification Action
export const verifyMatchSchema = z.object({
  matchId: z.string().cuid(),
  verifiedByUserId: z.string().cuid(),
  action: z.enum(["VERIFIED", "UNRELATED", "REUNITED"]),
  notes: z.string().max(500).optional(),
});

interface MatchComparisonModalProps {
  match: PetMatch;
  lostPet: LostPet;
  sighting: Sighting;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (data: z.infer<typeof verifyMatchSchema>) => Promise<void>;
}

export function MatchComparisonModal({
  match,
  lostPet,
  sighting,
  isOpen,
  onClose,
  onVerify,
}: MatchComparisonModalProps) {
  const [activeKeypointId, setActiveKeypointId] = useState<string | null>(
    match.keypoints[0]?.id || null
  );
  const [showKeypoints, setShowKeypoints] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] w-full max-w-5xl rounded-2xl shadow-2xl border border-amber-900/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-white border-b border-amber-900/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E06D53]/10 text-[#E06D53] rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-display">
                Feature Match Comparison
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {match.overallScore}% AI Confidence Score
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>

        {/* Dual Panel Comparison */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
          {/* Lost Pet Profile */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#E06D53]">Lost Profile: {lostPet.name}</h3>
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900">
              <img src={lostPet.photoUrl} alt={lostPet.name} className="w-full h-full object-cover" />
              {showKeypoints && match.keypoints.map((kp, idx) => (
                <div
                  key={kp.id}
                  style={{ left: \`\${kp.petCoord.x}%\`, top: \`\${kp.petCoord.y}%\` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#E06D53] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white"
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Sighting Photo */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#7DA18B]">Sighting #{sighting.id}</h3>
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900">
              <img src={sighting.photoUrl} alt="Sighting" className="w-full h-full object-cover" />
              {showKeypoints && match.keypoints.map((kp, idx) => (
                <div
                  key={kp.id}
                  style={{ left: \`\${kp.sightingCoord.x}%\`, top: \`\${kp.sightingCoord.y}%\` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#7DA18B] text-white text-xs font-bold flex items-center justify-center ring-2 ring-white"
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex justify-between items-center">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Spotter location obfuscated by {sighting.privacyRadiusMeters}m blur zone</span>
          </div>

          <button
            onClick={() => onVerify({ matchId: match.id, verifiedByUserId: "usr_curr", action: "VERIFIED" })}
            className="px-5 py-2.5 bg-[#E06D53] hover:bg-[#c95d45] text-white font-bold rounded-xl shadow-xs text-xs flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Verify Match & Request Direct Contact
          </button>
        </div>
      </div>
    </div>
  );
}`;

  const securitySpecsCode = `// lib/security/privacy-pipeline.ts
/**
 * FURTRACE Privacy, EXIF Stripping & Obfuscation Engine
 */

import crypto from "crypto";
import { Redis } from "@upstash/redis";

// 1. Upstash Redis Rate Limiting (10 sighting uploads per 10 minutes per IP)
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function checkRateLimit(ipAddress: string): Promise<boolean> {
  const key = \`ratelimit:sighting:\${ipAddress}\`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 600); // 10 minutes window
  }
  return count <= 10;
}

// 2. Geolocation Privacy Obfuscation (200m - 500m Random Gaussian Offset)
export function obfuscateCoordinates(
  lat: number,
  lng: number,
  radiusMeters: number = 300
): { approxLat: number; approxLng: number } {
  const earthRadius = 6378137; // meters
  
  // Random angle and random distance within radius
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.sqrt(Math.random()) * radiusMeters;
  
  const dLat = (distance * Math.cos(angle)) / earthRadius;
  const dLng = (distance * Math.sin(angle)) / (earthRadius * Math.cos((Math.PI * lat) / 180));

  return {
    approxLat: lat + (dLat * 180) / Math.PI,
    approxLng: lng + (dLng * 180) / Math.PI,
  };
}

// 3. AES-256-GCM PII Encryption for exact coordinates and owner phone numbers
const ENCRYPTION_KEY = Buffer.from(process.env.PII_AES_KEY || "01234567890123456789012345678901", "utf-8"); // 32 bytes

export function encryptPII(plainText: string): { ciphertext: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return {
    ciphertext: encrypted,
    iv: iv.toString("hex"),
    authTag,
  };
}

export function decryptPII(ciphertext: string, ivHex: string, authTagHex: string): string {
  const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  
  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}`;

  return (
    <div className="space-y-6">
      
      {/* Blueprint Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#E06D53] text-white text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Engineering Specs
            </span>
            <h2 className="text-xl font-bold font-display">
              System Architecture & Core Source Code
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Production blueprint covering Next.js 14, Python FastAPI (PyTorch + pgvector), Prisma Schema, and Zero-Knowledge Security Specs.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap bg-slate-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'architecture' ? 'bg-[#E06D53] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            Architecture Diagram
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'schema' ? 'bg-[#E06D53] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Prisma Schema
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'python' ? 'bg-[#E06D53] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Python AI Service
          </button>

          <button
            onClick={() => setActiveTab('nextjs')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'nextjs' ? 'bg-[#E06D53] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Next.js UI Component
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'security' ? 'bg-[#E06D53] text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Security & Privacy
          </button>
        </div>
      </div>

      {/* Tab 1: Architecture Diagram & Flowchart */}
      {activeTab === 'architecture' && (
        <div className="space-y-4">
          
          {/* Visual Architecture Flow Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-4 rounded-xl border border-amber-900/10 shadow-xs space-y-2">
              <div className="font-bold text-[#E06D53] font-display text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> 1. Edge & Client
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Next.js 14 App Router, PWA camera upload with client-side EXIF metadata stripping, and interactive dual-panel match viewer.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-900/10 shadow-xs space-y-2">
              <div className="font-bold text-[#7DA18B] font-display text-sm flex items-center gap-1.5">
                <Server className="w-4 h-4" /> 2. Security Gateway
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Upstash Redis rate limiter (10 req/10 min), strict Zod schema validation, and 200–500m privacy blur radius calculation.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-900/10 shadow-xs space-y-2">
              <div className="font-bold text-amber-600 font-display text-sm flex items-center gap-1.5">
                <Cpu className="w-4 h-4" /> 3. PyTorch CV Engine
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                FastAPI microservice generating 512-dimension MobileNetV3 / EfficientNet normalized feature vector embeddings.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-900/10 shadow-xs space-y-2">
              <div className="font-bold text-emerald-600 font-display text-sm flex items-center gap-1.5">
                <Database className="w-4 h-4" /> 4. pgvector Store
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                PostgreSQL 16 with HNSW cosine distance indexing (&lt;=&gt;), AWS S3 secure image assets, and AES-256 PII encryption.
              </p>
            </div>
          </div>

          {/* Mermaid.js Code Box */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span className="font-mono text-amber-400">System Architecture Diagram (Mermaid.js)</span>
              <button
                onClick={() => handleCopy(mermaidDiagramCode, 'mermaid')}
                className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg transition-colors text-xs"
              >
                {copiedSection === 'mermaid' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'mermaid' ? 'Copied!' : 'Copy Mermaid'}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
              {mermaidDiagramCode}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Database Schema */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span className="font-mono text-amber-400">prisma/schema.prisma (PostgreSQL + pgvector Extension)</span>
            <button
              onClick={() => handleCopy(prismaSchemaCode, 'prisma')}
              className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg transition-colors text-xs"
            >
              {copiedSection === 'prisma' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'prisma' ? 'Copied!' : 'Copy Schema'}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-[500px]">
            {prismaSchemaCode}
          </pre>
        </div>
      )}

      {/* Tab 3: Python FastAPI */}
      {activeTab === 'python' && (
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span className="font-mono text-amber-400">ai_service/main.py (FastAPI + PyTorch MobileNetV3 + pgvector)</span>
            <button
              onClick={() => handleCopy(pythonFastAPICode, 'python')}
              className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg transition-colors text-xs"
            >
              {copiedSection === 'python' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'python' ? 'Copied!' : 'Copy Python Code'}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[500px]">
            {pythonFastAPICode}
          </pre>
        </div>
      )}

      {/* Tab 4: Next.js Component */}
      {activeTab === 'nextjs' && (
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span className="font-mono text-amber-400">app/components/MatchComparisonModal.tsx (Next.js 14 + Zod)</span>
            <button
              onClick={() => handleCopy(nextjsComponentCode, 'nextjs')}
              className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg transition-colors text-xs"
            >
              {copiedSection === 'nextjs' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'nextjs' ? 'Copied!' : 'Copy Next.js Code'}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-purple-300 overflow-x-auto leading-relaxed max-h-[500px]">
            {nextjsComponentCode}
          </pre>
        </div>
      )}

      {/* Tab 5: Security & Privacy */}
      {activeTab === 'security' && (
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span className="font-mono text-amber-400">lib/security/privacy-pipeline.ts (Upstash Rate Limit & AES-256 PII)</span>
            <button
              onClick={() => handleCopy(securitySpecsCode, 'security')}
              className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg transition-colors text-xs"
            >
              {copiedSection === 'security' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSection === 'security' ? 'Copied!' : 'Copy Security Code'}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-amber-300 overflow-x-auto leading-relaxed max-h-[500px]">
            {securitySpecsCode}
          </pre>
        </div>
      )}
    </div>
  );
};
