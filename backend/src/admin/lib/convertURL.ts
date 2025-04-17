export const convertGoogleDriveUrl = (url: string): string => {
  try {
    if (!url || !url.includes('drive.google.com')) {
      return url
    }

    let fileId = ''
    
    if (url.includes('/file/d/')) {
      fileId = url.split('/file/d/')[1]?.split('/')[0] || ''
    } else if (url.includes('id=')) {
      fileId = url.split('id=')[1]?.split('&')[0] || ''
    } else {
      fileId = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)?.[0] || ''
    }

    if (!fileId) {
      return url
    }

    return `https://lh3.googleusercontent.com/d/${fileId}`
  } catch (error) {
    console.error('Error converting URL:', error)
    return url
  }
} 