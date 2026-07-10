"use client"

import { useState } from "react"
import Image from "next/image"

interface SafeImageProps {
  src: string
  alt: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
}

export default function SafeImage({ src, alt, fill, sizes, priority, className = "" }: SafeImageProps) {
  const [hasError, setHasError] = useState(false)
  const letter = alt.charAt(0).toUpperCase()

  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 text-2xl font-bold select-none ${fill ? "absolute inset-0" : ""} ${className}`}>
        {letter}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}
