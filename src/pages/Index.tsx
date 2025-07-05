import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lottie from 'lottie-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, Trash2, Image as ImageIcon, FileText, RotateCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Enhanced Lottie animation data with more complex interactions
const uploadAnimation = {
  "v": "5.5.7",
  "meta": { "g": "LottieFiles AE ", "a": "", "k": "", "d": "", "tc": "" },
  "fr": 29.9700012207031,
  "ip": 0,
  "op": 120.0000048828125,
  "w": 512,
  "h": 512,
  "nm": "upload-enhanced",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "upload-circle",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100, "ix": 11 },
        "r": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [0] }, { "t": 120.0000048828125, "s": [360] }], "ix": 10 },
        "p": { "a": 0, "k": [256, 256, 0], "ix": 2 },
        "a": { "a": 0, "k": [0, 0, 0], "ix": 1 },
        "s": { "a": 1, "k": [{ "i": { "x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833] }, "o": { "x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167] }, "t": 0, "s": [100, 100, 100] }, { "i": { "x": [0.833, 0.833, 0.833], "y": [0.833, 0.833, 0.833] }, "o": { "x": [0.167, 0.167, 0.167], "y": [0.167, 0.167, 0.167] }, "t": 60, "s": [120, 120, 100] }, { "t": 120.0000048828125, "s": [100, 100, 100] }], "ix": 6 }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ind": 0,
              "ty": "sh",
              "ix": 1,
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0, -27.614], [27.614, 0], [0, 27.614], [-27.614, 0]],
                  "o": [[0, 27.614], [-27.614, 0], [0, -27.614], [27.614, 0]],
                  "v": [[50, 0], [0, 50], [-50, 0], [0, -50]],
                  "c": true
                },
                "ix": 2
              },
              "nm": "Path 1",
              "mn": "ADBE Vector Shape - Group",
              "hd": false
            },
            {
              "ty": "fl",
              "c": { "a": 0, "k": [0.2, 0.7, 1, 0.8], "ix": 4 },
              "o": { "a": 0, "k": 100, "ix": 5 },
              "r": 1,
              "bm": 0,
              "nm": "Fill 1",
              "mn": "ADBE Vector Graphic - Fill",
              "hd": false
            }
          ],
          "nm": "Group 1",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false
        }
      ],
      "ip": 0,
      "op": 120.0000048828125,
      "st": 0,
      "bm": 0
    }
  ]
};

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const converterRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [pdfSize, setPdfSize] = useState('A4');
  const [isConverting, setIsConverting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { toast } = useToast();

  useEffect(() => {
    // Enhanced entrance animations with stagger effect
    const tl = gsap.timeline();
    
    // Brand logo entrance animation
    gsap.fromTo(logoRef.current, {
      scale: 0,
      rotation: -180,
      opacity: 0,
      y: -50
    }, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "back.out(2)",
      delay: 0.3
    });

    // Logo floating animation
    gsap.to(logoRef.current, {
      y: -5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Logo glow pulse effect
    gsap.to(logoRef.current?.querySelector('.logo-glow'), {
      scale: 1.1,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Hero section with breathing effect
    tl.from(heroRef.current, {
      duration: 1.2,
      y: 100,
      opacity: 0,
      scale: 0.8,
      ease: "back.out(1.7)"
    })
    .to(heroRef.current, {
      duration: 2,
      scale: 1.02,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    })
    .from(featuresRef.current?.children || [], {
      duration: 0.8,
      y: 50,
      opacity: 0,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=1")
    .from(converterRef.current, {
      duration: 1,
      y: 80,
      opacity: 0,
      rotationY: 15,
      ease: "power3.out"
    }, "-=0.5");

    // Floating elements with physics-based movement
    gsap.to(".floating-element", {
      duration: 4,
      y: () => gsap.utils.random(-30, 30),
      x: () => gsap.utils.random(-20, 20),
      rotation: () => gsap.utils.random(-15, 15),
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      stagger: {
        each: 0.5,
        from: "random"
      }
    });

    // Magnetic effect for interactive elements
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(el, { scale: 1.05, duration: 0.3, ease: "power2.out" });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
      });
    });

    // Scroll-triggered animations
    ScrollTrigger.create({
      trigger: featuresRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.from(featuresRef.current?.children || [], {
          scale: 0.8,
          rotation: 5,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const createRippleEffect = (e: React.MouseEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      pointer-events: none;
      z-index: 1000;
    `;
    
    element.appendChild(ripple);
    
    gsap.to(ripple, {
      scale: 2,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => ripple.remove()
    });
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid files",
        description: "Please select only image files.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedImages(prev => [...prev, ...imageFiles]);
    
    // Enhanced staggered animation for new images
    setTimeout(() => {
      const newImages = document.querySelectorAll('.image-preview:nth-last-child(-n+' + imageFiles.length + ')');
      gsap.fromTo(newImages, 
        {
          scale: 0,
          rotation: 180,
          opacity: 0,
          y: 50
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );
    }, 100);
    
    toast({
      title: "Images added",
      description: `${imageFiles.length} image(s) added successfully.`
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    
    // Add pulsing effect during drag
    gsap.to(e.currentTarget, {
      scale: 1.02,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    // Bounce effect on drop
    gsap.to(e.currentTarget, {
      scale: 0.98,
      duration: 0.1,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(e.currentTarget, {
          scale: 1,
          duration: 0.2,
          ease: "back.out(1.7)"
        });
      }
    });
    
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const imageElement = document.querySelector(`.image-preview-${index}`);
    
    gsap.to(imageElement, {
      scale: 0,
      rotation: 180,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
      }
    });
  };

  const processImageToCanvas = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      
      img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
      img.src = URL.createObjectURL(file);
    });
  };

  const convertToPDF = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one image to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    setConversionProgress(0);
    setCurrentImageIndex(0);
    
    try {
      const sizeConfigs = {
        'A4': { width: 210, height: 297 },
        'A3': { width: 297, height: 420 },
        'Letter': { width: 216, height: 279 },
        'Legal': { width: 216, height: 356 }
      };
      
      const config = sizeConfigs[pdfSize as keyof typeof sizeConfigs];
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [config.width, config.height]
      });

      // Process images sequentially with progress tracking
      for (let i = 0; i < selectedImages.length; i++) {
        setCurrentImageIndex(i + 1);
        const file = selectedImages[i];
        
        try {
          const imageDataUrl = await processImageToCanvas(file);
          
          // Create a temporary image to get dimensions
          const tempImg = new Image();
          await new Promise<void>((resolve, reject) => {
            tempImg.onload = () => resolve();
            tempImg.onerror = () => reject(new Error(`Failed to process image: ${file.name}`));
            tempImg.src = imageDataUrl;
          });
          
          if (i > 0) {
            pdf.addPage();
          }
          
          // Calculate dimensions to fit the page while maintaining aspect ratio
          const imgRatio = tempImg.width / tempImg.height;
          const pageRatio = config.width / config.height;
          
          let imgWidth, imgHeight;
          if (imgRatio > pageRatio) {
            imgWidth = config.width - 20; // 10mm margin on each side
            imgHeight = imgWidth / imgRatio;
          } else {
            imgHeight = config.height - 20; // 10mm margin on each side
            imgWidth = imgHeight * imgRatio;
          }
          
          const x = (config.width - imgWidth) / 2;
          const y = (config.height - imgHeight) / 2;
          
          pdf.addImage(imageDataUrl, 'JPEG', x, y, imgWidth, imgHeight);
          
          // Update progress
          const progress = ((i + 1) / selectedImages.length) * 100;
          setConversionProgress(progress);
          
        } catch (error) {
          console.error(`Error processing image ${file.name}:`, error);
          toast({
            title: "Image processing error",
            description: `Failed to process ${file.name}. Skipping...`,
            variant: "destructive"
          });
        }
      }

      // Save the PDF
      pdf.save('converted-images.pdf');
      
      // Success animation
      gsap.to('.convert-button', {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          gsap.to('.convert-button', {
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.7)"
          });
        }
      });
      
      toast({
        title: "Conversion successful!",
        description: "Your PDF has been downloaded."
      });
      
    } catch (error) {
      console.error('PDF conversion error:', error);
      toast({
        title: "Conversion failed",
        description: "An error occurred while converting to PDF.",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
      setConversionProgress(0);
      setCurrentImageIndex(0);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden relative">
      {/* Fancy Brand Logo */}
      <div 
        ref={logoRef}
        className="fixed top-6 left-6 z-50 cursor-pointer group bg-red-500/20"
        onClick={(e) => createRippleEffect(e, e.currentTarget)}
      >
        <div className="relative">
          {/* Glow effect background */}
          <div className="logo-glow absolute -inset-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-full blur-lg opacity-60"></div>
          
          {/* Main logo container */}
          <div className="relative bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 shadow-2xl group-hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-2">
              {/* Logo icon */}
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <FileText className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              
              {/* Brand name */}
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent group-hover:from-purple-100 group-hover:via-pink-100 group-hover:to-cyan-100 transition-all duration-300">
                Documono
              </h1>
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
          </div>
          
          {/* Sparkle effects */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-full animate-pulse opacity-60"></div>
        </div>
      </div>

      {/* Enhanced floating background elements with particle effects */}
      <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="floating-element absolute top-40 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
      <div className="floating-element absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="floating-element absolute top-1/2 right-1/3 w-16 h-16 bg-pink-500/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        {/* Enhanced Hero Section */}
        <div ref={heroRef} className="container mx-auto px-4 pt-20 pb-16 text-center">
          <div className="mb-8">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-lg rounded-full mb-6 magnetic pulse-glow">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              Images to PDF
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Convert your images to professional PDF documents with customizable sizes and layouts. 
              Fast, secure, and completely free.
            </p>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div ref={featuresRef} className="container mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 text-center magnetic hover:bg-white/15 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Upload</h3>
              <p className="text-gray-300">Drag and drop or click to upload multiple images at once</p>
            </Card>
            
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 text-center magnetic hover:bg-white/15 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <ImageIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Multiple Formats</h3>
              <p className="text-gray-300">Support for JPG, PNG, GIF, and other image formats</p>
            </Card>
            
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 text-center magnetic hover:bg-white/15 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Custom Sizes</h3>
              <p className="text-gray-300">Choose from A4, A3, Letter, and Legal PDF sizes</p>
            </Card>
          </div>
        </div>

        {/* Enhanced Converter Section */}
        <div ref={converterRef} className="container mx-auto px-4 pb-20">
          <Card className="max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Enhanced Upload Area */}
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6">Upload Images</h2>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    isDragOver 
                      ? 'border-purple-400 bg-purple-500/20 scale-105' 
                      : 'border-gray-400 hover:border-purple-400 hover:bg-white/5'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={(e) => {
                    createRippleEffect(e, e.currentTarget);
                    document.getElementById('fileInput')?.click();
                  }}
                >
                  <div className="w-24 h-24 mx-auto mb-4">
                    <Lottie 
                      animationData={uploadAnimation} 
                      loop={true}
                      className="hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-white text-lg mb-2">
                    {isDragOver ? 'Drop images here' : 'Drag & drop images here'}
                  </p>
                  <p className="text-gray-400 mb-4">or click to browse</p>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 magnetic relative overflow-hidden">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
                
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />

                {/* Enhanced PDF Size Selection */}
                <div className="mt-6">
                  <label className="block text-white text-sm font-medium mb-2">
                    PDF Size
                  </label>
                  <Select value={pdfSize} onValueChange={setPdfSize}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-colors magnetic">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                      <SelectItem value="A3">A3 (297 × 420 mm)</SelectItem>
                      <SelectItem value="Letter">Letter (8.5 × 11 in)</SelectItem>
                      <SelectItem value="Legal">Legal (8.5 × 14 in)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Enhanced Preview Area */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    Preview ({selectedImages.length})
                  </h2>
                  {selectedImages.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        gsap.to('.image-preview', {
                          scale: 0,
                          opacity: 0,
                          stagger: 0.1,
                          duration: 0.3,
                          ease: "power2.in",
                          onComplete: () => setSelectedImages([])
                        });
                      }}
                      className="border-white/20 text-gray-800 bg-white/90 hover:bg-white hover:text-gray-900 magnetic transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {selectedImages.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50 animate-pulse" />
                      <p>No images selected</p>
                    </div>
                  ) : (
                    selectedImages.map((file, index) => (
                      <div
                        key={index}
                        className={`image-preview image-preview-${index} flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 magnetic`}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded hover:scale-110 transition-transform duration-300"
                        />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium truncate">
                            {file.name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            createRippleEffect(e, e.currentTarget);
                            removeImage(index);
                          }}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 magnetic"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Progress indicator */}
                {isConverting && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-white">
                      <span>Converting image {currentImageIndex} of {selectedImages.length}</span>
                      <span>{Math.round(conversionProgress)}%</span>
                    </div>
                    <Progress value={conversionProgress} className="h-2" />
                  </div>
                )}
                
                {selectedImages.length > 0 && (
                  <Button
                    onClick={(e) => {
                      createRippleEffect(e, e.currentTarget);
                      convertToPDF();
                    }}
                    disabled={isConverting}
                    className="convert-button w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 magnetic relative overflow-hidden group"
                  >
                    {isConverting ? (
                      <>
                        <RotateCw className="animate-spin h-4 w-4 mr-2" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                        Convert to PDF
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
