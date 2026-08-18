/**
 * BrandCardArt — generic placeholder shown when a card has no uploaded image.
 * Upload real images through the dashboard to replace these.
 */

interface Props {
  slug: string;
  brand: string;
}

export function BrandCardArt({ brand }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#E2E8F0] to-[#F4F7FC]">
      <svg
        className="h-10 w-10 text-[#9CA3AF]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.2}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
        />
      </svg>
      <span className="text-[11px] font-medium text-[#9CA3AF]">No image</span>
    </div>
  );
}
