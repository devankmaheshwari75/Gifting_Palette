declare module 'browser-image-compression' {
  export interface Options {
    maxSizeMB?: number
    maxWidthOrHeight?: number
    useWebWorker?: boolean
    quality?: number
    fileType?: string
    initialQuality?: number
    alwaysKeepResolution?: boolean
    signal?: AbortSignal
  }

  export default function imageCompression(
    file: File,
    options?: Options
  ): Promise<File>
} 