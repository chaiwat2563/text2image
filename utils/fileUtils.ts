
export const downloadImage = (dataUrl: string, filename: string): void => {
  try {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to download image:', error);
    alert('Could not download the image. Please try again.');
  }
};
