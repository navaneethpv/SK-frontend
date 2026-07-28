import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';

interface TabContainerProps {
  description: string;
  details?: string | null;
}

export default function TabContainer({ description, details }: TabContainerProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  const specs = [
    { label: 'Voltage', value: '18V' },
    { label: 'Motor Type', value: 'Brushless (BL Motor)' },
    { label: 'Max Torque', value: '60 N.m (Newton Meters)' },
    { label: 'No-load Speed', value: '0-500 / 0-1,900 RPM' },
    { label: 'Chuck Size', value: '13mm (1/2") Keyless Chuck' },
    { label: 'Impact Rate', value: '0-7,500 / 0-28,500 BPM' },
    { label: 'Weight (incl. Battery)', value: '1.8 kg' }
  ];

  const reviews = [
    {
      id: 1,
      user: 'John D.',
      date: 'July 15, 2026',
      rating: 5,
      title: 'Amazing power and build quality',
      comment: 'This drill is a beast. The brushless motor is extremely quiet and the battery runtime with the 4.0Ah pack is outstanding. Strongly recommend!'
    },
    {
      id: 2,
      user: 'Robert M.',
      date: 'June 28, 2026',
      rating: 4,
      title: 'Very reliable tool',
      comment: 'Used it on concrete and timber projects. The hammer action is robust. The chuck grips bits tightly. Only minor issue is it is a bit heavy with the 5.0Ah pack.'
    }
  ];

  return (
    <div className="bg-white border border-[#EAE5DC] rounded-2xl overflow-hidden shadow-sm">
      {/* Tabs Header */}
      <div className="flex bg-[#FAF7F2] border-b border-[#EAE5DC]">
        <button
          onClick={() => setActiveTab('desc')}
          className={`flex-1 p-4 md:p-5 border-none bg-none font-bold text-[0.95rem] cursor-pointer transition-all duration-300 border-b-2 ${
            activeTab === 'desc'
              ? 'text-[#C39F68] border-[#C39F68] bg-white'
              : 'text-[#6B7280] border-transparent hover:text-[#121316] hover:bg-[#EAE5DC]/20'
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`flex-1 p-4 md:p-5 border-none bg-none font-bold text-[0.95rem] cursor-pointer transition-all duration-300 border-b-2 ${
            activeTab === 'specs'
              ? 'text-[#C39F68] border-[#C39F68] bg-white'
              : 'text-[#6B7280] border-transparent hover:text-[#121316] hover:bg-[#EAE5DC]/20'
          }`}
        >
          Specifications
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 p-4 md:p-5 border-none bg-none font-bold text-[0.95rem] cursor-pointer transition-all duration-300 border-b-2 ${
            activeTab === 'reviews'
              ? 'text-[#C39F68] border-[#C39F68] bg-white'
              : 'text-[#6B7280] border-transparent hover:text-[#121316] hover:bg-[#EAE5DC]/20'
          }`}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="p-6 md:p-12">
        {/* Description Panel */}
        {activeTab === 'desc' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-[1.4rem] font-extrabold text-[#121316]">Product Details</h2>
            <p className="text-[0.95rem] text-[#6B7280] leading-relaxed">{description}</p>
            {details && (
              <>
                <h3 className="text-[1.1rem] font-bold text-[#121316] mt-4">Usage and Maintenance</h3>
                <p className="text-[0.95rem] text-[#6B7280] leading-relaxed">{details}</p>
              </>
            )}
            <h3 className="text-[1.1rem] font-bold text-[#121316] mt-4">What's in the Box</h3>
            <ul className="list-none space-y-2 p-0 m-0">
              <li className="relative pl-6 text-[0.9rem] text-[#6B7280] before:content-['•'] before:absolute before:left-2 before:text-[#C39F68] before:font-bold">1x SK Professional Brushless Hammer Drill</li>
              <li className="relative pl-6 text-[0.9rem] text-[#6B7280] before:content-['•'] before:absolute before:left-2 before:text-[#C39F68] before:font-bold">2x 18V Lithium-Ion Battery Packs</li>
              <li className="relative pl-6 text-[0.9rem] text-[#6B7280] before:content-['•'] before:absolute before:left-2 before:text-[#C39F68] before:font-bold">1x Intelligent Rapid Charger</li>
              <li className="relative pl-6 text-[0.9rem] text-[#6B7280] before:content-['•'] before:absolute before:left-2 before:text-[#C39F68] before:font-bold">1x Heavy-Duty Protective Carrying Case</li>
              <li className="relative pl-6 text-[0.9rem] text-[#6B7280] before:content-['•'] before:absolute before:left-2 before:text-[#C39F68] before:font-bold">1x Belt Clip & Auxiliary Handle</li>
            </ul>
          </div>
        )}

        {/* Specifications Panel */}
        {activeTab === 'specs' && (
          <div className="flex flex-col gap-6">
            <h2 className="text-[1.4rem] font-extrabold text-[#121316]">Technical Specifications</h2>
            <div className="overflow-x-auto border border-[#EAE5DC] rounded-lg">
              <table className="w-full text-left border-collapse text-[0.9rem]">
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={i} className="border-b border-[#EAE5DC] last:border-b-0 odd:bg-[#FAF7F2]/40">
                      <td className="py-3 px-5 font-bold text-[#121316] w-1/3 border-r border-[#EAE5DC]">{spec.label}</td>
                      <td className="py-3 px-5 text-[#6B7280]">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Panel */}
        {activeTab === 'reviews' && (
          <div className="flex flex-col gap-8">
            <h2 className="text-[1.4rem] font-extrabold text-[#121316]">Customer Feedback</h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-center bg-[#FAF7F2] p-6 rounded-xl border border-[#EAE5DC]">
              <div className="flex flex-col items-center justify-center pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-[#EAE5DC] pb-6 md:pb-0 min-w-[160px]">
                <span className="text-[2.8rem] font-extrabold text-[#121316] leading-none">4.5</span>
                <span className="text-[0.8rem] text-[#6B7280] font-medium my-1">out of 5</span>
                <div className="flex text-[#C39F68]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < 4 ? 'currentColor' : 'none'} className="text-[#C39F68]" />
                  ))}
                </div>
              </div>
              
              <div className="flex-1 w-full flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const percentage = rating === 5 ? 75 : rating === 4 ? 20 : 5;
                  return (
                    <div key={rating} className="flex items-center gap-3 text-[0.8rem]">
                      <span className="w-8 font-bold text-[#121316] text-right">{rating} ★</span>
                      <div className="flex-1 h-2 bg-[#EAE5DC] rounded-full overflow-hidden">
                        <div className="h-full bg-[#C39F68] rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="w-10 text-[#6B7280] font-medium">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Reviews List */}
            <div className="flex flex-col gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-5 rounded-xl border border-[#EAE5DC] flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#121316] text-[#C39F68] font-bold text-[0.85rem] flex items-center justify-center">{rev.user.charAt(0)}</div>
                      <div>
                        <h4 className="text-[0.9rem] font-bold text-[#121316]">{rev.user}</h4>
                        <span className="text-[0.72rem] text-[#6B7280]">{rev.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex text-[#C39F68]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < rev.rating ? 'currentColor' : 'none'}
                          className="text-[#C39F68]"
                        />
                      ))}
                    </div>
                  </div>

                  <h4 className="text-[0.95rem] font-bold text-[#121316] mt-1">{rev.title}</h4>
                  <p className="text-[0.88rem] text-[#6B7280] leading-relaxed">{rev.comment}</p>
                  
                  <button className="flex items-center gap-1.5 self-start text-[0.75rem] font-semibold text-[#6B7280] hover:text-[#C39F68] transition-colors mt-2 cursor-pointer bg-none border-none" aria-label="Helpful button">
                    <ThumbsUp size={14} /> Was this helpful?
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
