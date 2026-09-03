import React, { useState, useRef, useEffect } from 'react';
import { Sighting, PetSpecies } from '../types';
import {
  geocodeAddress,
  calculateObfuscatedLocation,
  getDeviceGPSLocation,
  LAPU_LAPU_LANDMARKS
} from '../lib/locationService';
import {
  X,
  UploadCloud,
  Camera,
  MapPin,
  Shield,
  ShieldCheck,
  Sparkles,
  Layers,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  EyeOff,
  Cpu,
  Clock,
  Smartphone,
  Monitor,
  FolderUp,
  RefreshCw,
  Lock,
  FileImage,
  SwitchCamera,
  Navigation,
  Crosshair
} from 'lucide-react';
import { DetectiveWhiskers } from './DetectiveWhiskers';

interface SightingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSighting: (sighting: Sighting) => void;
}

export const SightingReportModal: React.FC<SightingReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitSighting
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80'
  );
  const [species, setSpecies] = useState<PetSpecies>('Cat');
  const [address, setAddress] = useState<string>('Near Hoops Dome & Humay-Humay Road, Barangay Gun-ob, Lapu-Lapu City');
  const [privacyRadius, setPrivacyRadius] = useState<number>(350);
  const [conditionNotes, setConditionNotes] = useState<string>(
    'Orange tabby puspin with white markings resting peacefully near sari-sari store.'
  );
  const [hasCollar, setHasCollar] = useState<boolean>(false);
  const [collarDesc, setCollarDesc] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('Lapu-Lapu Community Spotter');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [stripExif, setStripExif] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [step, setStep] = useState<'form' | 'scanning' | 'success'>('form');

  // Device GPS State
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [isGettingGps, setIsGettingGps] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  const handleAcquireDeviceGps = async () => {
    setIsGettingGps(true);
    setGpsStatus('Acquiring high-precision GPS satellite fix...');
    try {
      const pos = await getDeviceGPSLocation();
      setGpsCoords({ lat: pos.lat, lng: pos.lng, accuracy: pos.accuracy });
      const srcLabel = pos.source === 'gps_satellite' ? 'Satellite GPS' : pos.source === 'network_cellular' ? 'Cellular / Wi-Fi Fix' : 'Network Triangulation';
      setGpsStatus(`${srcLabel} locked: ±${pos.accuracy}m accuracy`);
      if (pos.resolvedAddress) {
        setAddress(pos.resolvedAddress);
      } else {
        setAddress(`GPS Pin (${pos.lat.toFixed(4)}°N, ${pos.lng.toFixed(4)}°E), Lapu-Lapu City`);
      }
    } catch {
      setGpsStatus('GPS access denied or unavailable. You can tap a quick zone below or enter an address.');
    } finally {
      setIsGettingGps(false);
    }
  };

  // Device detection
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>(() => {
    if (typeof window === 'undefined') return 'desktop';
    const ua = navigator.userAgent || '';
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isSmallScreen = window.innerWidth <= 768;
    const hasTouch = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 1;
    return isMobileUA || (isSmallScreen && hasTouch) ? 'mobile' : 'desktop';
  });

  // Permission states: 'prompt' | 'granted' | 'denied'
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [storagePermission, setStoragePermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [activePermissionDialog, setActivePermissionDialog] = useState<'none' | 'camera' | 'storage'>('none');
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Live Camera state
  const [isLiveCameraActive, setIsLiveCameraActive] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Desktop Drag & Drop state
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // File input refs
  const mobileGalleryInputRef = useRef<HTMLInputElement | null>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement | null>(null);
  const desktopFileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingStorageTarget, setPendingStorageTarget] = useState<'mobile_gallery' | 'mobile_camera_native' | 'desktop'>('desktop');
  const [pendingDroppedFile, setPendingDroppedFile] = useState<File | null>(null);

  // Clean up camera stream on unmount or modal close
  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsLiveCameraActive(false);
    setCameraLoading(false);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  if (!isOpen) return null;

  const samplePhotos = [
    {
      label: 'Ginger Tabby (Puspin)',
      url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80',
      species: 'Cat' as PetSpecies
    },
    {
      label: 'Aspin / Aussie Mix',
      url: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=800&q=80',
      species: 'Dog' as PetSpecies
    },
    {
      label: 'Siamese Cross',
      url: 'https://images.unsplash.com/photo-1513360309081-38f0762daed1?auto=format&fit=crop&w=800&q=80',
      species: 'Cat' as PetSpecies
    },
    {
      label: 'Golden Pup',
      url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
      species: 'Dog' as PetSpecies
    }
  ];

  // Camera handling
  const startCamera = async (facing: 'environment' | 'user' = cameraFacingMode) => {
    try {
      setPermissionError(null);
      setCameraLoading(true);
      stopCameraStream();

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;
      setCameraPermission('granted');
      setActivePermissionDialog('none');
      setIsLiveCameraActive(true);
      setCameraLoading(false);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraLoading(false);
      setCameraPermission('denied');
      setPermissionError(
        'Camera access was blocked or is unavailable. Please check your browser permissions, or select a photo from your gallery.'
      );
      setActivePermissionDialog('none');
    }
  };

  const handleRequestCamera = () => {
    if (cameraPermission === 'granted') {
      startCamera();
    } else {
      setActivePermissionDialog('camera');
    }
  };

  const handleGrantCameraPermission = () => {
    startCamera();
  };

  const handleDenyCameraPermission = () => {
    setCameraPermission('denied');
    setActivePermissionDialog('none');
  };

  const flipCamera = () => {
    const nextFacing = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  const capturePhotoFromStream = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setPhotoUrl(dataUrl);
      stopCameraStream();
    }
  };

  // Storage and File Upload handling
  const triggerFileInput = (target: 'mobile_gallery' | 'mobile_camera_native' | 'desktop') => {
    if (target === 'mobile_gallery' && mobileGalleryInputRef.current) {
      mobileGalleryInputRef.current.click();
    } else if (target === 'mobile_camera_native' && mobileCameraInputRef.current) {
      mobileCameraInputRef.current.click();
    } else if (desktopFileInputRef.current) {
      desktopFileInputRef.current.click();
    }
  };

  const handleRequestStorage = (target: 'mobile_gallery' | 'mobile_camera_native' | 'desktop') => {
    if (storagePermission === 'granted') {
      triggerFileInput(target);
    } else {
      setPendingStorageTarget(target);
      setActivePermissionDialog('storage');
    }
  };

  const handleGrantStoragePermission = () => {
    setStoragePermission('granted');
    setActivePermissionDialog('none');
    if (pendingDroppedFile) {
      handleProcessFile(pendingDroppedFile);
      setPendingDroppedFile(null);
    } else {
      setTimeout(() => {
        triggerFileInput(pendingStorageTarget);
      }, 100);
    }
  };

  const handleDenyStoragePermission = () => {
    setStoragePermission('denied');
    setActivePermissionDialog('none');
    setPendingDroppedFile(null);
  };

  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setPhotoUrl(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  // Drag and Drop handlers for Desktop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (storagePermission !== 'granted') {
      setPendingDroppedFile(file);
      setActivePermissionDialog('storage');
    } else {
      handleProcessFile(file);
    }
  };

  const handleModalClose = () => {
    stopCameraStream();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    stopCameraStream();
    setIsAnalyzing(true);
    setStep('scanning');

    setTimeout(() => {
      // Resolve genuine exact coordinates from device GPS fix or Lapu-Lapu landmark geocoding
      let exactLat = 10.3080;
      let exactLng = 123.9390;
      let locSource = 'geocoded_landmark';

      if (gpsCoords) {
        exactLat = gpsCoords.lat;
        exactLng = gpsCoords.lng;
        locSource = 'device_gps';
      } else {
        const geocoded = geocodeAddress(address);
        exactLat = geocoded.coords.lat;
        exactLng = geocoded.coords.lng;
        locSource = geocoded.source;
      }

      const exact = { lat: exactLat, lng: exactLng };
      const { approxCoords, offsetMeters } = calculateObfuscatedLocation(exact, privacyRadius);

      const newSighting: Sighting = {
        id: `sight-${Math.floor(100 + Math.random() * 900)}`,
        reporterName: isAnonymous ? 'Lapu-Lapu Neighbor (Protected)' : reporterName,
        reporterIsAnonymous: isAnonymous,
        species,
        photoUrl,
        spottedAddress: address,
        approxCoords,
        exactCoordsProtected: exact,
        privacyRadiusMeters: privacyRadius,
        spottedAt: 'Just now (Live Sighting)',
        conditionNotes,
        hasCollar,
        collarDescription: hasCollar ? collarDesc : undefined,
        exifStripped: stripExif,
        rawExifData: {
          cameraMake: locSource === 'device_gps' ? 'Device GPS (High-Accuracy Fix)' : 'Geocoded Address Landmark',
          lens: `Privacy Offset: ${offsetMeters}m within ${privacyRadius}m safety circle`,
          originalGpsLat: stripExif ? undefined : exact.lat,
          originalGpsLng: stripExif ? undefined : exact.lng,
          timestamp: new Date().toISOString()
        },
        embeddingVectorPreview: [
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2))
        ]
      };

      onSubmitSighting(newSighting);
      setIsAnalyzing(false);
      setStep('success');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] w-full max-w-2xl rounded-2xl shadow-2xl border border-amber-900/10 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-white border-b border-amber-900/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 bg-[#7DA18B]/15 text-[#7DA18B] rounded-xl shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 font-display">
                Report a Pet Sighting
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Help lost pets reunite with their families. Fast, privacy-first & AI matched.
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="p-2 min-h-[44px] min-w-[44px] hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Photo Upload Section */}
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    1. Sighting Photo & Device Input
                  </label>

                  {/* Device Detection Indicator & Mode Switcher */}
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {deviceType === 'mobile' ? (
                        <>
                          <Smartphone className="w-3.5 h-3.5 text-[#E06D53]" />
                          <span>Mobile Device Detected</span>
                        </>
                      ) : (
                        <>
                          <Monitor className="w-3.5 h-3.5 text-[#7DA18B]" />
                          <span>Desktop / Laptop Detected</span>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeviceType(deviceType === 'mobile' ? 'desktop' : 'mobile')}
                      className="text-[11px] text-[#E06D53] hover:underline font-medium"
                      title="Toggle mode to preview mobile or desktop photo inputs"
                    >
                      Switch to {deviceType === 'mobile' ? 'Desktop' : 'Mobile'}
                    </button>
                  </div>
                </div>

                {/* Permission Status Feedback */}
                {permissionError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold">Permission Notice</p>
                      <p className="text-[11px] mt-0.5">{permissionError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPermissionError(null)}
                      className="text-rose-500 hover:text-rose-700 text-xs"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Live Camera Viewfinder (when active) */}
                {isLiveCameraActive ? (
                  <div className="relative bg-black rounded-2xl overflow-hidden aspect-4/3 flex flex-col items-center justify-center border-2 border-[#E06D53]">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Camera grid overlay */}
                    <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                      <div className="border-r border-b border-white/10" />
                      <div className="border-r border-b border-white/10" />
                      <div className="border-b border-white/10" />
                      <div className="border-r border-b border-white/10" />
                      <div className="border-r border-b border-white/10" />
                      <div className="border-b border-white/10" />
                      <div className="border-r border-white/10" />
                      <div className="border-r border-white/10" />
                      <div />
                    </div>

                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span>Live Viewfinder Active</span>
                    </div>

                    {/* Camera controls toolbar */}
                    <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 px-4">
                      <button
                        type="button"
                        onClick={flipCamera}
                        className="p-3 bg-white/25 hover:bg-white/40 text-white rounded-full backdrop-blur-xs transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Flip camera"
                        aria-label="Flip camera"
                      >
                        <SwitchCamera className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={capturePhotoFromStream}
                        className="px-6 py-3 bg-[#E06D53] hover:bg-[#c95d45] text-white font-bold text-sm rounded-full shadow-lg flex items-center gap-2 transition-transform active:scale-95 min-h-[48px]"
                      >
                        <Camera className="w-5 h-5" />
                        <span>Snap Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={stopCameraStream}
                        className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-xs transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        title="Close camera"
                        aria-label="Close camera"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Device-Specific Upload Inputs */}
                    {deviceType === 'mobile' ? (
                      /* MOBILE INTERFACE: Camera capture + Media gallery upload */
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Option 1: Mobile Camera */}
                          <div className="p-4 rounded-xl border-2 border-dashed border-amber-900/20 bg-amber-50/40 hover:bg-amber-50/70 transition-all flex flex-col justify-between space-y-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                                <Camera className="w-4 h-4 text-[#E06D53]" />
                                <span>Mobile Camera</span>
                              </div>
                              <p className="text-[11px] text-slate-500">
                                Capture live photo of spotted pet with camera viewfinder.
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              <button
                                type="button"
                                onClick={handleRequestCamera}
                                className="w-full py-2.5 px-3 bg-[#E06D53] hover:bg-[#c95d45] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors min-h-[44px]"
                              >
                                <Camera className="w-4 h-4" />
                                <span>Open Mobile Camera</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRequestStorage('mobile_camera_native')}
                                className="w-full py-1.5 text-[11px] text-slate-600 hover:text-slate-900 font-medium text-center"
                              >
                                Or use native camera app
                              </button>
                            </div>
                          </div>

                          {/* Option 2: Mobile Media Gallery */}
                          <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-all flex flex-col justify-between space-y-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                                <FolderUp className="w-4 h-4 text-[#7DA18B]" />
                                <span>Media Gallery</span>
                              </div>
                              <p className="text-[11px] text-slate-500">
                                Select saved photo from your device photo library.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRequestStorage('mobile_gallery')}
                              className="w-full py-2.5 px-3 bg-[#7DA18B] hover:bg-[#6c8f7a] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors min-h-[44px]"
                            >
                              <FolderUp className="w-4 h-4" />
                              <span>Select from Gallery</span>
                            </button>
                          </div>
                        </div>

                        {/* Hidden Native File Inputs for Mobile */}
                        <input
                          ref={mobileCameraInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileInputChange}
                          className="hidden"
                          aria-label="Native camera input"
                        />
                        <input
                          ref={mobileGalleryInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                          aria-label="Mobile photo gallery input"
                        />
                      </div>
                    ) : (
                      /* DESKTOP / LAPTOP INTERFACE: Drag and drop + File browse */
                      <div className="space-y-3">
                        <div
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => handleRequestStorage('desktop')}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                            isDragging
                              ? 'border-[#E06D53] bg-orange-50/60 scale-[1.01]'
                              : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100/70'
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-500">
                              <UploadCloud className="w-6 h-6 text-[#E06D53]" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-slate-800">
                                Drag and drop sighting photo here
                              </p>
                              <p className="text-[11px] text-slate-500">
                                or click to select an image from your computer (JPG, PNG, WEBP)
                              </p>
                            </div>
                            <span className="inline-block mt-1 px-4 py-2 bg-white text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors">
                              Browse Local Files
                            </span>
                          </div>
                        </div>

                        {/* Optional Laptop Webcam Option */}
                        <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-slate-500" />
                            Have pet right in front of your screen?
                          </span>
                          <button
                            type="button"
                            onClick={handleRequestCamera}
                            className="text-[#E06D53] hover:underline font-bold text-xs"
                          >
                            Open Laptop Webcam
                          </button>
                        </div>

                        {/* Hidden Desktop File Input */}
                        <input
                          ref={desktopFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                          aria-label="Desktop file upload"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Selected Photo Preview */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center">
                  <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
                    <img
                      src={photoUrl}
                      alt="Sighting Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {stripExif && (
                      <span className="absolute bottom-1 left-1 bg-black/75 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                        <ShieldCheck className="w-2.5 h-2.5" /> EXIF Stripped
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Current Photo for AI Identification</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                        Ready for Matching
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Or test with sample pet sightings from Lapu-Lapu neighborhoods:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {samplePhotos.map((sample) => (
                        <button
                          key={sample.label}
                          type="button"
                          onClick={() => {
                            setPhotoUrl(sample.url);
                            setSpecies(sample.species);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                            photoUrl === sample.url
                              ? 'bg-[#E06D53] text-white border-[#E06D53]'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Automatic EXIF Stripping Checkbox */}
                <div className="flex items-start gap-2.5 bg-emerald-50/80 border border-emerald-200/80 p-3 rounded-xl text-xs text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <label className="font-semibold cursor-pointer flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={stripExif}
                        onChange={(e) => setStripExif(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      Automatic EXIF Metadata Stripping (Recommended)
                    </label>
                    <p className="text-emerald-700 text-[11px] mt-0.5">
                      Removes camera serial numbers, device model, and embedded GPS coordinates to prevent unintended exposure of your private residence.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pet Details - Strictly Furry Pets (Dog & Cat) */}
              <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E06D53] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Lapu-Lapu City Household Furry Animals Only</span>
                  <span className="text-[11px] text-amber-800">
                    FURTRACE is strictly for domestic Dogs (Aspin, Shih Tzu, etc.) and Cats (Puspin, Siamese, etc.). Fish, birds, hamsters, and exotic wildlife are not permitted.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Species (Furry Household Pet)
                  </label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value as PetSpecies)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-[#E06D53]/20 focus:border-[#E06D53]"
                  >
                    <option value="Cat">Cat / Puspin (Pusang Pinoy)</option>
                    <option value="Dog">Dog / Aspin (Asong Pinoy)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Collar Status
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasCollar}
                        onChange={(e) => setHasCollar(e.target.checked)}
                        className="rounded text-[#E06D53] focus:ring-[#E06D53]"
                      />
                      Wearing Collar / Tag
                    </label>
                  </div>
                </div>
              </div>

              {hasCollar && (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="text-xs font-bold text-slate-600 block">
                    Collar Color & Details
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Red leather collar with bell, reflective blue tag..."
                    value={collarDesc}
                    onChange={(e) => setCollarDesc(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800"
                  />
                </div>
              )}

              {/* Location & Privacy Radius */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E06D53]" />
                    Sighting Location & Public Blur Zone
                  </label>
                  <span className="text-xs font-semibold text-[#E06D53] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {privacyRadius}m Radius Obfuscation
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (gpsCoords) setGpsCoords(null);
                    }}
                    placeholder="Street name, neighborhood, cross streets..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAcquireDeviceGps}
                    disabled={isGettingGps}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                      gpsCoords
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                    }`}
                    title="Lock high-precision GPS coordinates from device sensor"
                  >
                    <Crosshair className={`w-3.5 h-3.5 ${isGettingGps ? 'animate-spin text-[#E06D53]' : gpsCoords ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span>{isGettingGps ? 'Locating GPS...' : gpsCoords ? 'GPS Pin Locked' : 'Use Device GPS'}</span>
                  </button>
                </div>

                {gpsStatus && (
                  <div className={`text-[11px] px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 ${
                    gpsCoords
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-medium'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    <Navigation className="w-3 h-3 shrink-0" />
                    <span>{gpsStatus}</span>
                  </div>
                )}

                {/* Quick Barangay / Landmark Shortcuts */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Quick Lapu-Lapu Zones:</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { label: 'Gun-ob (Hoops Dome)', val: 'Hoops Dome Arena & Humay-Humay Road, Barangay Gun-ob, Lapu-Lapu City' },
                      { label: 'Pusok (Marina Mall)', val: 'Marina Mall & Pusok Access Road, Barangay Pusok, Lapu-Lapu City' },
                      { label: 'Basak (Gaisano Mall)', val: 'Gaisano Grand Mall & Maximo Patalinghug, Barangay Basak, Lapu-Lapu City' },
                      { label: 'Poblacion (City Hall)', val: 'Lapu-Lapu City Hall & Plaza Rizal, Barangay Poblacion, Lapu-Lapu City' },
                      { label: 'Maribago (Resorts)', val: 'Bluewater Maribago & Buyong Beach, Barangay Maribago, Lapu-Lapu City' },
                      { label: 'Mactan (Shrine)', val: 'Mactan Shrine & Newtown Blvd, Barangay Mactan, Lapu-Lapu City' }
                    ].map(zone => (
                      <button
                        key={zone.label}
                        type="button"
                        onClick={() => {
                          setAddress(zone.val);
                          setGpsCoords(null);
                          setGpsStatus(`Geocoded to ${zone.label}`);
                        }}
                        className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
                      >
                        {zone.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>200m (Tight)</span>
                    <span className="font-semibold text-slate-700">Privacy Blur Radius Slider</span>
                    <span>500m (Maximum Privacy)</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="500"
                    step="50"
                    value={privacyRadius}
                    onChange={(e) => setPrivacyRadius(Number(e.target.value))}
                    className="w-full accent-[#E06D53]"
                  />
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Your exact pin is protected by a <strong>{privacyRadius}m radius circle</strong> on public maps. Public viewers see the blurred zone to protect your residence, while verified pet owners can request exact coordinates.
                  </p>
                </div>
              </div>

              {/* Condition Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Condition & Behavior Notes
                </label>
                <textarea
                  rows={2}
                  value={conditionNotes}
                  onChange={(e) => setConditionNotes(e.target.value)}
                  placeholder="Was the animal friendly, frightened, injured? Moving in a specific direction?"
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800"
                />
              </div>

              {/* Reporter Privacy Option */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-[#E06D53]"
                  />
                  Submit Anonymously (Community Spotter)
                </label>
                {!isAnonymous && (
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Your Name / Handle"
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
                  />
                )}
              </div>

              {/* Response Time Promise Badge */}
              <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200/90 flex items-center gap-2.5 text-xs text-slate-700">
                <div className="w-7 h-7 rounded-lg bg-[#E06D53] text-white flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">
                    Fast Neighborhood Alerts • Free Community Protection
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Sighting alerts dispatch to worried pet owners and neighborhood watch volunteers immediately.
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#E06D53] hover:bg-[#c95d45] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98 font-display text-base cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Sighting & Check Matches</span>
              </button>
            </form>
          )}

          {/* Step 2: Scanning Simulation */}
          {step === 'scanning' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <DetectiveWhiskers size="lg" mood="detecting" />

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800 font-display flex items-center justify-center gap-2">
                  <Cpu className="w-5 h-5 text-[#E06D53]" />
                  Comparing Photo With Lost Pet Profiles...
                </h3>
                <p className="text-xs text-slate-500 max-w-md">
                  Analyzing fur patterns, coat colors, and distinctive markings to alert registered pet parents in your area.
                </p>
              </div>

              <div className="w-64 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-[#E06D53] h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          )}

          {/* Step 3: Success Confirmation */}
          {step === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-800 font-display">
                  Sighting Logged & Matched!
                </h3>
                <p className="text-xs text-slate-600 max-w-md">
                  Your sighting has been posted with a {privacyRadius}m privacy blur zone. The AI matching engine has alerted registered owners of prospective matches.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-left text-xs text-slate-700 max-w-md space-y-1">
                <div className="font-bold text-[#E06D53] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> High-Confidence Match Detected:
                </div>
                <p>
                  Found <strong>92% feature similarity</strong> with missing cat &quot;Barnaby&quot; registered by Sarah Jenkins located 350m away.
                </p>
              </div>

              <button
                onClick={handleModalClose}
                className="px-6 py-2.5 bg-[#E06D53] text-white font-bold rounded-xl shadow-xs text-xs"
              >
                View Match in Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Explicit User Permission Request Dialog */}
      {activePermissionDialog !== 'none' && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#E06D53] shrink-0">
                {activePermissionDialog === 'camera' ? (
                  <Camera className="w-6 h-6" />
                ) : (
                  <FolderUp className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {activePermissionDialog === 'camera'
                    ? 'Camera Permission Required'
                    : 'Storage & Gallery Permission Required'}
                </h3>
                <span className="text-xs text-slate-500">
                  Explicit user authorization request
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <p>
                {activePermissionDialog === 'camera'
                  ? 'FURTRACE requires permission to access your device camera to take a real-time photo of the spotted pet for instant neighborhood visual matching.'
                  : 'FURTRACE requires permission to access your device storage or photo gallery to upload a pet picture.'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {activePermissionDialog === 'camera'
                    ? 'Camera is only activated during this capture session. No background video is recorded.'
                    : 'Only the selected pet image will be accessed. EXIF location data is scrubbed automatically.'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={
                  activePermissionDialog === 'camera'
                    ? handleDenyCameraPermission
                    : handleDenyStoragePermission
                }
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px]"
              >
                Deny / Cancel
              </button>
              <button
                type="button"
                onClick={
                  activePermissionDialog === 'camera'
                    ? handleGrantCameraPermission
                    : handleGrantStoragePermission
                }
                className="px-5 py-2 text-xs font-bold text-white bg-[#E06D53] hover:bg-[#c95d45] rounded-xl shadow-xs transition-colors min-h-[44px] flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {activePermissionDialog === 'camera'
                    ? 'Grant Camera Access'
                    : 'Grant Storage Access'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
