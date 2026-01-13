
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const PetAI: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePetImage = async () => {
    if (!prompt) return;

    // Fix: Mandatory API key selection check for gemini-3-pro-image-preview
    if (typeof window.aistudio !== 'undefined') {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        // Guideline: proceed to app assuming key selection was successful
      }
    }

    setLoading(true);
    setError(null);
    try {
      // Fix: Create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `A highly detailed professional pet photo: ${prompt}` }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: imageSize
          }
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          // Fix: Correctly iterate to find the image part as per guidelines
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            setGeneratedImage(`data:image/png;base64,${base64EncodeString}`);
            break;
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      // Fix: Reset key selection if entity not found error occurs
      if (err?.message?.includes('Requested entity was not found.') && typeof window.aistudio !== 'undefined') {
        await window.aistudio.openSelectKey();
      }
      setError('Houve um erro ao gerar a imagem. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-royal-blue text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h3 className="text-4xl font-black mb-6">Laboratório Pet <span className="text-vibrant-yellow">A.R AI</span></h3>
            <p className="text-xl text-white/80 mb-8">
              Crie a imagem do pet dos seus sonhos com nossa Inteligência Artificial. Digite uma ideia e veja a mágica acontecer!
            </p>
            
            <div className="space-y-4">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Um Golden Retriever surfando em Seropédica..."
                className="w-full bg-white/10 border-2 border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:border-vibrant-yellow transition-all"
              />
              
              <div className="flex items-center gap-4">
                <span className="font-bold text-sm">Resolução:</span>
                {(['1K', '2K', '4K'] as const).map(size => (
                  <button 
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${imageSize === size ? 'bg-vibrant-yellow text-royal-blue' : 'bg-white/10 hover:bg-white/20'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <button 
                onClick={generatePetImage}
                disabled={loading || !prompt}
                className="w-full bg-vibrant-yellow text-royal-blue font-black py-4 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? <i className="fas fa-spinner fa-spin text-2xl"></i> : <i className="fas fa-wand-magic-sparkles text-2xl"></i>}
                {loading ? 'GERANDO...' : 'GERAR IMAGEM PET'}
              </button>
              {error && <p className="text-vibrant-yellow text-sm font-bold">{error}</p>}
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md aspect-square bg-white/5 rounded-3xl border-4 border-dashed border-white/20 flex items-center justify-center overflow-hidden shadow-inner">
              {generatedImage ? (
                <img src={generatedImage} alt="Pet AI Generated" className="w-full h-full object-cover animate-fadeIn" />
              ) : (
                <div className="text-center p-8 opacity-40">
                   <i className="fas fa-dog text-8xl mb-4"></i>
                   <p className="font-bold">Sua criação aparecerá aqui</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetAI;
