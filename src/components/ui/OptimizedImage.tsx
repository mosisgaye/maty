// components/ui/OptimizedImage.tsx
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createLazyObserver } from '@/lib/performance';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 300,
  height = 300,
  className,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  fallbackSrc = '/placeholder.svg'
}) => {
  const [imageSrc, setImageSrc] = useState<string>(
    priority ? src : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E'
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Lazy loading avec Intersection Observer
  useEffect(() => {
    if (priority || !imageRef.current) {
      setImageSrc(src);
      return;
    }

    const observer = createLazyObserver(
      (entry) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(imageRef.current);

    return () => observer.disconnect();
  }, [src, priority]);

  // Générer un blur placeholder si non fourni
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  // Format WebP avec fallback
  const getOptimizedSrc = (src: string) => {
    // Si c'est déjà une URL optimisée ou un placeholder, ne pas modifier
    if (src.startsWith('data:') || src.includes('_next/image')) {
      return src;
    }
    
    // Pour les images Bouygues, utiliser le CDN optimisé si disponible
    if (src.includes('bouyguestelecom.fr')) {
      return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    
    return src;
  };

  return (
    <div 
      ref={imageRef}
      className={cn(
        'relative overflow-hidden bg-muted',
        !isLoaded && 'animate-pulse',
        className
      )}
      style={{ width, height }}
    >
      {imageSrc !== 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E' && (
        <Image
          src={getOptimizedSrc(imageSrc)}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL || defaultBlurDataURL}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
        />
      )}
      
      {/* Skeleton loader */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      )}
      
      {/* Error state */}
      {hasError && imageSrc === fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

// Hook pour précharger des images
export const useImagePreloader = (urls: string[]) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preloadImage = (url: string) => {
      const img = new window.Image();
      img.src = url;
    };

    // Précharger après que la page soit idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        urls.forEach(preloadImage);
      });
    } else {
      setTimeout(() => {
        urls.forEach(preloadImage);
      }, 1);
    }
  }, [urls]);
};

export default OptimizedImage;