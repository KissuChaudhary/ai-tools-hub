"use client"

import React, { useState } from 'react'
import { Loader2, Clipboard, Check, AlertCircle, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface FormData {
  topic: string;
  keywords: string[];
}

interface Errors {
  [key: string]: string;
}

const characterLimits = {
  topic: 100,
  keyword: 20,
};

export default function YoutubeTitleGenerator() {
  const [formData, setFormData] = useState<FormData>({
    topic: '',
    keywords: [],
  });
  const [characterCounts, setCharacterCounts] = useState({
    topic: '0',
  });
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [model, setModel] = useState<'gpt4o' | 'gemini'>('gpt4o');

  const handleTopicChange = (value: string) => {
    if (value.length <= characterLimits.topic) {
      setFormData(prev => ({ ...prev, topic: value }));
      setCharacterCounts(prev => ({ ...prev, topic: value.length.toString() }));
      if (errors.topic) {
        setErrors(prev => ({ ...prev, topic: '' }));
      }
    }
  };

  const handleKeywordChange = (value: string) => {
    if (value.length <= characterLimits.keyword) {
      setCurrentKeyword(value);
      if (errors.keywords) {
        setErrors(prev => ({ ...prev, keywords: '' }));
      }
    }
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && formData.keywords.length < 5) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, currentKeyword.trim()]
      }));
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
    }
    if (formData.keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      const response = await fetch('/api/openai-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: 'aiYoutubeTitleGenerator',
          model,
          data: formData,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate title');
      }
      const data = await response.json();
      setGeneratedTitle(data.youtubeTitle);
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Failed to generate title. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedTitle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-10">
      <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight">AI YouTube Title Generator</h1>
      <p className="text-xl text-center mb-12 max-w-3xl mx-auto">Create Engaging YouTube Titles with Saze AI – Boost Your Video's Click-Through Rate.</p>
      <div className="flex justify-center items-center space-x-4 mb-8">
        <div className="flex items-center space-x-2">
          <svg
            className="w-6 h-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
          >
            <path
              d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z"
              fill="url(#prefix__paint0_radial_980_20147)"
            />
            <defs>
              <radialGradient
                id="prefix__paint0_radial_980_20147"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"
              >
                <stop offset=".067" stopColor="#9168C0" />
                <stop offset=".343" stopColor="#5684D1" />
                <stop offset=".672" stopColor="#1BA1E3" />
              </radialGradient>
            </defs>
          </svg>
          <Label htmlFor="model-switch" className={model === 'gemini' ? 'font-bold' : ''}>
            Gemini
          </Label>
        </div>
        <Switch
          id="model-switch"
          checked={model === 'gpt4o'}
          onCheckedChange={(checked) => setModel(checked ? 'gpt4o' : 'gemini')}
        />
        <div className="flex items-center space-x-2">
          <Label htmlFor="model-switch" className={model === 'gpt4o' ? 'font-bold' : ''}>
            GPT-4o
          </Label>
          <svg
            className="w-6 h-6"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="2"
          >
            <path
              d="M474.123 209.81c11.525-34.577 7.569-72.423-10.838-103.904-27.696-48.168-83.433-72.94-137.794-61.414a127.14 127.14 0 00-95.475-42.49c-55.564 0-104.936 35.781-122.139 88.593-35.781 7.397-66.574 29.76-84.637 61.414-27.868 48.167-21.503 108.72 15.826 150.007-11.525 34.578-7.569 72.424 10.838 103.733 27.696 48.34 83.433 73.111 137.966 61.585 24.084 27.18 58.833 42.835 95.303 42.663 55.564 0 104.936-35.782 122.139-88.594 35.782-7.397 66.574-29.76 84.465-61.413 28.04-48.168 21.676-108.722-15.654-150.008v-.172zm-39.567-87.218c11.01 19.267 15.139 41.803 11.354 63.65-.688-.516-2.064-1.204-2.924-1.72l-101.152-58.49a16.965 16.965 0 00-16.687 0L206.621 194.5v-50.232l97.883-56.597c45.587-26.32 103.732-10.666 130.052 34.921zm-227.935 104.42l49.888-28.9 49.887 28.9v57.63l-49.887 28.9-49.888-28.9v-57.63zm23.223-191.81c22.364 0 43.867 7.742 61.07 22.02-.688.344-2.064 1.204-3.097 1.72L186.666 117.26c-5.161 2.925-8.258 8.43-8.258 14.45v136.934l-43.523-25.116V130.333c0-52.64 42.491-95.13 95.131-95.302l-.172.172zM52.14 168.697c11.182-19.268 28.557-34.062 49.544-41.803V247.14c0 6.02 3.097 11.354 8.258 14.45l118.354 68.295-43.695 25.288-97.711-56.425c-45.415-26.32-61.07-84.465-34.75-130.052zm26.665 220.71c-11.182-19.095-15.139-41.802-11.354-63.65.688.516 2.064 1.204 2.924 1.72l101.152 58.49a16.965 16.965 0 0016.687 0l118.354-68.467v50.232l-97.883 56.425c-45.587 26.148-103.732 10.665-130.052-34.75h.172zm204.54 87.39c-22.192 0-43.867-7.741-60.898-22.02a62.439 62.439 0 003.097-1.72l101.152-58.317c5.16-2.924 8.429-8.43 8.257-14.45V243.527l43.523 25.116v113.022c0 52.64-42.663 95.303-95.131 95.303v-.172zM461.22 343.303c-11.182 19.267-28.729 34.061-49.544 41.63V264.687c0-6.021-3.097-11.526-8.257-14.45L284.893 181.77l43.523-25.116 97.883 56.424c45.587 26.32 61.07 84.466 34.75 130.053l.172.172z"
              fillRule="nonzero"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Title Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-medium text-gray-700">
                  Topic
                </Label>
                <div className="relative">
                  <Textarea
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => handleTopicChange(e.target.value)}
                    placeholder="Enter the main topic of your YouTube video..."
                    className={`resize-none ${errors.topic ? 'border-red-500' : ''}`}
                    rows={3}
                  />
                  <p className={`absolute right-0 -bottom-5 text-xs ${parseInt(characterCounts.topic) === characterLimits.topic ? 'text-orange-500' : 'text-gray-500'}`}>
                    {characterCounts.topic}/{characterLimits.topic}
                  </p>
                </div>
                {errors.topic && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.topic}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">
                  Keywords (up to 5)
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {keyword}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeKeyword(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="keywords"
                    value={currentKeyword}
                    onChange={(e) => handleKeywordChange(e.target.value)}
                    placeholder="Enter a keyword"
                    className={errors.keywords ? 'border-red-500' : ''}
                  />
                  <Button type="button" onClick={addKeyword} disabled={formData.keywords.length >= 5 || !currentKeyword.trim()}>
                    Add
                  </Button>
                </div>
                {errors.keywords && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.keywords}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : 'Generate Title'}
              </Button>
              {errors.submit && (
                <p className="mt-2 text-sm text-red-600 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 mr-1"   />
                  {errors.submit}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Generated Title</CardTitle>
          </CardHeader>
          <CardContent>
            {generatedTitle ? (
              <>
                <div className="bg-gray-100 p-4 rounded-md mb-4 min-h-[100px] flex items-center justify-center">
                  <p className="text-xl font-semibold text-center">{generatedTitle}</p>
                </div>
                <Button onClick={handleCopy} variant="outline" className="w-full">
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </>
            ) : (
              <p className="text-gray-500 italic text-center">Your generated YouTube title will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}