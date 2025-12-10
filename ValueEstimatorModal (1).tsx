import React, { useState } from 'react';
import { X, Camera, TrendingUp, AlertCircle, Upload } from 'lucide-react';
import { ValuationResult } from '../types';

interface ValueEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEstimate: (file: File, description: string) => void;
  result: ValuationResult | null;
  isLoading: boolean;
}

export const ValueEstimatorModal: React.FC<ValueEstimatorModalProps> = ({ isOpen, onClose, onEstimate, result, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [preview, setPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = () => {
    if (file && description) {
      onEstimate(file, description);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Item Value Estimator</h2>
            </div>
            <button onClick={onClose} className="hover:bg-primary-900 p-2 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!result ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg mb-4" />
                  ) : (
                    <div className="space-y-3">
                      <Camera className="w-16 h-16 mx-auto text-gray-400" />
                      <p className="text-gray-600 font-semibold">Click to upload item photo</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>

              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the item (brand, condition, age, etc.)" className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-primary-500 focus:border-transparent" />

              <button onClick={handleSubmit} disabled={!file || !description || isLoading} className={`w-full py-3 rounded-lg font-bold transition ${file && description && !isLoading ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                {isLoading ? 'Analyzing...' : 'Estimate Value'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {result.isIrreplaceable && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-red-900">IRREPLACEABLE ITEM DETECTED</p>
                      <p className="text-sm text-red-700 mt-1">{result.flagReason}</p>
                      <p className="text-sm text-red-700 mt-2">You must follow 30-day contact protocol. Upload proof within 7 days.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{result.itemName}</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-primary-600">${result.minValue}</span>
                  <span className="text-2xl text-gray-600">-</span>
                  <span className="text-4xl font-bold text-primary-600">${result.maxValue}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Confidence: {result.confidence}%</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Comparable Listings:</h4>
                <div className="grid grid-cols-2 gap-3">
                  {result.comparables.map((comp, idx) => (
                    <div key={idx} className="border rounded-lg p-3 hover:shadow-md transition">
                      <img src={comp.imageUrl} alt={comp.title} className="w-full h-32 object-cover rounded mb-2" />
                      <p className="text-sm font-semibold text-gray-800 truncate">{comp.title}</p>
                      <p className="text-lg font-bold text-primary-600">${comp.price}</p>
                      <p className="text-xs text-gray-500">{comp.source}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={onClose} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-bold transition">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
