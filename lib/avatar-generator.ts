/**
 * This utility generates avatar images from user initials
 */

/**
 * Generates an image with the user's initials
 * @param initials Two-character string containing the user's initials
 * @param backgroundColor Background color of the avatar
 * @param textColor Text color of the avatar
 * @returns Promise containing a Blob of the generated avatar image
 */
export async function generateInitialsAvatar(
  initials: string,
  backgroundColor: string = '#6366f1', // Indigo color by default
  textColor: string = '#ffffff'
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const size = 400; // Size of the avatar
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Could not get canvas context');
      }
      
      // Draw circle background
      context.fillStyle = backgroundColor;
      context.beginPath();
      context.arc(size/2, size/2, size/2, 0, Math.PI * 2, true);
      context.fill();
      
      // Add text
      context.fillStyle = textColor;
      context.font = `${size / 2.5}px Inter, system-ui, sans-serif`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(initials.toUpperCase(), size/2, size/2);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/png');
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Gets the initials from a person's name
 * @param name The full name to extract initials from
 * @returns A two-character string with the initials
 */
export function getInitials(name: string): string {
  if (!name || name.trim() === '') {
    return 'U'; // Default initial if no name is provided
  }
  
  const nameParts = name.trim().split(' ');
  
  if (nameParts.length === 1) {
    // If only one word, take first character
    return nameParts[0].charAt(0);
  }
  
  // Get first character of first and last words
  return nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
}
