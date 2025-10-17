import React, { useState, useCallback } from 'react';
import { generateImage, editImage } from './services/geminiService';
import { downloadImage } from './utils/fileUtils';
import { Header } from './components/Header';
import { ImageDisplay } from './components/ImageDisplay';
import { Controls } from './components/Controls';
import { CloseIcon, ErrorIcon } from './components/icons';

// Banner component for displaying dismissible errors.
interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div 
      className="bg-red-500/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg flex justify-between items-center animate-fade-in-down mb-6 border border-red-600" 
      role="alert"
    >
      <div className="flex items-center">
        <ErrorIcon className="h-6 w-6 mr-3 text-red-100" />
        <span className="font-medium text-red-50">{message}</span>
      </div>
      <button 
        onClick={onDismiss} 
        className="p-1 rounded-full hover:bg-red-600/50 transition-colors" 
        aria-label="Dismiss error message"
      >
        <CloseIcon className="w-5 h-5" />
      </button>
    </div>
  );
};


const App: React.FC = () => {
  const [generatePrompt, setGeneratePrompt] = useState<string>('');
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [imageHistory, setImageHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const currentImageUrl = imageHistory[historyIndex] ?? null;

  const handleGenerate = useCallback(async () => {
    if (!generatePrompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImageHistory([]);
    setHistoryIndex(0);
    setOriginalImageUrl(null);

    try {
      const resultUrl = await generateImage(generatePrompt);
      setImageHistory([resultUrl]);
      setOriginalImageUrl(resultUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  }, [generatePrompt, isLoading]);

  const handleEdit = useCallback(async () => {
    if (!editPrompt.trim() || !currentImageUrl || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const resultUrl = await editImage(editPrompt, currentImageUrl);
      // If we've navigated back, truncate the "future" history before adding the new image.
      const newHistory = imageHistory.slice(0, historyIndex + 1);
      newHistory.push(resultUrl);
      
      setImageHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image editing.');
    } finally {
      setIsLoading(false);
    }
  }, [editPrompt, currentImageUrl, isLoading, imageHistory, historyIndex]);

  const handleDownload = useCallback(() => {
    if (currentImageUrl) {
      downloadImage(currentImageUrl, `gemini-image-${Date.now()}.png`);
    }
  }, [currentImageUrl]);
  
  const handleNewImage = useCallback(() => {
    setImageHistory([]);
    setHistoryIndex(0);
    setOriginalImageUrl(null);
    setGeneratePrompt('');
    setEditPrompt('');
    setError(null);
  }, []);

  const handlePrevious = useCallback(() => {
    setHistoryIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setHistoryIndex(prev => Math.min(imageHistory.length - 1, prev + 1));
  }, [imageHistory.length]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 lg:p-8 flex flex-col">
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 flex flex-col space-y-8">
            <Controls
              generatePrompt={generatePrompt}
              setGeneratePrompt={setGeneratePrompt}
              onGenerate={handleGenerate}
              editPrompt={editPrompt}
              setEditPrompt={setEditPrompt}
              onEdit={handleEdit}
              isLoading={isLoading}
              hasImage={!!originalImageUrl}
              onNewImage={handleNewImage}
            />
          </div>
          <div className="lg:w-2/3 flex flex-col">
            <ImageDisplay
              imageUrl={currentImageUrl}
              isLoading={isLoading}
              error={error}
              onDownload={handleDownload}
              onPrevious={handlePrevious}
              onNext={handleNext}
              canPrevious={historyIndex > 0}
              canNext={historyIndex < imageHistory.length - 1}
              historyCount={imageHistory.length}
              currentIndex={historyIndex + 1}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;