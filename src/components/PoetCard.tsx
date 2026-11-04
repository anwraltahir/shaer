import React from 'react';
import { PoetProfile } from '../types';
import { CheckCircle, MapPin, BookOpen, Feather } from 'lucide-react';

interface PoetCardProps {
  poet: PoetProfile;
  poemCount?: number;
  onSelect: (poetSlug: string) => void;
}

export const PoetCard: React.FC<PoetCardProps> = ({ poet, poemCount = 0, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(poet.profileSlug)}
      className="group cursor-pointer rounded-xl bg-white dark:bg-[#162E28] border border-[#D9B56D]/30 hover:border-[#D9B56D] p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-right"
    >
      <div>
        {/* Top Header: Avatar & Verification */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <img
              src={poet.profileImage}
              alt={poet.literaryName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-lg object-cover border border-[#D9B56D]/40 shadow-xs"
              onError={(e) => {
                // Fallback to stylized SVG
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {poet.verificationStatus && (
              <div 
                className="absolute -bottom-1 -left-1 bg-[#183C35] text-[#D9B56D] p-0.5 rounded-full border border-[#D9B56D]"
                title="شاعر سوداني موثق رسمياً"
              >
                <CheckCircle size={14} className="fill-[#D9B56D] text-[#183C35]" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-amiri text-lg font-bold text-[#183C35] dark:text-[#D9B56D] group-hover:text-[#7D302D] dark:group-hover:text-white transition-colors">
                {poet.literaryName}
              </h3>
            </div>

            {/* Zero-pill unboxed metadata separated by middots */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-[#D9B56D]" />
                <span>{poet.city}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{poet.literarySchool}</span>
              {poet.birthYear && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-mono text-[11px]">
                    {poet.birthYear} {poet.deathYear ? `– ${poet.deathYear}` : ''}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Short Biography excerpt */}
        <p className="text-xs text-[#39352F]/80 dark:text-[#F4EFE3]/80 line-clamp-3 leading-relaxed mb-4">
          {poet.biography}
        </p>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-[#D9B56D]/15 flex items-center justify-between text-xs">
        <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
          <BookOpen size={13} className="text-[#D9B56D]" />
          <span>{poemCount > 0 ? `${poemCount} قصيدة منشورة` : 'ديوان موثق'}</span>
        </span>
        <span className="text-[#183C35] dark:text-[#D9B56D] font-bold group-hover:underline">
          زيارة صفحة الشاعر ←
        </span>
      </div>
    </div>
  );
};
