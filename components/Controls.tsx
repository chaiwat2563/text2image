
import React from 'react';
import { LoadingSpinner, NewImageIcon } from './icons';

interface ControlsProps {
  generatePrompt: string;
  setGeneratePrompt: (value: string) => void;
  onGenerate: () => void;
  editPrompt: string;
  setEditPrompt: (value: string) => void;
  onEdit: () => void;
  isLoading: boolean;
  hasImage: boolean;
  onNewImage: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  generatePrompt,
  setGeneratePrompt,
  onGenerate,
  editPrompt,
  setEditPrompt,
  onEdit,
  isLoading,
  hasImage,
  onNewImage
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col gap-8 h-full">
      {/* Generate Section */}
      <div className="flex flex-col gap-4">
        <label htmlFor="generate-prompt" className="text-lg font-semibold text-gray-300">
          1. Generate Image
        </label>
        <textarea
          id="generate-prompt"
          value={generatePrompt}
          onChange={(e) => setGeneratePrompt(e.target.value)}
          placeholder="e.g., A majestic lion wearing a crown in a futuristic city"
          rows={4}
          disabled={isLoading || hasImage}
          className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 disabled:opacity-50"
        />
        <button
          onClick={onGenerate}
          disabled={isLoading || hasImage || !generatePrompt.trim()}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading && !hasImage ? <LoadingSpinner className="w-5 h-5" /> : 'Generate'}
        </button>
      </div>

      {/* Edit Section */}
      <div className={`flex flex-col gap-4 transition-opacity duration-500 ${hasImage ? 'opacity-100' : 'opacity-40'}`}>
        <label htmlFor="edit-prompt" className="text-lg font-semibold text-gray-300">
          2. Edit Your Image
        </label>
        <textarea
          id="edit-prompt"
          value={editPrompt}
          onChange={(e) => setEditPrompt(e.target.value)}
          placeholder="e.g., Change the crown to a wizard hat"
          rows={3}
          disabled={!hasImage || isLoading}
          className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 disabled:opacity-50"
        />
        <button
          onClick={onEdit}
          disabled={!hasImage || isLoading || !editPrompt.trim()}
          className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading && hasImage ? <LoadingSpinner className="w-5 h-5" /> : 'Apply Edit'}
        </button>
      </div>

      <div className="mt-auto pt-8 border-t border-gray-700">
          <button
            onClick={onNewImage}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <NewImageIcon />
            Start New Image
          </button>
      </div>
    </div>
  );
};
